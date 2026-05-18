/**
 * MinitestResult Repository
 *
 * Xử lý các thao tác database cho kết quả bài kiểm tra.
 * Quản lý việc lưu và truy vấn kết quả làm bài của người dùng.
 */
import { BaseRepository } from '../../../base/base.repository';
/**
 * Interface định nghĩa cấu trúc MinitestResult
 * @interface MinitestResult
 */
interface MinitestResult {
    /** ID duy nhất của kết quả */
    id: string;
    /** ID của bài test */
    minitestId: string;
    /** ID của người dùng */
    userId: string;
    /** Số câu trả lời đúng */
    score: number;
    /** Tổng số câu hỏi */
    totalQuestions: number;
    /** Thời điểm nộp bài */
    completedAt: Date;
}
/**
 * MinitestResultRepository - Quản lý database operations cho kết quả bài test
 * @class MinitestResultRepository
 * @extends BaseRepository<MinitestResult>
 */
declare class MinitestResultRepository extends BaseRepository<MinitestResult> {
    /** Prisma model được sử dụng cho các thao tác database */
    protected model: any;
    /**
     * Tìm kết quả bài test của người dùng (lần làm gần nhất)
     * @param userId - ID của người dùng
     * @param minitestId - ID của bài test
     * @returns Promise<MinitestResult | null> - Kết quả tìm được hoặc null
     */
    findByUserAndMinitest(userId: string, minitestId: string): Promise<MinitestResult | null>;
    /**
     * Tìm tất cả kết quả của một người dùng
     * @param userId - ID của người dùng
     * @returns Promise<MinitestResult[]> - Danh sách kết quả bài test
     */
    findByUserId(userId: string): Promise<MinitestResult[]>;
}
declare const _default: MinitestResultRepository;
export default _default;
//# sourceMappingURL=minitestResult.repository.d.ts.map