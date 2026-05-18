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
 * Interface định nghĩa cấu trúc Feedback
 * @interface Feedback
 */
interface Feedback {
  /** ID duy nhất của feedback */
  id: string;
  /** ID của người gửi feedback */
  userId: string;
  /** ID của đối tượng được đánh giá */
  targetId: string;
  /** Loại đối tượng được đánh giá */
  targetType: string;
  /** Điểm đánh giá */
  rating: number;
  /** Nội dung phản hồi */
  comment: string;
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
   * Tìm tất cả feedback theo targetId và targetType
   * @param targetId - ID của đối tượng được đánh giá
   * @param targetType - Loại đối tượng được đánh giá
   * @returns Promise<Feedback[]> - Danh sách feedback
   */
  async findByTargetId(targetId: string, targetType: string): Promise<Feedback[]> {
    // Bước 1: Truy vấn database với điều kiện targetId và targetType
    // Bước 2: Sắp xếp theo thời gian tạo giảm dần (mới nhất trước)
    return this.model.findMany({
      where: { targetId, targetType },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Tìm feedback của một user cho một target cụ thể
   * @param userId - ID của người dùng
   * @param targetId - ID của đối tượng được đánh giá
   * @param targetType - Loại đối tượng được đánh giá
   * @returns Promise<Feedback | null> - Feedback tìm được hoặc null
   */
  async findByUserAndTarget(userId: string, targetId: string, targetType: string): Promise<Feedback | null> {
    // Bước 1: Tìm feedback với điều kiện userId, targetId và targetType
    return this.model.findFirst({
      where: { userId, targetId, targetType }
    });
  }

  /**
   * Tính điểm đánh giá trung bình cho một target
   * @param targetId - ID của đối tượng được đánh giá
   * @param targetType - Loại đối tượng được đánh giá
   * @returns Promise<number> - Điểm trung bình
   */
  async getAverageRating(targetId: string, targetType: string): Promise<number> {
    // Bước 1: Sử dụng aggregate để tính trung bình rating
    const result = await this.model.aggregate({
      where: { targetId, targetType },
      _avg: { rating: true }
    });
    // Bước 2: Trả về giá trị trung bình hoặc 0 nếu không có feedback
    return result._avg.rating || 0;
  }

  /**
   * Đếm số lượng feedback cho một target
   * @param targetId - ID của đối tượng được đánh giá
   * @param targetType - Loại đối tượng được đánh giá
   * @returns Promise<number> - Số lượng feedback
   */
  async getFeedbackCount(targetId: string, targetType: string): Promise<number> {
    // Bước 1: Đếm số bản ghi với điều kiện targetId và targetType
    return this.model.count({
      where: { targetId, targetType }
    });
  }
}

export default new FeedbackRepository();
