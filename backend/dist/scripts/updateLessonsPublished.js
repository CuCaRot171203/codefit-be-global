"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    // Update all lessons to isPublished = true
    const result = await prisma.lesson.updateMany({
        data: {
            isPublished: true,
        },
    });
    console.log(`Updated ${result.count} lessons to isPublished: true`);
    // Also update all lessons in the specific course if needed
    const courseId = 'e0aac8f3-1dc2-44c0-bf75-5fd16eb6806d';
    const courseResult = await prisma.lesson.updateMany({
        where: {
            phase: {
                courseId: courseId,
            },
        },
        data: {
            isPublished: true,
        },
    });
    console.log(`Updated ${courseResult.count} lessons in course ${courseId}`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=updateLessonsPublished.js.map