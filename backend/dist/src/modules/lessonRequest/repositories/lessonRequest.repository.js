"use strict";
/**
 * Repository layer cho module LessonRequest
 */
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const base_repository_1 = require("../../../base/base.repository");
const prisma = new client_1.PrismaClient();
class LessonRequestRepository extends base_repository_1.BaseRepository {
    model = prisma.lessonRequest;
    async findAllWithDetails() {
        return this.model.findMany({
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
                    },
                },
                lecture: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findByLectureId(lectureId) {
        return this.model.findMany({
            where: { lectureId },
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
                    },
                },
                lecture: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findByIdWithDetails(id) {
        return this.model.findUnique({
            where: { id },
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
                lecture: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true,
                        email: true,
                    },
                },
            },
        });
    }
    async updateStatus(id, status) {
        return this.model.update({
            where: { id },
            data: { status: status },
        });
    }
    async findLessonById(id) {
        return prisma.lesson.findUnique({ where: { id } });
    }
    async findLectureById(id) {
        return prisma.user.findUnique({
            where: { id },
            include: { role: true },
        });
    }
    async findAdmins() {
        return prisma.user.findMany({
            where: { role: { name: 'admin' } },
        });
    }
    async updateLessonStatus(lessonId, status) {
        return prisma.lesson.update({
            where: { id: lessonId },
            data: { status: status },
        });
    }
    async upsertLessonContent(lessonId) {
        return prisma.lessonContent.upsert({
            where: { lessonId },
            create: {
                lessonId,
                content: '',
                testCases: '[]',
                hints: '[]',
            },
            update: {},
        });
    }
    async upsertScoringConfig(lessonId) {
        return prisma.scoringConfig.upsert({
            where: { lessonId },
            create: {
                lessonId,
                baseScore: 100,
                penaltyPerHint: 10,
            },
            update: {},
        });
    }
    async findPendingByLectureId(lectureId) {
        return this.model.findMany({
            where: {
                lectureId,
                status: { in: ['PENDING', 'IN_PROGRESS'] },
            },
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
                    },
                },
                lecture: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true,
                        email: true,
                    },
                },
            },
            orderBy: { dueDate: 'asc' },
        });
    }
}
exports.default = new LessonRequestRepository();
//# sourceMappingURL=lessonRequest.repository.js.map