/**
 * Project Service
 *
 * Chứa business logic cho các thao tác với Project.
 * Xử lý việc tạo, cập nhật, xóa và truy vấn dự án.
 */
import { BaseService } from '../../../base/base.service';
import projectRepository from '../repositories/project.repository';
import { CreateProjectDto, UpdateProjectDto } from '../types';
/**
 * ProjectService - Business logic layer cho Project
 * @class ProjectService
 * @extends BaseService
 */
declare class ProjectService extends BaseService<typeof projectRepository> {
    constructor();
    /**
     * Tạo mới một dự án
     * @param userId - ID của người tạo
     * @param dto - Dữ liệu tạo dự án bao gồm title, description
     * @returns Promise<Project> - Dự án vừa được tạo
     * @throws Error - Nếu thiếu title
     */
    create(userId: string, dto: CreateProjectDto): Promise<any>;
    /**
     * Lấy dự án theo ID
     * @param id - ID của dự án
     * @returns Promise<Project | null> - Dự án tìm được hoặc null
     */
    getById(id: string): Promise<any | null>;
    /**
     * Lấy tất cả dự án của một người dùng
     * @param userId - ID của người dùng
     * @returns Promise<Project[]> - Danh sách dự án
     */
    getUserProjects(userId: string): Promise<any[]>;
    /**
     * Lấy tất cả dự án trong một khóa học
     * @param courseId - ID của khóa học
     * @returns Promise<Project[]> - Danh sách dự án
     */
    getCourseProjects(courseId: string): Promise<any[]>;
    /**
     * Cập nhật một dự án
     * @param id - ID của dự án cần cập nhật
     * @param userId - ID của người cập nhật (để kiểm tra quyền)
     * @param dto - Dữ liệu cập nhật
     * @returns Promise<Project> - Dự án sau khi cập nhật
     * @throws Error - Nếu dự án không tồn tại
     */
    update(id: string, userId: string, dto: UpdateProjectDto): Promise<any>;
    /**
     * Xóa một dự án
     * @param id - ID của dự án cần xóa
     * @returns Promise<{ message: string }> - Thông báo thành công
     * @throws Error - Nếu dự án không tồn tại
     */
    delete(id: string): Promise<{
        message: string;
    }>;
    submitProject(params: {
        userId: string;
        projectId: string;
        fileUrl: string;
        fileName?: string;
    }): Promise<{
        id: string;
        projectId: string;
        courseId: any;
        status: string;
        submittedAt: Date;
        projectTitle: any;
        courseTitle: string;
        certificate: {
            id: string;
            certificateUrl: string | null;
        } | null;
    }>;
}
declare const _default: ProjectService;
export default _default;
//# sourceMappingURL=project.service.d.ts.map