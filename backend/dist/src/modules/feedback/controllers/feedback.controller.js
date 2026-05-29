"use strict";
/**
 * Feedback Controller
 *
 * Xử lý các HTTP requests liên quan đến Feedback.
 * Quản lý việc tạo, cập nhật, xóa và xem feedback.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_controller_1 = require("../../../base/base.controller");
const feedback_service_1 = __importDefault(require("../services/feedback.service"));
/**
 * FeedbackController - HTTP layer cho Feedback operations
 * @class FeedbackController
 * @extends BaseController
 */
class FeedbackController extends base_controller_1.BaseController {
    constructor() {
        super(feedback_service_1.default);
    }
    /**
     * Tạo mới một feedback
     * POST /api/feedback
     * @param req - Request chứa body với targetId, targetType, rating, comment, user từ token
     * @param res - Response trả về feedback đã tạo
     * @param next - Next function để xử lý lỗi
     */
    create = async (req, res, next) => {
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
        }
        catch (error) {
            // Bước 4: Xác định status code dựa trên loại lỗi
            const status = error.message.includes('already') ? 400 : 500;
            this.error(res, error.message, status);
        }
    };
    /**
     * Lấy tất cả feedback của một target
     * GET /api/feedback/:targetId/:targetType
     * @param req - Request chứa params.targetId và params.targetType
     * @param res - Response trả về danh sách feedback
     * @param next - Next function để xử lý lỗi
     */
    getByTarget = async (req, res, next) => {
        try {
            // Bước 1: Lấy targetId và targetType từ URL params
            const { targetId, targetType } = req.params;
            // Bước 2: Gọi service để lấy danh sách feedback
            const feedback = await this.service.getByTarget(targetId, targetType);
            // Bước 3: Trả về response với danh sách feedback
            this.success(res, feedback, 'Feedback retrieved successfully');
        }
        catch (error) {
            // Bước 4: Chuyển lỗi đến middleware xử lý lỗi
            next(error);
        }
    };
    /**
     * Lấy điểm đánh giá trung bình của một target
     * GET /api/feedback/:targetId/:targetType/rating
     * @param req - Request chứa params.targetId và params.targetType
     * @param res - Response trả về thông tin rating
     * @param next - Next function để xử lý lỗi
     */
    getAverageRating = async (req, res, next) => {
        try {
            // Bước 1: Lấy targetId và targetType từ URL params
            const { targetId, targetType } = req.params;
            // Bước 2: Gọi service để lấy thông tin rating trung bình
            const rating = await this.service.getAverageRating(targetId, targetType);
            // Bước 3: Trả về response với thông tin rating
            this.success(res, rating, 'Rating retrieved successfully');
        }
        catch (error) {
            // Bước 4: Chuyển lỗi đến middleware xử lý lỗi
            next(error);
        }
    };
    /**
     * Cập nhật một feedback
     * PUT /api/feedback/:id
     * @param req - Request chứa params.id, body với rating/comment, user từ token
     * @param res - Response trả về feedback đã cập nhật
     * @param next - Next function để xử lý lỗi
     */
    update = async (req, res, next) => {
        try {
            // Bước 1: Lấy userId từ token đã được verify
            const userId = req.user?.userId;
            if (!userId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            // Bước 2: Lấy id từ URL params
            const { id } = req.params;
            // Bước 3: Gọi service để cập nhật feedback
            const feedback = await this.service.update(id, userId, req.body);
            // Bước 4: Trả về response với feedback đã cập nhật
            this.success(res, feedback, 'Feedback updated successfully');
        }
        catch (error) {
            // Bước 5: Xác định status code dựa trên loại lỗi
            const status = error.message.includes('not found') ? 404 : 400;
            this.error(res, error.message, status);
        }
    };
    /**
     * Xóa một feedback
     * DELETE /api/feedback/:id
     * @param req - Request chứa params.id và user từ token
     * @param res - Response trả về thông báo thành công
     * @param next - Next function để xử lý lỗi
     */
    delete = async (req, res, next) => {
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
        }
        catch (error) {
            // Bước 5: Xác định status code dựa trên loại lỗi
            const status = error.message.includes('not found') ? 404 : 400;
            this.error(res, error.message, status);
        }
    };
}
exports.default = new FeedbackController();
//# sourceMappingURL=feedback.controller.js.map