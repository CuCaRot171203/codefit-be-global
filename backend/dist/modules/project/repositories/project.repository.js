/**
 * Project Repository
 *
 * Xử lý các thao tác database cho Project entity.
 * Quản lý việc tạo, đọc và truy vấn các dự án.
 */
import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../../../base/base.repository';
const prisma = new PrismaClient();
/**
 * ProjectRepository - Quản lý database operations cho Project
 * @class ProjectRepository
 * @extends BaseRepository<Project>
 */
class ProjectRepository extends BaseRepository {
    /** Prisma model được sử dụng cho các thao tác database */
    model = prisma.project;
    /**
     * Tìm các dự án theo userId
     * @param userId - ID của người dùng
     * @returns Promise<Project[]> - Danh sách dự án của người dùng
     */
    async findByUserId(userId) {
        // Bước 1: Truy vấn database với điều kiện userId
        // Bước 2: Sắp xếp theo thời gian tạo giảm dần (mới nhất trước)
        return this.model.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }
    /**
     * Tìm các dự án theo courseId
     * @param courseId - ID của khóa học
     * @returns Promise<Project[]> - Danh sách dự án của khóa học
     */
    async findByCourseId(courseId) {
        // Bước 1: Truy vấn database với điều kiện courseId
        // Bước 2: Sắp xếp theo thời gian tạo giảm dần
        return this.model.findMany({
            where: { courseId },
            orderBy: { createdAt: 'desc' }
        });
    }
    /**
     * Tìm các dự án theo userId và courseId
     * @param userId - ID của người dùng
     * @param courseId - ID của khóa học
     * @returns Promise<Project[]> - Danh sách dự án của người dùng trong khóa học
     */
    async findByUserAndCourse(userId, courseId) {
        // Bước 1: Truy vấn database với điều kiện userId và courseId
        // Bước 2: Sắp xếp theo thời gian tạo giảm dần
        return this.model.findMany({
            where: { userId, courseId },
            orderBy: { createdAt: 'desc' }
        });
    }
}
export default new ProjectRepository();
//# sourceMappingURL=project.repository.js.map