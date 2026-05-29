"use strict";
/**
 * Course Access Routes - Enhanced
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const courseAccess_controller_1 = __importDefault(require("./courseAccess.controller"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
/**
 * Tạo access code
 * POST /api/course-access/:courseId/codes
 */
router.post('/:courseId/codes', auth_middleware_1.verifyToken, auth_middleware_1.requireAdmin, (req, res, next) => {
    courseAccess_controller_1.default.createCode(req, res, next);
});
/**
 * Tạo nhiều access codes
 * POST /api/course-access/:courseId/codes/bulk
 */
router.post('/:courseId/codes/bulk', auth_middleware_1.verifyToken, auth_middleware_1.requireAdmin, (req, res, next) => {
    courseAccess_controller_1.default.createBulkCodes(req, res, next);
});
/**
 * Gán quyền cho user bằng email
 * POST /api/course-access/:courseId/grant
 */
router.post('/:courseId/grant', auth_middleware_1.verifyToken, auth_middleware_1.requireAdmin, (req, res, next) => {
    courseAccess_controller_1.default.grantAccess(req, res, next);
});
/**
 * Gán quyền cho nhiều users
 * POST /api/course-access/:courseId/assign-users
 */
router.post('/:courseId/assign-users', auth_middleware_1.verifyToken, auth_middleware_1.requireAdmin, (req, res, next) => {
    courseAccess_controller_1.default.assignToUsers(req, res, next);
});
/**
 * Lấy danh sách users chưa enroll
 * GET /api/course-access/:courseId/users/not-enrolled
 */
router.get('/:courseId/users/not-enrolled', auth_middleware_1.verifyToken, auth_middleware_1.requireAdmin, (req, res, next) => {
    courseAccess_controller_1.default.getUsersNotEnrolled(req, res, next);
});
/**
 * Kích hoạt khóa học bằng code (user đã login)
 * POST /api/course-access/activate
 */
router.post('/activate', auth_middleware_1.verifyToken, (req, res, next) => {
    courseAccess_controller_1.default.activateByCode(req, res, next);
});
/**
 * Validate code (không cần đăng nhập - cho email link)
 * GET /api/course-access/activate/:code
 */
router.get('/activate/:code', (req, res, next) => {
    courseAccess_controller_1.default.validateCodeLink(req, res, next);
});
/**
 * Lấy danh sách codes
 * GET /api/course-access/:courseId/codes
 */
router.get('/:courseId/codes', auth_middleware_1.verifyToken, auth_middleware_1.requireAdmin, (req, res, next) => {
    courseAccess_controller_1.default.getCodes(req, res, next);
});
/**
 * Xóa access code
 * DELETE /api/course-access/codes/:codeId
 */
router.delete('/codes/:codeId', auth_middleware_1.verifyToken, auth_middleware_1.requireAdmin, (req, res, next) => {
    courseAccess_controller_1.default.deleteCode(req, res, next);
});
/**
 * Lấy danh sách enrollments (users đã đăng ký)
 * GET /api/course-access/:courseId/enrollments
 */
router.get('/:courseId/enrollments', auth_middleware_1.verifyToken, auth_middleware_1.requireAdmin, (req, res, next) => {
    courseAccess_controller_1.default.getEnrollments(req, res, next);
});
/**
 * Cập nhật số bài mở khóa cho user
 * PUT /api/course-access/:courseId/enrollments/:userId/unlock
 */
router.put('/:courseId/enrollments/:userId/unlock', auth_middleware_1.verifyToken, auth_middleware_1.requireAdmin, (req, res, next) => {
    courseAccess_controller_1.default.updateUserUnlocks(req, res, next);
});
/**
 * Mở khóa toàn bộ bài học cho user
 * POST /api/course-access/:courseId/enrollments/:userId/unlock-all
 */
router.post('/:courseId/enrollments/:userId/unlock-all', auth_middleware_1.verifyToken, auth_middleware_1.requireAdmin, (req, res, next) => {
    courseAccess_controller_1.default.unlockAllLessons(req, res, next);
});
exports.default = router;
//# sourceMappingURL=courseAccess.routes.js.map