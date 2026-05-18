/**
 * Types cho module LessonContent
 */
export interface LessonContent {
    id: string;
    lessonId: string;
    content: string | null;
    testCases: string | null;
    hints: string | null;
    timeLimit: number | null;
    memoryLimit: number | null;
    starterCode: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface UpdateLessonContentDto {
    content?: string;
    testCases?: TestCase[];
    hints?: Hint[];
    timeLimit?: number;
    memoryLimit?: number;
    starterCode?: string;
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
    id: string;
    lessonId: string;
    baseScore: number;
    penaltyPerHint: number;
    timeBonusEnabled: boolean;
    timeBonusThreshold: number | null;
    timeBonusValue: number | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface UpdateScoringConfigDto {
    baseScore?: number;
    penaltyPerHint?: number;
    timeBonusEnabled?: boolean;
    timeBonusThreshold?: number;
    timeBonusValue?: number;
}
export interface LessonContentWithDetails extends LessonContent {
    lesson: {
        id: string;
        title: string;
        type: string;
        phase: {
            id: string;
            title: string;
            course: {
                id: string;
                title: string;
            };
        };
    };
    scoringConfig?: ScoringConfig;
}
//# sourceMappingURL=index.d.ts.map