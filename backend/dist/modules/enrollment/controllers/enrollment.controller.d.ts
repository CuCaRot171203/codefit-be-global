/**
 * @fileoverview Controller layer cho module Enrollment
 * Xử lý các HTTP requests liên quan đến enrollment
 * @module enrollment/controllers
 */
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../base/base.controller';
/**
 * Controller xử lý các endpoints liên quan đến enrollment
 * Kế thừa từ BaseController và sử dụng enrollmentService
 */
declare class EnrollmentController extends BaseController {
    /**
     * Constructor - Khởi tạo controller với enrollmentService
     */
    constructor();
    /**
     * POST /enrollment - Đăng ký khóa học mới
     * Yêu cầu user đã đăng nhập (có userId trong token)
     * @param req - Express Request object (chứa user.userId và body với courseId)
     * @param res - Express Response object
     * @param next - Express NextFunction
     */
    enroll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * GET /enrollment - Lấy danh sách enrollment của user hiện tại
     * @param req - Express Request object
     * @param res - Express Response object
     * @param next - Express NextFunction
     */
    getMyEnrollments: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * GET /enrollment/:courseId - Lấy thông tin một enrollment cụ thể
     * @param req - Express Request object (chứa params.courseId)
     * @param res - Express Response object
     * @param next - Express NextFunction
     */
    getEnrollment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * PUT /enrollment/:enrollmentId/progress - Cập nhật tiến độ học tập
     * @param req - Express Request object (chứa params.enrollmentId, body.progress)
     * @param res - Express Response object
     * @param next - Express NextFunction
     */
    updateProgress: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * DELETE /enrollment/:courseId - Hủy đăng ký khóa học
     * @param req - Express Request object (chứa params.courseId)
     * @param res - Express Response object
     * @param next - Express NextFunction
     */
    unenroll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: EnrollmentController;
export default _default;
//# sourceMappingURL=enrollment.controller.d.ts.map