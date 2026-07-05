const prisma = require("../config/prisma");
const readCSV = require("./readCSV");

async function seedLeaveRequests() {
    const leaveRequests = await readCSV("./CSV_Files/leaverequests.csv");

    for (const leaveRequest of leaveRequests) {
        await prisma.leaveRequest.create({
            data: {
                id: Number(leaveRequest.id),
                leaveType: leaveRequest.leaveType,
                startDate: new Date(leaveRequest.startDate),
                endDate: new Date(leaveRequest.endDate),
                reason: leaveRequest.reason || null,
                status: leaveRequest.status,
                createdAt: new Date(leaveRequest.createdAt),
                employeeId: Number(leaveRequest.employeeId),
                approvedById: leaveRequest.approvedById
                    ? Number(leaveRequest.approvedById)
                    : null
            }
        });
    }

    console.log("Leave Requests Imported Successfully");
}

seedLeaveRequests()
    .catch((error) => {
        console.error(error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });