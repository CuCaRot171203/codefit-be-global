/**
 * Types cho module LessonRequest
 */

export interface LessonRequest {
  id: string;
  lessonId: string;
  lectureId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'SUBMITTED' | 'CANCELLED';
  dueDate: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLessonRequestDto {
  lessonId: string;
  lectureId: string;
  dueDate?: string;
  notes?: string;
}

export interface UpdateLessonRequestDto {
  status?: 'PENDING' | 'IN_PROGRESS' | 'SUBMITTED' | 'CANCELLED';
  dueDate?: string;
  notes?: string;
}

export interface LessonRequestWithDetails extends LessonRequest {
  lesson: {
    id: string;
    title: string;
    type: string;
    phase: {
      id: string;
      title: string;
      course: {
        id: string;
        title: string;
      };
    };
  };
  lecture: {
    id: string;
    username: string;
    fullName: string | null;
    email: string;
  };
}
