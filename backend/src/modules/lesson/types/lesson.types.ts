/**
 * @fileoverview Type definitions for Lesson module.
 * Contains interfaces for Lesson entity, Create DTO, and Update DTO.
 */

/**
 * Represents a Lesson entity in the system.
 * A lesson belongs to a Phase and contains educational content.
 */
export interface Lesson {
  /** Unique identifier for the lesson */
  id: string;
  /** ID of the parent phase this lesson belongs to */
  phaseId: string;
  /** Title of the lesson */
  title: string;
  /** Main content/material of the lesson */
  content: string;
  /** Type of lesson content: 'video' or 'code' */
  type: 'video' | 'code';
  /** Order index for sorting lessons within a phase */
  orderIndex: number;
}

/**
 * Data Transfer Object for creating a new Lesson.
 * Used when sending POST requests to create a lesson.
 */
export interface CreateLessonDto {
  /** ID of the phase to attach this lesson to (required) */
  phaseId: string;
  /** Title of the lesson (required) */
  title: string;
  /** Main content/material of the lesson (required) */
  content: string;
  /** Type of lesson content: 'video' or 'code' (optional, defaults to 'video') */
  type?: 'video' | 'code';
  /** Order index for sorting within a phase (optional, defaults to 0) */
  orderIndex?: number;
}

/**
 * Data Transfer Object for updating an existing Lesson.
 * All fields are optional - only provided fields will be updated.
 */
export interface UpdateLessonDto {
  /** Updated title of the lesson */
  title?: string;
  /** Updated content/material of the lesson */
  content?: string;
  /** Updated type of lesson content */
  type?: 'video' | 'code';
  /** Updated order index for sorting */
  orderIndex?: number;
}
