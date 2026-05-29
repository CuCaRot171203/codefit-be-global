/**
 * Project Controller
 *
 * Xử lý các HTTP requests liên quan đến Project.
 * Quản lý việc tạo, cập nhật, xóa và xem dự án.
 */
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../base/base.controller';
/**
 * ProjectController - HTTP layer cho Project operations
 * @class ProjectController
 * @extends BaseController
 */
declare class ProjectController extends BaseController {
    constructor();
    /**
     * Tạo mới một dự án
     * POST /api/projects
     * @param req - Request chứa body với title, description, user từ token
     * @param res - Response trả về dự án đã tạo
     * @param next - Next function để xử lý lỗi
     */
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy dự án theo ID
     * GET /api/projects/:id
     * @param req - Request chứa params.id
     * @param res - Response trả về dự án tìm được
     * @param next - Next function để xử lý lỗi
     */
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy tất cả dự án của người dùng hiện tại
     * GET /api/projects/my
     * @param req - Request chứa user từ token
     * @param res - Response trả về danh sách dự án
     * @param next - Next function để xử lý lỗi
     */
    getMyProjects: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy tất cả dự án trong một khóa học
     * GET /api/projects/course/:courseId
     * @param req - Request chứa params.courseId
     * @param res - Response trả về danh sách dự án
     * @param next - Next function để xử lý lỗi
     */
    getCourseProjects: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Cập nhật một dự án
     * PUT /api/projects/:id
     * @param req - Request chứa params.id, body với dữ liệu cập nhật, user từ token
     * @param res - Response trả về dự án đã cập nhật
     * @param next - Next function để xử lý lỗi
     */
    update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Xóa một dự án
     * DELETE /api/projects/:id
     * @param req - Request chứa params.id
     * @param res - Response trả về thông báo thành công
     * @param next - Next function để xử lý lỗi
     */
    delete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    submitProject: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: ProjectController;
export default _default;
//# sourceMappingURL=project.controller.d.ts.map