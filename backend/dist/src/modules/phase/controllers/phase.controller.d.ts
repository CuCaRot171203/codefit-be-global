/**
 * Phase Controller
 *
 * Xử lý các HTTP requests liên quan đến Phase.
 * Nhận requests từ client, gọi service, và trả về responses.
 */
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../base/base.controller';
/**
 * PhaseController - HTTP layer cho Phase operations
 * @class PhaseController
 * @extends BaseController
 */
declare class PhaseController extends BaseController {
    constructor();
    /**
     * Tạo mới một phase
     * POST /api/phases
     * @param req - Request chứa body với courseId và title
     * @param res - Response trả về phase đã tạo
     * @param next - Next function để xử lý lỗi
     */
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy tất cả các phase của một khóa học
     * GET /api/phases/course/:courseId
     * @param req - Request chứa params.courseId
     * @param res - Response trả về danh sách các phase
     * @param next - Next function để xử lý lỗi
     */
    getByCourseId: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy một phase theo ID
     * GET /api/phases/:id
     * @param req - Request chứa params.id
     * @param res - Response trả về phase tìm được
     * @param next - Next function để xử lý lỗi
     */
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Cập nhật một phase
     * PUT /api/phases/:id
     * @param req - Request chứa params.id và body với title/orderIndex
     * @param res - Response trả về phase đã cập nhật
     * @param next - Next function để xử lý lỗi
     */
    update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Xóa một phase
     * DELETE /api/phases/:id
     * @param req - Request chứa params.id
     * @param res - Response trả về thông báo thành công
     * @param next - Next function để xử lý lỗi
     */
    delete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: PhaseController;
export default _default;
//# sourceMappingURL=phase.controller.d.ts.map