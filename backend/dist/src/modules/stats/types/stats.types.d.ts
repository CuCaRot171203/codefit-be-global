/**
 * Stats Type Definitions
 *
 * Định nghĩa các interface cho thống kê người dùng, khóa học và nền tảng.
 */
/**
 * Thống kê chi tiết của một người dùng
 * @interface UserStats
 */
export interface UserStats {
    /** ID của người dùng */
    userId: string;
    /** Tổng số bài nộp */
    totalSubmissions: number;
    /** Số bài nộp thành công (Accepted) */
    acceptedSubmissions: number;
    /** Tỷ lệ chấp nhận (phần trăm) */
    acceptanceRate: number;
    /** Tổng số bài toán đã giải */
    totalProblemsSolved: number;
    /** Tổng số khóa học đã đăng ký */
    totalCoursesEnrolled: number;
    /** Tổng số khóa học đã hoàn thành */
    totalCoursesCompleted: number;
    /** Tổng số chứng chỉ đã nhận */
    totalCertificates: number;
    /** Tổng số hackathon đã tham gia */
    totalHackathonsJoined: number;
}
/**
 * Thống kê của một khóa học
 * @interface CourseStats
 */
export interface CourseStats {
    /** ID của khóa học */
    courseId: string;
    /** Tổng số lượt đăng ký */
    totalEnrollments: number;
    /** Tiến độ trung bình của học viên (phần trăm) */
    averageProgress: number;
    /** Điểm đánh giá trung bình */
    averageRating: number;
    /** Tổng số feedback */
    totalFeedback: number;
}
/**
 * Thống kê tổng quan của nền tảng
 * @interface PlatformStats
 */
export interface PlatformStats {
    /** Tổng số người dùng */
    totalUsers: number;
    /** Tổng số khóa học */
    totalCourses: number;
    /** Tổng số bài nộp */
    totalSubmissions: number;
    /** Tổng số lượt đăng ký */
    totalEnrollments: number;
}
//# sourceMappingURL=stats.types.d.ts.map