/**
 * @fileoverview Repository layer cho module Progress
 * Xử lý các thao tác database liên quan đến tiến độ học tập
 * @module progress/repositories
 */
import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../../../base/base.repository';
const prisma = new PrismaClient();
/**
 * Repository class xử lý các thao tác CRUD với bảng Progress trong database
 * Kế thừa từ BaseRepository với generic type Progress
 */
class ProgressRepository extends BaseRepository {
    model = prisma.progress;
    /**
     * Tìm tiến độ học tập của user trong một khóa học cụ thể
     * @param userId - ID của user
     * @param courseId - ID của khóa học
     * @returns Progress nếu tìm thấy, null nếu không tồn tại
     */
    async findByUserAndCourse(userId, courseId) {
        return this.model.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            }
        });
    }
    /**
     * Cập nhật hoặc tạo mới tiến độ học tập của user
     * Nếu đã có record, cập nhật; nếu chưa có, tạo mới
     * @param userId - ID của user
     * @param courseId - ID của khóa học
     * @param completedLessons - Số bài đã hoàn thành
     * @param totalLessons - Tổng số bài học
     * @returns Progress đã được cập nhật/tạo mới
     */
    async updateProgress(userId, courseId, completedLessons, totalLessons) {
        // Bước 1: Tính toán phần trăm hoàn thành dựa trên số bài đã hoàn thành và tổng số bài
        const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
        // Bước 2: Kiểm tra xem đã có record progress cho user và course này chưa
        const existing = await this.findByUserAndCourse(userId, courseId);
        // Bước 3: Nếu đã có record, cập nhật record đó
        if (existing) {
            return this.model.update({
                where: { id: existing.id },
                data: {
                    completedLessons,
                    totalLessons,
                    percentage,
                    updatedAt: new Date()
                }
            });
        }
        // Bước 4: Nếu chưa có record, tạo mới với các giá trị được truyền vào
        return this.model.create({
            data: {
                userId,
                courseId,
                completedLessons,
                totalLessons,
                percentage
            }
        });
    }
}
export default new ProgressRepository();
//# sourceMappingURL=progress.repository.js.map