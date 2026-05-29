/**
 * Testcase Repository
 *
 * Xử lý các thao tác database cho Testcase entity.
 * Testcase chứa dữ liệu đầu vào và đầu ra mong đợi để chấm bài.
 */
import { BaseRepository } from '../../../base/base.repository';
import { Testcase } from '../../problem/types';
/**
 * TestcaseRepository - Quản lý database operations cho Testcase
 * @class TestcaseRepository
 * @extends BaseRepository<Testcase>
 */
declare class TestcaseRepository extends BaseRepository<Testcase> {
    /** Prisma model được sử dụng cho các thao tác database */
    protected model: import(".prisma/client").Prisma.TestcaseDelegate<import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    /**
     * Tìm tất cả các testcase theo problemId
     * @param problemId - ID của bài toán cần lấy các testcase
     * @returns Promise<Testcase[]> - Danh sách các testcase của bài toán
     */
    findByProblemId(problemId: string): Promise<Testcase[]>;
    /**
     * Tìm các testcase công khai theo problemId
     * @param problemId - ID của bài toán
     * @returns Promise<Testcase[]> - Danh sách testcase công khai
     */
    findPublicByProblemId(problemId: string): Promise<Testcase[]>;
    /**
     * Tìm các testcase riêng tư theo problemId
     * @param problemId - ID của bài toán
     * @returns Promise<Testcase[]> - Danh sách testcase riêng tư
     */
    findPrivateByProblemId(problemId: string): Promise<Testcase[]>;
}
declare const _default: TestcaseRepository;
export default _default;
//# sourceMappingURL=testcase.repository.d.ts.map