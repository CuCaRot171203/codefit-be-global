/**
 * @fileoverview Type definitions cho module Enrollment
 * Định nghĩa các interface và DTO (Data Transfer Object) được sử dụng trong enrollment
 * @module enrollment/types
 */
/**
 * Interface đại diện cho một enrollment trong hệ thống
 * Theo dõi việc đăng ký khóa học của người dùng
 */
export interface Enrollment {
    /** ID duy nhất của enrollment */
    id: string;
    /** ID của người dùng đăng ký */
    userId: string;
    /** ID của khóa học được đăng ký */
    courseId: string;
    /** Tiến độ hoàn thành khóa học (0-100) */
    progress: number;
    /** ID của coach hướng dẫn (nullable nếu không có coach) */
    coachId: string | null;
    /** Thời điểm tạo enrollment */
    createdAt: Date;
}
/**
 * DTO để tạo mới một enrollment
 * Sử dụng khi người dùng đăng ký khóa học
 */
export interface CreateEnrollmentDto {
    /** ID của khóa học cần đăng ký (bắt buộc) */
    courseId: string;
    /** ID của coach được chỉ định (tùy chọn) */
    coachId?: string;
}
/**
 * DTO để cập nhật tiến độ học tập
 * Sử dụng khi cập nhật progress của enrollment
 */
export interface UpdateProgressDto {
    /** Tiến độ hoàn thành mới (0-100) */
    progress: number;
}
//# sourceMappingURL=enrollment.types.d.ts.map