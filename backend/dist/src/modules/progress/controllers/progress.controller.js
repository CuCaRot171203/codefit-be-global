"use strict";
/**
 * @fileoverview Controller layer cho module Progress
 * Xử lý HTTP requests liên quan đến tiến độ học tập
 * @module progress/controllers
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_controller_1 = require("../../../base/base.controller");
const progress_service_1 = __importDefault(require("../services/progress.service"));
/**
 * Controller class xử lý các HTTP requests liên quan đến progress
 * Kế thừa từ BaseController, sử dụng progressService để xử lý business logic
 */
class ProgressController extends base_controller_1.BaseController {
    /**
     * Constructor khởi tạo controller với progressService
     */
    constructor() {
        super(progress_service_1.default);
    }
    /**
     * Handler lấy tiến độ học tập của user trong một khóa học
     * GET /:courseId
     * @param req - Express Request object
     * @param res - Express Response object
     * @param next - Express NextFunction
     */
    getProgress = async (req, res, next) => {
        try {
            // Bước 1: Lấy userId từ request (đã được verify bởi auth middleware)
            const userId = req.user?.userId;
            // Bước 2: Validate userId - nếu không có trả về lỗi 401 Unauthorized
            if (!userId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            // Bước 3: Lấy courseId từ request params
            const { courseId } = req.params;
            // Bước 4: Gọi service để lấy progress data
            const progress = await this.service.getProgress(userId, courseId);
            // Bước 5: Trả về response thành công với progress data
            this.success(res, progress, 'Progress retrieved successfully');
        }
        catch (error) {
            // Bước 6: Chuyển error sang middleware xử lý lỗi tiếp theo
            next(error);
        }
    };
    /**
     * Handler cập nhật tiến độ học tập của user trong khóa học
     * PUT /:courseId
     * @param req - Express Request object với body chứa completedLessons và totalLessons
     * @param res - Express Response object
     * @param next - Express NextFunction
     */
    updateProgress = async (req, res, next) => {
        try {
            // Bước 1: Lấy userId từ request (đã được verify bởi auth middleware)
            const userId = req.user?.userId;
            // Bước 2: Validate userId - nếu không có trả về lỗi 401 Unauthorized
            if (!userId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            // Bước 3: Lấy courseId từ request params
            const { courseId } = req.params;
            // Bước 4: Lấy progress data từ request body
            const { completedLessons, totalLessons } = req.body;
            // Bước 5: Gọi service để cập nhật progress
            const progress = await this.service.updateProgress(userId, courseId, completedLessons, totalLessons);
            // Bước 6: Trả về response thành công với progress đã được cập nhật
            this.success(res, progress, 'Progress updated successfully');
        }
        catch (error) {
            // Bước 7: Xử lý lỗi - nếu là lỗi validation trả về 400, ngược lại trả về 500
            const status = error.message.includes('Invalid') ? 400 : 500;
            this.error(res, error.message, status);
        }
    };
}
exports.default = new ProgressController();
//# sourceMappingURL=progress.controller.js.map