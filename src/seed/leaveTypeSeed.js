const prisma = require("../config/prisma");
const readCSV = require("./readCSV");

async function seedLeaveTypes() {
    const leaveTypes = await readCSV("./CSV_Files/leavetypes.csv");

    for (const leaveType of leaveTypes) {
        await prisma.leaveType.create({
            data: {
                id: Number(leaveType.id),
                leaveName: leaveType.leaveName,
                description: leaveType.description || null,
                maxDaysPerYear: Number(leaveType.maxDaysPerYear),
                createdAt: new Date(leaveType.createdAt)
            }
        });
    }

    console.log("Leave Types Imported Successfully");
}

seedLeaveTypes()
    .catch((error) => {
        console.error(error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });