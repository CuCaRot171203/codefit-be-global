"use strict";
/**
 * Service layer cho module LessonReview
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_service_1 = require("../../../base/base.service");
const lessonReview_repository_1 = __importDefault(require("../repositories/lessonReview.repository"));
const notification_service_1 = __importDefault(require("../../notification/services/notification.service"));
const email_service_1 = __importDefault(require("../../email/email.service"));
const prisma_1 = __importDefault(require("../../../prisma"));
class LessonReviewService extends base_service_1.BaseService {
    constructor() {
        super(lessonReview_repository_1.default);
    }
    async getPendingReviews() {
        return this.repository.findPendingReviews();
    }
    async getReviewDetails(lessonId) {
        const review = await this.repository.findWithDetails(lessonId);
        if (!review) {
            // Return lesson details even without review
            const lesson = await prisma_1.default.lesson.findUnique({
                where: { id: lessonId },
                include: {
                    phase: {
                        include: {
                            course: {
                                select: {
                                    id: true,
                                    title: true,
                                },
                            },
                        },
                    },
                    lessonContent: true,
                    lessonRequest: {
                        include: {
                            lecture: {
                                select: {
                                    id: true,
                                    username: true,
                                    fullName: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!lesson) {
                throw new Error('Lesson not found');
            }
            return {
                id: lesson.id,
                lessonId: lesson.id,
                adminId: '',
                status: lesson.status,
                feedback: null,
                reviewedAt: lesson.createdAt,
                createdAt: lesson.createdAt,
                updatedAt: lesson.updatedAt,
                lesson: {
                    id: lesson.id,
                    title: lesson.title,
                    type: lesson.type,
                    status: lesson.status,
                    phase: lesson.phase,
                },
                lessonContent: lesson.lessonContent ? {
                    content: lesson.lessonContent.content,
                    testCases: lesson.lessonContent.testCases,
                    hints: lesson.lessonContent.hints,
                    starterCode: lesson.lessonContent.starterCode,
                } : null,
            };
        }
        return review;
    }
    async approve(lessonId, adminId, feedback) {
        // Get lesson info
        const lesson = await prisma_1.default.lesson.findUnique({
            where: { id: lessonId },
        });
        if (!lesson) {
            throw new Error('Lesson not found');
        }
        // Get lessonRequest with lecture info
        const lessonRequest = await prisma_1.default.lessonRequest.findFirst({
            where: { lessonId },
            include: {
                lecture: {
                    select: { id: true, email: true, fullName: true },
                },
            },
        });
        console.log('[LESSON REVIEW] Approve - lessonRequest:', lessonRequest);
        if (!lessonRequest) {
            throw new Error('Lesson request not found');
        }
        // Update lesson status to APPROVED
        await prisma_1.default.lesson.update({
            where: { id: lessonId },
            data: {
                status: 'APPROVED',
            },
        });
        // Create review record
        const review = await this.repository.createReview(lessonId, adminId, feedback);
        // Notify lecture via email
        if (lessonRequest.lecture) {
            await email_service_1.default.sendLessonApprovedNotification(lessonRequest.lecture.email, lessonRequest.lecture.fullName || 'Giảng viên', lesson.title);
            await notification_service_1.default.createNotification({
                userId: lessonRequest.lecture.id,
                type: 'lesson_approved',
                title: 'Bài học được duyệt thành công!',
                message: `Bài học "${lesson.title}" đã được admin duyệt. Bạn có thể xuất bản hoặc tiếp tục chỉnh sửa.`,
                metadata: {
                    lessonId: lessonId,
                    lessonTitle: lesson.title,
                    status: 'APPROVED',
                    feedback: feedback || null,
                    actionUrl: `/lecture/lessons/${lessonId}/edit`,
                },
            });
        }
        return review;
    }
    async reject(lessonId, adminId, feedback) {
        if (!feedback) {
            throw new Error('Feedback is required when rejecting');
        }
        // Get lesson info
        const lesson = await prisma_1.default.lesson.findUnique({
            where: { id: lessonId },
        });
        if (!lesson) {
            throw new Error('Lesson not found');
        }
        // Get lessonRequest with lecture info
        const lessonRequest = await prisma_1.default.lessonRequest.findFirst({
            where: { lessonId },
            include: {
                lecture: {
                    select: { id: true, email: true, fullName: true },
                },
            },
        });
        // Update lesson status to REJECTED
        await prisma_1.default.lesson.update({
            where: { id: lessonId },
            data: {
                status: 'REJECTED',
            },
        });
        // Update lesson request status
        if (lessonRequest && lessonRequest.id) {
            await prisma_1.default.lessonRequest.update({
                where: { id: lessonRequest.id },
                data: { status: 'IN_PROGRESS' },
            });
        }
        // Create review record
        const review = await this.repository.createReview(lessonId, adminId, feedback);
        // Notify lecture via email
        if (lessonRequest?.lecture) {
            await email_service_1.default.sendLessonRejectedNotification(lessonRequest.lecture.email, lessonRequest.lecture.fullName || 'Giảng viên', lesson.title, feedback);
            await notification_service_1.default.createNotification({
                userId: lessonRequest.lecture.id,
                type: 'lesson_rejected',
                title: 'Bài học bị từ chối duyệt',
                message: `Bài học "${lesson.title}" đã bị từ chối. Lý do: ${feedback}`,
                metadata: {
                    lessonId: lessonId,
                    lessonTitle: lesson.title,
                    status: 'REJECTED',
                    feedback: feedback,
                    actionUrl: `/lecture/lessons/${lessonId}/edit`,
                },
            });
        }
        return review;
    }
    async publish(lessonId, adminId) {
        // Get lesson info with phase and course
        const lesson = await prisma_1.default.lesson.findUnique({
            where: { id: lessonId },
            include: {
                phase: {
                    include: {
                        course: {
                            include: {
                                enrollments: {
                                    select: { userId: true },
                                },
                            },
                        },
                    },
                },
            },
        });
        // Get lessonRequest with lecture info
        const lessonRequest = await prisma_1.default.lessonRequest.findFirst({
            where: { lessonId },
            include: {
                lecture: {
                    select: { id: true, email: true, fullName: true },
                },
            },
        });
        if (!lesson) {
            throw new Error('Lesson not found');
        }
        if (lesson.status !== 'APPROVED') {
            throw new Error('Lesson must be approved before publishing');
        }
        // Update lesson status to PUBLISHED
        await prisma_1.default.lesson.update({
            where: { id: lessonId },
            data: {
                status: 'PUBLISHED',
                isPublished: true,
                publishedAt: new Date(),
            },
        });
        // Notify lecture via email and notification when published
        if (lessonRequest?.lecture) {
            await email_service_1.default.sendLessonApprovedNotification(lessonRequest.lecture.email, lessonRequest.lecture.fullName || 'Giảng viên', lesson.title);
            await notification_service_1.default.createNotification({
                userId: lessonRequest.lecture.id,
                type: 'lesson_published',
                title: 'Bài học đã được xuất bản!',
                message: `Bài học "${lesson.title}" đã được xuất bản thành công và sẵn sàng cho học viên.`,
                metadata: {
                    lessonId: lessonId,
                    lessonTitle: lesson.title,
                    status: 'PUBLISHED',
                    courseId: lesson.phase.courseId,
                    courseTitle: lesson.phase.course.title,
                    actionUrl: `/lecture/lessons/${lessonId}/edit`,
                },
            });
        }
        // Notify all enrolled users
        const enrolledUserIds = lesson.phase.course.enrollments.map((e) => e.userId);
        for (const userId of enrolledUserIds) {
            await notification_service_1.default.createNotification({
                userId,
                type: 'new_lesson_available',
                title: 'Bài học mới',
                message: `Khóa học "${lesson.phase.course.title}" vừa có bài học mới: "${lesson.title}"`,
            });
            // Send email to user
            const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
            if (user) {
                const lessonUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/user/khoa-hoc/${lessonId}`;
                await email_service_1.default.sendNewLessonNotification(user.email, user.fullName || user.username, lesson.phase.course.title, lesson.title, lessonUrl);
            }
        }
        // Update lesson request to SUBMITTED
        if (lessonRequest && lessonRequest.id) {
            await prisma_1.default.lessonRequest.update({
                where: { id: lessonRequest.id },
                data: { status: 'SUBMITTED' },
            });
        }
        // Auto enroll users who are not enrolled yet (if course.autoEnrollOnApproval is true)
        if (lesson.phase.course.autoEnrollOnApproval) {
            await this.autoEnrollUsers(lesson.phase.course.id, lesson.phase.course.title, lesson.id, lesson.title);
        }
        return lesson;
    }
    /**
     * Auto enroll users who are not enrolled in the course
     */
    async autoEnrollUsers(courseId, courseTitle, lessonId, lessonTitle) {
        // Get all users with 'user' role who are not enrolled
        const usersToEnroll = await prisma_1.default.user.findMany({
            where: {
                role: {
                    name: 'user',
                },
                enrollments: {
                    none: {
                        courseId,
                    },
                },
                subscriptions: {
                    none: {
                        courseId,
                    },
                },
            },
            select: {
                id: true,
                email: true,
                username: true,
                fullName: true,
            },
        });
        if (usersToEnroll.length === 0) {
            console.log(`[LessonReview] No users to auto-enroll for course: ${courseTitle}`);
            return;
        }
        // Create subscriptions for all users
        await prisma_1.default.courseSubscription.createMany({
            data: usersToEnroll.map((user) => ({
                userId: user.id,
                courseId,
                status: 'ACTIVE',
            })),
            skipDuplicates: true,
        });
        console.log(`[LessonReview] Auto-enrolled ${usersToEnroll.length} users for course: ${courseTitle}`);
        // Send notifications and emails to newly enrolled users
        const lessonUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/user/khoa-hoc/${courseId}`;
        for (const user of usersToEnroll) {
            // Create notification
            await notification_service_1.default.createNotification({
                userId: user.id,
                type: 'new_lesson_available',
                title: 'Bạn đã được thêm vào khóa học',
                message: `Bạn đã được thêm vào khóa học "${courseTitle}" với bài học mới: "${lessonTitle}"`,
            });
            // Send email
            await email_service_1.default.sendNewLessonNotification(user.email, user.fullName || user.username, courseTitle, lessonTitle, lessonUrl);
        }
    }
    async batchApprove(lessonIds, adminId) {
        const results = [];
        for (const lessonId of lessonIds) {
            try {
                const result = await this.approve(lessonId, adminId);
                results.push({ lessonId, success: true, result });
            }
            catch (error) {
                results.push({ lessonId, success: false, error: error.message });
            }
        }
        return results;
    }
    async batchPublish(lessonIds, adminId) {
        const results = [];
        for (const lessonId of lessonIds) {
            try {
                const result = await this.publish(lessonId, adminId);
                results.push({ lessonId, success: true, result });
            }
            catch (error) {
                results.push({ lessonId, success: false, error: error.message });
            }
        }
        return results;
    }
    async getAllReviews() {
        return this.repository.findAll();
    }
}
exports.default = new LessonReviewService();
//# sourceMappingURL=lessonReview.service.js.map