/**
 * Stats Service
 *
 * Chứa business logic cho việc lấy và cache thống kê.
 * Sử dụng Redis để cache kết quả nhằm giảm tải database.
 */
/**
 * StatsService - Business logic layer cho thống kê
 * @class StatsService
 */
declare class StatsService {
    /**
     * Lấy thống kê của người dùng (có cache)
     * @param userId - ID của người dùng
     * @returns Promise<object> - Thông tin thống kê người dùng
     */
    getUserStats(userId: string): Promise<any>;
    /**
     * Lấy thống kê của khóa học (có cache)
     * @param courseId - ID của khóa học
     * @returns Promise<object> - Thông tin thống kê khóa học
     */
    getCourseStats(courseId: string): Promise<any>;
    /**
     * Lấy thống kê tổng quan của nền tảng (có cache)
     * @returns Promise<object> - Thông tin thống kê nền tảng
     */
    getPlatformStats(): Promise<any>;
    /**
     * Xóa cache theo pattern
     * @param pattern - Pattern để xóa cache (ví dụ: stats:user:*)
     */
    invalidateCache(pattern: string): Promise<void>;
    /**
     * Lấy so sánh progress theo tuần
     * @param userId - ID của người dùng
     * @returns Promise<object> - Thông tin so sánh tuần này vs tuần trước
     */
    getWeeklyComparison(userId: string): Promise<any>;
    getUserScoreBreakdown(userId: string): Promise<any>;
    getUserLoginDays(userId: string): Promise<any>;
    getUserWeeklyActivity(userId: string): Promise<any>;
    getUserGlobalRank(userId: string): Promise<any>;
    getGlobalLeaderboard(): Promise<any>;
    getUserEnrolledCourses(userId: string): Promise<any>;
    getUserEvaluation(userId: string): Promise<any>;
}
declare const _default: StatsService;
export default _default;
//# sourceMappingURL=stats.service.d.ts.map