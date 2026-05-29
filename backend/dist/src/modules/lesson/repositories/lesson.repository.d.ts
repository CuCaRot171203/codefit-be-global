/**
 * @fileoverview Repository layer for Lesson database operations.
 * Handles all Prisma interactions for the Lesson entity.
 */
import { BaseRepository } from '../../../base/base.repository';
import { Lesson } from '../types';
/**
 * Repository class for Lesson entity operations.
 * Extends BaseRepository to inherit standard CRUD methods.
 * Provides custom query methods specific to Lesson functionality.
 */
declare class LessonRepository extends BaseRepository<Lesson> {
    /** Prisma model instance for Lesson entity */
    protected model: import(".prisma/client").Prisma.LessonDelegate<import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    /**
     * Find lesson by ID with full relations (phase, course, hackathons, projects)
     */
    findById(id: string): Promise<any>;
    /**
     * Retrieves all lessons belonging to a specific phase.
     * Results are sorted by orderIndex in ascending order.
     * @param phaseId - The ID of the phase to get lessons for
     * @returns Promise resolving to array of lessons sorted by order
     */
    findByPhaseId(phaseId: string): Promise<any[]>;
}
declare const _default: LessonRepository;
export default _default;
//# sourceMappingURL=lesson.repository.d.ts.map