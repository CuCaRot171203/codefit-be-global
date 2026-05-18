/**
 * @fileoverview Repository layer cho module Enrollment
 * Xử lý các thao tác database với bảng enrollment
 * @module enrollment/repositories
 */
import { BaseRepository } from '../../../base/base.repository';
import { Enrollment } from '../types';
/**
 * Repository class xử lý các thao tác CRUD với enrollment trong database
 * Kế thừa từ BaseRepository và mở rộng với các method đặc thù cho enrollment
 */
declare class EnrollmentRepository extends BaseRepository<Enrollment> {
    protected model: import(".prisma/client").Prisma.EnrollmentDelegate<import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    /**
     * Lấy danh sách tất cả enrollment của một user
     * Bao gồm thông tin chi tiết của course và các lessons
     * @param userId - ID của người dùng
     * @returns Promise<Enrollment[]> - Danh sách enrollment kèm course details
     */
    findByUserId(userId: string): Promise<any[]>;
    /**
     * Tìm một enrollment cụ thể theo userId và courseId
     * Sử dụng unique constraint composite key
     * @param userId - ID của người dùng
     * @param courseId - ID của khóa học
     * @returns Promise<Enrollment | null> - Enrollment nếu tìm thấy, null nếu không
     */
    findByUserIdAndCourseId(userId: string, courseId: string): Promise<Enrollment | null>;
    /**
     * Cập nhật tiến độ học tập của một enrollment
     * @param id - ID của enrollment cần cập nhật
     * @param progress - Tiến độ mới (0-100)
     * @returns Promise<Enrollment> - Enrollment sau khi cập nhật
     */
    updateProgress(id: string, progress: number): Promise<Enrollment>;
}
declare const _default: EnrollmentRepository;
export default _default;
//# sourceMappingURL=enrollment.repository.d.ts.map