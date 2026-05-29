/**
 * @fileoverview Repository layer cho module Progress
 * Xử lý các thao tác database liên quan đến tiến độ học tập
 * @module progress/repositories
 */
import { BaseRepository } from '../../../base/base.repository';
import { Progress } from '../types';
/**
 * Repository class xử lý các thao tác CRUD với bảng Progress trong database
 * Kế thừa từ BaseRepository với generic type Progress
 */
declare class ProgressRepository extends BaseRepository<Progress> {
    protected model: import(".prisma/client").Prisma.ProgressDelegate<import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    /**
     * Tìm tiến độ học tập của user trong một khóa học cụ thể
     * @param userId - ID của user
     * @param courseId - ID của khóa học
     * @returns Progress nếu tìm thấy, null nếu không tồn tại
     */
    findByUserAndCourse(userId: string, courseId: string): Promise<Progress | null>;
    /**
     * Cập nhật hoặc tạo mới tiến độ học tập của user
     * Nếu đã có record, cập nhật; nếu chưa có, tạo mới
     * @param userId - ID của user
     * @param courseId - ID của khóa học
     * @param completedLessons - Số bài đã hoàn thành
     * @param totalLessons - Tổng số bài học
     * @returns Progress đã được cập nhật/tạo mới
     */
    updateProgress(userId: string, courseId: string, completedLessons: number, totalLessons: number): Promise<Progress>;
}
declare const _default: ProgressRepository;
export default _default;
//# sourceMappingURL=progress.repository.d.ts.map