"use strict";
/**
 * @fileoverview Routes configuration cho module Enrollment
 * Định nghĩa các HTTP endpoints liên quan đến enrollment
 * @module enrollment/routes
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const enrollment_controller_1 = __importDefault(require("../controllers/enrollment.controller"));
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const router = (0, express_1.Router)();
/**
 * POST /api/enrollments
 * Đăng ký một khóa học mới
 * Yêu cầu: Token xác thực hợp lệ
 * Body: { courseId: string, coachId?: string }
 */
router.post('/', auth_middleware_1.verifyToken, (req, res, next) => enrollment_controller_1.default.enroll(req, res, next));
/**
 * GET /api/enrollments/my
 * Lấy danh sách tất cả enrollment của user hiện tại
 * Yêu cầu: Token xác thực hợp lệ
 */
router.get('/my', auth_middleware_1.verifyToken, (req, res, next) => enrollment_controller_1.default.getMyEnrollments(req, res, next));
/**
 * GET /api/enrollments
 * Lấy danh sách tất cả enrollment của user hiện tại
 * Yêu cầu: Token xác thực hợp lệ
 */
router.get('/', auth_middleware_1.verifyToken, (req, res, next) => enrollment_controller_1.default.getMyEnrollments(req, res, next));
/**
 * GET /enrollment/:courseId
 * Lấy thông tin một enrollment cụ thể theo courseId
 * Yêu cầu: Token xác thực hợp lệ
 * Params: courseId - ID của khóa học
 */
router.get('/:courseId', auth_middleware_1.verifyToken, (req, res, next) => enrollment_controller_1.default.getEnrollment(req, res, next));
/**
 * PUT /enrollment/:enrollmentId/progress
 * Cập nhật tiến độ học tập của một enrollment
 * Yêu cầu: Token xác thực hợp lệ
 * Params: enrollmentId - ID của enrollment
 * Body: { progress: number }
 */
router.put('/:enrollmentId/progress', auth_middleware_1.verifyToken, (req, res, next) => enrollment_controller_1.default.updateProgress(req, res, next));
/**
 * DELETE /enrollment/:courseId
 * Hủy đăng ký khóa học
 * Yêu cầu: Token xác thực hợp lệ
 * Params: courseId - ID của khóa học cần hủy
 */
router.delete('/:courseId', auth_middleware_1.verifyToken, (req, res, next) => enrollment_controller_1.default.unenroll(req, res, next));
exports.default = router;
//# sourceMappingURL=enrollment.routes.js.map