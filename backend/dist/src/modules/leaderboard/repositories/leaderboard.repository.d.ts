/**
 * Leaderboard Repository
 *
 * Xử lý các thao tác database cho Leaderboard.
 * Sử dụng Redis để cache và truy vấn leaderboard nhanh.
 */
import { BaseRepository } from '../../../base/base.repository';
/**
 * LeaderboardRepository - Quản lý database và cache operations cho Leaderboard
 * @class LeaderboardRepository
 * @extends BaseRepository
 */
declare class LeaderboardRepository extends BaseRepository<any> {
    /** Prisma model được sử dụng (user model) */
    protected model: import(".prisma/client").Prisma.UserDelegate<import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    /**
     * Lấy bảng xếp hạng toàn cục
     * @param limit - Số lượng entry tối đa (mặc định: 50)
     * @returns Promise<object[]> - Danh sách leaderboard với thứ hạng
     */
    getGlobalLeaderboard(limit?: number): Promise<any[]>;
    /**
     * Lấy bảng xếp hạng theo khóa học
     * @param courseId - ID của khóa học
     * @param limit - Số lượng entry tối đa (mặc định: 50)
     * @returns Promise<object[]> - Danh sách leaderboard của khóa học
     */
    getCourseLeaderboard(courseId: string, limit?: number): Promise<any[]>;
    /**
     * Format dữ liệu leaderboard từ Redis
     * @param data - Mảng dữ liệu Redis [userId, score, userId, score, ...]
     * @returns object[] - Mảng entries đã format
     * @private
     */
    private formatRedisLeaderboard;
}
declare const _default: LeaderboardRepository;
export default _default;
//# sourceMappingURL=leaderboard.repository.d.ts.map