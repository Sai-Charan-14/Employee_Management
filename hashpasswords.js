const bcrypt = require("bcrypt");
const prisma = require("./src/config/prisma");

async function hashPasswords() {
  const users = await prisma.users.findMany();

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    await prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    console.log(`Updated password for ${user.email}`);
  }

  console.log("All passwords hashed!");

  await prisma.$disconnect();
}

hashPasswords();