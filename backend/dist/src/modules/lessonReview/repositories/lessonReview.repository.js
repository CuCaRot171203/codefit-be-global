"use strict";
/**
 * Repository layer cho module LessonReview
 */
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const base_repository_1 = require("../../../base/base.repository");
const prisma = new client_1.PrismaClient();
class LessonReviewRepository extends base_repository_1.BaseRepository {
    model = prisma.lessonReview;
    async findByLessonId(lessonId) {
        return this.model.findUnique({
            where: { lessonId },
        });
    }
    async findWithDetails(lessonId) {
        return this.model.findUnique({
            where: { lessonId },
            include: {
                lesson: {
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
                    },
                },
                admin: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true,
                    },
                },
            },
        });
    }
    async findPendingReviews() {
        const lessons = await prisma.lesson.findMany({
            where: { status: 'PENDING_REVIEW' },
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
        return lessons.map((lesson) => ({
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
        }));
    }
    async createReview(lessonId, adminId, feedback) {
        return this.model.upsert({
            where: { lessonId },
            create: {
                lessonId,
                adminId,
                feedback,
                reviewedAt: new Date(),
            },
            update: {
                adminId,
                feedback,
                reviewedAt: new Date(),
            },
        });
    }
    async findAll() {
        const reviews = await this.model.findMany({
            include: {
                lesson: {
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
                    },
                },
                admin: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true,
                    },
                },
            },
            orderBy: { reviewedAt: 'desc' },
        });
        return reviews;
    }
}
exports.default = new LessonReviewRepository();
//# sourceMappingURL=lessonReview.repository.js.map