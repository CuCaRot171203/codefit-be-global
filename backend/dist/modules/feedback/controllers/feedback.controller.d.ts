/**
 * Feedback Controller
 *
 * Xử lý các HTTP requests liên quan đến Feedback.
 * Quản lý việc tạo, cập nhật, xóa và xem feedback.
 */
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../base/base.controller';
/**
 * FeedbackController - HTTP layer cho Feedback operations
 * @class FeedbackController
 * @extends BaseController
 */
declare class FeedbackController extends BaseController {
    constructor();
    /**
     * Tạo mới một feedback
     * POST /api/feedback
     * @param req - Request chứa body với targetId, targetType, rating, comment, user từ token
     * @param res - Response trả về feedback đã tạo
     * @param next - Next function để xử lý lỗi
     */
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy tất cả feedback của một target
     * GET /api/feedback/:targetId/:targetType
     * @param req - Request chứa params.targetId và params.targetType
     * @param res - Response trả về danh sách feedback
     * @param next - Next function để xử lý lỗi
     */
    getByTarget: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy điểm đánh giá trung bình của một target
     * GET /api/feedback/:targetId/:targetType/rating
     * @param req - Request chứa params.targetId và params.targetType
     * @param res - Response trả về thông tin rating
     * @param next - Next function để xử lý lỗi
     */
    getAverageRating: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Cập nhật một feedback
     * PUT /api/feedback/:id
     * @param req - Request chứa params.id, body với rating/comment, user từ token
     * @param res - Response trả về feedback đã cập nhật
     * @param next - Next function để xử lý lỗi
     */
    update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Xóa một feedback
     * DELETE /api/feedback/:id
     * @param req - Request chứa params.id và user từ token
     * @param res - Response trả về thông báo thành công
     * @param next - Next function để xử lý lỗi
     */
    delete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: FeedbackController;
export default _default;
//# sourceMappingURL=feedback.controller.d.ts.map