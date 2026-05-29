/**
 * Feedback Repository
 *
 * Xử lý các thao tác database cho Feedback entity.
 * Quản lý việc tạo, đọc và truy vấn feedback.
 */

import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../../../base/base.repository';

const prisma = new PrismaClient();

/**
 * Interface định nghĩa cấu trúc Feedback (matches Prisma schema)
 * @interface Feedback
 */
interface Feedback {
  /** ID duy nhất của feedback */
  id: string;
  /** ID của người gửi feedback */
  userId: string;
  /** Nội dung phản hồi */
  message: string;
  /** Thời điểm tạo */
  createdAt: Date;
}

/**
 * FeedbackRepository - Quản lý database operations cho Feedback
 * @class FeedbackRepository
 * @extends BaseRepository<Feedback>
 */
class FeedbackRepository extends BaseRepository<Feedback> {
  /** Prisma model được sử dụng cho các thao tác database */
  protected model = prisma.feedback;

  /**
   * Tìm tất cả feedback theo userId
   * @param userId - ID của người dùng
   * @returns Promise<Feedback[]> - Danh sách feedback
   */
  async findByUserId(userId: string): Promise<Feedback[]> {
    return this.model.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Tìm tất cả feedback (lấy tất cả)
   * @returns Promise<Feedback[]> - Danh sách feedback
   */
  async findAllFeedback(): Promise<Feedback[]> {
    return this.model.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }
}

export default new FeedbackRepository();
