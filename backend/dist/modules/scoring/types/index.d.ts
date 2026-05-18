/**
 * Types cho module Scoring
 */
export interface ScoreCalculationResult {
    baseScore: number;
    hintPenalty: number;
    testCasePenalty: number;
    timeBonus: number;
    finalScore: number;
    passedTests: number;
    totalTests: number;
    hintsUsed: number;
    timeUsed: number | null;
    details: {
        testResults: TestResultDetail[];
        hintDetails: HintDetail[];
    };
    isNoTestCase?: boolean;
}
export interface TestResultDetail {
    testId: string;
    passed: boolean;
    input: string;
    expectedOutput: string;
    actualOutput?: string;
    points: number;
    earnedPoints: number;
}
export interface HintDetail {
    hintId: string;
    content: string;
    penalty: number;
    used: boolean;
}
export interface TestCase {
    id?: string;
    input: string;
    expectedOutput: string;
    isPublic: boolean;
    points: number;
    description?: string;
}
export interface Hint {
    id?: string;
    content: string;
    order: number;
    penalty: number;
}
export interface ScoringConfig {
    baseScore: number;
    penaltyPerHint: number;
    timeBonusEnabled: boolean;
    timeBonusThreshold: number | null;
    timeBonusValue: number | null;
}
//# sourceMappingURL=index.d.ts.map