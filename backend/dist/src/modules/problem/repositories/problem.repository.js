"use strict";
/**
 * Problem Repository
 * @description Handles all database operations for Problem entities using Prisma ORM.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const base_repository_1 = require("../../../base/base.repository");
const prisma = new client_1.PrismaClient();
/**
 * ProblemRepository class
 * @extends BaseRepository
 * @description Extends BaseRepository to provide problem-specific database operations.
 */
class ProblemRepository extends base_repository_1.BaseRepository {
    /** The Prisma model used for problem operations */
    model = prisma.problem;
    /**
     * Find a problem by ID including all associated testcases
     * @description Retrieves a single problem with its full test case list for detailed views.
     * @param id - The unique identifier of the problem
     * @returns Promise resolving to the problem with testcases or null if not found
     */
    async findByIdWithTestcases(id) {
        // Bước 1: Sử dụng Prisma findUnique để tìm problem với điều kiện id
        // Bước 2: Include tất cả testcases liên quan thông qua relation
        return this.model.findUnique({
            where: { id },
            include: {
                testcases: true
            }
        });
    }
    /**
     * Find all public test cases for a specific problem
     * @description Retrieves only the test cases marked as public for user visibility.
     * @param problemId - The unique identifier of the parent problem
     * @returns Promise resolving to an array of public test cases
     */
    async findPublicTestcases(problemId) {
        // Bước 1: Query database để lấy tất cả testcases của problem
        // Bước 2: Filter chỉ lấy những testcase có isPublic = true
        const testcases = await prisma.testcase.findMany({
            where: {
                problemId,
                isPublic: true
            }
        });
        return testcases;
    }
}
exports.default = new ProblemRepository();
//# sourceMappingURL=problem.repository.js.map