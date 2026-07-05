const prisma = require("../config/prisma");
const readCSV = require("./readCSV");

async function seedAuditLogs() {
    const auditLogs = await readCSV("./CSV_Files/auditLog.csv");

    for (const auditLog of auditLogs) {
        await prisma.auditLog.create({
            data: {
                id: Number(auditLog.id),
                action: auditLog.action,
                entityName: auditLog.entityName || null,
                entityId: auditLog.entityId
                    ? Number(auditLog.entityId)
                    : null,
                description: auditLog.description || null,
                createdAt: new Date(auditLog.createdAt),
                userId: Number(auditLog.userId)
            }
        });
    }

    console.log("Audit Logs Imported Successfully");
}

seedAuditLogs()
    .catch((error) => {
        console.error(error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });