/**
 * @fileoverview Database access layer for submission-related operations
 * Handles all Prisma queries for submissions and submission results.
 */
import { BaseRepository } from '../../../base/base.repository';
import { Submission, Testcase } from '../types';
/**
 * Repository class for managing submission data in the database
 * Extends BaseRepository to inherit common CRUD operations.
 */
declare class SubmissionRepository extends BaseRepository<Submission> {
    /** The Prisma model used for submission queries */
    protected model: import(".prisma/client").Prisma.SubmissionDelegate<import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    /**
     * Retrieves all submissions for a specific user, ordered by creation date (newest first)
     * @param userId - The unique identifier of the user
     * @returns Promise resolving to an array of user's submissions
     */
    findByUserId(userId: string): Promise<any[]>;
    /**
     * Retrieves all submissions for a specific problem, ordered by creation date (newest first)
     * @param problemId - The unique identifier of the problem
     * @returns Promise resolving to an array of problem's submissions
     */
    findByProblemId(problemId: string): Promise<any[]>;
    /**
     * Retrieves a submission by its ID along with all associated test case results
     * @param id - The unique identifier of the submission
     * @returns Promise resolving to the submission with included results, or undefined if not found
     */
    findByIdWithResults(id: string): Promise<any>;
    /**
     * Creates a new submission result record in the database
     * @param data - The submission result data to create
     * @returns Promise resolving to the created submission result
     */
    createResult(data: any): Promise<any>;
    /**
     * Retrieves all test cases associated with a specific problem
     * @param problemId - The unique identifier of the problem
     * @returns Promise resolving to an array of test cases for the problem
     */
    getTestcasesByProblemId(problemId: string): Promise<Testcase[]>;
}
/** Singleton instance of SubmissionRepository */
declare const _default: SubmissionRepository;
export default _default;
//# sourceMappingURL=submission.repository.d.ts.map