/**
 * Service layer cho module LessonContent
 */
import { BaseService } from '../../../base/base.service';
import lessonContentRepository from '../repositories/lessonContent.repository';
declare class LessonContentService extends BaseService<typeof lessonContentRepository.lessonContent> {
    constructor();
    getByLessonId(lessonId: string, userId?: string): Promise<any>;
    updateContent(lessonId: string, dto: {
        content?: string;
        testCases?: any[];
        hints?: any[];
        timeLimit?: number;
        memoryLimit?: number;
        starterCode?: string;
    }): Promise<any>;
    updateScoringConfig(lessonId: string, dto: {
        baseScore?: number;
        penaltyPerHint?: number;
        timeBonusEnabled?: boolean;
        timeBonusThreshold?: number;
        timeBonusValue?: number;
    }): Promise<any>;
    updateLessonContent(lessonId: string, dto: {
        content?: string;
        testCases?: string;
        hints?: string;
        timeLimit?: number;
        memoryLimit?: number;
        starterCode?: string;
    }): Promise<any>;
    updateScoring(lessonId: string, dto: {
        baseScore?: number;
        penaltyPerHint?: number;
        timeBonusEnabled?: boolean;
        timeBonusThreshold?: number;
        timeBonusValue?: number;
    }): Promise<any>;
    getScoringConfig(lessonId: string): Promise<any>;
}
declare const _default: LessonContentService;
export default _default;
//# sourceMappingURL=lessonContent.service.d.ts.map