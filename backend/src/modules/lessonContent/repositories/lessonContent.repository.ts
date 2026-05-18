/**
 * Repository layer cho module LessonContent
 */

import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../../../base/base.repository';
import { LessonContent, LessonContentWithDetails, ScoringConfig } from '../types';

const prisma = new PrismaClient();

class LessonContentRepository extends BaseRepository<LessonContent> {
  protected model = prisma.lessonContent;

  async findByLessonId(lessonId: string): Promise<LessonContent | null> {
    return this.model.findUnique({
      where: { lessonId },
    });
  }

  async findByLessonIdWithDetails(lessonId: string, userId?: string): Promise<any> {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        lessonContent: true, // Include lesson content from separate table
        scoringConfig: true, // Include scoring config
        phase: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                unlockLessonsCount: true,
                hackathons: true,
                projects: true,
              },
            },
            minitests: {
              include: {
                questions: {
                  include: {
                    problem: true
                  }
                }
              }
            },
          },
        },
      },
    });

    if (!lesson) {
      return null;
    }

    // Get all lessons in the course for next lesson navigation
    const allLessonsInCourse = await prisma.lesson.findMany({
      where: {
        phase: {
          courseId: lesson.phase.courseId,
        },
      },
      select: {
        id: true,
        title: true,
        orderIndex: true,
        phaseId: true,
        phase: {
          select: {
            id: true,
            title: true,
            orderIndex: true,
          },
        },
      },
      orderBy: [
        { phase: { orderIndex: 'asc' } },
        { orderIndex: 'asc' },
      ],
    });

    // Get enrollment for unlock info
    let currentUnlocks = 0;
    let completedLessonIds: string[] = [];
    if (userId) {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: lesson.phase.courseId,
          },
        },
        select: {
          currentUnlocks: true,
        },
      });
      currentUnlocks = enrollment?.currentUnlocks || 0;

      // Get completed lessons
      const completedProgress = await prisma.lessonProgress.findMany({
        where: {
          userId,
          isCompleted: true,
          lesson: {
            phase: {
              courseId: lesson.phase.courseId,
            },
          },
        },
        select: { lessonId: true },
      });
      completedLessonIds = completedProgress.map(p => p.lessonId);
    }

    // Build lessons with unlock status
    const lessons = allLessonsInCourse.map((l, index) => ({
      ...l,
      isUnlocked: index < currentUnlocks,
      isCompleted: completedLessonIds.includes(l.id),
    }));

    // Get user's lesson progress if userId is provided
    let isCompleted = completedLessonIds.includes(lessonId);
    const lessonProgress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: userId || '',
          lessonId,
        },
      },
    });

    return {
      ...lesson,
      isCompleted: isCompleted,
      lessons,
      currentUnlocks,
    };
  }

  async upsert(lessonId: string, data: {
    content?: string;
    testCases?: string;
    hints?: string;
    timeLimit?: number;
    memoryLimit?: number;
    starterCode?: string;
  }): Promise<LessonContent> {
    return this.model.upsert({
      where: { lessonId },
      create: {
        lessonId,
        content: data.content || '',
        testCases: data.testCases || '[]',
        hints: data.hints || '[]',
        timeLimit: data.timeLimit || null,
        memoryLimit: data.memoryLimit || null,
        starterCode: data.starterCode || null,
      },
      update: data,
    });
  }
}

class ScoringConfigRepository extends BaseRepository<ScoringConfig> {
  protected model = prisma.scoringConfig;

  async findByLessonId(lessonId: string): Promise<ScoringConfig | null> {
    return this.model.findUnique({
      where: { lessonId },
    });
  }

  async upsert(lessonId: string, data: {
    baseScore?: number;
    penaltyPerHint?: number;
    timeBonusEnabled?: boolean;
    timeBonusThreshold?: number;
    timeBonusValue?: number;
  }): Promise<ScoringConfig> {
    return this.model.upsert({
      where: { lessonId },
      create: {
        lessonId,
        baseScore: data.baseScore ?? 100,
        penaltyPerHint: data.penaltyPerHint ?? 10,
        timeBonusEnabled: data.timeBonusEnabled ?? false,
        timeBonusThreshold: data.timeBonusThreshold ?? null,
        timeBonusValue: data.timeBonusValue ?? null,
      },
      update: data,
    });
  }
}

export default {
  lessonContent: new LessonContentRepository(),
  scoringConfig: new ScoringConfigRepository(),
};
