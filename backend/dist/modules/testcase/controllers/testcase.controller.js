/**
 * Testcase Controller
 *
 * Xử lý các HTTP requests liên quan đến Testcase.
 * Testcase được dùng để chấm bài tự động cho các bài tập lập trình.
 */
import { BaseController } from '../../../base/base.controller';
import testcaseService from '../services/testcase.service';
/**
 * TestcaseController - HTTP layer cho Testcase operations
 * @class TestcaseController
 * @extends BaseController
 */
class TestcaseController extends BaseController {
    constructor() {
        super(testcaseService);
    }
    /**
     * Tạo mới một testcase
     * POST /api/testcases
     * @param req - Request chứa body với problemId, input, expectedOutput, isPublic
     * @param res - Response trả về testcase đã tạo
     * @param next - Next function để xử lý lỗi
     */
    create = async (req, res, next) => {
        try {
            // Bước 1: Gọi service để tạo testcase với dữ liệu từ request body
            const testcase = await this.service.create(req.body);
            // Bước 2: Trả về response thành công với status 201
            this.success(res, testcase, 'Testcase created successfully', 201);
        }
        catch (error) {
            // Bước 3: Chuyển lỗi đến middleware xử lý lỗi
            next(error);
        }
    };
    /**
     * Lấy tất cả các testcase của một bài toán
     * GET /api/testcases/problem/:problemId
     * @param req - Request chứa params.problemId
     * @param res - Response trả về danh sách các testcase
     * @param next - Next function để xử lý lỗi
     */
    getByProblemId = async (req, res, next) => {
        try {
            // Bước 1: Lấy problemId từ URL params
            const { problemId } = req.params;
            // Bước 2: Gọi service để lấy các testcase của bài toán
            const testcases = await this.service.getByProblemId(problemId);
            // Bước 3: Trả về response với danh sách testcases
            this.success(res, testcases, 'Testcases retrieved successfully');
        }
        catch (error) {
            // Bước 4: Chuyển lỗi đến middleware xử lý lỗi
            next(error);
        }
    };
    /**
     * Lấy các testcase công khai của một bài toán
     * GET /api/testcases/problem/:problemId/public
     * @param req - Request chứa params.problemId
     * @param res - Response trả về danh sách testcase công khai
     * @param next - Next function để xử lý lỗi
     */
    getPublicByProblemId = async (req, res, next) => {
        try {
            // Bước 1: Lấy problemId từ URL params
            const { problemId } = req.params;
            // Bước 2: Gọi service để lấy các testcase công khai của bài toán
            const testcases = await this.service.getPublicByProblemId(problemId);
            // Bước 3: Trả về response với danh sách testcases công khai
            this.success(res, testcases, 'Public testcases retrieved successfully');
        }
        catch (error) {
            // Bước 4: Chuyển lỗi đến middleware xử lý lỗi
            next(error);
        }
    };
    /**
     * Lấy một testcase theo ID
     * GET /api/testcases/:id
     * @param req - Request chứa params.id
     * @param res - Response trả về testcase tìm được
     * @param next - Next function để xử lý lỗi
     */
    getById = async (req, res, next) => {
        try {
            // Bước 1: Lấy id từ URL params
            const { id } = req.params;
            // Bước 2: Gọi service để lấy testcase theo id
            const testcase = await this.service.getById(id);
            // Bước 3: Kiểm tra testcase có tồn tại không
            if (!testcase) {
                this.error(res, 'Testcase not found', 404);
                return;
            }
            // Bước 4: Trả về response với testcase tìm được
            this.success(res, testcase, 'Testcase retrieved successfully');
        }
        catch (error) {
            // Bước 5: Chuyển lỗi đến middleware xử lý lỗi
            next(error);
        }
    };
    /**
     * Cập nhật một testcase
     * PUT /api/testcases/:id
     * @param req - Request chứa params.id và body với input/expectedOutput/isPublic
     * @param res - Response trả về testcase đã cập nhật
     * @param next - Next function để xử lý lỗi
     */
    update = async (req, res, next) => {
        try {
            // Bước 1: Lấy id từ URL params
            const { id } = req.params;
            // Bước 2: Gọi service để cập nhật testcase
            const testcase = await this.service.update(id, req.body);
            // Bước 3: Trả về response với testcase đã cập nhật
            this.success(res, testcase, 'Testcase updated successfully');
        }
        catch (error) {
            // Bước 4: Xác định status code dựa trên loại lỗi
            const status = error.message.includes('not found') ? 404 : 500;
            // Bước 5: Chuyển lỗi đến middleware xử lý lỗi
            next(error);
        }
    };
    /**
     * Xóa một testcase
     * DELETE /api/testcases/:id
     * @param req - Request chứa params.id
     * @param res - Response trả về thông báo thành công
     * @param next - Next function để xử lý lỗi
     */
    delete = async (req, res, next) => {
        try {
            // Bước 1: Lấy id từ URL params
            const { id } = req.params;
            // Bước 2: Gọi service để xóa testcase
            const result = await this.service.delete(id);
            // Bước 3: Trả về response với thông báo thành công
            this.success(res, result, 'Testcase deleted successfully');
        }
        catch (error) {
            // Bước 4: Xác định status code dựa trên loại lỗi
            const status = error.message.includes('not found') ? 404 : 500;
            // Bước 5: Chuyển lỗi đến middleware xử lý lỗi
            next(error);
        }
    };
}
export default new TestcaseController();
//# sourceMappingURL=testcase.controller.js.map