"use strict";
/**
 * @fileoverview Database access layer for submission-related operations
 * Handles all Prisma queries for submissions and submission results.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const base_repository_1 = require("../../../base/base.repository");
/**
 * Prisma client instance for database operations
 */
const prisma = new client_1.PrismaClient();
/**
 * Repository class for managing submission data in the database
 * Extends BaseRepository to inherit common CRUD operations.
 */
class SubmissionRepository extends base_repository_1.BaseRepository {
    /** The Prisma model used for submission queries */
    model = prisma.submission;
    /**
     * Retrieves all submissions for a specific user, ordered by creation date (newest first)
     * @param userId - The unique identifier of the user
     * @returns Promise resolving to an array of user's submissions
     */
    async findByUserId(userId) {
        return this.model.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }
    /**
     * Retrieves all submissions for a specific problem, ordered by creation date (newest first)
     * @param problemId - The unique identifier of the problem
     * @returns Promise resolving to an array of problem's submissions
     */
    async findByProblemId(problemId) {
        return this.model.findMany({
            where: { problemId },
            orderBy: { createdAt: 'desc' }
        });
    }
    /**
     * Retrieves a submission by its ID along with all associated test case results
     * @param id - The unique identifier of the submission
     * @returns Promise resolving to the submission with included results, or undefined if not found
     */
    async findByIdWithResults(id) {
        return this.model.findUnique({
            where: { id },
            include: {
                results: true
            }
        });
    }
    /**
     * Creates a new submission result record in the database
     * @param data - The submission result data to create
     * @returns Promise resolving to the created submission result
     */
    async createResult(data) {
        return prisma.submissionResult.create({ data });
    }
    /**
     * Retrieves all test cases associated with a specific problem
     * @param problemId - The unique identifier of the problem
     * @returns Promise resolving to an array of test cases for the problem
     */
    async getTestcasesByProblemId(problemId) {
        return prisma.testcase.findMany({
            where: { problemId }
        });
    }
}
/** Singleton instance of SubmissionRepository */
exports.default = new SubmissionRepository();
//# sourceMappingURL=submission.repository.js.map