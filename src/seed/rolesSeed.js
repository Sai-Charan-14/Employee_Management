const prisma = require("../config/prisma");
const readCSV = require("./readCSV");

async function seedRoles() {
    const roles = await readCSV("./CSV_Files/roles.csv");

    for (const role of roles) {
        await prisma.roles.create({
            data: {
                id: Number(role.id),
                role_name: role.role_name,
                createdAt: new Date(role.createdAt),
                updatedAt: new Date(role.updatedAt)
            }
        });
    }

    console.log("Roles Imported Successfully");
}

seedRoles()
    .catch((error) => {
        console.error(error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });