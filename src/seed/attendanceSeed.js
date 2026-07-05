const prisma = require("../config/prisma");
const readCSV = require("./readCSV");

async function seedAttendance() {
    const attendances = await readCSV("./CSV_Files/attendance.csv");

    for (const attendance of attendances) {
        await prisma.attendance.create({
            data: {
                id: Number(attendance.id),
                attendanceDate: new Date(attendance.attendanceDate),
                checkIn: attendance.checkIn ? new Date(attendance.checkIn) : null,
                checkOut: attendance.checkOut ? new Date(attendance.checkOut) : null,
                totalHours: attendance.totalHours
                    ? Number(attendance.totalHours)
                    : null,
                status: attendance.status || null,
                createdAt: new Date(attendance.createdAt),
                employeeId: Number(attendance.employeeId)
            }
        });
    }

    console.log("Attendance Imported Successfully");
}

seedAttendance()
    .catch((error) => {
        console.error(error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });