const prisma = require("../config/prisma");
const readCSV = require("./readCSV");

async function seedTasks() {
    const tasks = await readCSV("./CSV_Files/task.csv");

    for (const task of tasks) {
        await prisma.task.create({
            data: {
                id: Number(task.id),
                title: task.title,
                description: task.description || null,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate ? new Date(task.dueDate) : null,
                createdAt: new Date(task.createdAt),
                updatedAt: new Date(task.updatedAt),
                assignedToId: Number(task.assignedToId),
                assignedById: Number(task.assignedById)
            }
        });
    }

    console.log("Tasks Imported Successfully");
}

seedTasks()
    .catch((error) => {
        console.error(error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });