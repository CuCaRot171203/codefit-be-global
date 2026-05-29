"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    // Get or create a test user
    let user = await prisma.user.findFirst();
    if (!user) {
        // Find a role first
        const role = await prisma.role.findFirst({ where: { name: 'user' } });
        if (!role) {
            throw new Error('No role found. Please create roles first.');
        }
        user = await prisma.user.create({
            data: {
                email: 'testuser@example.com',
                username: 'testuser',
                password: 'password123',
                fullName: 'Test User',
                roleId: role.id,
            },
        });
        console.log('Created test user:', user.id);
    }
    // Get or create a course
    let course = await prisma.course.findFirst({
        where: { title: { contains: 'Test Course' } },
    });
    if (!course) {
        course = await prisma.course.create({
            data: {
                title: 'Test Course - JavaScript Cơ Bản',
                description: 'Khóa học JavaScript cơ bản cho người mới bắt đầu',
                image: 'https://example.com/js-course.jpg',
                price: 0,
                level: 'BEGINNER',
                creatorId: user.id,
                unlockLessonsCount: 2,
                unlockByPhase: false,
            },
        });
        console.log('Created course:', course.id);
    }
    // Create Phase 1
    const phase1 = await prisma.phase.create({
        data: {
            courseId: course.id,
            title: 'Chương 1: Giới thiệu',
            orderIndex: 1,
        },
    });
    console.log('Created Phase 1:', phase1.id);
    // Create lessons for Phase 1
    const lessonsPhase1 = [
        { title: 'Bài 1: Giới thiệu về JavaScript', type: 'LECTURE', orderIndex: 1 },
        { title: 'Bài 2: Biến và Kiểu dữ liệu', type: 'LECTURE', orderIndex: 2 },
        { title: 'Bài 3: Toán tử và Biểu thức', type: 'LECTURE', orderIndex: 3 },
    ];
    for (const lessonData of lessonsPhase1) {
        const lesson = await prisma.lesson.create({
            data: {
                phaseId: phase1.id,
                title: lessonData.title,
                type: lessonData.type,
                orderIndex: lessonData.orderIndex,
                isPublished: true,
                content: `<h2>${lessonData.title}</h2><p>Nội dung bài học...</p>`,
            },
        });
        console.log('Created lesson:', lesson.title);
    }
    // Create Phase 2
    const phase2 = await prisma.phase.create({
        data: {
            courseId: course.id,
            title: 'Chương 2: Cấu trúc điều khiển',
            orderIndex: 2,
        },
    });
    console.log('Created Phase 2:', phase2.id);
    // Create lessons for Phase 2
    const lessonsPhase2 = [
        { title: 'Bài 4: Câu lệnh If-Else', type: 'LECTURE', orderIndex: 1 },
        { title: 'Bài 5: Vòng lặp For', type: 'LECTURE', orderIndex: 2 },
        { title: 'Bài 6: Vòng lặp While', type: 'LECTURE', orderIndex: 3 },
    ];
    for (const lessonData of lessonsPhase2) {
        const lesson = await prisma.lesson.create({
            data: {
                phaseId: phase2.id,
                title: lessonData.title,
                type: lessonData.type,
                orderIndex: lessonData.orderIndex,
                isPublished: true,
                content: `<h2>${lessonData.title}</h2><p>Nội dung bài học...</p>`,
            },
        });
        console.log('Created lesson:', lesson.title);
    }
    // Create enrollment for test user
    const existingEnrollment = await prisma.enrollment.findFirst({
        where: {
            userId: user.id,
            courseId: course.id,
        },
    });
    if (!existingEnrollment) {
        await prisma.enrollment.create({
            data: {
                userId: user.id,
                courseId: course.id,
                currentUnlocks: 3,
                completedLessons: 0,
            },
        });
        console.log('Created enrollment for user:', user.email);
    }
    console.log('\n✅ Seed completed!');
    console.log('Course ID:', course.id);
    console.log('User ID:', user.id);
    console.log('\nAccess the course at: http://localhost:8000/user/course/' + course.id);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seedTestCourse.js.map