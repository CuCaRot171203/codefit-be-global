/**
 * @fileoverview Controller layer cho module Progress
 * Xử lý HTTP requests liên quan đến tiến độ học tập
 * @module progress/controllers
 */
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../base/base.controller';
/**
 * Controller class xử lý các HTTP requests liên quan đến progress
 * Kế thừa từ BaseController, sử dụng progressService để xử lý business logic
 */
declare class ProgressController extends BaseController {
    /**
     * Constructor khởi tạo controller với progressService
     */
    constructor();
    /**
     * Handler lấy tiến độ học tập của user trong một khóa học
     * GET /:courseId
     * @param req - Express Request object
     * @param res - Express Response object
     * @param next - Express NextFunction
     */
    getProgress: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Handler cập nhật tiến độ học tập của user trong khóa học
     * PUT /:courseId
     * @param req - Express Request object với body chứa completedLessons và totalLessons
     * @param res - Express Response object
     * @param next - Express NextFunction
     */
    updateProgress: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: ProgressController;
export default _default;
//# sourceMappingURL=progress.controller.d.ts.map