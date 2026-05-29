"use strict";
/**
 * Routes cho module LessonContent
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lessonContent_controller_1 = __importDefault(require("../controllers/lessonContent.controller"));
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_middleware_1.verifyToken);
// Get lesson content
router.get('/:lessonId', lessonContent_controller_1.default.getByLessonId);
// Update lesson content (lecture only)
router.put('/:lessonId/content', auth_middleware_1.requireLectureOrAdmin, lessonContent_controller_1.default.updateContent);
// Get scoring config
router.get('/:lessonId/scoring', lessonContent_controller_1.default.getScoringConfig);
// Update scoring config
router.put('/:lessonId/scoring', auth_middleware_1.requireLectureOrAdmin, lessonContent_controller_1.default.updateScoringConfig);
exports.default = router;
//# sourceMappingURL=lessonContent.routes.js.map