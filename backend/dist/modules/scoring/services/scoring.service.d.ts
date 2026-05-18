/**
 * Service layer cho module Scoring
 * Xử lý logic tính điểm cho bài nộp
 */
import { ScoreCalculationResult } from './types';
declare class ScoringService {
    /**
     * Chạy code để preview (không lưu)
     */
    runCode(lessonId: string, code: string, language: string): Promise<{
        passedTests: number;
        totalTests: number;
        publicPassedTests: number;
        publicTotalTests: number;
        hiddenPassedTests: number;
        hiddenTotalTests: number;
        allPassed: boolean;
        results: {
            testId: string;
            passed: boolean;
            actualOutput: string;
            input: string;
            expectedOutput: string;
            isPublic: boolean;
        }[];
    }>;
    /**
     * Tính điểm cho một bài nộp
     */
    calculateScore(lessonId: string, code: string, language: string, hintsUsed?: number, timeUsed?: number | null): Promise<{
        score: number;
        passedTests: number;
        totalTests: number;
        publicPassedTests: number;
        publicTotalTests: number;
        hiddenPassedTests: number;
        hiddenTotalTests: number;
        allPassed: boolean;
        result: ScoreCalculationResult;
    }>;
    /**
     * Chạy code against test cases
     * Hiện tại là simulation - cần tích hợp với Judge0/Code executor thực tế
     */
    private runCodeAgainstTestCases;
    /**
     * Simulate code execution
     * Sử dụng Function constructor để execute JavaScript
     * Tự động detect function name và call với input
     */
    private simulateExecution;
    /**
     * Parse function arguments handling nested parentheses, strings, arrays, objects
     */
    private parseArguments;
    /**
     * Parse a single argument value
     */
    private parseValue;
    /**
     * Format result for comparison
     */
    private formatResult;
    /**
     * Tính điểm cuối cùng
     */
    private computeScore;
    /**
     * Lưu kết quả submission
     */
    saveSubmission(lessonId: string, userId: string, code: string, language: string, hintsUsed: number, timeUsed: number | null): Promise<any>;
    /**
     * Lấy lịch sử submissions của user cho một lesson
     */
    getUserSubmissions(lessonId: string, userId: string): Promise<any[]>;
    /**
     * Lấy chi tiết một submission
     */
    getSubmissionById(submissionId: string): Promise<any | null>;
}
declare const _default: ScoringService;
export default _default;
//# sourceMappingURL=scoring.service.d.ts.map