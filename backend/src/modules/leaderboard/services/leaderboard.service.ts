/**
 * Leaderboard Service
 * 
 * Chứa business logic cho các thao tác với Leaderboard.
 * Xử lý việc lấy thứ hạng và cập nhật điểm số người dùng.
 * Sử dụng Redis để truy vấn nhanh.
 */

import { BaseService } from '../../../base/base.service';
import leaderboardRepository from '../repositories/leaderboard.repository';
import { redis } from '../../../utils/redis';

/**
 * LeaderboardService - Business logic layer cho Leaderboard
 * @class LeaderboardService
 * @extends BaseService
 */
class LeaderboardService extends BaseService<typeof leaderboardRepository> {

  constructor() {
    super(leaderboardRepository);
  }

  /**
   * Lấy bảng xếp hạng toàn cục
   * @param limit - Số lượng entry tối đa (mặc định: 50)
   * @returns Promise<object[]> - Danh sách leaderboard toàn cục
   */
  async getGlobal(limit: number = 50): Promise<any[]> {
    // Bước 1: Gọi repository để lấy leaderboard toàn cục
    return this.repository.getGlobalLeaderboard(limit);
  }

  /**
   * Lấy bảng xếp hạng theo khóa học
   * @param courseId - ID của khóa học
   * @param limit - Số lượng entry tối đa (mặc định: 50)
   * @returns Promise<object[]> - Danh sách leaderboard của khóa học
   */
  async getCourseLeaderboard(courseId: string, limit: number = 50): Promise<any[]> {
    // Bước 1: Gọi repository để lấy leaderboard theo khóa học
    return this.repository.getCourseLeaderboard(courseId, limit);
  }

  /**
   * Lấy thứ hạng của một người dùng
   * @param userId - ID của người dùng
   * @returns Promise<object | null> - Thông tin rank hoặc null nếu không tìm thấy
   */
  async getUserRank(userId: string): Promise<any | null> {
    try {
      // Bước 1: Lấy rank từ Redis (0-based index)
      const rank = await redis.zrevrank('leaderboard:global', userId);
      const score = await redis.zscore('leaderboard:global', userId);

      // Bước 2: Kiểm tra nếu user không có trong leaderboard
      if (rank === null) return null;

      // Bước 3: Trả về thông tin rank (cộng 1 để hiển thị 1-based)
      return {
        rank: rank + 1,
        score: parseInt(score || '0')
      };
    } catch (error) {
      // Bước 4: Log lỗi và trả về null nếu có vấn đề với Redis
      console.error('Redis error:', error);
      return null;
    }
  }

  /**
   * Cập nhật điểm số của người dùng khi có bài nộp thành công
   * @param userId - ID của người dùng
   * @param problemId - ID của bài toán (hiện không sử dụng, để dành cho future use)
   */
  async updateUserScore(userId: string, problemId: string): Promise<void> {
    try {
      // Bước 1: Tăng điểm user lên 10 khi có bài nộp AC
      await redis.zincrby('leaderboard:global', 10, userId);
    } catch (error) {
      // Bước 2: Log lỗi nếu không thể cập nhật (không ảnh hưởng luồng chính)
      console.error('Redis update error:', error);
    }
  }
}

export default new LeaderboardService();
