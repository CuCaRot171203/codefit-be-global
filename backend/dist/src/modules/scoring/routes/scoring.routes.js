"use strict";
/**
 * Routes cho module Scoring
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const scoring_controller_1 = __importDefault(require("../controllers/scoring.controller"));
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_middleware_1.verifyToken);
// Run code against test cases (preview, no save)
router.post('/run', scoring_controller_1.default.run);
// Submit code for scoring (saves submission)
router.post('/submit', scoring_controller_1.default.submit);
// Get my submissions for a lesson
router.get('/submissions/:lessonId', scoring_controller_1.default.getMySubmissions);
// Get submission details
router.get('/submission/:submissionId', scoring_controller_1.default.getSubmissionDetails);
exports.default = router;
//# sourceMappingURL=scoring.routes.js.map