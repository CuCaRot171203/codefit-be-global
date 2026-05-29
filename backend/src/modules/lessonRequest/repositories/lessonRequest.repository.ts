/**
 * Repository layer cho module LessonRequest
 */

import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../../../base/base.repository';
import { LessonRequest, LessonRequestWithDetails } from '../types';

const prisma = new PrismaClient();

class LessonRequestRepository extends BaseRepository<LessonRequest> {
  protected model = prisma.lessonRequest;

  async findAllWithDetails(): Promise<LessonRequestWithDetails[]> {
    return this.model.findMany({
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
          },
        },
        lecture: {
          select: {
            id: true,
            username: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByLectureId(lectureId: string): Promise<LessonRequestWithDetails[]> {
    return this.model.findMany({
      where: { lectureId },
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
          },
        },
        lecture: {
          select: {
            id: true,
            username: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByIdWithDetails(id: string): Promise<LessonRequestWithDetails | null> {
    return this.model.findUnique({
      where: { id },
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
        lecture: {
          select: {
            id: true,
            username: true,
            fullName: true,
            email: true,
          },
        },
      },
    });
  }

  async updateStatus(id: string, status: string): Promise<LessonRequest> {
    return this.model.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async findLessonById(id: string) {
    return prisma.lesson.findUnique({ where: { id } });
  }

  async findLectureById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
  }

  async findAdmins() {
    return prisma.user.findMany({
      where: { role: { name: 'admin' } },
    });
  }

  async updateLessonStatus(lessonId: string, status: string) {
    return prisma.lesson.update({
      where: { id: lessonId },
      data: { status: status as any },
    });
  }

  async upsertLessonContent(lessonId: string) {
    return prisma.lessonContent.upsert({
      where: { lessonId },
      create: {
        lessonId,
        content: '',
        testCases: '[]',
        hints: '[]',
      },
      update: {},
    });
  }

  async upsertScoringConfig(lessonId: string) {
    return prisma.scoringConfig.upsert({
      where: { lessonId },
      create: {
        lessonId,
        baseScore: 100,
        penaltyPerHint: 10,
      },
      update: {},
    });
  }

  async findPendingByLectureId(lectureId: string): Promise<LessonRequestWithDetails[]> {
    return this.model.findMany({
      where: {
        lectureId,
        status: { in: ['PENDING', 'IN_PROGRESS'] },
      },
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
          },
        },
        lecture: {
          select: {
            id: true,
            username: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    });
  }
}

export default new LessonRequestRepository();
