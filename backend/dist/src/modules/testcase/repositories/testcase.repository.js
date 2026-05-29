"use strict";
/**
 * Testcase Repository
 *
 * Xử lý các thao tác database cho Testcase entity.
 * Testcase chứa dữ liệu đầu vào và đầu ra mong đợi để chấm bài.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const base_repository_1 = require("../../../base/base.repository");
const prisma = new client_1.PrismaClient();
/**
 * TestcaseRepository - Quản lý database operations cho Testcase
 * @class TestcaseRepository
 * @extends BaseRepository<Testcase>
 */
class TestcaseRepository extends base_repository_1.BaseRepository {
    /** Prisma model được sử dụng cho các thao tác database */
    model = prisma.testcase;
    /**
     * Tìm tất cả các testcase theo problemId
     * @param problemId - ID của bài toán cần lấy các testcase
     * @returns Promise<Testcase[]> - Danh sách các testcase của bài toán
     */
    async findByProblemId(problemId) {
        // Bước 1: Truy vấn database với điều kiện problemId
        // Bước 2: Sắp xếp theo id tăng dần
        return this.model.findMany({
            where: { problemId },
            orderBy: { id: 'asc' }
        });
    }
    /**
     * Tìm các testcase công khai theo problemId
     * @param problemId - ID của bài toán
     * @returns Promise<Testcase[]> - Danh sách testcase công khai
     */
    async findPublicByProblemId(problemId) {
        // Bước 1: Truy vấn database với điều kiện problemId và isPublic = true
        return this.model.findMany({
            where: {
                problemId,
                isPublic: true
            }
        });
    }
    /**
     * Tìm các testcase riêng tư theo problemId
     * @param problemId - ID của bài toán
     * @returns Promise<Testcase[]> - Danh sách testcase riêng tư
     */
    async findPrivateByProblemId(problemId) {
        // Bước 1: Truy vấn database với điều kiện problemId và isPublic = false
        return this.model.findMany({
            where: {
                problemId,
                isPublic: false
            }
        });
    }
}
exports.default = new TestcaseRepository();
//# sourceMappingURL=testcase.repository.js.map