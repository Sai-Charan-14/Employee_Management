const prisma = require("../src/config/prisma");
const { createObjectCsvWriter } = require("csv-writer");

async function main() {
  const roles = await prisma.roles.findMany();

  if (!roles.length) {
    console.log("No roles found.");
    return;
  }

  const csvWriter = createObjectCsvWriter({
    path: "roles.csv",
    header: [
      { id: "id", title: "ID" },
      { id: "role_name", title: "ROLE_NAME" },
      { id: "createdAt", title: "CREATED_AT" },
      { id: "updatedAt", title: "UPDATED_AT" },
    ],
  });

  await csvWriter.writeRecords(roles);

  console.log("✅ roles.csv created successfully");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });