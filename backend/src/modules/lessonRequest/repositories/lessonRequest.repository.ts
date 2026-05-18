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
