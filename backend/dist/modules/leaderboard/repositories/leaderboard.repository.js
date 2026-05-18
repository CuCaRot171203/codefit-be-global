/**
 * Leaderboard Repository
 *
 * Xử lý các thao tác database cho Leaderboard.
 * Sử dụng Redis để cache và truy vấn leaderboard nhanh.
 */
import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../../../base/base.repository';
import Redis from 'ioredis';
const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
/**
 * LeaderboardRepository - Quản lý database và cache operations cho Leaderboard
 * @class LeaderboardRepository
 * @extends BaseRepository
 */
class LeaderboardRepository extends BaseRepository {
    /** Prisma model được sử dụng (user model) */
    model = prisma.user;
    /**
     * Lấy bảng xếp hạng toàn cục
     * @param limit - Số lượng entry tối đa (mặc định: 50)
     * @returns Promise<object[]> - Danh sách leaderboard với thứ hạng
     */
    async getGlobalLeaderboard(limit = 50) {
        const leaderboardKey = 'leaderboard:global';
        // Bước 1: Thử lấy dữ liệu từ Redis cache trước
        try {
            const cached = await redis.zrevrange(leaderboardKey, 0, limit - 1, 'WITHSCORES');
            if (cached.length > 0) {
                // Bước 2: Nếu có cache, format và trả về
                return this.formatRedisLeaderboard(cached);
            }
        }
        catch (error) {
            // Log lỗi nhưng vẫn tiếp tục lấy từ database
            console.error('Redis error:', error);
        }
        // Bước 3: Lấy tất cả users từ database
        const users = await this.model.findMany({
            select: {
                id: true,
                username: true,
                avatar: true
            }
        });
        // Bước 4: Đếm số bài nộp thành công (status = 'AC') theo user
        const submissions = await prisma.submission.groupBy({
            by: ['userId'],
            where: { status: 'AC' },
            _count: { id: true }
        });
        // Bước 5: Tính điểm cho mỗi user (mỗi AC = 10 điểm)
        const scoreMap = new Map();
        for (const sub of submissions) {
            scoreMap.set(sub.userId, sub._count.id * 10);
        }
        // Bước 6: Map user với điểm số
        const entries = users.map(u => ({
            userId: u.id,
            username: u.username,
            avatar: u.avatar,
            score: scoreMap.get(u.id) || 0
        }));
        // Bước 7: Sắp xếp theo điểm giảm dần
        entries.sort((a, b) => b.score - a.score);
        // Bước 8: Cache kết quả vào Redis
        try {
            for (const entry of entries.slice(0, limit)) {
                await redis.zadd(leaderboardKey, entry.score, entry.userId);
            }
        }
        catch (error) {
            console.error('Redis zadd error:', error);
        }
        // Bước 9: Trả về kết quả với thứ hạng
        return entries.slice(0, limit).map((e, i) => ({ ...e, rank: i + 1 }));
    }
    /**
     * Lấy bảng xếp hạng theo khóa học
     * @param courseId - ID của khóa học
     * @param limit - Số lượng entry tối đa (mặc định: 50)
     * @returns Promise<object[]> - Danh sách leaderboard của khóa học
     */
    async getCourseLeaderboard(courseId, limit = 50) {
        // Bước 1: Lấy danh sách enrollments của khóa học kèm thông tin user
        const enrollments = await prisma.enrollment.findMany({
            where: { courseId },
            include: {
                user: {
                    select: { id: true, username: true, avatar: true }
                }
            }
        });
        // Bước 2: Trích xuất danh sách userId
        const userIds = enrollments.map(e => e.userId);
        // Bước 3: Đếm số bài nộp thành công của các user trong khóa học
        const submissions = await prisma.submission.groupBy({
            by: ['userId'],
            where: {
                userId: { in: userIds },
                status: 'AC'
            },
            _count: { id: true }
        });
        // Bước 4: Tính điểm cho mỗi user (mỗi AC = 10 điểm)
        const scoreMap = new Map();
        for (const sub of submissions) {
            scoreMap.set(sub.userId, sub._count.id * 10);
        }
        // Bước 5: Map enrollment với thông tin user và điểm số
        const entries = enrollments.map(e => ({
            userId: e.user.id,
            username: e.user.username,
            avatar: e.user.avatar,
            score: scoreMap.get(e.user.id) || 0,
            progress: e.progress
        }));
        // Bước 6: Sắp xếp theo điểm giảm dần
        entries.sort((a, b) => b.score - a.score);
        // Bước 7: Trả về kết quả với thứ hạng (giới hạn số lượng)
        return entries.slice(0, limit).map((e, i) => ({ ...e, rank: i + 1 }));
    }
    /**
     * Format dữ liệu leaderboard từ Redis
     * @param data - Mảng dữ liệu Redis [userId, score, userId, score, ...]
     * @returns object[] - Mảng entries đã format
     * @private
     */
    formatRedisLeaderboard(data) {
        const entries = [];
        // Redis trả về dạng [member, score, member, score, ...]
        for (let i = 0; i < data.length; i += 2) {
            entries.push({
                userId: data[i],
                score: parseInt(data[i + 1])
            });
        }
        return entries;
    }
}
export default new LeaderboardRepository();
//# sourceMappingURL=leaderboard.repository.js.map