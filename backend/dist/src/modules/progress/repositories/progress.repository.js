"use strict";
/**
 * @fileoverview Repository layer cho module Progress
 * Xử lý các thao tác database liên quan đến tiến độ học tập
 * @module progress/repositories
 */
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const base_repository_1 = require("../../../base/base.repository");
const prisma = new client_1.PrismaClient();
/**
 * Repository class xử lý các thao tác CRUD với bảng Progress trong database
 * Kế thừa từ BaseRepository với generic type Progress
 */
class ProgressRepository extends base_repository_1.BaseRepository {
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
        const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
        const existing = await this.findByUserAndCourse(userId, courseId);
        if (existing) {
            return this.model.update({
                where: { id: existing.id },
                data: {
                    completedLessons,
                    totalLessons,
                    percentage,
                }
            });
        }
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
exports.default = new ProgressRepository();
//# sourceMappingURL=progress.repository.js.map