const prisma = require("../config/prisma");
const readCSV = require("./readCSV");

async function seedLeaveBalances() {
    const leaveBalances = await readCSV("./CSV_Files/leavebalance.csv");

    for (const leaveBalance of leaveBalances) {
        await prisma.leaveBalance.create({
            data: {
                id: Number(leaveBalance.id),
                totalLeaves: Number(leaveBalance.totalLeaves),
                usedLeaves: Number(leaveBalance.usedLeaves),
                remainingLeaves: Number(leaveBalance.remainingLeaves),
                updatedAt: new Date(leaveBalance.updatedAt),
                employeeId: Number(leaveBalance.employeeId),
                leaveTypeId: Number(leaveBalance.leaveTypeId)
            }
        });
    }

    console.log("Leave Balances Imported Successfully");
}

seedLeaveBalances()
    .catch((error) => {
        console.error(error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });