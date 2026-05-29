"use strict";
/**
 * LessonProgress Routes
 *
 * Định nghĩa các API routes cho tiến độ bài học.
 * Tất cả các routes đều yêu cầu authentication.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lessonProgress_controller_1 = __importDefault(require("../controllers/lessonProgress.controller"));
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const router = (0, express_1.Router)();
/** Áp dụng verifyToken middleware cho tất cả routes trong module này */
router.use(auth_middleware_1.verifyToken);
/** GET /api/lesson-progress/lesson/:lessonId - Lấy tiến độ của một bài học */
router.get('/lesson/:lessonId', (req, res, next) => lessonProgress_controller_1.default.getLessonProgress(req, res, next));
/** GET /api/lesson-progress/course/:courseId - Lấy tất cả tiến độ trong một khóa học */
router.get('/course/:courseId', (req, res, next) => lessonProgress_controller_1.default.getCourseProgress(req, res, next));
/** POST /api/lesson-progress/complete - Đánh dấu bài học hoàn thành */
router.post('/complete', (req, res, next) => lessonProgress_controller_1.default.markComplete(req, res, next));
/** PUT /api/lesson-progress/lesson/:lessonId/incomplete - Đánh dấu bài học chưa hoàn thành */
router.put('/lesson/:lessonId/incomplete', (req, res, next) => lessonProgress_controller_1.default.markIncomplete(req, res, next));
exports.default = router;
//# sourceMappingURL=lessonProgress.routes.js.map