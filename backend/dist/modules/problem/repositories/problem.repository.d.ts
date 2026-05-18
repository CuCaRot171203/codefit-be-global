/**
 * Problem Repository
 * @description Handles all database operations for Problem entities using Prisma ORM.
 */
import { BaseRepository } from '../../../base/base.repository';
import { Problem } from '../types';
/**
 * ProblemRepository class
 * @extends BaseRepository
 * @description Extends BaseRepository to provide problem-specific database operations.
 */
declare class ProblemRepository extends BaseRepository<Problem> {
    /** The Prisma model used for problem operations */
    protected model: import(".prisma/client").Prisma.ProblemDelegate<import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    /**
     * Find a problem by ID including all associated testcases
     * @description Retrieves a single problem with its full test case list for detailed views.
     * @param id - The unique identifier of the problem
     * @returns Promise resolving to the problem with testcases or null if not found
     */
    findByIdWithTestcases(id: string): Promise<any>;
    /**
     * Find all public test cases for a specific problem
     * @description Retrieves only the test cases marked as public for user visibility.
     * @param problemId - The unique identifier of the parent problem
     * @returns Promise resolving to an array of public test cases
     */
    findPublicTestcases(problemId: string): Promise<any[]>;
}
declare const _default: ProblemRepository;
export default _default;
//# sourceMappingURL=problem.repository.d.ts.map