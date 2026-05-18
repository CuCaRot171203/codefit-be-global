/**
 * Project Service
 *
 * Chứa business logic cho các thao tác với Project.
 * Xử lý việc tạo, cập nhật, xóa và truy vấn dự án.
 */
import { BaseService } from '../../../base/base.service';
import projectRepository from '../repositories/project.repository';
/**
 * ProjectService - Business logic layer cho Project
 * @class ProjectService
 * @extends BaseService
 */
class ProjectService extends BaseService {
    constructor() {
        super(projectRepository);
    }
    /**
     * Tạo mới một dự án
     * @param userId - ID của người tạo
     * @param dto - Dữ liệu tạo dự án bao gồm title, description
     * @returns Promise<Project> - Dự án vừa được tạo
     * @throws Error - Nếu thiếu title
     */
    async create(userId, dto) {
        // Bước 1: Validate dữ liệu - yêu cầu title
        if (!dto.title) {
            throw new Error('Title is required');
        }
        // Bước 2: Tạo dự án mới với các trường được cung cấp
        // Bước 3: Mặc định status là 'draft'
        // Bước 4: Các URL được set là null nếu không cung cấp
        return this.repository.create({
            userId,
            title: dto.title,
            description: dto.description,
            courseId: dto.courseId,
            status: 'draft',
            repositoryUrl: dto.repositoryUrl || null,
            demoUrl: dto.demoUrl || null
        });
    }
    /**
     * Lấy dự án theo ID
     * @param id - ID của dự án
     * @returns Promise<Project | null> - Dự án tìm được hoặc null
     */
    async getById(id) {
        // Bước 1: Gọi repository để tìm dự án theo ID
        return this.repository.findById(id);
    }
    /**
     * Lấy tất cả dự án của một người dùng
     * @param userId - ID của người dùng
     * @returns Promise<Project[]> - Danh sách dự án
     */
    async getUserProjects(userId) {
        // Bước 1: Gọi repository để tìm dự án theo userId
        return this.repository.findByUserId(userId);
    }
    /**
     * Lấy tất cả dự án trong một khóa học
     * @param courseId - ID của khóa học
     * @returns Promise<Project[]> - Danh sách dự án
     */
    async getCourseProjects(courseId) {
        // Bước 1: Gọi repository để tìm dự án theo courseId
        return this.repository.findByCourseId(courseId);
    }
    /**
     * Cập nhật một dự án
     * @param id - ID của dự án cần cập nhật
     * @param userId - ID của người cập nhật (để kiểm tra quyền)
     * @param dto - Dữ liệu cập nhật
     * @returns Promise<Project> - Dự án sau khi cập nhật
     * @throws Error - Nếu dự án không tồn tại
     */
    async update(id, userId, dto) {
        // Bước 1: Kiểm tra dự án có tồn tại hay không
        const project = await this.repository.findById(id);
        if (!project) {
            throw new Error('Project not found');
        }
        // Bước 2: Cập nhật các trường được phép
        return this.repository.update(id, {
            title: dto.title,
            description: dto.description,
            status: dto.status,
            repositoryUrl: dto.repositoryUrl,
            demoUrl: dto.demoUrl
        });
    }
    /**
     * Xóa một dự án
     * @param id - ID của dự án cần xóa
     * @returns Promise<{ message: string }> - Thông báo thành công
     * @throws Error - Nếu dự án không tồn tại
     */
    async delete(id) {
        // Bước 1: Kiểm tra dự án có tồn tại hay không
        const project = await this.repository.findById(id);
        if (!project) {
            throw new Error('Project not found');
        }
        // Bước 2: Thực hiện xóa dự án
        await this.repository.delete(id);
        // Bước 3: Trả về thông báo thành công
        return { message: 'Project deleted successfully' };
    }
}
export default new ProjectService();
//# sourceMappingURL=project.service.js.map