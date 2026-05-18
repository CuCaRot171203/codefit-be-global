/**
 * Leaderboard Type Definitions
 *
 * Định nghĩa các interface và type cho Leaderboard entity.
 */
/**
 * Entity LeaderboardEntry - Đại diện cho một entry trong bảng xếp hạng
 * @interface LeaderboardEntry
 */
export interface LeaderboardEntry {
    /** Thứ hạng của người dùng */
    rank: number;
    /** ID của người dùng */
    userId: string;
    /** Tên đăng nhập của người dùng */
    username: string;
    /** URL avatar của người dùng */
    avatar: string | null;
    /** Điểm số tích lũy */
    score: number;
    /** Số bài toán đã giải */
    solvedProblems: number;
    /** Tổng số bài nộp */
    submissions: number;
    /** Số ngày liên tiếp học */
    streak: number;
}
/**
 * Cấu hình cho việc lấy leaderboard
 * @interface LeaderboardConfig
 */
export interface LeaderboardConfig {
    /** Loại leaderboard: toàn cục, theo khóa học, hàng tuần, hàng tháng */
    type: 'global' | 'course' | 'weekly' | 'monthly';
    /** ID khóa học (nếu type là 'course') */
    courseId?: string;
    /** Số lượng entry tối đa trả về */
    limit?: number;
}
//# sourceMappingURL=leaderboard.types.d.ts.map