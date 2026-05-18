/**
 * @fileoverview Repository layer cho ActivateCode module
 * Xử lý các thao tác database liên quan đến ActivateCode
 * @module activateCode/repositories
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
class ActivateCodeRepository {
    /**
     * Tạo activate code mới
     */
    async create(data) {
        return prisma.activateCode.create({ data });
    }
    /**
     * Tìm activate code theo code string
     */
    async findByCode(code) {
        return prisma.activateCode.findUnique({
            where: { code },
            include: { course: true }
        });
    }
    /**
     * Tìm activate codes theo course ID
     */
    async findByCourseId(courseId) {
        return prisma.activateCode.findMany({
            where: { courseId },
            orderBy: { createdAt: 'desc' }
        });
    }
    /**
     * Tìm activate codes của một user đã sử dụng
     */
    async findByUserId(userId) {
        return prisma.activateCode.findMany({
            where: { usedBy: userId },
            include: { course: true },
            orderBy: { usedAt: 'desc' }
        });
    }
    /**
     * Đánh dấu activate code đã sử dụng
     */
    async markAsUsed(code, userId) {
        return prisma.activateCode.update({
            where: { code },
            data: {
                isUsed: true,
                usedBy: userId,
                usedAt: new Date()
            }
        });
    }
    /**
     * Xóa activate code
     */
    async delete(id) {
        return prisma.activateCode.delete({
            where: { id }
        });
    }
}
export default new ActivateCodeRepository();
//# sourceMappingURL=activateCode.repository.js.map