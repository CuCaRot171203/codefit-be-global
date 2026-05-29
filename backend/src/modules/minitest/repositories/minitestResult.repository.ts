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
  /** Số câu trả lời đúng / Điểm số */
  score: number | null;
}

/**
 * MinitestResultRepository - Quản lý database operations cho kết quả bài test
 * @class MinitestResultRepository
 * @extends BaseRepository<MinitestResult>
 */
class MinitestResultRepository {
  protected model = prisma.minitestSubmission;

  /**
   * Tìm kết quả bài test của người dùng (lần làm gần nhất)
   * @param userId - ID của người dùng
   * @param minitestId - ID của bài test
   * @returns Promise<MinitestResult | null> - Kết quả tìm được hoặc null
   */
  async findByUserAndMinitest(userId: string, minitestId: string): Promise<any> {
    return this.model.findFirst({
      where: { userId, minitestId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findByUserId(userId: string): Promise<any[]> {
    return this.model.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }
}

export default new MinitestResultRepository();
