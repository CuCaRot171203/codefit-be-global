/**
 * @fileoverview Service layer for Lesson business logic.
 * Contains business rules and validation for Lesson operations.
 */
import { BaseService } from '../../../base/base.service';
import lessonRepository from '../repositories/lesson.repository';
import { CreateLessonDto, UpdateLessonDto } from '../types';
/**
 * Service class for handling Lesson business logic.
 * Extends BaseService to inherit standard CRUD operations.
 * Implements validation and business rules for lesson management.
 */
declare class LessonService extends BaseService<typeof lessonRepository> {
    constructor();
    /**
     * Creates a new lesson after validating required fields.
     * @param dto - CreateLessonDto containing lesson data
     * @returns Promise resolving to the created lesson
     * @throws Error if required fields (phaseId, title, content) are missing
     */
    create(dto: CreateLessonDto): Promise<any>;
    /**
     * Create lesson for lecture (without content initially)
     * @param params - phaseId, title, type, status
     * @returns Promise resolving to the created lesson
     */
    createLesson(params: {
        phaseId: string;
        title: string;
        type?: string;
        status?: string;
    }): Promise<any>;
    /**
     * Retrieves all lessons for a specific phase.
     * @param phaseId - ID of the phase to get lessons for
     * @returns Promise resolving to array of lessons
     */
    getByPhaseId(phaseId: string): Promise<any[]>;
    /**
     * Retrieves a single lesson by its ID.
     * @param id - Unique identifier of the lesson
     * @returns Promise resolving to the lesson or null if not found
     */
    getById(id: string): Promise<any | null>;
    /**
     * Updates an existing lesson with new data.
     * @param id - ID of the lesson to update
     * @param dto - UpdateLessonDto containing fields to update
     * @returns Promise resolving to the updated lesson
     * @throws Error if lesson is not found
     */
    update(id: string, dto: UpdateLessonDto): Promise<any>;
    /**
     * Deletes a lesson by its ID.
     * @param id - ID of the lesson to delete
     * @returns Promise resolving to success message
     * @throws Error if lesson is not found
     */
    delete(id: string): Promise<{
        message: string;
    }>;
}
declare const _default: LessonService;
export default _default;
//# sourceMappingURL=lesson.service.d.ts.map