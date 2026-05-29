/**
 * Minitest Repository
 *
 * Xử lý các thao tác database cho Minitest entity.
 * Quản lý việc tạo, đọc và truy vấn các bài kiểm tra nhỏ.
 */
import { BaseRepository } from '../../../base/base.repository';
/**
 * Interface định nghĩa cấu trúc Minitest
 * @interface Minitest
 */
interface Minitest {
    /** ID duy nhất của bài test */
    id: string;
    /** Tiêu đề bài test */
    title: string;
    /** Mô tả bài test */
    description: string;
    /** ID của khóa học liên kết */
    courseId: string | null;
    /** Độ khó của bài test */
    difficulty: string;
    /** Thời gian làm bài (giây) */
    timeLimit: number;
    /** Thời điểm tạo */
    createdAt: Date;
}
/**
 * MinitestRepository - Quản lý database operations cho Minitest
 * @class MinitestRepository
 * @extends BaseRepository<Minitest>
 */
declare class MinitestRepository extends BaseRepository<Minitest> {
    /** Prisma model được sử dụng cho các thao tác database */
    protected model: import(".prisma/client").Prisma.MinitestDelegate<import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    /**
     * Tìm bài test theo ID kèm danh sách câu hỏi
     * @param id - ID của bài test cần tìm
     * @returns Promise<Minitest | null> - Bài test với câu hỏi hoặc null
     */
    findByIdWithQuestions(id: string): Promise<any>;
    /**
     * Tìm các bài test theo courseId
     * @param courseId - ID của khóa học
     * @returns Promise<Minitest[]> - Danh sách bài test của khóa học
     */
    findByCourseId(courseId: string): Promise<any[]>;
}
declare const _default: MinitestRepository;
export default _default;
//# sourceMappingURL=minitest.repository.d.ts.map