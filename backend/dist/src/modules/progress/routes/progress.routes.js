"use strict";
/**
 * @fileoverview Routes configuration cho module Progress
 * Định nghĩa các API endpoints liên quan đến tiến độ học tập
 * @module progress/routes
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const progress_controller_1 = __importDefault(require("../controllers/progress.controller"));
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const router = (0, express_1.Router)();
/**
 * Middleware xác thực token được áp dụng cho tất cả các routes trong module
 * Tất cả các request đến progress routes đều phải qua verifyToken middleware
 */
router.use(auth_middleware_1.verifyToken);
/**
 * GET /:courseId
 * Lấy tiến độ học tập của user trong một khóa học
 * @param courseId - ID của khóa học cần lấy progress
 */
router.get('/:courseId', (req, res, next) => progress_controller_1.default.getProgress(req, res, next));
/**
 * PUT /:courseId
 * Cập nhật tiến độ học tập của user trong một khóa học
 * @param courseId - ID của khóa học cần cập nhật progress
 * @body completedLessons - Số bài đã hoàn thành
 * @body totalLessons - Tổng số bài học
 */
router.put('/:courseId', (req, res, next) => progress_controller_1.default.updateProgress(req, res, next));
exports.default = router;
//# sourceMappingURL=progress.routes.js.map