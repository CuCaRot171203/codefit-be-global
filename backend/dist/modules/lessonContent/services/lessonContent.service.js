/**
 * Service layer cho module LessonContent
 */
import { BaseService } from '../../../base/base.service';
import lessonContentRepository from '../repositories/lessonContent.repository';
import prisma from '../../../prisma';
class LessonContentService extends BaseService {
    constructor() {
        super(lessonContentRepository.lessonContent);
    }
    async getByLessonId(lessonId, userId) {
        const content = await this.repository.findByLessonIdWithDetails(lessonId, userId);
        if (!content) {
            throw new Error('Lesson content not found');
        }
        return content;
    }
    async updateContent(lessonId, dto) {
        // Verify lesson exists
        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            include: { lessonRequest: true },
        });
        if (!lesson) {
            throw new Error('Lesson not found');
        }
        // Check if lecture owns this lesson request
        if (lesson.lessonRequest && lesson.lessonRequest.lectureId) {
            // Only allow update if lesson is in DRAFT or PENDING_REVIEW state
            if (lesson.status === 'PUBLISHED') {
                throw new Error('Cannot update published lesson');
            }
        }
        const updateData = {};
        if (dto.content !== undefined)
            updateData.content = dto.content;
        if (dto.testCases !== undefined)
            updateData.testCases = JSON.stringify(dto.testCases);
        if (dto.hints !== undefined)
            updateData.hints = JSON.stringify(dto.hints);
        if (dto.timeLimit !== undefined)
            updateData.timeLimit = dto.timeLimit;
        if (dto.memoryLimit !== undefined)
            updateData.memoryLimit = dto.memoryLimit;
        if (dto.starterCode !== undefined)
            updateData.starterCode = dto.starterCode;
        return this.repository.upsert(lessonId, updateData);
    }
    async updateScoringConfig(lessonId, dto) {
        return lessonContentRepository.scoringConfig.upsert(lessonId, dto);
    }
    // Alias methods for consistency with controller
    async updateLessonContent(lessonId, dto) {
        // Parse JSON strings if needed
        const parsedDto = { ...dto };
        if (dto.testCases && typeof dto.testCases === 'string') {
            parsedDto.testCases = JSON.parse(dto.testCases);
        }
        if (dto.hints && typeof dto.hints === 'string') {
            parsedDto.hints = JSON.parse(dto.hints);
        }
        return this.updateContent(lessonId, parsedDto);
    }
    async updateScoring(lessonId, dto) {
        return this.updateScoringConfig(lessonId, dto);
    }
    async getScoringConfig(lessonId) {
        const config = await lessonContentRepository.scoringConfig.findByLessonId(lessonId);
        if (!config) {
            // Return default config
            return {
                lessonId,
                baseScore: 100,
                penaltyPerHint: 10,
                timeBonusEnabled: false,
                timeBonusThreshold: null,
                timeBonusValue: null,
            };
        }
        return config;
    }
}
export default new LessonContentService();
//# sourceMappingURL=lessonContent.service.js.map