const prisma = require("../src/config/prisma");

async function main() {
  await prisma.$executeRawUnsafe(`
    DROP TABLE "Roles" CASCADE;
  `);

  console.log("Roles table deleted successfully!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });