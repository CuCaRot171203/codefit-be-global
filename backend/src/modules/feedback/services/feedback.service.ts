/**
 * Feedback Service
 *
 * Chứa business logic cho các thao tác với Feedback.
 * Xử lý việc tạo, cập nhật, xóa feedback.
 */

import { BaseService } from '../../../base/base.service';
import feedbackRepository from '../repositories/feedback.repository';

/**
 * FeedbackService - Business logic layer cho Feedback
 * @class FeedbackService
 * @extends BaseService
 */
class FeedbackService extends BaseService<typeof feedbackRepository> {

  constructor() {
    super(feedbackRepository);
  }

  /**
   * Tạo mới một feedback
   * @param userId - ID của người gửi feedback
   * @param dto - Dữ liệu tạo feedback
   * @returns Promise<Feedback> - Feedback vừa được tạo
   * @throws Error - Nếu thiếu dữ liệu
   */
  async create(userId: string, dto: any): Promise<any> {
    // Bước 1: Validate dữ liệu - yêu cầu message
    if (!dto.message) {
      throw new Error('message is required');
    }

    // Bước 2: Tạo feedback mới
    return this.repository.create({
      userId,
      message: dto.message
    });
  }

  /**
   * Lấy tất cả feedback
   * @returns Promise<Feedback[]> - Danh sách feedback
   */
  async getAll(): Promise<any[]> {
    return this.repository.findAllFeedback();
  }

  /**
   * Lấy feedback của một user
   * @param userId - ID của người dùng
   * @returns Promise<Feedback[]> - Danh sách feedback của user
   */
  async getByUser(userId: string): Promise<any[]> {
    return this.repository.findByUserId(userId);
  }

  /**
   * Xóa một feedback
   * @param id - ID của feedback cần xóa
   * @param userId - ID của người xóa (để kiểm tra quyền)
   * @returns Promise<{ message: string }> - Thông báo thành công
   * @throws Error - Nếu feedback không tồn tại hoặc không có quyền
   */
  async delete(id: string, userId: string): Promise<{ message: string }> {
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

export default new FeedbackService();
