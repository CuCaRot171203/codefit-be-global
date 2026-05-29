"use strict";
/**
 * Controller layer cho module LessonContent
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_controller_1 = require("../../../base/base.controller");
const lessonContent_service_1 = __importDefault(require("../services/lessonContent.service"));
class LessonContentController extends base_controller_1.BaseController {
    constructor() {
        super(lessonContent_service_1.default);
    }
    // Get lesson content by lessonId
    getByLessonId = async (req, res, next) => {
        try {
            const { lessonId } = req.params;
            const userId = req.user?.userId;
            const content = await this.service.getByLessonId(lessonId, userId);
            return this.success(res, content, 'Fetched lesson content');
        }
        catch (error) {
            return this.error(res, error.message, 404);
        }
    };
    // Update lesson content
    updateContent = async (req, res, next) => {
        try {
            const { lessonId } = req.params;
            const { content, testCases, hints, timeLimit, memoryLimit, starterCode } = req.body;
            const updated = await this.service.updateContent(lessonId, {
                content,
                testCases,
                hints,
                timeLimit,
                memoryLimit,
                starterCode,
            });
            return this.success(res, updated, 'Lesson content updated successfully');
        }
        catch (error) {
            return this.error(res, error.message, 400);
        }
    };
    // Get scoring config
    getScoringConfig = async (req, res, next) => {
        try {
            const { lessonId } = req.params;
            const config = await this.service.getScoringConfig(lessonId);
            return this.success(res, config, 'Fetched scoring config');
        }
        catch (error) {
            return this.error(res, error.message, 404);
        }
    };
    // Update scoring config
    updateScoringConfig = async (req, res, next) => {
        try {
            const { lessonId } = req.params;
            const { baseScore, penaltyPerHint, timeBonusEnabled, timeBonusThreshold, timeBonusValue } = req.body;
            const updated = await this.service.updateScoringConfig(lessonId, {
                baseScore,
                penaltyPerHint,
                timeBonusEnabled,
                timeBonusThreshold,
                timeBonusValue,
            });
            return this.success(res, updated, 'Scoring config updated successfully');
        }
        catch (error) {
            return this.error(res, error.message, 400);
        }
    };
}
exports.default = new LessonContentController();
//# sourceMappingURL=lessonContent.controller.js.map