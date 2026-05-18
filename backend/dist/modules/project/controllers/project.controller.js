/**
 * Project Controller
 *
 * Xử lý các HTTP requests liên quan đến Project.
 * Quản lý việc tạo, cập nhật, xóa và xem dự án.
 */
import { BaseController } from '../../../base/base.controller';
import projectService from '../services/project.service';
/**
 * ProjectController - HTTP layer cho Project operations
 * @class ProjectController
 * @extends BaseController
 */
class ProjectController extends BaseController {
    constructor() {
        super(projectService);
    }
    /**
     * Tạo mới một dự án
     * POST /api/projects
     * @param req - Request chứa body với title, description, user từ token
     * @param res - Response trả về dự án đã tạo
     * @param next - Next function để xử lý lỗi
     */
    create = async (req, res, next) => {
        try {
            // Bước 1: Lấy userId từ token đã được verify
            const userId = req.user?.userId;
            if (!userId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            // Bước 2: Gọi service để tạo dự án với userId và dữ liệu từ body
            const project = await this.service.create(userId, req.body);
            // Bước 3: Trả về response thành công với status 201
            this.success(res, project, 'Project created successfully', 201);
        }
        catch (error) {
            // Bước 4: Chuyển lỗi đến middleware xử lý lỗi
            next(error);
        }
    };
    /**
     * Lấy dự án theo ID
     * GET /api/projects/:id
     * @param req - Request chứa params.id
     * @param res - Response trả về dự án tìm được
     * @param next - Next function để xử lý lỗi
     */
    getById = async (req, res, next) => {
        try {
            // Bước 1: Lấy id từ URL params
            const { id } = req.params;
            // Bước 2: Gọi service để lấy dự án theo id
            const project = await this.service.getById(id);
            // Bước 3: Kiểm tra dự án có tồn tại không
            if (!project) {
                this.error(res, 'Project not found', 404);
                return;
            }
            // Bước 4: Trả về response với dự án tìm được
            this.success(res, project, 'Project retrieved successfully');
        }
        catch (error) {
            // Bước 5: Chuyển lỗi đến middleware xử lý lỗi
            next(error);
        }
    };
    /**
     * Lấy tất cả dự án của người dùng hiện tại
     * GET /api/projects/my
     * @param req - Request chứa user từ token
     * @param res - Response trả về danh sách dự án
     * @param next - Next function để xử lý lỗi
     */
    getMyProjects = async (req, res, next) => {
        try {
            // Bước 1: Lấy userId từ token đã được verify
            const userId = req.user?.userId;
            if (!userId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            // Bước 2: Gọi service để lấy danh sách dự án của user
            const projects = await this.service.getUserProjects(userId);
            // Bước 3: Trả về response với danh sách dự án
            this.success(res, projects, 'Projects retrieved successfully');
        }
        catch (error) {
            // Bước 4: Chuyển lỗi đến middleware xử lý lỗi
            next(error);
        }
    };
    /**
     * Lấy tất cả dự án trong một khóa học
     * GET /api/projects/course/:courseId
     * @param req - Request chứa params.courseId
     * @param res - Response trả về danh sách dự án
     * @param next - Next function để xử lý lỗi
     */
    getCourseProjects = async (req, res, next) => {
        try {
            // Bước 1: Lấy courseId từ URL params
            const { courseId } = req.params;
            // Bước 2: Gọi service để lấy danh sách dự án của khóa học
            const projects = await this.service.getCourseProjects(courseId);
            // Bước 3: Trả về response với danh sách dự án
            this.success(res, projects, 'Course projects retrieved successfully');
        }
        catch (error) {
            // Bước 4: Chuyển lỗi đến middleware xử lý lỗi
            next(error);
        }
    };
    /**
     * Cập nhật một dự án
     * PUT /api/projects/:id
     * @param req - Request chứa params.id, body với dữ liệu cập nhật, user từ token
     * @param res - Response trả về dự án đã cập nhật
     * @param next - Next function để xử lý lỗi
     */
    update = async (req, res, next) => {
        try {
            // Bước 1: Lấy userId từ token đã được verify
            const userId = req.user?.userId;
            if (!userId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            // Bước 2: Lấy id từ URL params
            const { id } = req.params;
            // Bước 3: Gọi service để cập nhật dự án
            const project = await this.service.update(id, userId, req.body);
            // Bước 4: Trả về response với dự án đã cập nhật
            this.success(res, project, 'Project updated successfully');
        }
        catch (error) {
            // Bước 5: Xác định status code dựa trên loại lỗi
            const status = error.message.includes('not found') ? 404 : 500;
            this.error(res, error.message, status);
        }
    };
    /**
     * Xóa một dự án
     * DELETE /api/projects/:id
     * @param req - Request chứa params.id
     * @param res - Response trả về thông báo thành công
     * @param next - Next function để xử lý lỗi
     */
    delete = async (req, res, next) => {
        try {
            // Bước 1: Lấy id từ URL params
            const { id } = req.params;
            // Bước 2: Gọi service để xóa dự án
            const result = await this.service.delete(id);
            // Bước 3: Trả về response với thông báo thành công
            this.success(res, result, 'Project deleted successfully');
        }
        catch (error) {
            // Bước 4: Xác định status code dựa trên loại lỗi
            const status = error.message.includes('not found') ? 404 : 500;
            this.error(res, error.message, status);
        }
    };
}
export default new ProjectController();
//# sourceMappingURL=project.controller.js.map