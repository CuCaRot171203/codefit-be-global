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
class LessonService extends BaseService<typeof lessonRepository> {

  constructor() {
    super(lessonRepository);
  }

  /**
   * Creates a new lesson after validating required fields.
   * @param dto - CreateLessonDto containing lesson data
   * @returns Promise resolving to the created lesson
   * @throws Error if required fields (phaseId, title, content) are missing
   */
  async create(dto: CreateLessonDto): Promise<any> {
    // Bước 1: Validate required fields
    if (!dto.phaseId || !dto.title || !dto.content) {
      throw new Error('phaseId, title, and content are required');
    }

    // Bước 2: Prepare lesson data with defaults
    const lesson = await this.repository.create({
      phaseId: dto.phaseId,
      title: dto.title,
      content: dto.content,
      type: dto.type || 'video',
      orderIndex: dto.orderIndex || 0,
      isPublished: true
    } as any);

    // Bước 3: Return created lesson
    return lesson;
  }

  /**
   * Create lesson for lecture (without content initially)
   * @param params - phaseId, title, type, status
   * @returns Promise resolving to the created lesson
   */
  async createLesson(params: { phaseId: string; title: string; type?: string; status?: string }): Promise<any> {
    if (!params.phaseId || !params.title) {
      throw new Error('phaseId and title are required');
    }

    // Get max orderIndex for this phase
    const lessons = await this.repository.findByPhaseId(params.phaseId);
    const maxOrder = lessons.reduce((max, l) => Math.max(max, l.orderIndex || 0), -1);

    const lesson = await this.repository.create({
      phaseId: params.phaseId,
      title: params.title,
      content: '',
      type: params.type || 'theory',
      status: params.status || 'DRAFT',
      orderIndex: maxOrder + 1,
      isPublished: true
    } as any);

    return lesson;
  }

  /**
   * Retrieves all lessons for a specific phase.
   * @param phaseId - ID of the phase to get lessons for
   * @returns Promise resolving to array of lessons
   */
  async getByPhaseId(phaseId: string): Promise<any[]> {
    return this.repository.findByPhaseId(phaseId);
  }

  /**
   * Retrieves a single lesson by its ID.
   * @param id - Unique identifier of the lesson
   * @returns Promise resolving to the lesson or null if not found
   */
  async getById(id: string): Promise<any | null> {
    return this.repository.findById(id);
  }

  /**
   * Updates an existing lesson with new data.
   * @param id - ID of the lesson to update
   * @param dto - UpdateLessonDto containing fields to update
   * @returns Promise resolving to the updated lesson
   * @throws Error if lesson is not found
   */
  async update(id: string, dto: UpdateLessonDto): Promise<any> {
    // Bước 1: Check if lesson exists
    const lesson = await this.repository.findById(id);
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    // Bước 2: Update lesson with provided fields
    const updated = await this.repository.update(id, {
      title: dto.title,
      content: dto.content,
      type: dto.type,
      orderIndex: dto.orderIndex
    } as any);

    // Bước 3: Return updated lesson
    return updated;
  }

  /**
   * Deletes a lesson by its ID.
   * @param id - ID of the lesson to delete
   * @returns Promise resolving to success message
   * @throws Error if lesson is not found
   */
  async delete(id: string): Promise<{ message: string }> {
    // Bước 1: Check if lesson exists
    const lesson = await this.repository.findById(id);
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    // Bước 2: Delete lesson from database
    await this.repository.delete(id);

    // Bước 3: Return success message
    return { message: 'Lesson deleted successfully' };
  }
}

export default new LessonService();
