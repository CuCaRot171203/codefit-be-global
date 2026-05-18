/**
 * Phase Controller
 *
 * Xử lý các HTTP requests liên quan đến Phase.
 * Nhận requests từ client, gọi service, và trả về responses.
 */
import { BaseController } from '../../../base/base.controller';
import phaseService from '../services/phase.service';
/**
 * PhaseController - HTTP layer cho Phase operations
 * @class PhaseController
 * @extends BaseController
 */
class PhaseController extends BaseController {
    constructor() {
        super(phaseService);
    }
    /**
     * Tạo mới một phase
     * POST /api/phases
     * @param req - Request chứa body với courseId và title
     * @param res - Response trả về phase đã tạo
     * @param next - Next function để xử lý lỗi
     */
    create = async (req, res, next) => {
        try {
            // Bước 1: Gọi service để tạo phase với dữ liệu từ request body
            const phase = await this.service.create(req.body);
            // Bước 2: Trả về response thành công với status 201
            this.success(res, phase, 'Phase created successfully', 201);
        }
        catch (error) {
            // Bước 3: Chuyển lỗi đến middleware xử lý lỗi
            next(error);
        }
    };
    /**
     * Lấy tất cả các phase của một khóa học
     * GET /api/phases/course/:courseId
     * @param req - Request chứa params.courseId
     * @param res - Response trả về danh sách các phase
     * @param next - Next function để xử lý lỗi
     */
    getByCourseId = async (req, res, next) => {
        try {
            // Bước 1: Lấy courseId từ URL params
            const { courseId } = req.params;
            // Bước 2: Gọi service để lấy các phase của khóa học
            const phases = await this.service.getByCourseId(courseId);
            // Bước 3: Trả về response với danh sách phases
            this.success(res, phases, 'Phases retrieved successfully');
        }
        catch (error) {
            // Bước 4: Chuyển lỗi đến middleware xử lý lỗi
            next(error);
        }
    };
    /**
     * Lấy một phase theo ID
     * GET /api/phases/:id
     * @param req - Request chứa params.id
     * @param res - Response trả về phase tìm được
     * @param next - Next function để xử lý lỗi
     */
    getById = async (req, res, next) => {
        try {
            // Bước 1: Lấy id từ URL params
            const { id } = req.params;
            // Bước 2: Gọi service để lấy phase theo id
            const phase = await this.service.getById(id);
            // Bước 3: Kiểm tra phase có tồn tại không
            if (!phase) {
                this.error(res, 'Phase not found', 404);
                return;
            }
            // Bước 4: Trả về response với phase tìm được
            this.success(res, phase, 'Phase retrieved successfully');
        }
        catch (error) {
            // Bước 5: Chuyển lỗi đến middleware xử lý lỗi
            next(error);
        }
    };
    /**
     * Cập nhật một phase
     * PUT /api/phases/:id
     * @param req - Request chứa params.id và body với title/orderIndex
     * @param res - Response trả về phase đã cập nhật
     * @param next - Next function để xử lý lỗi
     */
    update = async (req, res, next) => {
        try {
            // Bước 1: Lấy id từ URL params
            const { id } = req.params;
            // Bước 2: Gọi service để cập nhật phase
            const phase = await this.service.update(id, req.body);
            // Bước 3: Trả về response với phase đã cập nhật
            this.success(res, phase, 'Phase updated successfully');
        }
        catch (error) {
            // Bước 4: Xác định status code dựa trên loại lỗi
            const status = error.message.includes('not found') ? 404 : 500;
            // Bước 5: Chuyển lỗi đến middleware xử lý lỗi
            next(error);
        }
    };
    /**
     * Xóa một phase
     * DELETE /api/phases/:id
     * @param req - Request chứa params.id
     * @param res - Response trả về thông báo thành công
     * @param next - Next function để xử lý lỗi
     */
    delete = async (req, res, next) => {
        try {
            // Bước 1: Lấy id từ URL params
            const { id } = req.params;
            // Bước 2: Gọi service để xóa phase
            const result = await this.service.delete(id);
            // Bước 3: Trả về response với thông báo thành công
            this.success(res, result, 'Phase deleted successfully');
        }
        catch (error) {
            // Bước 4: Xác định status code dựa trên loại lỗi
            const status = error.message.includes('not found') ? 404 : 500;
            // Bước 5: Chuyển lỗi đến middleware xử lý lỗi
            next(error);
        }
    };
}
export default new PhaseController();
//# sourceMappingURL=phase.controller.js.map