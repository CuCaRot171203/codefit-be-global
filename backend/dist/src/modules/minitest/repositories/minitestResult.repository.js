"use strict";
/**
 * MinitestResult Repository
 *
 * Xử lý các thao tác database cho kết quả bài kiểm tra.
 * Quản lý việc lưu và truy vấn kết quả làm bài của người dùng.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * MinitestResultRepository - Quản lý database operations cho kết quả bài test
 * @class MinitestResultRepository
 * @extends BaseRepository<MinitestResult>
 */
class MinitestResultRepository {
    model = prisma.minitestSubmission;
    /**
     * Tìm kết quả bài test của người dùng (lần làm gần nhất)
     * @param userId - ID của người dùng
     * @param minitestId - ID của bài test
     * @returns Promise<MinitestResult | null> - Kết quả tìm được hoặc null
     */
    async findByUserAndMinitest(userId, minitestId) {
        return this.model.findFirst({
            where: { userId, minitestId },
            orderBy: { createdAt: 'desc' }
        });
    }
    async findByUserId(userId) {
        return this.model.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }
}
exports.default = new MinitestResultRepository();
//# sourceMappingURL=minitestResult.repository.js.map