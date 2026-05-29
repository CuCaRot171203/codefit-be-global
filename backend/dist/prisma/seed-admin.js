"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Seed script - Admin only version
 * Run with: npm run db:seed:admin
 */
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function cleanDatabase() {
    await prisma.submissionResult.deleteMany();
    await prisma.submission.deleteMany();
    await prisma.minitestSubmission.deleteMany();
    await prisma.minitestQuestion.deleteMany();
    await prisma.minitest.deleteMany();
    await prisma.hackathonSubmission.deleteMany();
    await prisma.hackathonParticipant.deleteMany();
    await prisma.hackathon.deleteMany();
    await prisma.projectSubmission.deleteMany();
    await prisma.project.deleteMany();
    await prisma.certificate.deleteMany();
    await prisma.userStats.deleteMany();
    await prisma.feedback.deleteMany();
    await prisma.notificationTarget.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.lessonProgress.deleteMany();
    await prisma.lessonReview.deleteMany();
    await prisma.scoringConfig.deleteMany();
    await prisma.lessonSubmission.deleteMany();
    await prisma.lessonRequest.deleteMany();
    await prisma.lessonContent.deleteMany();
    await prisma.progress.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.activateCode.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.phase.deleteMany();
    await prisma.lectureCourse.deleteMany();
    await prisma.course.deleteMany();
    await prisma.testcase.deleteMany();
    await prisma.problem.deleteMany();
    await prisma.userSession.deleteMany();
    await prisma.user.deleteMany();
    await prisma.role.deleteMany();
    await prisma.courseSubscription.deleteMany();
    await prisma.conversationMessage.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.aIRequest.deleteMany();
    console.log('Da xoa du lieu cu');
}
async function main() {
    console.log('Bat dau seed du lieu admin...\n');
    await cleanDatabase();
    // ============ ROLES ============
    const adminRole = await prisma.role.create({
        data: { name: 'admin', description: 'Quan tri vien' },
    });
    await prisma.role.create({
        data: { name: 'user', description: 'Hoc vien' },
    });
    await prisma.role.create({
        data: { name: 'lecture', description: 'Giang vien' },
    });
    console.log('Tao 3 roles: admin, user, lecture');
    // ============ ADMIN USERS ============
    const adminPassword = await bcrypt_1.default.hash('admin123', 10);
    const admin1 = await prisma.user.create({
        data: {
            email: 'admin1@codefit.edu.vn',
            username: 'admin1',
            password: adminPassword,
            roleId: adminRole.id,
            fullName: 'Tran Van A',
            bio: 'Quan tri he thong',
        },
    });
    const admin2 = await prisma.user.create({
        data: {
            email: 'admin2@codefit.edu.vn',
            username: 'admin2',
            password: adminPassword,
            roleId: adminRole.id,
            fullName: 'Le Thi B',
            bio: 'Quan ly noi dung',
        },
    });
    const admin3 = await prisma.user.create({
        data: {
            email: 'admin3@codefit.edu.vn',
            username: 'admin3',
            password: adminPassword,
            roleId: adminRole.id,
            fullName: 'Pham Van C',
            bio: 'Ky thuat he thong',
        },
    });
    console.log('Tao 3 admin users');
    // ============ SUMMARY ============
    console.log('\n========== SEED HOAN TAT ==========');
    console.log('\nADMIN (password: admin123):');
    console.log('  - admin1@codefit.edu.vn');
    console.log('  - admin2@codefit.edu.vn');
    console.log('  - admin3@codefit.edu.vn');
    console.log('\nChi co roles va admin users, khong co courses hay du lieu khac.');
    console.log('===================================\n');
}
main()
    .catch((e) => {
    console.error('Seed that bai:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-admin.js.map