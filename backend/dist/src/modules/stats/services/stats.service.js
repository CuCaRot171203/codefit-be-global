"use strict";
/**
 * Stats Service
 *
 * Chứa business logic cho việc lấy và cache thống kê.
 * Sử dụng Redis để cache kết quả nhằm giảm tải database.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stats_repository_1 = __importDefault(require("../repositories/stats.repository"));
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379');
/**
 * StatsService - Business logic layer cho thống kê
 * @class StatsService
 */
class StatsService {
    /**
     * Lấy thống kê của người dùng (có cache)
     * @param userId - ID của người dùng
     * @returns Promise<object> - Thông tin thống kê người dùng
     */
    async getUserStats(userId) {
        const cacheKey = `stats:user:${userId}`;
        // Bước 1: Thử lấy dữ liệu từ cache trước
        try {
            const cached = await redis.get(cacheKey);
            if (cached) {
                return JSON.parse(cached);
            }
        }
        catch (error) {
            console.error('Redis get error:', error);
        }
        // Bước 2: Nếu không có cache, lấy từ database
        const stats = await stats_repository_1.default.getUserStats(userId);
        // Bước 3: Cache kết quả với TTL 5 phút (300 giây)
        try {
            await redis.setex(cacheKey, 300, JSON.stringify(stats));
        }
        catch (error) {
            console.error('Redis set error:', error);
        }
        return stats;
    }
    /**
     * Lấy thống kê của khóa học (có cache)
     * @param courseId - ID của khóa học
     * @returns Promise<object> - Thông tin thống kê khóa học
     */
    async getCourseStats(courseId) {
        const cacheKey = `stats:course:${courseId}`;
        // Bước 1: Thử lấy dữ liệu từ cache trước
        try {
            const cached = await redis.get(cacheKey);
            if (cached) {
                return JSON.parse(cached);
            }
        }
        catch (error) {
            console.error('Redis get error:', error);
        }
        // Bước 2: Nếu không có cache, lấy từ database
        const stats = await stats_repository_1.default.getCourseStats(courseId);
        // Bước 3: Cache kết quả với TTL 5 phút (300 giây)
        try {
            await redis.setex(cacheKey, 300, JSON.stringify(stats));
        }
        catch (error) {
            console.error('Redis set error:', error);
        }
        return stats;
    }
    /**
     * Lấy thống kê tổng quan của nền tảng (có cache)
     * @returns Promise<object> - Thông tin thống kê nền tảng
     */
    async getPlatformStats() {
        const cacheKey = 'stats:platform';
        // Bước 1: Thử lấy dữ liệu từ cache trước
        try {
            const cached = await redis.get(cacheKey);
            if (cached) {
                return JSON.parse(cached);
            }
        }
        catch (error) {
            console.error('Redis get error:', error);
        }
        // Bước 2: Nếu không có cache, lấy từ database
        const stats = await stats_repository_1.default.getPlatformStats();
        // Bước 3: Cache kết quả với TTL 1 phút (60 giây) - ngắn hơn vì là stats toàn cục
        try {
            await redis.setex(cacheKey, 60, JSON.stringify(stats));
        }
        catch (error) {
            console.error('Redis set error:', error);
        }
        return stats;
    }
    /**
     * Xóa cache theo pattern
     * @param pattern - Pattern để xóa cache (ví dụ: stats:user:*)
     */
    async invalidateCache(pattern) {
        try {
            // Bước 1: Tìm tất cả keys theo pattern
            const keys = await redis.keys(pattern);
            // Bước 2: Xóa tất cả keys tìm được
            if (keys.length > 0) {
                await redis.del(...keys);
            }
        }
        catch (error) {
            console.error('Redis invalidate error:', error);
        }
    }
    /**
     * Lấy so sánh progress theo tuần
     * @param userId - ID của người dùng
     * @returns Promise<object> - Thông tin so sánh tuần này vs tuần trước
     */
    async getWeeklyComparison(userId) {
        const cacheKey = `stats:weekly:${userId}`;
        try {
            const cached = await redis.get(cacheKey);
            if (cached) {
                return JSON.parse(cached);
            }
        }
        catch (error) {
            console.error('Redis get error:', error);
        }
        const comparison = await stats_repository_1.default.getWeeklyComparison(userId);
        try {
            await redis.setex(cacheKey, 300, JSON.stringify(comparison));
        }
        catch (error) {
            console.error('Redis set error:', error);
        }
        return comparison;
    }
    async getUserScoreBreakdown(userId) {
        const cacheKey = `stats:score:${userId}`;
        try {
            const cached = await redis.get(cacheKey);
            if (cached)
                return JSON.parse(cached);
        }
        catch (error) {
            console.error('Redis get error:', error);
        }
        const data = await stats_repository_1.default.getUserScoreBreakdown(userId);
        try {
            await redis.setex(cacheKey, 300, JSON.stringify(data));
        }
        catch (error) {
            console.error('Redis set error:', error);
        }
        return data;
    }
    async getUserLoginDays(userId) {
        const cacheKey = `stats:login:${userId}`;
        try {
            const cached = await redis.get(cacheKey);
            if (cached)
                return JSON.parse(cached);
        }
        catch (error) {
            console.error('Redis get error:', error);
        }
        const data = await stats_repository_1.default.getUserLoginDays(userId);
        try {
            await redis.setex(cacheKey, 300, JSON.stringify(data));
        }
        catch (error) {
            console.error('Redis set error:', error);
        }
        return data;
    }
    async getUserWeeklyActivity(userId) {
        const cacheKey = `stats:weekly-activity:${userId}`;
        try {
            const cached = await redis.get(cacheKey);
            if (cached)
                return JSON.parse(cached);
        }
        catch (error) {
            console.error('Redis get error:', error);
        }
        const data = await stats_repository_1.default.getUserWeeklyActivity(userId);
        try {
            await redis.setex(cacheKey, 60, JSON.stringify(data));
        }
        catch (error) {
            console.error('Redis set error:', error);
        }
        return data;
    }
    async getUserGlobalRank(userId) {
        const cacheKey = `stats:rank:${userId}`;
        try {
            const cached = await redis.get(cacheKey);
            if (cached)
                return JSON.parse(cached);
        }
        catch (error) {
            console.error('Redis get error:', error);
        }
        const data = await stats_repository_1.default.getUserGlobalRank(userId);
        try {
            await redis.setex(cacheKey, 300, JSON.stringify(data));
        }
        catch (error) {
            console.error('Redis set error:', error);
        }
        return data;
    }
    async getGlobalLeaderboard() {
        const cacheKey = 'stats:leaderboard';
        try {
            const cached = await redis.get(cacheKey);
            if (cached)
                return JSON.parse(cached);
        }
        catch (error) {
            console.error('Redis get error:', error);
        }
        const data = await stats_repository_1.default.getGlobalLeaderboard();
        try {
            await redis.setex(cacheKey, 60, JSON.stringify(data));
        }
        catch (error) {
            console.error('Redis set error:', error);
        }
        return data;
    }
    async getUserEnrolledCourses(userId) {
        const cacheKey = `stats:courses:${userId}`;
        try {
            const cached = await redis.get(cacheKey);
            if (cached)
                return JSON.parse(cached);
        }
        catch (error) {
            console.error('Redis get error:', error);
        }
        const data = await stats_repository_1.default.getUserEnrolledCoursesWithProgress(userId);
        try {
            await redis.setex(cacheKey, 300, JSON.stringify(data));
        }
        catch (error) {
            console.error('Redis set error:', error);
        }
        return data;
    }
    async getUserEvaluation(userId) {
        const cacheKey = `stats:eval:${userId}`;
        try {
            const cached = await redis.get(cacheKey);
            if (cached)
                return JSON.parse(cached);
        }
        catch (error) {
            console.error('Redis get error:', error);
        }
        const data = await stats_repository_1.default.getUserEvaluation(userId);
        try {
            await redis.setex(cacheKey, 300, JSON.stringify(data));
        }
        catch (error) {
            console.error('Redis set error:', error);
        }
        return data;
    }
}
exports.default = new StatsService();
//# sourceMappingURL=stats.service.js.map