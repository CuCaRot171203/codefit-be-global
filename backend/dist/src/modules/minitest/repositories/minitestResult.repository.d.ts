/**
 * MinitestResult Repository
 *
 * Xử lý các thao tác database cho kết quả bài kiểm tra.
 * Quản lý việc lưu và truy vấn kết quả làm bài của người dùng.
 */
/**
 * MinitestResultRepository - Quản lý database operations cho kết quả bài test
 * @class MinitestResultRepository
 * @extends BaseRepository<MinitestResult>
 */
declare class MinitestResultRepository {
    protected model: import(".prisma/client").Prisma.MinitestSubmissionDelegate<import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    /**
     * Tìm kết quả bài test của người dùng (lần làm gần nhất)
     * @param userId - ID của người dùng
     * @param minitestId - ID của bài test
     * @returns Promise<MinitestResult | null> - Kết quả tìm được hoặc null
     */
    findByUserAndMinitest(userId: string, minitestId: string): Promise<any>;
    findByUserId(userId: string): Promise<any[]>;
}
declare const _default: MinitestResultRepository;
export default _default;
//# sourceMappingURL=minitestResult.repository.d.ts.map