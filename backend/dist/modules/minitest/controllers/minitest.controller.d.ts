/**
 * Minitest Controller
 *
 * Xử lý các HTTP requests liên quan đến Minitest.
 * Quản lý việc tạo bài test, lấy thông tin và nộp bài.
 */
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../base/base.controller';
/**
 * MinitestController - HTTP layer cho Minitest operations
 * @class MinitestController
 * @extends BaseController
 */
declare class MinitestController extends BaseController {
    constructor();
    /**
     * Tạo mới một bài minitest
     * POST /api/minitests
     * @param req - Request chứa body với title, description, questions
     * @param res - Response trả về bài test đã tạo
     * @param next - Next function để xử lý lỗi
     */
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy bài minitest theo ID
     * GET /api/minitests/:id
     * @param req - Request chứa params.id
     * @param res - Response trả về bài test với câu hỏi
     * @param next - Next function để xử lý lỗi
     */
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy các bài minitest theo courseId
     * GET /api/minitests/course/:courseId
     * @param req - Request chứa params.courseId
     * @param res - Response trả về danh sách bài test
     * @param next - Next function để xử lý lỗi
     */
    getByCourseId: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Nộp bài minitest
     * POST /api/minitests/:id/submit
     * @param req - Request chứa params.id và body với answers, user từ token
     * @param res - Response trả về kết quả chấm điểm
     * @param next - Next function để xử lý lỗi
     */
    submit: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy kết quả bài test của người dùng hiện tại
     * GET /api/minitests/my/results
     * @param req - Request chứa user từ token
     * @param res - Response trả về danh sách kết quả
     * @param next - Next function để xử lý lỗi
     */
    getMyResults: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy kết quả bài test của user cho một minitest cụ thể
     * GET /api/minitests/:id/result
     * @param req - Request chứa params.id và user từ token
     * @param res - Response trả về kết quả
     * @param next - Next function để xử lý lỗi
     */
    getResult: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: MinitestController;
export default _default;
//# sourceMappingURL=minitest.controller.d.ts.map