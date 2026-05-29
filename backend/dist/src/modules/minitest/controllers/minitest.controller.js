"use strict";
/**
 * Minitest Controller
 *
 * Xử lý các HTTP requests liên quan đến Minitest.
 * Quản lý việc tạo bài test, lấy thông tin và nộp bài.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_controller_1 = require("../../../base/base.controller");
const minitest_service_1 = __importDefault(require("../services/minitest.service"));
/**
 * MinitestController - HTTP layer cho Minitest operations
 * @class MinitestController
 * @extends BaseController
 */
class MinitestController extends base_controller_1.BaseController {
    constructor() {
        super(minitest_service_1.default);
    }
    /**
     * Tạo mới một bài minitest
     * POST /api/minitests
     * @param req - Request chứa body với title, description, questions
     * @param res - Response trả về bài test đã tạo
     * @param next - Next function để xử lý lỗi
     */
    create = async (req, res, next) => {
        try {
            // Bước 1: Gọi service để tạo bài test với dữ liệu từ request body
            const minitest = await this.service.create(req.body);
            // Bước 2: Trả về response thành công với status 201
            this.success(res, minitest, 'Minitest created successfully', 201);
        }
        catch (error) {
            // Bước 3: Chuyển lỗi đến middleware xử lý lỗi
            next(error);
        }
    };
    /**
     * Lấy bài minitest theo ID
     * GET /api/minitests/:id
     * @param req - Request chứa params.id
     * @param res - Response trả về bài test với câu hỏi
     * @param next - Next function để xử lý lỗi
     */
    getById = async (req, res, next) => {
        try {
            // Bước 1: Lấy id từ URL params
            const { id } = req.params;
            // Bước 2: Gọi service để lấy bài test
            const minitest = await this.service.getById(id);
            // Bước 3: Kiểm tra bài test có tồn tại không
            if (!minitest) {
                this.error(res, 'Minitest not found', 404);
                return;
            }
            // Bước 4: Trả về response với bài test tìm được
            this.success(res, minitest, 'Minitest retrieved successfully');
        }
        catch (error) {
            // Bước 5: Chuyển lỗi đến middleware xử lý lỗi
            next(error);
        }
    };
    /**
     * Lấy các bài minitest theo courseId
     * GET /api/minitests/course/:courseId
     * @param req - Request chứa params.courseId
     * @param res - Response trả về danh sách bài test
     * @param next - Next function để xử lý lỗi
     */
    getByCourseId = async (req, res, next) => {
        try {
            // Bước 1: Lấy courseId từ URL params
            const { courseId } = req.params;
            // Bước 2: Gọi service để lấy các bài test của khóa học
            const minitests = await this.service.getByCourseId(courseId);
            // Bước 3: Trả về response với danh sách bài test
            this.success(res, minitests, 'Minitests retrieved successfully');
        }
        catch (error) {
            // Bước 4: Chuyển lỗi đến middleware xử lý lỗi
            next(error);
        }
    };
    /**
     * Nộp bài minitest
     * POST /api/minitests/:id/submit
     * @param req - Request chứa params.id và body với answers, user từ token
     * @param res - Response trả về kết quả chấm điểm
     * @param next - Next function để xử lý lỗi
     */
    submit = async (req, res, next) => {
        try {
            // Bước 1: Lấy userId từ token đã được verify
            const userId = req.user?.userId;
            if (!userId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            // Bước 2: Lấy id bài test từ URL params
            const { id } = req.params;
            // Bước 3: Gọi service để nộp bài và chấm điểm
            const result = await this.service.submit(userId, id, req.body);
            // Bước 4: Trả về response với kết quả
            this.success(res, result, 'Minitest submitted successfully');
        }
        catch (error) {
            // Bước 5: Xác định status code dựa trên loại lỗi
            const status = error.message.includes('not found') ? 404 : 500;
            this.error(res, error.message, status);
        }
    };
    /**
     * Lấy kết quả bài test của người dùng hiện tại
     * GET /api/minitests/my/results
     * @param req - Request chứa user từ token
     * @param res - Response trả về danh sách kết quả
     * @param next - Next function để xử lý lỗi
     */
    getMyResults = async (req, res, next) => {
        try {
            // Bước 1: Lấy userId từ token đã được verify
            const userId = req.user?.userId;
            if (!userId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            // Bước 2: Gọi service để lấy kết quả bài test
            const results = await this.service.getUserResults(userId);
            // Bước 3: Trả về response với danh sách kết quả
            this.success(res, results, 'Results retrieved successfully');
        }
        catch (error) {
            // Bước 4: Chuyển lỗi đến middleware xử lý lỗi
            next(error);
        }
    };
    /**
     * Lấy kết quả bài test của user cho một minitest cụ thể
     * GET /api/minitests/:id/result
     * @param req - Request chứa params.id và user từ token
     * @param res - Response trả về kết quả
     * @param next - Next function để xử lý lỗi
     */
    getResult = async (req, res, next) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            const { id } = req.params;
            const result = await this.service.getResult(userId, id);
            if (!result) {
                this.error(res, 'Result not found', 404);
                return;
            }
            this.success(res, result, 'Result retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = new MinitestController();
//# sourceMappingURL=minitest.controller.js.map