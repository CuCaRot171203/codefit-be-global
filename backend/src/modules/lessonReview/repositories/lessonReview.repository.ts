/**
 * Repository layer cho module LessonReview
 */

import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../../../base/base.repository';
import { LessonReview, LessonReviewWithDetails } from '../types';

const prisma = new PrismaClient();

class LessonReviewRepository extends BaseRepository<LessonReview> {
  protected model = prisma.lessonReview;

  async findByLessonId(lessonId: string): Promise<LessonReview | null> {
    return this.model.findUnique({
      where: { lessonId },
    });
  }

  async findWithDetails(lessonId: string): Promise<LessonReviewWithDetails | null> {
    return this.model.findUnique({
      where: { lessonId },
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
        admin: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
    });
  }

  async findPendingReviews(): Promise<LessonReviewWithDetails[]> {
    const lessons = await prisma.lesson.findMany({
      where: { status: 'PENDING_REVIEW' },
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
        lessonRequest: {
          include: {
            lecture: {
              select: {
                id: true,
                username: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return lessons.map((lesson) => ({
      id: lesson.id,
      lessonId: lesson.id,
      adminId: '',
      status: lesson.status,
      feedback: null,
      reviewedAt: lesson.createdAt,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
      lesson: {
        id: lesson.id,
        title: lesson.title,
        type: lesson.type,
        status: lesson.status,
        phase: lesson.phase,
      },
      lessonContent: lesson.lessonContent ? {
        content: lesson.lessonContent.content,
        testCases: lesson.lessonContent.testCases,
        hints: lesson.lessonContent.hints,
        starterCode: lesson.lessonContent.starterCode,
      } : null,
    }));
  }

  async createReview(lessonId: string, adminId: string, feedback?: string): Promise<LessonReview> {
    return this.model.upsert({
      where: { lessonId },
      create: {
        lessonId,
        adminId,
        feedback,
        reviewedAt: new Date(),
      },
      update: {
        adminId,
        feedback,
        reviewedAt: new Date(),
      },
    });
  }

  async findAll(): Promise<LessonReviewWithDetails[]> {
    const reviews = await this.model.findMany({
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
        admin: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
      orderBy: { reviewedAt: 'desc' },
    });

    return reviews;
  }
}

export default new LessonReviewRepository();
