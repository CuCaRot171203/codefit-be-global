/**
 * Testcase Controller
 *
 * Xử lý các HTTP requests liên quan đến Testcase.
 * Testcase được dùng để chấm bài tự động cho các bài tập lập trình.
 */
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../base/base.controller';
/**
 * TestcaseController - HTTP layer cho Testcase operations
 * @class TestcaseController
 * @extends BaseController
 */
declare class TestcaseController extends BaseController {
    constructor();
    /**
     * Tạo mới một testcase
     * POST /api/testcases
     * @param req - Request chứa body với problemId, input, expectedOutput, isPublic
     * @param res - Response trả về testcase đã tạo
     * @param next - Next function để xử lý lỗi
     */
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy tất cả các testcase của một bài toán
     * GET /api/testcases/problem/:problemId
     * @param req - Request chứa params.problemId
     * @param res - Response trả về danh sách các testcase
     * @param next - Next function để xử lý lỗi
     */
    getByProblemId: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy các testcase công khai của một bài toán
     * GET /api/testcases/problem/:problemId/public
     * @param req - Request chứa params.problemId
     * @param res - Response trả về danh sách testcase công khai
     * @param next - Next function để xử lý lỗi
     */
    getPublicByProblemId: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy một testcase theo ID
     * GET /api/testcases/:id
     * @param req - Request chứa params.id
     * @param res - Response trả về testcase tìm được
     * @param next - Next function để xử lý lỗi
     */
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Cập nhật một testcase
     * PUT /api/testcases/:id
     * @param req - Request chứa params.id và body với input/expectedOutput/isPublic
     * @param res - Response trả về testcase đã cập nhật
     * @param next - Next function để xử lý lỗi
     */
    update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Xóa một testcase
     * DELETE /api/testcases/:id
     * @param req - Request chứa params.id
     * @param res - Response trả về thông báo thành công
     * @param next - Next function để xử lý lỗi
     */
    delete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: TestcaseController;
export default _default;
//# sourceMappingURL=testcase.controller.d.ts.map