/**
 * @fileoverview Repository layer cho module Progress
 * Xử lý các thao tác database liên quan đến tiến độ học tập
 * @module progress/repositories
 */

import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../../../base/base.repository';
import { Progress } from '../types';

const prisma = new PrismaClient();

/**
 * Repository class xử lý các thao tác CRUD với bảng Progress trong database
 * Kế thừa từ BaseRepository với generic type Progress
 */
class ProgressRepository extends BaseRepository<Progress> {
  protected model = prisma.progress;

  /**
   * Tìm tiến độ học tập của user trong một khóa học cụ thể
   * @param userId - ID của user
   * @param courseId - ID của khóa học
   * @returns Progress nếu tìm thấy, null nếu không tồn tại
   */
  async findByUserAndCourse(userId: string, courseId: string): Promise<Progress | null> {
    return this.model.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });
  }

  /**
   * Cập nhật hoặc tạo mới tiến độ học tập của user
   * Nếu đã có record, cập nhật; nếu chưa có, tạo mới
   * @param userId - ID của user
   * @param courseId - ID của khóa học
   * @param completedLessons - Số bài đã hoàn thành
   * @param totalLessons - Tổng số bài học
   * @returns Progress đã được cập nhật/tạo mới
   */
  async updateProgress(
    userId: string,
    courseId: string,
    completedLessons: number,
    totalLessons: number
  ): Promise<Progress> {
    const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    const existing = await this.findByUserAndCourse(userId, courseId);

    if (existing) {
      return this.model.update({
        where: { id: existing.id },
        data: {
          completedLessons,
          totalLessons,
          percentage,
        }
      });
    }

    return this.model.create({
      data: {
        userId,
        courseId,
        completedLessons,
        totalLessons,
        percentage
      }
    });
  }
}

export default new ProgressRepository();
