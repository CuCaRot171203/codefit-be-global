/**
 * Type definitions for Problem module
 * @description Defines all TypeScript types and interfaces used across problem-related controllers, services, and repositories.
 */

/**
 * Difficulty levels for problems
 * @description Represents the complexity level of a programming problem.
 */
export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * Problem entity interface
 * @description Represents a programming problem in the system with its core attributes.
 */
export interface Problem {
  /** Unique identifier for the problem */
  id: string;
  /** Title or name of the problem */
  title: string;
  /** Detailed description of the problem including requirements */
  description: string;
  /** Difficulty level (easy, medium, or hard) */
  difficulty: Difficulty;
  /** Maximum allowed execution time in milliseconds */
  timeLimit: number;
  /** Maximum allowed memory usage in megabytes */
  memoryLimit: number;
  /** Timestamp when the problem was created */
  createdAt: Date;
}

/**
 * Data Transfer Object for creating a new problem
 * @description Validates and transfers data when creating a new problem.
 */
export interface CreateProblemDto {
  /** Title or name of the problem (required) */
  title: string;
  /** Detailed description of the problem (required) */
  description: string;
  /** Difficulty level (defaults to 'easy' if not provided) */
  difficulty: Difficulty;
  /** Maximum allowed execution time in milliseconds (defaults to 1000ms) */
  timeLimit?: number;
  /** Maximum allowed memory usage in megabytes (defaults to 256MB) */
  memoryLimit?: number;
}

/**
 * Data Transfer Object for updating an existing problem
 * @description Validates and transfers partial data when updating a problem.
 */
export interface UpdateProblemDto {
  /** Updated title or name of the problem */
  title?: string;
  /** Updated description of the problem */
  description?: string;
  /** Updated difficulty level */
  difficulty?: Difficulty;
  /** Updated maximum execution time in milliseconds */
  timeLimit?: number;
  /** Updated maximum memory usage in megabytes */
  memoryLimit?: number;
}

/**
 * Testcase entity interface
 * @description Represents a test case used to validate problem solutions.
 */
export interface Testcase {
  /** Unique identifier for the test case */
  id: string;
  /** Reference to the parent problem ID */
  problemId: string;
  /** Input data for the test case */
  input: string;
  /** Expected output for the test case */
  expectedOutput: string;
  /** Whether the test case is publicly visible to users */
  isPublic: boolean;
}

/**
 * Data Transfer Object for creating a new test case
 * @description Validates and transfers data when creating a new test case.
 */
export interface CreateTestcaseDto {
  /** Reference to the parent problem ID */
  problemId: string;
  /** Input data for the test case */
  input: string;
  /** Expected output for the test case */
  expectedOutput: string;
  /** Whether the test case is publicly visible (defaults to false) */
  isPublic?: boolean;
}

/**
 * Data Transfer Object for updating an existing test case
 * @description Validates and transfers partial data when updating a test case.
 */
export interface UpdateTestcaseDto {
  /** Updated input data for the test case */
  input?: string;
  /** Updated expected output for the test case */
  expectedOutput?: string;
  /** Updated visibility status */
  isPublic?: boolean;
}
