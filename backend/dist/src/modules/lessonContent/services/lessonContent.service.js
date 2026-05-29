"use strict";
/**
 * Service layer cho module LessonContent
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_service_1 = require("../../../base/base.service");
const lessonContent_repository_1 = __importDefault(require("../repositories/lessonContent.repository"));
const prisma_1 = __importDefault(require("../../../prisma"));
class LessonContentService extends base_service_1.BaseService {
    constructor() {
        super(lessonContent_repository_1.default.lessonContent);
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
        const lesson = await prisma_1.default.lesson.findUnique({
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
        return lessonContent_repository_1.default.scoringConfig.upsert(lessonId, dto);
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
        const config = await lessonContent_repository_1.default.scoringConfig.findByLessonId(lessonId);
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
exports.default = new LessonContentService();
//# sourceMappingURL=lessonContent.service.js.map