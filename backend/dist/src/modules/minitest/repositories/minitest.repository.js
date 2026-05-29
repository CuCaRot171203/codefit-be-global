"use strict";
/**
 * Minitest Repository
 *
 * Xử lý các thao tác database cho Minitest entity.
 * Quản lý việc tạo, đọc và truy vấn các bài kiểm tra nhỏ.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const base_repository_1 = require("../../../base/base.repository");
const prisma = new client_1.PrismaClient();
/**
 * MinitestRepository - Quản lý database operations cho Minitest
 * @class MinitestRepository
 * @extends BaseRepository<Minitest>
 */
class MinitestRepository extends base_repository_1.BaseRepository {
    /** Prisma model được sử dụng cho các thao tác database */
    model = prisma.minitest;
    /**
     * Tìm bài test theo ID kèm danh sách câu hỏi
     * @param id - ID của bài test cần tìm
     * @returns Promise<Minitest | null> - Bài test với câu hỏi hoặc null
     */
    async findByIdWithQuestions(id) {
        // Bước 1: Tìm bài test theo ID
        // Bước 2: Include các câu hỏi và sắp xếp theo orderIndex tăng dần
        return this.model.findUnique({
            where: { id },
            include: {
                questions: {
                    orderBy: { orderIndex: 'asc' }
                }
            }
        });
    }
    /**
     * Tìm các bài test theo courseId
     * @param courseId - ID của khóa học
     * @returns Promise<Minitest[]> - Danh sách bài test của khóa học
     */
    async findByCourseId(courseId) {
        const phases = await prisma.phase.findMany({
            where: { courseId },
            select: { id: true },
        });
        const phaseIds = phases.map(p => p.id);
        return this.model.findMany({
            where: { phaseId: { in: phaseIds } },
            include: {
                phase: { select: { id: true, title: true, orderIndex: true } },
                questions: { include: { problem: true } },
            },
            orderBy: [
                { phase: { orderIndex: 'asc' } },
                { orderIndex: 'asc' }
            ]
        });
    }
}
exports.default = new MinitestRepository();
//# sourceMappingURL=minitest.repository.js.map