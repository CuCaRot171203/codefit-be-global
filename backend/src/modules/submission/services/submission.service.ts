/**
 * @fileoverview Business logic layer for submission operations
 * Handles submission creation, processing, and retrieval logic.
 */

import { BaseService } from '../../../base/base.service';
import submissionRepository from '../repositories/submission.repository';
import problemRepository from '../../problem/repositories/problem.repository';
import progressService from '../../progress/services/progress.service';
import notificationService from '../../notification/services/notification.service';
import { 
  CreateSubmissionDto, 
  SubmissionResponse, 
  SubmissionStatus,
  SubmissionResult 
} from '../types';

/**
 * Service class for managing submission business logic
 * Extends BaseService to inherit common service operations.
 */
class SubmissionService extends BaseService<typeof submissionRepository> {

  constructor() {
    super(submissionRepository);
  }

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
  async createSubmission(userId: string, dto: CreateSubmissionDto): Promise<SubmissionResponse> {
    const { problemId, code, language } = dto;

    // Bước 1: Validate required fields
    if (!problemId || !code || !language) {
      throw new Error('problemId, code, and language are required');
    }

    // Bước 2: Verify problem exists
    const problem = await problemRepository.findById(problemId);
    if (!problem) {
      throw new Error('Problem not found');
    }

    // Bước 3: Create initial submission record with PENDING status
    const submission = await this.repository.create({
      userId,
      problemId,
      code,
      language,
      status: 'PENDING',
      runtime: null,
      memory: null
    } as any);

    // Bước 4: Process and evaluate the submission against test cases
    const results = await this.processMockResults(submission.id, problemId);

    // Bước 5: Determine overall status based on all test case results
    const overallStatus = this.determineOverallStatus(results);
    const avgRuntime = this.calculateAverageRuntime(results);

    // Bước 6: Update submission with final status and runtime
    const updatedSubmission = await this.repository.update(submission.id, {
      status: overallStatus,
      runtime: avgRuntime
    } as any);

    // Bước 7: Handle successful submission - update user progress if passed
    if (overallStatus === 'AC') {
      await this.handleSuccessfulSubmission(userId, problemId);
    }

    // Bước 8: Send notification to user about submission result
    await this.createSubmissionNotification(userId, submission.id, problem.title, overallStatus);

    // Bước 9: Format and return the submission response
    return this.formatResponse(updatedSubmission, results);
  }

  /**
   * Retrieves a submission by its ID, including all test case results
   * 
   * @param id - The unique identifier of the submission
   * @returns Promise resolving to the submission response with results, or null if not found
   */
  async getSubmissionById(id: string): Promise<SubmissionResponse | null> {
    const submission = await this.repository.findByIdWithResults(id);
    if (!submission) return null;
    return this.formatResponse(submission, submission.results);
  }

  /**
   * Retrieves all submissions for a specific user
   * 
   * @param userId - The unique identifier of the user
   * @returns Promise resolving to an array of user's submission responses
   */
  async getSubmissionsByUserId(userId: string): Promise<SubmissionResponse[]> {
    const submissions = await this.repository.findByUserId(userId);
    return submissions.map(s => this.formatResponse(s, []));
  }

  /**
   * Retrieves all submissions for a specific problem
   * 
   * @param problemId - The unique identifier of the problem
   * @returns Promise resolving to an array of problem's submission responses
   */
  async getSubmissionsByProblemId(problemId: string): Promise<SubmissionResponse[]> {
    const submissions = await this.repository.findByProblemId(problemId);
    return submissions.map(s => this.formatResponse(s, []));
  }

