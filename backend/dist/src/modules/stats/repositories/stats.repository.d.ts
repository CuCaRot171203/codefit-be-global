/**
 * Stats Repository
 *
 * Xử lý các thao tác database để tính toán thống kê.
 * Sử dụng Prisma aggregate và groupBy để truy vấn hiệu quả.
 */
/**
 * StatsRepository - Quản lý database operations cho thống kê
 * @class StatsRepository
 */
declare class StatsRepository {
    /**
     * Lấy thống kê chi tiết của một người dùng
     * @param userId - ID của người dùng
     * @returns Promise<object> - Thông tin thống kê người dùng
     */
    getUserStats(userId: string): Promise<any>;
    /**
     * Lấy thống kê của một khóa học
     * @param courseId - ID của khóa học
     * @returns Promise<object> - Thông tin thống kê khóa học
     */
    getCourseStats(courseId: string): Promise<any>;
    /**
     * Lấy thống kê tổng quan của nền tảng
     * @returns Promise<object> - Thông tin thống kê nền tảng
     */
    getPlatformStats(): Promise<any>;
    /**
     * Lấy so sánh progress theo tuần cho một người dùng
     * @param userId - ID của người dùng
     * @returns Promise<object> - Thông tin so sánh tuần
     */
    getWeeklyComparison(userId: string): Promise<any>;
    getUserScoreBreakdown(userId: string): Promise<any>;
    getUserLoginDays(userId: string): Promise<any>;
    getUserWeeklyActivity(userId: string): Promise<any>;
    getUserGlobalRank(userId: string): Promise<any>;
    getGlobalLeaderboard(): Promise<any>;
    getUserEnrolledCoursesWithProgress(userId: string): Promise<any>;
    getUserEvaluation(userId: string): Promise<any>;
}
declare const _default: StatsRepository;
export default _default;
//# sourceMappingURL=stats.repository.d.ts.map