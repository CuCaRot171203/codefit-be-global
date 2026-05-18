/**
 * MinitestResult Repository
 * 
 * Xử lý các thao tác database cho kết quả bài kiểm tra.
 * Quản lý việc lưu và truy vấn kết quả làm bài của người dùng.
 */

import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../../../base/base.repository';

const prisma = new PrismaClient();

/**
 * Interface định nghĩa cấu trúc MinitestResult
 * @interface MinitestResult
 */
interface MinitestResult {
  /** ID duy nhất của kết quả */
  id: string;
  /** ID của bài test */
  minitestId: string;
  /** ID của người dùng */
  userId: string;
  /** Số câu trả lời đúng */
  score: number;
  /** Tổng số câu hỏi */
  totalQuestions: number;
  /** Thời điểm nộp bài */
  completedAt: Date;
}

/**
 * MinitestResultRepository - Quản lý database operations cho kết quả bài test
 * @class MinitestResultRepository
 * @extends BaseRepository<MinitestResult>
 */
class MinitestResultRepository extends BaseRepository<MinitestResult> {
  /** Prisma model được sử dụng cho các thao tác database */
  protected model = prisma.minitestResult;

  /**
   * Tìm kết quả bài test của người dùng (lần làm gần nhất)
   * @param userId - ID của người dùng
   * @param minitestId - ID của bài test
   * @returns Promise<MinitestResult | null> - Kết quả tìm được hoặc null
   */
  async findByUserAndMinitest(userId: string, minitestId: string): Promise<MinitestResult | null> {
    // Bước 1: Tìm kết quả với điều kiện userId và minitestId
    // Bước 2: Lấy kết quả gần nhất (sắp xếp theo completedAt giảm dần)
    return this.model.findFirst({
      where: { userId, minitestId },
      orderBy: { completedAt: 'desc' }
    });
  }

  /**
   * Tìm tất cả kết quả của một người dùng
   * @param userId - ID của người dùng
   * @returns Promise<MinitestResult[]> - Danh sách kết quả bài test
   */
  async findByUserId(userId: string): Promise<MinitestResult[]> {
    // Bước 1: Tìm tất cả kết quả của userId
    // Bước 2: Sắp xếp theo thời gian nộp giảm dần
    return this.model.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' }
    });
  }
}

export default new MinitestResultRepository();
