"use strict";
/**
 * @fileoverview Repository layer for Lesson database operations.
 * Handles all Prisma interactions for the Lesson entity.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const base_repository_1 = require("../../../base/base.repository");
const prisma = new client_1.PrismaClient();
/**
 * Repository class for Lesson entity operations.
 * Extends BaseRepository to inherit standard CRUD methods.
 * Provides custom query methods specific to Lesson functionality.
 */
class LessonRepository extends base_repository_1.BaseRepository {
    /** Prisma model instance for Lesson entity */
    model = prisma.lesson;
    /**
     * Find lesson by ID with full relations (phase, course, hackathons, projects)
     */
    async findById(id) {
        return this.model.findUnique({
            where: { id },
            include: {
                phase: {
                    include: {
                        course: {
                            include: {
                                hackathons: true,
                                projects: true,
                            }
                        },
                        minitests: true,
                    }
                },
            }
        });
    }
    /**
     * Retrieves all lessons belonging to a specific phase.
     * Results are sorted by orderIndex in ascending order.
     * @param phaseId - The ID of the phase to get lessons for
     * @returns Promise resolving to array of lessons sorted by order
     */
    async findByPhaseId(phaseId) {
        return this.model.findMany({
            where: { phaseId },
            orderBy: { orderIndex: 'asc' }
        });
    }
}
exports.default = new LessonRepository();
//# sourceMappingURL=lesson.repository.js.map