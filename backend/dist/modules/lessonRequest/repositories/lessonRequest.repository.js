/**
 * Repository layer cho module LessonRequest
 */
import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../../../base/base.repository';
const prisma = new PrismaClient();
class LessonRequestRepository extends BaseRepository {
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
export default new LessonRequestRepository();
//# sourceMappingURL=lessonRequest.repository.js.map