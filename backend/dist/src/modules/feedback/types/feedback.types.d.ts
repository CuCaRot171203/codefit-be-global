/**
 * Feedback Type Definitions
 *
 * Định nghĩa các interface và type cho Feedback entity và các DTOs liên quan.
 */
/** Các loại đối tượng có thể được đánh giá */
export type FeedbackType = 'course' | 'lesson' | 'coach' | 'platform';
/**
 * Entity Feedback - Đại diện cho một phản hồi/đánh giá
 * @interface Feedback
 */
export interface Feedback {
    /** ID duy nhất của feedback */
    id: string;
    /** ID của người gửi feedback */
    userId: string;
    /** ID của đối tượng được đánh giá */
    targetId: string;
    /** Loại đối tượng được đánh giá */
    targetType: FeedbackType;
    /** Điểm đánh giá (1-5 sao) */
    rating: number;
    /** Nội dung phản hồi */
    comment: string;
    /** Thời điểm tạo feedback */
    createdAt: Date;
}
/**
 * DTO để tạo mới một feedback
 * @interface CreateFeedbackDto
 */
export interface CreateFeedbackDto {
    /** ID của đối tượng được đánh giá */
    targetId: string;
    /** Loại đối tượng được đánh giá */
    targetType: FeedbackType;
    /** Điểm đánh giá (1-5) */
    rating: number;
    /** Nội dung phản hồi */
    comment: string;
}
/**
 * DTO để cập nhật một feedback
 * @interface UpdateFeedbackDto
 */
export interface UpdateFeedbackDto {
    /** Điểm đánh giá mới (tùy chọn) */
    rating?: number;
    /** Nội dung phản hồi mới (tùy chọn) */
    comment?: string;
}
//# sourceMappingURL=feedback.types.d.ts.map