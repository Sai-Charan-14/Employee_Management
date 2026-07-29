const prisma = require("../config/prisma");
const { getIO, connectedUsers } = require("../socket/socket");
const { sendMessageToQueue } = require("./sqs.service");

const applyLeave = async (leaveData, loggedInUser) => {
  const {
    leaveTypeId,
    startDate,
    endDate,
    reason,
  } = leaveData;

  const employeeId = loggedInUser.employeeId;

  // 1. Check Employee
  const employee = await prisma.employee.findUnique({
    where: {
      id: employeeId,
    },
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

// 2. Check Leave Type
  const leaveType = await prisma.leaveType.findUnique({
  where: {
    id: leaveTypeId,
  },
});

if (!leaveType) {
  throw new Error("Invalid Leave Type");
}
  // 3. Validate Dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  if (start > end) {
    throw new Error("Start date cannot be after end date");
  }

  if (start < today) {
    throw new Error("Cannot apply leave for past dates");
  }

  // 4. Calculate Requested Leave Days
  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  const requestedDays =
    Math.floor((end - start) / millisecondsPerDay) + 1;

  // 5. Check leave balance
  const leaveBalance = await prisma.leaveBalance.findFirst({
  where: {
    employeeId,
    leaveTypeId,
  },
  });

  if (!leaveBalance) {
    throw new Error("Leave balance not found");
  }

  // 6. Check Remaining Leaves
  if (requestedDays > leaveBalance.remainingLeaves) {
    throw new Error("Insufficient leave balance");
  }

  // 7. Check for overlapping leave requests
  const overlappingLeave = await prisma.leaveRequest.findFirst({
  where: {
    employeeId,
    status: {
      in: ["PENDING", "APPROVED"],
    },
    startDate: {
      lte: end,
    },
    endDate: {
      gte: start,
    },
  },
});

if (overlappingLeave) {
  throw new Error("Leave request overlaps with an existing leave");
}

// 8. Create Leave Request
const leaveRequest = await prisma.leaveRequest.create({
  data: {
    leaveType: leaveType.leaveName,
    startDate: start,
    endDate: end,
    reason,
    employeeId,
  },
});

await sendMessageToQueue({
    event: "LEAVE_APPLIED",
    leaveRequestId: leaveRequest.id,
    employeeId: leaveRequest.employeeId,
    leaveType: leaveRequest.leaveType,
    startDate: leaveRequest.startDate,
    endDate: leaveRequest.endDate,
    reason: leaveRequest.reason,
    status: leaveRequest.status,
});

// Send notification to all connected clients
const io = getIO();

console.log("Connected Users:");
console.log(connectedUsers);

for (const [userId, user] of connectedUsers.entries()) {
  console.log(userId, user);

  if (user.role === "ADMIN") {
    console.log("Sending notification to Admin...");

    io.to(user.socketId).emit("newLeaveRequest", {
      id: leaveRequest.id,
      employeeId: leaveRequest.employeeId,
      leaveType: leaveRequest.leaveType,
      status: leaveRequest.status,
    });
  }
}

return leaveRequest;
};

const getPendingLeaves = async () => {
  const pendingLeaves = await prisma.leaveRequest.findMany({
    where: {
      status: "PENDING",
    },
    include: {
      employee: {
        select: {
          id: true,
          employeeCode: true,
          firstName: true,
          lastName: true,
          designation: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return pendingLeaves;
};

  const approveLeave = async (leaveRequestId, loggedInUser) => {

  // 1. Find Leave Request
  const leaveRequest = await prisma.leaveRequest.findUnique({
    where: {
      id: Number(leaveRequestId),
    },
  });

  if (!leaveRequest) {
    throw new Error("Leave request not found");
  }

  // 2. Check Status
  if (leaveRequest.status !== "PENDING") {
    throw new Error("Only pending leave requests can be approved");
  }

  // 3. Calculate Requested Leave Days
const start = new Date(leaveRequest.startDate);
const end = new Date(leaveRequest.endDate);

const millisecondsPerDay = 1000 * 60 * 60 * 24;

const requestedDays =
  Math.floor((end - start) / millisecondsPerDay) + 1;


// 4. Find Leave Type
const leaveType = await prisma.leaveType.findUnique({
  where: {
    leaveName: leaveRequest.leaveType,
  },
});

if (!leaveType) {
  throw new Error("Leave Type not found");
}


// 5. Find Leave Balance
const leaveBalance = await prisma.leaveBalance.findFirst({
  where: {
    employeeId: leaveRequest.employeeId,
    leaveTypeId: leaveType.id,
  },
});

if (!leaveBalance) {
  throw new Error("Leave Balance not found");
}

const updatedLeave = await prisma.$transaction(async (tx) => {

  // 1. Update Leave Request
  const updatedLeaveRequest = await tx.leaveRequest.update({
    where: {
      id: Number(leaveRequestId),
    },
    data: {
      status: "APPROVED",
      approvedById: loggedInUser.employeeId,
    },
  });

  // 2. Update Leave Balance
  await tx.leaveBalance.update({
    where: {
      id: leaveBalance.id,
    },
    data: {
      usedLeaves: leaveBalance.usedLeaves + requestedDays,
      remainingLeaves: leaveBalance.remainingLeaves - requestedDays,
    },
  });

  // 3. Create Audit Log
  await tx.auditLog.create({
    data: {
      action: "APPROVE_LEAVE",
      entityName: "LeaveRequest",
      entityId: leaveRequest.id,
      description: `Leave request ${leaveRequest.id} approved`,
      userId: loggedInUser.id,
    },
  });

  return updatedLeaveRequest;
});

const io = getIO();

const employeeSocket = connectedUsers.get(leaveRequest.employeeId);

if (employeeSocket) {
  io.to(employeeSocket.socketId).emit("leaveApproved", {
    leaveRequestId: updatedLeave.id,
    status: updatedLeave.status,
    message: "Your leave request has been approved.",
  });

  console.log(`Approval notification sent to Employee ${leaveRequest.employeeId}`);
}

return updatedLeave;

};

const rejectLeave = async (leaveRequestId, loggedInUser) => {

  // 1. Find Leave Request
  const leaveRequest = await prisma.leaveRequest.findUnique({
    where: {
      id: Number(leaveRequestId),
    },
  });

  if (!leaveRequest) {
    throw new Error("Leave request not found");
  }

  // 2. Check Status
  if (leaveRequest.status !== "PENDING") {
    throw new Error("Only pending leave requests can be rejected");
  }

  // 3. Transaction
  const updatedLeave = await prisma.$transaction(async (tx) => {

    // Update Leave Request
    const rejectedLeave = await tx.leaveRequest.update({
      where: {
        id: Number(leaveRequestId),
      },
      data: {
        status: "REJECTED",
        approvedById: loggedInUser.employeeId,
      },
    });

    // Create Audit Log
    await tx.auditLog.create({
      data: {
        action: "REJECT_LEAVE",
        entityName: "LeaveRequest",
        entityId: leaveRequest.id,
        description: `Leave request ${leaveRequest.id} rejected`,
        userId: loggedInUser.id,
      },
    });

    return rejectedLeave;
  });

  return updatedLeave;
};

  const getMyLeaveHistory = async (loggedInUser) => {

  const leaveHistory = await prisma.leaveRequest.findMany({
    where: {
      employeeId: loggedInUser.employeeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return leaveHistory;
};

const getMyLeaveBalance = async (loggedInUser) => {

  const leaveBalance = await prisma.leaveBalance.findMany({
    where: {
      employeeId: loggedInUser.employeeId,
    },
    include: {
      leaveType: {
        select: {
          id: true,
          leaveName: true,
          description: true,
          maxDaysPerYear: true,
        },
      },
    },
  });

  return leaveBalance;
};

const cancelLeave = async (leaveRequestId, loggedInUser) => {

  // 1. Find Leave Request
  const leaveRequest = await prisma.leaveRequest.findUnique({
    where: {
      id: Number(leaveRequestId),
    },
  });

  if (!leaveRequest) {
    throw new Error("Leave request not found");
  }

  // 2. Check Ownership
  if (leaveRequest.employeeId !== loggedInUser.employeeId) {
    throw new Error("You can only cancel your own leave requests");
  }

  // 3. Check Status
  if (leaveRequest.status !== "PENDING") {
    throw new Error("Only pending leave requests can be cancelled");
  }

  // 4. Transaction
  const cancelledLeave = await prisma.$transaction(async (tx) => {

    // Update Leave Request
    const updatedLeave = await tx.leaveRequest.update({
      where: {
        id: Number(leaveRequestId),
      },
      data: {
        status: "CANCELLED",
      },
    });

    // Audit Log
    await tx.auditLog.create({
      data: {
        action: "CANCEL_LEAVE",
        entityName: "LeaveRequest",
        entityId: leaveRequest.id,
        description: `Leave request ${leaveRequest.id} cancelled`,
        userId: loggedInUser.id,
      },
    });

    return updatedLeave;
  });

  return cancelledLeave;
};

const getAllLeaves = async () => {

  const leaves = await prisma.leaveRequest.findMany({
    include: {
      employee: {
        select: {
          id: true,
          employeeCode: true,
          firstName: true,
          lastName: true,
          designation: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return leaves;
};

const getLeaveDashboard = async () => {

  const totalRequests = await prisma.leaveRequest.count();

  const pending = await prisma.leaveRequest.count({
    where: {
      status: "PENDING",
    },
  });

  const approved = await prisma.leaveRequest.count({
    where: {
      status: "APPROVED",
    },
  });

  const rejected = await prisma.leaveRequest.count({
    where: {
      status: "REJECTED",
    },
  });

  const cancelled = await prisma.leaveRequest.count({
    where: {
      status: "CANCELLED",
    },
  });

  return {
    totalRequests,
    pending,
    approved,
    rejected,
    cancelled,
  };
};

module.exports = {
  applyLeave,
  getPendingLeaves,
  getMyLeaveHistory,
  getMyLeaveBalance,
  approveLeave,
  rejectLeave,
  cancelLeave,
  getAllLeaves,
  getLeaveDashboard,
};