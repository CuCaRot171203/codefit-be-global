"use strict";
/**
 * Leaderboard Service
 *
 * Chứa business logic cho các thao tác với Leaderboard.
 * Xử lý việc lấy thứ hạng và cập nhật điểm số người dùng.
 * Sử dụng Redis để truy vấn nhanh.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_service_1 = require("../../../base/base.service");
const leaderboard_repository_1 = __importDefault(require("../repositories/leaderboard.repository"));
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379');
/**
 * LeaderboardService - Business logic layer cho Leaderboard
 * @class LeaderboardService
 * @extends BaseService
 */
class LeaderboardService extends base_service_1.BaseService {
    constructor() {
        super(leaderboard_repository_1.default);
    }
    /**
     * Lấy bảng xếp hạng toàn cục
     * @param limit - Số lượng entry tối đa (mặc định: 50)
     * @returns Promise<object[]> - Danh sách leaderboard toàn cục
     */
    async getGlobal(limit = 50) {
        // Bước 1: Gọi repository để lấy leaderboard toàn cục
        return this.repository.getGlobalLeaderboard(limit);
    }
    /**
     * Lấy bảng xếp hạng theo khóa học
     * @param courseId - ID của khóa học
     * @param limit - Số lượng entry tối đa (mặc định: 50)
     * @returns Promise<object[]> - Danh sách leaderboard của khóa học
     */
    async getCourseLeaderboard(courseId, limit = 50) {
        // Bước 1: Gọi repository để lấy leaderboard theo khóa học
        return this.repository.getCourseLeaderboard(courseId, limit);
    }
    /**
     * Lấy thứ hạng của một người dùng
     * @param userId - ID của người dùng
     * @returns Promise<object | null> - Thông tin rank hoặc null nếu không tìm thấy
     */
    async getUserRank(userId) {
        try {
            // Bước 1: Lấy rank từ Redis (0-based index)
            const rank = await redis.zrevrank('leaderboard:global', userId);
            const score = await redis.zscore('leaderboard:global', userId);
            // Bước 2: Kiểm tra nếu user không có trong leaderboard
            if (rank === null)
                return null;
            // Bước 3: Trả về thông tin rank (cộng 1 để hiển thị 1-based)
            return {
                rank: rank + 1,
                score: parseInt(score || '0')
            };
        }
        catch (error) {
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
    async updateUserScore(userId, problemId) {
        try {
            // Bước 1: Tăng điểm user lên 10 khi có bài nộp AC
            await redis.zincrby('leaderboard:global', 10, userId);
        }
        catch (error) {
            // Bước 2: Log lỗi nếu không thể cập nhật (không ảnh hưởng luồng chính)
            console.error('Redis update error:', error);
        }
    }
}
exports.default = new LeaderboardService();
//# sourceMappingURL=leaderboard.service.js.map