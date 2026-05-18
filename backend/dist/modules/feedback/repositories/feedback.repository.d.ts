/**
 * Feedback Repository
 *
 * Xử lý các thao tác database cho Feedback entity.
 * Quản lý việc tạo, đọc và truy vấn feedback.
 */
import { BaseRepository } from '../../../base/base.repository';
/**
 * Interface định nghĩa cấu trúc Feedback
 * @interface Feedback
 */
interface Feedback {
    /** ID duy nhất của feedback */
    id: string;
    /** ID của người gửi feedback */
    userId: string;
    /** ID của đối tượng được đánh giá */
    targetId: string;
    /** Loại đối tượng được đánh giá */
    targetType: string;
    /** Điểm đánh giá */
    rating: number;
    /** Nội dung phản hồi */
    comment: string;
    /** Thời điểm tạo */
    createdAt: Date;
}
/**
 * FeedbackRepository - Quản lý database operations cho Feedback
 * @class FeedbackRepository
 * @extends BaseRepository<Feedback>
 */
declare class FeedbackRepository extends BaseRepository<Feedback> {
    /** Prisma model được sử dụng cho các thao tác database */
    protected model: import(".prisma/client").Prisma.FeedbackDelegate<import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    /**
     * Tìm tất cả feedback theo targetId và targetType
     * @param targetId - ID của đối tượng được đánh giá
     * @param targetType - Loại đối tượng được đánh giá
     * @returns Promise<Feedback[]> - Danh sách feedback
     */
    findByTargetId(targetId: string, targetType: string): Promise<Feedback[]>;
    /**
     * Tìm feedback của một user cho một target cụ thể
     * @param userId - ID của người dùng
     * @param targetId - ID của đối tượng được đánh giá
     * @param targetType - Loại đối tượng được đánh giá
     * @returns Promise<Feedback | null> - Feedback tìm được hoặc null
     */
    findByUserAndTarget(userId: string, targetId: string, targetType: string): Promise<Feedback | null>;
    /**
     * Tính điểm đánh giá trung bình cho một target
     * @param targetId - ID của đối tượng được đánh giá
     * @param targetType - Loại đối tượng được đánh giá
     * @returns Promise<number> - Điểm trung bình
     */
    getAverageRating(targetId: string, targetType: string): Promise<number>;
    /**
     * Đếm số lượng feedback cho một target
     * @param targetId - ID của đối tượng được đánh giá
     * @param targetType - Loại đối tượng được đánh giá
     * @returns Promise<number> - Số lượng feedback
     */
    getFeedbackCount(targetId: string, targetType: string): Promise<number>;
}
declare const _default: FeedbackRepository;
export default _default;
//# sourceMappingURL=feedback.repository.d.ts.map