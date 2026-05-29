"use strict";
/**
 * Feedback Service
 *
 * Chứa business logic cho các thao tác với Feedback.
 * Xử lý việc tạo, cập nhật, xóa feedback và tính toán rating trung bình.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_service_1 = require("../../../base/base.service");
const feedback_repository_1 = __importDefault(require("../repositories/feedback.repository"));
/**
 * FeedbackService - Business logic layer cho Feedback
 * @class FeedbackService
 * @extends BaseService
 */
class FeedbackService extends base_service_1.BaseService {
    constructor() {
        super(feedback_repository_1.default);
    }
    /**
     * Tạo mới một feedback
     * @param userId - ID của người gửi feedback
     * @param dto - Dữ liệu tạo feedback
     * @returns Promise<Feedback> - Feedback vừa được tạo
     * @throws Error - Nếu thiếu dữ liệu, rating không hợp lệ, hoặc đã feedback rồi
     */
    async create(userId, dto) {
        // Bước 1: Validate dữ liệu - yêu cầu targetId, rating, comment
        if (!dto.targetId || !dto.rating || !dto.comment) {
            throw new Error('targetId, rating, and comment are required');
        }
        // Bước 2: Validate rating phải trong khoảng 1-5
        if (dto.rating < 1 || dto.rating > 5) {
            throw new Error('Rating must be between 1 and 5');
        }
        // Bước 3: Kiểm tra user đã feedback cho target này chưa
        const existing = await feedback_repository_1.default.findByUserAndTarget(userId, dto.targetId, dto.targetType);
        if (existing) {
            throw new Error('You have already submitted feedback for this target');
        }
        // Bước 4: Tạo feedback mới
        return this.repository.create({
            userId,
            targetId: dto.targetId,
            targetType: dto.targetType,
            rating: dto.rating,
            comment: dto.comment
        });
    }
    /**
     * Lấy tất cả feedback của một target
     * @param targetId - ID của đối tượng được đánh giá
     * @param targetType - Loại đối tượng
     * @returns Promise<Feedback[]> - Danh sách feedback
     */
    async getByTarget(targetId, targetType) {
        // Bước 1: Gọi repository để tìm feedback theo target
        return this.repository.findByTargetId(targetId, targetType);
    }
    /**
     * Lấy điểm đánh giá trung bình của một target
     * @param targetId - ID của đối tượng được đánh giá
     * @param targetType - Loại đối tượng
     * @returns Promise<object> - Thông tin rating trung bình và số lượng
     */
    async getAverageRating(targetId, targetType) {
        // Bước 1: Tính điểm trung bình
        const avgRating = await this.repository.getAverageRating(targetId, targetType);
        // Bước 2: Đếm số lượng feedback
        const count = await this.repository.getFeedbackCount(targetId, targetType);
        // Bước 3: Trả về thông tin với rating được làm tròn 1 chữ số
        return {
            targetId,
            targetType,
            averageRating: Math.round(avgRating * 10) / 10,
            totalFeedback: count
        };
    }
    /**
     * Cập nhật một feedback
     * @param id - ID của feedback cần cập nhật
     * @param userId - ID của người cập nhật (để kiểm tra quyền)
     * @param dto - Dữ liệu cập nhật
     * @returns Promise<Feedback> - Feedback sau khi cập nhật
     * @throws Error - Nếu feedback không tồn tại hoặc không có quyền
     */
    async update(id, userId, dto) {
        // Bước 1: Kiểm tra feedback có tồn tại hay không
        const feedback = await this.repository.findById(id);
        if (!feedback) {
            throw new Error('Feedback not found');
        }
        // Bước 2: Kiểm tra quyền sở hữu - chỉ người tạo mới được sửa
        if (feedback.userId !== userId) {
            throw new Error('You can only update your own feedback');
        }
        // Bước 3: Cập nhật các trường được phép
        return this.repository.update(id, {
            rating: dto.rating || feedback.rating,
            comment: dto.comment || feedback.comment
        });
    }
    /**
     * Xóa một feedback
     * @param id - ID của feedback cần xóa
     * @param userId - ID của người xóa (để kiểm tra quyền)
     * @returns Promise<{ message: string }> - Thông báo thành công
     * @throws Error - Nếu feedback không tồn tại hoặc không có quyền
     */
    async delete(id, userId) {
        // Bước 1: Kiểm tra feedback có tồn tại hay không
        const feedback = await this.repository.findById(id);
        if (!feedback) {
            throw new Error('Feedback not found');
        }
        // Bước 2: Kiểm tra quyền sở hữu - chỉ người tạo mới được xóa
        if (feedback.userId !== userId) {
            throw new Error('You can only delete your own feedback');
        }
        // Bước 3: Thực hiện xóa feedback
        await this.repository.delete(id);
        // Bước 4: Trả về thông báo thành công
        return { message: 'Feedback deleted successfully' };
    }
}
exports.default = new FeedbackService();
//# sourceMappingURL=feedback.service.js.map