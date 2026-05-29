"use strict";
/**
 * Project Service
 *
 * Chứa business logic cho các thao tác với Project.
 * Xử lý việc tạo, cập nhật, xóa và truy vấn dự án.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_service_1 = require("../../../base/base.service");
const project_repository_1 = __importDefault(require("../repositories/project.repository"));
const notification_service_1 = __importDefault(require("../../notification/services/notification.service"));
const email_service_1 = __importDefault(require("../../email/email.service"));
const certificate_service_1 = __importDefault(require("../../certificate/services/certificate.service"));
const prisma_1 = __importDefault(require("../../../prisma"));
/**
 * ProjectService - Business logic layer cho Project
 * @class ProjectService
 * @extends BaseService
 */
class ProjectService extends base_service_1.BaseService {
    constructor() {
        super(project_repository_1.default);
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
        const project = await this.repository.findById(id);
        if (!project) {
            throw new Error('Project not found');
        }
        await this.repository.delete(id);
        return { message: 'Project deleted successfully' };
    }
    async submitProject(params) {
        const project = await this.repository.findById(params.projectId);
        if (!project) {
            throw new Error('Project not found');
        }
        const submission = await this.repository.createSubmission({
            userId: params.userId,
            projectId: params.projectId,
            fileUrl: params.fileUrl,
            fileName: params.fileName,
        });
        // Gửi notification
        notification_service_1.default.createNotification({
            userId: params.userId,
            type: 'submission_result',
            title: `Đã nộp: ${project.title}`,
            message: `Bạn đã nộp dự án "${project.title}" thành công. Đang chờ giảng viên chấm điểm.`,
            metadata: {
                projectId: params.projectId,
                submissionId: submission.id,
                courseId: project.courseId,
            },
        }).catch(err => console.error('[ProjectService] Failed to create notification:', err));
        // Gửi email xác nhận
        const user = await prisma_1.default.user.findUnique({ where: { id: params.userId } });
        if (user?.email) {
            email_service_1.default.sendProjectSubmittedEmail(user.email, user.username, project.title, submission.project.course.title, `${process.env.FRONTEND_URL || 'http://localhost:5173'}/user/project/${params.projectId}/result`).catch(err => console.error('[ProjectService] Failed to send email:', err));
        }
        // Auto-issue certificate ngay khi nộp project thành công
        const courseId = project.courseId;
        const course = project.course;
        let certificateResult = null;
        try {
            const certificate = await certificate_service_1.default.generateForProjectSubmission(params.userId, courseId);
            console.log(`[ProjectService] Certificate generated successfully:`, certificate.id);
            certificateResult = { id: certificate.id, certificateUrl: certificate.certificateUrl };
            // Notify about certificate
            notification_service_1.default.createNotification({
                userId: params.userId,
                type: 'certificate',
                title: 'Chúc mừng bạn!',
                message: `Bạn đã hoàn thành khóa học "${course.title}"! Chứng chỉ đã được phát hành.`,
                metadata: { courseId, certificateId: certificate.id },
            }).catch(err => console.error('[ProjectService] Failed to create cert notification:', err));
            // Gửi email chứng chỉ
            if (user?.email) {
                email_service_1.default.sendCertificateEmail(user.email, user.username, course.title, certificate.certificateUrl || '', certificate.id).catch(err => console.error('[ProjectService] Failed to send certificate email:', err));
            }
        }
        catch (certErr) {
            console.error('[ProjectService] Certificate generation failed:', certErr.message);
        }
        return {
            id: submission.id,
            projectId: submission.projectId,
            courseId: project.courseId,
            status: submission.status,
            submittedAt: submission.submittedAt,
            projectTitle: project.title,
            courseTitle: submission.project.course.title,
            certificate: certificateResult,
        };
    }
}
exports.default = new ProjectService();
//# sourceMappingURL=project.service.js.map