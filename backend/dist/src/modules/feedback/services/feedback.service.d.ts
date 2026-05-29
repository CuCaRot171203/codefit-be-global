/**
 * Feedback Service
 *
 * Chứa business logic cho các thao tác với Feedback.
 * Xử lý việc tạo, cập nhật, xóa feedback và tính toán rating trung bình.
 */
import { BaseService } from '../../../base/base.service';
import feedbackRepository from '../repositories/feedback.repository';
import { CreateFeedbackDto, UpdateFeedbackDto } from '../types';
/**
 * FeedbackService - Business logic layer cho Feedback
 * @class FeedbackService
 * @extends BaseService
 */
declare class FeedbackService extends BaseService<typeof feedbackRepository> {
    constructor();
    /**
     * Tạo mới một feedback
     * @param userId - ID của người gửi feedback
     * @param dto - Dữ liệu tạo feedback
     * @returns Promise<Feedback> - Feedback vừa được tạo
     * @throws Error - Nếu thiếu dữ liệu, rating không hợp lệ, hoặc đã feedback rồi
     */
    create(userId: string, dto: CreateFeedbackDto): Promise<any>;
    /**
     * Lấy tất cả feedback của một target
     * @param targetId - ID của đối tượng được đánh giá
     * @param targetType - Loại đối tượng
     * @returns Promise<Feedback[]> - Danh sách feedback
     */
    getByTarget(targetId: string, targetType: string): Promise<any[]>;
    /**
     * Lấy điểm đánh giá trung bình của một target
     * @param targetId - ID của đối tượng được đánh giá
     * @param targetType - Loại đối tượng
     * @returns Promise<object> - Thông tin rating trung bình và số lượng
     */
    getAverageRating(targetId: string, targetType: string): Promise<any>;
    /**
     * Cập nhật một feedback
     * @param id - ID của feedback cần cập nhật
     * @param userId - ID của người cập nhật (để kiểm tra quyền)
     * @param dto - Dữ liệu cập nhật
     * @returns Promise<Feedback> - Feedback sau khi cập nhật
     * @throws Error - Nếu feedback không tồn tại hoặc không có quyền
     */
    update(id: string, userId: string, dto: UpdateFeedbackDto): Promise<any>;
    /**
     * Xóa một feedback
     * @param id - ID của feedback cần xóa
     * @param userId - ID của người xóa (để kiểm tra quyền)
     * @returns Promise<{ message: string }> - Thông báo thành công
     * @throws Error - Nếu feedback không tồn tại hoặc không có quyền
     */
    delete(id: string, userId: string): Promise<{
        message: string;
    }>;
}
declare const _default: FeedbackService;
export default _default;
//# sourceMappingURL=feedback.service.d.ts.map