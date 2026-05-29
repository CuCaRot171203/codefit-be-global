/**
 * Feedback Controller
 *
 * Xử lý các HTTP requests liên quan đến Feedback.
 * Quản lý việc tạo, cập nhật, xóa và xem feedback.
 */

import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../base/base.controller';
import feedbackService from '../services/feedback.service';

/**
 * FeedbackController - HTTP layer cho Feedback operations
 * @class FeedbackController
 * @extends BaseController
 */
class FeedbackController extends BaseController {
  constructor() {
    // @ts-ignore - BaseController expects generic type but we use any for flexibility
    super(feedbackService as any);
  }

  /**
   * Tạo mới một feedback
   * POST /api/feedback
   * @param req - Request chứa body với message, user từ token
   * @param res - Response trả về feedback đã tạo
   * @param next - Next function để xử lý lỗi
   */
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Bước 1: Lấy userId từ token đã được verify
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, 'Unauthorized', 401);
        return;
      }

      // Bước 2: Gọi service để tạo feedback với dữ liệu từ body
      const feedback = await this.service.create(userId, req.body);

      // Bước 3: Trả về response thành công với status 201
      this.success(res, feedback, 'Feedback submitted successfully', 201);
    } catch (error: any) {
      // Bước 4: Xác định status code dựa trên loại lỗi
      const status = error.message.includes('already') ? 400 : 500;
      this.error(res, error.message, status);
    }
  };

  /**
   * Lấy tất cả feedback
   * GET /api/feedback
   * @param req - Request
   * @param res - Response trả về danh sách feedback
   * @param next - Next function để xử lý lỗi
   */
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Bước 1: Gọi service để lấy danh sách feedback
      const feedback = await this.service.getAll();

      // Bước 2: Trả về response với danh sách feedback
      this.success(res, feedback, 'Feedback retrieved successfully');
    } catch (error: any) {
      // Bước 3: Chuyển lỗi đến middleware xử lý lỗi
      next(error);
    }
  };

  /**
   * Xóa một feedback
   * DELETE /api/feedback/:id
   * @param req - Request chứa params.id và user từ token
   * @param res - Response trả về thông báo thành công
   * @param next - Next function để xử lý lỗi
   */
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Bước 1: Lấy userId từ token đã được verify
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, 'Unauthorized', 401);
        return;
      }

      // Bước 2: Lấy id từ URL params
      const { id } = req.params;

      // Bước 3: Gọi service để xóa feedback
      const result = await this.service.delete(id, userId);

      // Bước 4: Trả về response với thông báo thành công
      this.success(res, result, 'Feedback deleted successfully');
    } catch (error: any) {
      // Bước 5: Xác định status code dựa trên loại lỗi
      const status = error.message.includes('not found') ? 404 : 400;
      this.error(res, error.message, status);
    }
  };
}

export default new FeedbackController();
