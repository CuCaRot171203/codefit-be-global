/**
 * @fileoverview Type definitions for submission module
 * Contains all TypeScript types, interfaces, and enums used across
 * submission controllers, services, and repositories.
 */

/**
 * Status of a submission in the CodeFit system
 * - PENDING: Submission is queued but not yet processed
 * - RUNNING: Submission is currently being evaluated
 * - AC: All test cases passed (Accepted)
 * - WA: Wrong Answer on one or more test cases
 * - RE: Runtime Error occurred during execution
 * - CE: Compilation Error
 * - TLE: Time Limit Exceeded
 * - MLE: Memory Limit Exceeded
 */
export type SubmissionStatus = 'PENDING' | 'RUNNING' | 'AC' | 'WA' | 'RE' | 'CE' | 'TLE' | 'MLE';

/**
 * Supported programming languages for code submissions
 */
export type SubmissionLanguage = 'javascript' | 'typescript' | 'python' | 'java' | 'cpp' | 'go' | 'rust';

/**
 * Core submission entity representing a user's code submission to a problem
 */
export interface Submission {
  id: string;
  userId: string;
  problemId: string;
  code: string;
  language: SubmissionLanguage;
  status: SubmissionStatus;
  runtime: number | null;
  memory: number | null;
  createdAt: Date;
}

/**
 * Result of a submission against a single test case
 */
export interface SubmissionResult {
  id: string;
  submissionId: string;
  testcaseId: string;
  status: SubmissionStatus;
  runtime: number | null;
}

/**
 * Represents a test case for a problem
 */
export interface Testcase {
  id: string;
  problemId: string;
  input: string;
  expectedOutput: string;
  isPublic: boolean;
}

/**
 * Core problem entity
 */
export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  memoryLimit: number;
}

/**
 * Data Transfer Object for creating a new submission
 */
export interface CreateSubmissionDto {
  problemId: string;
  code: string;
  language: SubmissionLanguage;
}

/**
 * Response object returned from submission operations
 * Includes submission details and optionally the test case results
 */
export interface SubmissionResponse {
  id: string;
  problemId: string;
  language: SubmissionLanguage;
  status: SubmissionStatus;
  runtime: number | null;
  memory: number | null;
  createdAt: Date;
  results?: SubmissionResult[];
}
