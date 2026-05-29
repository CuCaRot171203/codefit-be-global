/**
 * Repository layer cho module LessonContent
 */
import { BaseRepository } from '../../../base/base.repository';
import { LessonContent, ScoringConfig } from '../types';
declare class LessonContentRepository extends BaseRepository<LessonContent> {
    protected model: import(".prisma/client").Prisma.LessonContentDelegate<import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findByLessonId(lessonId: string): Promise<LessonContent | null>;
    findByLessonIdWithDetails(lessonId: string, userId?: string): Promise<any>;
    upsert(lessonId: string, data: {
        content?: string;
        testCases?: string;
        hints?: string;
        timeLimit?: number;
        memoryLimit?: number;
        starterCode?: string;
    }): Promise<LessonContent>;
}
declare class ScoringConfigRepository extends BaseRepository<ScoringConfig> {
    protected model: import(".prisma/client").Prisma.ScoringConfigDelegate<import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findByLessonId(lessonId: string): Promise<ScoringConfig | null>;
    upsert(lessonId: string, data: {
        baseScore?: number;
        penaltyPerHint?: number;
        timeBonusEnabled?: boolean;
        timeBonusThreshold?: number;
        timeBonusValue?: number;
    }): Promise<ScoringConfig>;
}
declare const _default: {
    lessonContent: LessonContentRepository;
    scoringConfig: ScoringConfigRepository;
};
export default _default;
//# sourceMappingURL=lessonContent.repository.d.ts.map