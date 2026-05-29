"use strict";
/**
 * Phase Repository
 *
 * Xử lý các thao tác database cho Phase entity.
 * Kế thừa từ BaseRepository để có các CRUD operations cơ bản.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const base_repository_1 = require("../../../base/base.repository");
const prisma = new client_1.PrismaClient();
/**
 * PhaseRepository - Quản lý database operations cho Phase
 * @class PhaseRepository
 * @extends BaseRepository<Phase>
 */
class PhaseRepository extends base_repository_1.BaseRepository {
    /** Prisma model được sử dụng cho các thao tác database */
    model = prisma.phase;
    /**
     * Tìm tất cả các phase theo courseId
     * @param courseId - ID của khóa học cần lấy các phase
     * @returns Promise<Phase[]> - Danh sách các phase của khóa học
     */
    async findByCourseId(courseId) {
        // Bước 1: Truy vấn database với điều kiện courseId
        // Bước 2: Sắp xếp theo orderIndex tăng dần để hiển thị đúng thứ tự
        return this.model.findMany({
            where: { courseId },
            orderBy: { orderIndex: 'asc' }
        });
    }
    /**
     * Xóa tất cả các phase theo courseId
     * @param courseId - ID của khóa học cần xóa các phase
     */
    async deleteByCourseId(courseId) {
        // Bước 1: Xóa tất cả các phase có cùng courseId
        await this.model.deleteMany({ where: { courseId } });
    }
}
exports.default = new PhaseRepository();
//# sourceMappingURL=phase.repository.js.map