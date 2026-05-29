"use strict";
/**
 * Controller layer cho module Scoring
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_controller_1 = require("../../../base/base.controller");
const scoring_service_1 = __importDefault(require("../services/scoring.service"));
class ScoringController extends base_controller_1.BaseController {
    constructor() {
        super(scoring_service_1.default);
    }
    // Run code against test cases (preview, no save)
    run = async (req, res, next) => {
        try {
            const { lessonId, code, language } = req.body;
            const userId = req.user?.userId;
            if (!userId) {
                return this.error(res, 'User not authenticated', 401);
            }
            if (!lessonId || !code) {
                return this.error(res, 'lessonId and code are required', 400);
            }
            const results = await scoring_service_1.default.runCode(lessonId, code, language || 'javascript');
            return this.success(res, results, 'Code run completed');
        }
        catch (error) {
            return this.error(res, error.message, 400);
        }
    };
    // Submit and calculate score
    submit = async (req, res, next) => {
        try {
            const { lessonId, code, language, hintsUsed, timeUsed } = req.body;
            const userId = req.user?.userId;
            if (!userId) {
                return this.error(res, 'User not authenticated', 401);
            }
            if (!lessonId || !code) {
                return this.error(res, 'lessonId and code are required', 400);
            }
            const submission = await scoring_service_1.default.saveSubmission(lessonId, userId, code, language || 'javascript', hintsUsed || 0, timeUsed || null);
            return this.success(res, submission, 'Submission scored successfully');
        }
        catch (error) {
            return this.error(res, error.message, 400);
        }
    };
    // Get user submissions for a lesson
    getMySubmissions = async (req, res, next) => {
        try {
            const lessonId = req.params.lessonId;
            const userId = req.user?.userId;
            if (!userId) {
                return this.error(res, 'User not authenticated', 401);
            }
            const submissions = await scoring_service_1.default.getUserSubmissions(lessonId, userId);
            return this.success(res, submissions, 'Fetched submissions');
        }
        catch (error) {
            return this.error(res, error.message, 400);
        }
    };
    // Get submission details
    getSubmissionDetails = async (req, res, next) => {
        try {
            const submissionId = req.params.submissionId;
            const submission = await scoring_service_1.default.getSubmissionById(submissionId);
            if (!submission) {
                return this.error(res, 'Submission not found', 404);
            }
            return this.success(res, submission, 'Fetched submission details');
        }
        catch (error) {
            return this.error(res, error.message, 400);
        }
    };
}
exports.default = new ScoringController();
//# sourceMappingURL=scoring.controller.js.map