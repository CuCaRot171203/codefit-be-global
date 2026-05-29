"use strict";
/**
 * @fileoverview Lecture Submissions Controller
 * Handles lecture actions on lesson submissions (approve, reject, bulk email)
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_controller_1 = require("../../../base/base.controller");
const prisma_1 = __importDefault(require("../../../prisma"));
const email_service_1 = __importDefault(require("../../email/email.service"));
const notification_service_1 = __importDefault(require("../../notification/services/notification.service"));
class LectureSubmissionController extends base_controller_1.BaseController {
    /**
     * Get all lesson submissions for lessons that this lecture owns
     */
    getSubmissions = async (req, res, next) => {
        try {
            const lectureId = req.user?.userId;
            if (!lectureId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            const lessonId = req.query.lessonId;
            const courseId = req.query.courseId;
            const status = req.query.status;
            const page = req.query.page || '1';
            const limit = req.query.limit || '20';
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            const skip = (pageNum - 1) * limitNum;
            const lectureCourseIds = await prisma_1.default.lectureCourse.findMany({
                where: { lectureId },
                select: { courseId: true },
            });
            const courseIds = lectureCourseIds.map((lc) => lc.courseId);
            const whereClause = {};
            if (lessonId) {
                whereClause.lessonId = lessonId;
            }
            if (courseId) {
                whereClause.lesson = {
                    phase: {
                        courseId: courseId,
                    },
                };
            }
            else if (courseIds.length > 0) {
                whereClause.lesson = {
                    phase: {
                        courseId: { in: courseIds },
                    },
                };
            }
            else {
                this.success(res, { submissions: [], total: 0, page: pageNum, limit: limitNum }, 'No courses assigned');
                return;
            }
            if (status) {
                whereClause.status = status;
            }
            const [submissions, total] = await Promise.all([
                prisma_1.default.lessonSubmission.findMany({
                    where: whereClause,
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                fullName: true,
                                email: true,
                            },
                        },
                        lesson: {
                            select: {
                                id: true,
                                title: true,
                                type: true,
                                phase: {
                                    select: {
                                        title: true,
                                        course: {
                                            select: {
                                                id: true,
                                                title: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                    skip,
                    take: limitNum,
                }),
                prisma_1.default.lessonSubmission.count({ where: whereClause }),
            ]);
            this.success(res, { submissions, total, page: pageNum, limit: limitNum }, 'Success');
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Approve a single submission score
     */
    approveSubmission = async (req, res, next) => {
        try {
            const lectureId = req.user?.userId;
            if (!lectureId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            const id = req.params.id;
            const { score } = req.body;
            const submission = await prisma_1.default.lessonSubmission.findUnique({
                where: { id },
                include: {
                    lesson: {
                        include: {
                            phase: {
                                include: {
                                    course: true,
                                },
                            },
                        },
                    },
                    user: {
                        select: {
                            id: true,
                            username: true,
                            fullName: true,
                            email: true,
                        },
                    },
                },
            });
            if (!submission) {
                this.error(res, 'Submission not found', 404);
                return;
            }
            const lectureCourse = await prisma_1.default.lectureCourse.findFirst({
                where: {
                    lectureId,
                    courseId: submission.lesson.phase.courseId,
                },
            });
            if (!lectureCourse) {
                this.error(res, 'You do not have permission to approve this submission', 403);
                return;
            }
            const updated = await prisma_1.default.lessonSubmission.update({
                where: { id },
                data: {
                    status: 'APPROVED',
                    reviewedAt: new Date(),
                    reviewedBy: lectureId,
                    ...(score !== undefined && { score }),
                },
            });
            await notification_service_1.default.createNotification({
                userId: submission.userId,
                type: 'submission_approved',
                title: 'Bài tập đã được duyệt',
                message: `Bài tập "${submission.lesson.title}" đã được giảng viên duyệt. Điểm: ${updated.score || 0}`,
            });
            await email_service_1.default.sendScoreNotification(submission.user.email, submission.user.fullName || submission.user.username, submission.lesson.title, submission.lesson.phase.course.title, updated.score || 0, submission.passedTests || 0, submission.totalTests || 0, `${process.env.FRONTEND_URL || 'http://localhost:5173'}/user/lessons/${submission.lessonId}`);
            this.success(res, updated, 'Submission approved successfully');
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Reject a single submission
     */
    rejectSubmission = async (req, res, next) => {
        try {
            const lectureId = req.user?.userId;
            if (!lectureId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            const id = req.params.id;
            const { feedback } = req.body;
            const submission = await prisma_1.default.lessonSubmission.findUnique({
                where: { id },
                include: {
                    lesson: {
                        include: {
                            phase: {
                                include: {
                                    course: true,
                                },
                            },
                        },
                    },
                    user: {
                        select: {
                            id: true,
                            username: true,
                            fullName: true,
                            email: true,
                        },
                    },
                },
            });
            if (!submission) {
                this.error(res, 'Submission not found', 404);
                return;
            }
            const lectureCourse = await prisma_1.default.lectureCourse.findFirst({
                where: {
                    lectureId,
                    courseId: submission.lesson.phase.courseId,
                },
            });
            if (!lectureCourse) {
                this.error(res, 'You do not have permission to reject this submission', 403);
                return;
            }
            const updated = await prisma_1.default.lessonSubmission.update({
                where: { id },
                data: {
                    status: 'REJECTED',
                    reviewedAt: new Date(),
                    reviewedBy: lectureId,
                },
            });
            await notification_service_1.default.createNotification({
                userId: submission.userId,
                type: 'submission_rejected',
                title: 'Bài tập cần chỉnh sửa',
                message: `Bài tập "${submission.lesson.title}" cần được chỉnh sửa thêm.${feedback ? ` Phản hồi: ${feedback}` : ''}`,
            });
            this.success(res, updated, 'Submission rejected');
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Bulk approve submissions and send emails
     */
    bulkApprove = async (req, res, next) => {
        try {
            const lectureId = req.user?.userId;
            if (!lectureId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            const { submissionIds } = req.body;
            if (!Array.isArray(submissionIds) || submissionIds.length === 0) {
                this.error(res, 'submissionIds must be a non-empty array', 400);
                return;
            }
            const submissions = await prisma_1.default.lessonSubmission.findMany({
                where: { id: { in: submissionIds } },
                include: {
                    lesson: {
                        include: {
                            phase: {
                                include: {
                                    course: true,
                                },
                            },
                        },
                    },
                    user: {
                        select: {
                            id: true,
                            username: true,
                            fullName: true,
                            email: true,
                        },
                    },
                },
            });
            const lectureCourseIds = await prisma_1.default.lectureCourse.findMany({
                where: { lectureId },
                select: { courseId: true },
            });
            const allowedCourseIds = lectureCourseIds.map((lc) => lc.courseId);
            const unauthorized = submissions.filter((s) => !allowedCourseIds.includes(s.lesson.phase.courseId));
            if (unauthorized.length > 0) {
                this.error(res, 'You do not have permission to approve some submissions', 403);
                return;
            }
            const now = new Date();
            await prisma_1.default.lessonSubmission.updateMany({
                where: { id: { in: submissionIds } },
                data: {
                    status: 'APPROVED',
                    reviewedAt: now,
                    reviewedBy: lectureId,
                },
            });
            const results = [];
            for (const submission of submissions) {
                await notification_service_1.default.createNotification({
                    userId: submission.userId,
                    type: 'submission_approved',
                    title: 'Bài tập đã được duyệt',
                    message: `Bài tập "${submission.lesson.title}" đã được giảng viên duyệt. Điểm: ${submission.score || 0}`,
                });
                await email_service_1.default.sendScoreNotification(submission.user.email, submission.user.fullName || submission.user.username, submission.lesson.title, submission.lesson.phase.course.title, submission.score || 0, submission.passedTests || 0, submission.totalTests || 0, `${process.env.FRONTEND_URL || 'http://localhost:5173'}/user/lessons/${submission.lessonId}`);
                results.push({
                    submissionId: submission.id,
                    userId: submission.userId,
                    email: submission.user.email,
                });
            }
            this.success(res, {
                approved: submissionIds.length,
                results,
            }, 'Bulk approval completed and emails sent');
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = new LectureSubmissionController();
//# sourceMappingURL=lectureSubmission.controller.js.map