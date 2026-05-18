/**
 * Problem Service
 * @description Contains business logic for managing programming problems.
 */
import { BaseService } from '../../../base/base.service';
import problemRepository from '../repositories/problem.repository';
import { CreateProblemDto, UpdateProblemDto } from '../types';
/**
 * ProblemService class
 * @extends BaseService
 * @description Handles business logic and validation for problem operations.
 */
declare class ProblemService extends BaseService<typeof problemRepository> {
    constructor();
    /**
     * Get all problems
     * @description Retrieves all problems from the database.
     * @returns Promise resolving to an array of all problems
     */
    getAll(): Promise<any[]>;
    /**
     * Create a new problem
     * @description Validates input data and creates a new problem in the database.
     * @param dto - Data Transfer Object containing problem details
     * @returns Promise resolving to the created problem
     * @throws Error if title or description is missing
     */
    create(dto: CreateProblemDto): Promise<any>;
    /**
     * Get a problem by ID with all testcases
     * @description Retrieves a problem along with its associated test cases.
     * @param id - The unique identifier of the problem
     * @returns Promise resolving to the problem with testcases or null
     */
    getById(id: string): Promise<any | null>;
    /**
     * Get all public test cases for a problem
     * @description Retrieves only the test cases that are marked as public for user access.
     * @param problemId - The unique identifier of the problem
     * @returns Promise resolving to an array of public test cases
     * @throws Error if the problem is not found
     */
    getPublicTestcases(problemId: string): Promise<any[]>;
    /**
     * Update an existing problem
     * @description Validates existence and updates problem data with provided fields.
     * @param id - The unique identifier of the problem to update
     * @param dto - Data Transfer Object containing fields to update
     * @returns Promise resolving to the updated problem
     * @throws Error if the problem is not found
     */
    update(id: string, dto: UpdateProblemDto): Promise<any>;
    /**
     * Delete a problem
     * @description Removes a problem from the database after verifying its existence.
     * @param id - The unique identifier of the problem to delete
     * @returns Promise resolving to a success message
     * @throws Error if the problem is not found
     */
    delete(id: string): Promise<{
        message: string;
    }>;
}
declare const _default: ProblemService;
export default _default;
//# sourceMappingURL=problem.service.d.ts.map