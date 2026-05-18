/**
 * LessonProgress Repository
 * 
 * Xử lý các thao tác database cho tiến độ bài học.
 * Quản lý việc đánh dấu hoàn thành/chưa hoàn thành bài học của người dùng.
 */

import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../../../base/base.repository';
import Redis from 'ioredis';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

/**
 * Interface định nghĩa cấu trúc LessonProgress
 * @interface LessonProgress
 */
interface LessonProgress {
  /** ID duy nhất của bản ghi tiến độ */
  id: string;
  /** ID của người dùng */
  userId: string;
  /** ID của bài học */
  lessonId: string;
  /** ID của khóa học chứa bài học */
  courseId: string;
  /** Trạng thái hoàn thành */
  isCompleted: boolean;
  /** Thời điểm hoàn thành (null nếu chưa hoàn thành) */
  completedAt: Date | null;
}

/**
 * LessonProgressRepository - Quản lý database operations cho tiến độ bài học
 * @class LessonProgressRepository
 * @extends BaseRepository<LessonProgress>
 */
class LessonProgressRepository extends BaseRepository<LessonProgress> {
  /** Prisma model được sử dụng cho các thao tác database */
  protected model = prisma.lessonProgress;

  /**
   * Tìm tiến độ bài học của người dùng theo lessonId
   * @param userId - ID của người dùng
   * @param lessonId - ID của bài học
   * @returns Promise<LessonProgress | null> - Tiến độ tìm được hoặc null
   */
  async findByUserAndLesson(userId: string, lessonId: string): Promise<LessonProgress | null> {
    // Bước 1: Truy vấn với unique constraint userId_lessonId
    return this.model.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId
        }
      }
    });
  }

  /**
   * Tìm tất cả tiến độ bài học của người dùng trong một khóa học
   * @param userId - ID của người dùng
   * @param courseId - ID của khóa học
   * @returns Promise<LessonProgress[]> - Danh sách tiến độ bài học
   */
  async findByUserAndCourse(userId: string, courseId: string): Promise<LessonProgress[]> {
    // Bước 1: Truy vấn với điều kiện userId và courseId
    return this.model.findMany({
      where: { userId, courseId }
    });
  }

  /**
   * Đánh dấu bài học là hoàn thành
   * @param userId - ID của người dùng
   * @param lessonId - ID của bài học
   * @param courseId - ID của khóa học
   * @returns Promise<LessonProgress> - Bản ghi tiến độ đã cập nhật/tạo mới
   */
  async markComplete(userId: string, lessonId: string, courseId: string): Promise<LessonProgress> {
    // Bước 1: Kiểm tra xem đã có bản ghi tiến độ chưa
    const existing = await this.findByUserAndLesson(userId, lessonId);

    // Bước 2: Nếu đã có, cập nhật trạng thái hoàn thành
    if (existing) {
      await this.model.update({
        where: { id: existing.id },
        data: {
          isCompleted: true,
          completedAt: new Date()
        }
      });
    } else {
      // Bước 3: Nếu chưa có, tạo bản ghi mới với trạng thái hoàn thành
      await this.model.create({
        data: {
          userId,
          lessonId,
          courseId,
          isCompleted: true,
          completedAt: new Date()
        }
      });
    }

    // Bước 4: Cập nhật enrollment - đếm số bài đã hoàn thành và unlock thêm nếu cần
    const completedCount = await this.model.count({
      where: {
        userId,
        isCompleted: true,
        courseId
      }
    });

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
      include: { course: true }
    });

    if (enrollment) {
      const unlockLessonsCount = enrollment.course.unlockLessonsCount;
      const totalLessons = await prisma.lesson.count({
        where: { phase: { courseId } }
      });

      let newUnlocks = enrollment.currentUnlocks;
      if (unlockLessonsCount === 0) {
        newUnlocks = totalLessons;
      } else {
        const completedBatches = Math.floor(completedCount / unlockLessonsCount);
        newUnlocks = Math.min((completedBatches + 1) * unlockLessonsCount, totalLessons);
      }

      // Chỉ update nếu có thay đổi
      if (newUnlocks > enrollment.currentUnlocks) {
        await prisma.enrollment.update({
          where: { userId_courseId: { userId, courseId } },
          data: {
            completedLessons: completedCount,
            currentUnlocks: newUnlocks
          }
        });
      } else if (completedCount !== enrollment.completedLessons) {
        // Cập nhật số bài đã hoàn thành nếu chưa unlock thêm
        await prisma.enrollment.update({
          where: { userId_courseId: { userId, courseId } },
          data: { completedLessons: completedCount }
        });
      }
    }

    // Invalidate stats cache so progress is reflected immediately
    try {
      await redis.del(`stats:courses:${userId}`);
    } catch (err) {
      console.error('Redis cache invalidation error:', err);
    }

    // Trả về bản ghi đã cập nhật
    return this.model.findUnique({
      where: { userId_lessonId: { userId, lessonId } }
    }) as Promise<LessonProgress>;
  }

  /**
   * Đánh dấu bài học là chưa hoàn thành
   * @param userId - ID của người dùng
   * @param lessonId - ID của bài học
   * @returns Promise<LessonProgress> - Bản ghi tiến độ đã cập nhật
   * @throws Error - Nếu không tìm thấy tiến độ bài học
   */
  async markIncomplete(userId: string, lessonId: string): Promise<LessonProgress> {
    // Bước 1: Tìm bản ghi tiến độ hiện tại
    const existing = await this.findByUserAndLesson(userId, lessonId);

    // Bước 2: Kiểm tra nếu không tìm thấy thì throw error
    if (!existing) {
      throw new Error('Lesson progress not found');
    }

    // Bước 3: Cập nhật trạng thái thành chưa hoàn thành và xóa completedAt
    return this.model.update({
      where: { id: existing.id },
      data: {
        isCompleted: false,
        completedAt: null
      }
    });
  }
}

export default new LessonProgressRepository();