  /**
   * Handles post-submission actions for successful (AC) submissions
   * Updates the user's progress in the associated course if applicable.
   * 
   * @param userId - The unique identifier of the user
   * @param problemId - The unique identifier of the solved problem
   * @private
   */
  private async handleSuccessfulSubmission(userId: string, problemId: string): Promise<void> {
    try {
      // Bước 1: Find the course that contains this problem
      const enrolledCourse = await this.findCourseByProblemId(problemId);
      
      // Bước 2: Increment user's progress if enrolled in the course
      if (enrolledCourse) {
        await progressService.incrementProgress(userId, enrolledCourse.courseId);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }

  /**
   * Finds the course that contains a specific problem by searching through lessons
   * Searches both 'code' type lessons and lessons with embedded problemId in content.
   * 
   * @param problemId - The unique identifier of the problem to find
   * @returns Promise resolving to the course ID if found, or null
   * @private
   */
  private async findCourseByProblemId(problemId: string): Promise<any | null> {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    // Bước 1: Search for code-type lessons containing the problemId
    const lesson = await prisma.lesson.findFirst({
      where: {
        type: 'code',
        content: {
          contains: problemId
        }
      },
      include: {
        phase: {
          include: {
            course: true
          }
        }
      }
    });

    if (lesson?.phase?.course) {
      return { courseId: lesson.phase.course.id };
    }

    // Bước 2: Search for lessons with embedded problemId in JSON content
    const problemLesson = await prisma.lesson.findFirst({
      where: {
        content: {
          contains: `"problemId": "${problemId}"`
        }
      },
      include: {
        phase: {
          include: {
            course: true
          }
        }
      }
    });

    if (problemLesson?.phase?.course) {
      return { courseId: problemLesson.phase.course.id };
    }

    // Bước 3: Return null if no course found
    return null;
  }

  /**
   * Creates a notification for the user about their submission result
   * 
   * @param userId - The unique identifier of the user to notify
   * @param submissionId - The unique identifier of the submission
   * @param problemTitle - The title of the problem submitted
   * @param status - The final status of the submission
   * @private
   */
  private async createSubmissionNotification(
    userId: string,
    submissionId: string,
    problemTitle: string,
    status: SubmissionStatus
  ): Promise<void> {
    try {
      await notificationService.createSubmissionNotification(
        userId,
        submissionId,
        problemTitle,
        status
      );
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }

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
  private async processMockResults(submissionId: string, problemId: string): Promise<SubmissionResult[]> {
    // Bước 1: Retrieve all test cases for the problem
    const testcases = await this.repository.getTestcasesByProblemId(problemId);
    
    // Bước 2: Handle case when no test cases exist - create a mock result
    if (testcases.length === 0) {
      const mockResult = await this.repository.createResult({
        submissionId,
        testcaseId: 'mock-tc-1',
        status: 'AC',
        runtime: Math.floor(Math.random() * 200) + 50
      } as any);
      return [mockResult];
    }

    // Bước 3: Generate mock results for each existing test case
    const results: SubmissionResult[] = [];
    for (const tc of testcases) {
      const mockResult = await this.generateMockResult(submissionId, tc.id);
      results.push(mockResult);
    }
    return results;
  }

  /**
   * Generates a mock result for a single test case with randomized status
   * Uses weighted probability: 60% AC, 15% WA, 15% TLE, 10% RE
   * 
   * @param submissionId - The unique identifier of the submission
   * @param testcaseId - The unique identifier of the test case
   * @returns Promise resolving to the generated submission result
   * @private
   */
  private async generateMockResult(submissionId: string, testcaseId: string): Promise<SubmissionResult> {
    // Bước 1: Generate random index for weighted status selection
    const statuses: SubmissionStatus[] = ['AC', 'AC', 'AC', 'WA', 'TLE', 'RE'];
    const randomIndex = Math.floor(Math.random() * 100);
    
    let status: SubmissionStatus;
    let runtime: number;

    // Bước 2: Determine status based on random index with weighted probability
    if (randomIndex < 60) {
      // 60% chance: Accepted
      status = 'AC';
      runtime = Math.floor(Math.random() * 150) + 30;
    } else if (randomIndex < 75) {
      // 15% chance: Wrong Answer
      status = 'WA';
      runtime = Math.floor(Math.random() * 100) + 20;
    } else if (randomIndex < 90) {
      // 15% chance: Time Limit Exceeded
      status = 'TLE';
      runtime = 2000;
    } else {
      // 10% chance: Runtime Error
      status = 'RE';
      runtime = Math.floor(Math.random() * 50) + 10;
    }

    // Bước 3: Create and return the result record
    const result = await this.repository.createResult({
      submissionId,
      testcaseId,
      status,
      runtime
    } as any);

    return result;
  }

  /**
   * Determines the overall submission status from all test case results
   * Priority: RE/CE/TLE/MLE > WA > AC
   * 
   * @param results - Array of submission results from all test cases
   * @returns The overall submission status
   * @private
   */
  private determineOverallStatus(results: SubmissionResult[]): SubmissionStatus {
    // Bước 1: Handle empty results case
    if (results.length === 0) return 'PENDING';
    
    // Bước 2: Check for any runtime/compilation errors (highest priority)
    const hasError = results.some(r => ['RE', 'CE', 'TLE', 'MLE'].includes(r.status));
    
    // Bước 3: Check for wrong answers (medium priority)
    const hasWA = results.some(r => r.status === 'WA');
    
    // Bước 4: Return status based on priority
    if (hasError) return 'RE';
    if (hasWA) return 'WA';
    return 'AC';
  }

  /**
   * Calculates the average runtime from all test case results
   * 
   * @param results - Array of submission results from all test cases
   * @returns The average runtime in milliseconds, or null if no results
   * @private
   */
  private calculateAverageRuntime(results: SubmissionResult[]): number | null {
    // Bước 1: Handle empty results case
    if (results.length === 0) return null;
    
    // Bước 2: Sum all runtimes and calculate average
    const total = results.reduce((sum, r) => sum + (r.runtime || 0), 0);
    return Math.round(total / results.length);
  }

  /**
   * Formats a submission entity into a standardized response object
   * 
   * @param submission - The raw submission entity from the database
   * @param results - Array of submission results to include
   * @returns Formatted SubmissionResponse object
   * @private
   */
  private formatResponse(submission: any, results: any[]): SubmissionResponse {
    return {
      id: submission.id,
      problemId: submission.problemId,
      language: submission.language,
      status: submission.status,
      runtime: submission.runtime,
      memory: submission.memory,
      createdAt: submission.createdAt,
      results: results.map(r => ({
        id: r.id,
        testcaseId: r.testcaseId,
        status: r.status,
        runtime: r.runtime,
        submissionId: submission.id
      }))
    };
  }
}

/** Singleton instance of SubmissionService */
export default new SubmissionService();
