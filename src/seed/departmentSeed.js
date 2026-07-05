const prisma = require("../config/prisma");
const readCSV = require("./readCSV");

async function seedDepartments() {
    const departments = await readCSV("./CSV_Files/department.csv");

    for (const department of departments) {
        await prisma.department.create({
            data: {
                id: Number(department.id),
                departmentName: department.departmentName,
                departmentCode: department.departmentCode,
                description: department.description || null,
                createdAt: new Date(department.createdAt),
                updatedAt: new Date(department.updatedAt)
            }
        });
    }

    console.log("Departments Imported Successfully");
}

seedDepartments()
    .catch((error) => {
        console.error(error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });