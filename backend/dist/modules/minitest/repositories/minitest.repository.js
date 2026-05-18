/**
 * Minitest Repository
 *
 * Xử lý các thao tác database cho Minitest entity.
 * Quản lý việc tạo, đọc và truy vấn các bài kiểm tra nhỏ.
 */
import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../../../base/base.repository';
const prisma = new PrismaClient();
/**
 * MinitestRepository - Quản lý database operations cho Minitest
 * @class MinitestRepository
 * @extends BaseRepository<Minitest>
 */
class MinitestRepository extends BaseRepository {
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
        // Bước 1: Tìm các bài test có courseId tương ứng
        // Bước 2: Sắp xếp theo thời gian tạo giảm dần (mới nhất trước)
        return this.model.findMany({
            where: { courseId },
            orderBy: { createdAt: 'desc' }
        });
    }
}
export default new MinitestRepository();
//# sourceMappingURL=minitest.repository.js.map