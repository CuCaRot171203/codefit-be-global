/**
 * @fileoverview Types and DTOs cho module Progress
 * Định nghĩa các interface liên quan đến tiến độ học tập và thông báo
 * @module progress/types
 */
/**
 * Interface mô tả tiến độ học tập của user trong một khóa học
 */
export interface Progress {
    /** ID duy nhất của bản ghi progress */
    id: string;
    /** ID của user */
    userId: string;
    /** ID của khóa học */
    courseId: string;
    /** Số bài học đã hoàn thành */
    completedLessons: number;
    /** Tổng số bài học trong khóa */
    totalLessons: number;
    /** Phần trăm hoàn thành (0-100) */
    percentage: number;
}
/**
 * DTO để cập nhật tiến độ học tập
 */
export interface UpdateProgressDto {
    /** Số bài học đã hoàn thành */
    completedLessons: number;
    /** Tổng số bài học */
    totalLessons: number;
}
/**
 * Interface mô tả tiến độ của một bài học cụ thể
 */
export interface LessonProgress {
    /** ID duy nhất của bản ghi */
    id: string;
    /** ID của user */
    userId: string;
    /** ID của bài học */
    lessonId: string;
    /** ID của khóa học chứa bài học */
    courseId: string | null;
    /** Trạng thái hoàn thành */
    isCompleted: boolean;
    /** Thời điểm hoàn thành (null nếu chưa hoàn thành) */
    completedAt: Date | null;
}
/**
 * DTO để đánh dấu hoàn thành một bài học
 */
export interface MarkLessonCompleteDto {
    /** ID của bài học cần đánh dấu */
    lessonId: string;
    /** ID của khóa học */
    courseId: string;
}
/**
 * Interface mô tả thông báo
 */
export interface Notification {
    /** ID duy nhất của thông báo */
    id: string;
    /** ID của user nhận thông báo */
    userId: string;
    /** Loại thông báo */
    type: 'submission_result' | 'enrollment' | 'course_update';
    /** Tiêu đề thông báo */
    title: string;
    /** Nội dung thông báo */
    message: string;
    /** Trạng thái đã đọc */
    isRead: boolean;
    /** Thời điểm tạo thông báo */
    createdAt: Date;
}
/**
 * DTO để tạo mới thông báo
 */
export interface CreateNotificationDto {
    /** ID của user nhận thông báo */
    userId: string;
    /** Loại thông báo */
    type: 'submission_result' | 'enrollment' | 'course_update';
    /** Tiêu đề thông báo */
    title: string;
    /** Nội dung thông báo */
    message: string;
}
//# sourceMappingURL=progress.types.d.ts.map