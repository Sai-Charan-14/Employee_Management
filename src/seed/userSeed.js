const prisma = require("../config/prisma");
const readCSV = require("./readCSV");

async function seedUsers() {
    const users = await readCSV("./CSV_Files/users.csv");

    for (const user of users) {
        await prisma.users.create({
            data: {
                id: Number(user.id),
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: user.password,
                phone: user.phone || null,
                isActive: user.isActive === "true" || user.isActive === "TRUE",
                lastLogin: user.lastLogin ? new Date(user.lastLogin) : null,
                roleId: Number(user.roleId),
                createdAt: new Date(user.createdAt),
                updatedAt: new Date(user.updatedAt)
            }
        });
    }

    console.log("Users Imported Successfully");
}

seedUsers()
    .catch((error) => {
        console.error(error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });