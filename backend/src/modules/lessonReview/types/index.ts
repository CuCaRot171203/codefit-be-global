/**
 * Types cho module LessonReview
 */

export interface LessonReview {
  id: string;
  lessonId: string;
  adminId: string;
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'PUBLISHED' | 'ARCHIVED';
  feedback: string | null;
  reviewedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLessonReviewDto {
  lessonId: string;
  feedback?: string;
}

export interface ApproveLessonDto {
  feedback?: string;
}

export interface RejectLessonDto {
  feedback: string;
}

export interface LessonReviewWithDetails extends LessonReview {
  lesson: {
    id: string;
    title: string;
    type: string;
    status: string;
    phase: {
      id: string;
      title: string;
      course: {
        id: string;
        title: string;
      };
    };
  };
  lessonContent?: {
    content: string | null;
    testCases: string | null;
    hints: string | null;
    starterCode: string | null;
  };
  admin?: {
    id: string;
    username: string;
    fullName: string | null;
  };
}
