const prisma = require("../config/prisma");
const readCSV = require("./readCSV");

async function seedEmployees() {
    const employees = await readCSV("./CSV_Files/employee.csv");

    for (const employee of employees) {
        await prisma.employee.create({
            data: {
                id: Number(employee.id),
                employeeCode: employee.employeeCode,
                firstName: employee.firstName,
                lastName: employee.lastName || null,
                email: employee.email,
                phone: employee.phone || null,
                gender: employee.gender || null,
                dateOfBirth: employee.dateOfBirth
                    ? new Date(employee.dateOfBirth)
                    : null,
                hireDate: new Date(employee.hireDate),
                designation: employee.designation || null,
                salary: employee.salary
                    ? Number(employee.salary)
                    : null,
                employmentStatus: employee.employmentStatus,
                createdAt: new Date(employee.createdAt),
                departmentId: employee.departmentId
                    ? Number(employee.departmentId)
                    : null,
                managerId: employee.managerId
                    ? Number(employee.managerId)
                    : null
            }
        });
    }

    console.log("Employees Imported Successfully");
}

seedEmployees()
    .catch((error) => {
        console.error(error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });