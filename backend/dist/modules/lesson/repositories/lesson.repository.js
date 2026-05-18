/**
 * @fileoverview Repository layer for Lesson database operations.
 * Handles all Prisma interactions for the Lesson entity.
 */
import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../../../base/base.repository';
const prisma = new PrismaClient();
/**
 * Repository class for Lesson entity operations.
 * Extends BaseRepository to inherit standard CRUD methods.
 * Provides custom query methods specific to Lesson functionality.
 */
class LessonRepository extends BaseRepository {
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
                                minitests: true,
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
export default new LessonRepository();
//# sourceMappingURL=lesson.repository.js.map