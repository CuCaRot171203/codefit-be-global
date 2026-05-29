/**
 * Project Repository
 *
 * Xử lý các thao tác database cho Project entity.
 * Quản lý việc tạo, đọc và truy vấn các dự án.
 */
import { BaseRepository } from '../../../base/base.repository';
import { Project } from '../types';
/**
 * ProjectRepository - Quản lý database operations cho Project
 * @class ProjectRepository
 * @extends BaseRepository<Project>
 */
declare class ProjectRepository extends BaseRepository<Project> {
    /** Prisma model được sử dụng cho các thao tác database */
    protected model: import(".prisma/client").Prisma.ProjectDelegate<import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    /**
     * Tìm một dự án theo ID với course và submissions
     */
    findById(id: string): Promise<any | null>;
    /**
     * Tìm các dự án theo userId
     * @param userId - ID của người dùng
     * @returns Promise<Project[]> - Danh sách dự án của người dùng
     */
    findByUserId(userId: string): Promise<any[]>;
    /**
     * Tìm các dự án theo courseId
     * @param courseId - ID của khóa học
     * @returns Promise<Project[]> - Danh sách dự án của khóa học
     */
    findByCourseId(courseId: string): Promise<any[]>;
    /**
     * Tìm các dự án theo userId và courseId
     * @param userId - ID của người dùng
     * @param courseId - ID của khóa học
     * @returns Promise<Project[]> - Danh sách dự án của người dùng trong khóa học
     */
    findByUserAndCourse(userId: string, courseId: string): Promise<any[]>;
    createSubmission(data: {
        userId: string;
        projectId: string;
        fileUrl: string;
        fileName?: string;
    }): Promise<{
        project: {
            course: {
                id: string;
                title: string;
            };
        } & {
            id: string;
            description: string;
            title: string;
            courseId: string;
            imageUrl: string | null;
            fileUrl: string | null;
        };
    } & {
        id: string;
        userId: string;
        status: string;
        submittedAt: Date;
        fileUrl: string;
        projectId: string;
        reviewNote: string | null;
    }>;
}
declare const _default: ProjectRepository;
export default _default;
//# sourceMappingURL=project.repository.d.ts.map