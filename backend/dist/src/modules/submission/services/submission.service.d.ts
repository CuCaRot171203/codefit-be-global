/**
 * @fileoverview Business logic layer for submission operations
 * Handles submission creation, processing, and retrieval logic.
 */
import { BaseService } from '../../../base/base.service';
import submissionRepository from '../repositories/submission.repository';
import { CreateSubmissionDto, SubmissionResponse } from '../types';
/**
 * Service class for managing submission business logic
 * Extends BaseService to inherit common service operations.
 */
declare class SubmissionService extends BaseService<typeof submissionRepository> {
    constructor();
    /**
     * Creates a new submission for a user
     * Validates the problem, creates the submission record, processes mock results,
     * updates submission status, handles progress updates, and sends notifications.
     *
     * @param userId - The unique identifier of the submitting user
     * @param dto - The submission data containing problemId, code, and language
     * @returns Promise resolving to the created submission response
     * @throws Error if problemId, code, or language is missing
     * @throws Error if the specified problem does not exist
     */
    createSubmission(userId: string, dto: CreateSubmissionDto): Promise<SubmissionResponse>;
    /**
     * Retrieves a submission by its ID, including all test case results
     *
     * @param id - The unique identifier of the submission
     * @returns Promise resolving to the submission response with results, or null if not found
     */
    getSubmissionById(id: string): Promise<SubmissionResponse | null>;
    /**
     * Retrieves all submissions for a specific user
     *
     * @param userId - The unique identifier of the user
     * @returns Promise resolving to an array of user's submission responses
     */
    getSubmissionsByUserId(userId: string): Promise<SubmissionResponse[]>;
    /**
     * Retrieves all submissions for a specific problem
     *
     * @param problemId - The unique identifier of the problem
     * @returns Promise resolving to an array of problem's submission responses
     */
    getSubmissionsByProblemId(problemId: string): Promise<SubmissionResponse[]>;
    /**
     * Handles post-submission actions for successful (AC) submissions
     * Updates the user's progress in the associated course if applicable.
     *
     * @param userId - The unique identifier of the user
     * @param problemId - The unique identifier of the solved problem
     * @private
     */
    private handleSuccessfulSubmission;
    /**
     * Finds the course that contains a specific problem by searching through lessons
     * Searches both 'code' type lessons and lessons with embedded problemId in content.
     *
     * @param problemId - The unique identifier of the problem to find
     * @returns Promise resolving to the course ID if found, or null
     * @private
     */
    private findCourseByProblemId;
    /**
     * Creates a notification for the user about their submission result
     *
     * @param userId - The unique identifier of the user to notify
     * @param submissionId - The unique identifier of the submission
     * @param problemTitle - The title of the problem submitted
     * @param status - The final status of the submission
     * @private
     */
    private createSubmissionNotification;
    /**
     * Processes mock test results for a submission
     * If no test cases exist, creates a single mock result.
     * Otherwise, generates results for each test case.
     *
     * @param submissionId - The unique identifier of the submission
     * @param problemId - The unique identifier of the problem
     * @returns Promise resolving to an array of submission results
     * @private
     */
    private processMockResults;
    /**
     * Generates a mock result for a single test case with randomized status
     * Uses weighted probability: 60% AC, 15% WA, 15% TLE, 10% RE
     *
     * @param submissionId - The unique identifier of the submission
     * @param testcaseId - The unique identifier of the test case
     * @returns Promise resolving to the generated submission result
     * @private
     */
    private generateMockResult;
    /**
     * Determines the overall submission status from all test case results
     * Priority: RE/CE/TLE/MLE > WA > AC
     *
     * @param results - Array of submission results from all test cases
     * @returns The overall submission status
     * @private
     */
    private determineOverallStatus;
    /**
     * Calculates the average runtime from all test case results
     *
     * @param results - Array of submission results from all test cases
     * @returns The average runtime in milliseconds, or null if no results
     * @private
     */
    private calculateAverageRuntime;
    /**
     * Formats a submission entity into a standardized response object
     *
     * @param submission - The raw submission entity from the database
     * @param results - Array of submission results to include
     * @returns Formatted SubmissionResponse object
     * @private
     */
    private formatResponse;
}
/** Singleton instance of SubmissionService */
declare const _default: SubmissionService;
export default _default;
//# sourceMappingURL=submission.service.d.ts.map