"use strict";
/**
 * Stats Routes
 *
 * Định nghĩa các API routes cho Stats module.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stats_controller_1 = __importDefault(require("../controllers/stats.controller"));
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const router = (0, express_1.Router)();
/** GET /api/stats/me - Lấy thống kê của người dùng hiện tại (yêu cầu auth) */
router.get('/me', auth_middleware_1.verifyToken, (req, res, next) => stats_controller_1.default.getMyStats(req, res, next));
/** GET /api/stats/course/:courseId - Lấy thống kê theo khóa học */
router.get('/course/:courseId', (req, res, next) => stats_controller_1.default.getCourseStats(req, res, next));
/** GET /api/stats/platform - Lấy thống kê tổng quan nền tảng */
router.get('/platform', (req, res, next) => stats_controller_1.default.getPlatformStats(req, res, next));
/** GET /api/stats/weekly-comparison - Lấy so sánh progress theo tuần (yêu cầu auth) */
router.get('/weekly-comparison', auth_middleware_1.verifyToken, (req, res, next) => stats_controller_1.default.getWeeklyComparison(req, res, next));
/** GET /api/stats/score-breakdown - Lấy chi tiết điểm theo khóa học */
router.get('/score-breakdown', auth_middleware_1.verifyToken, (req, res, next) => stats_controller_1.default.getScoreBreakdown(req, res, next));
/** GET /api/stats/login-days - Lấy số ngày login và streak */
router.get('/login-days', auth_middleware_1.verifyToken, (req, res, next) => stats_controller_1.default.getLoginDays(req, res, next));
/** GET /api/stats/weekly-activity - Lấy hoạt động hàng tuần */
router.get('/weekly-activity', auth_middleware_1.verifyToken, (req, res, next) => stats_controller_1.default.getWeeklyActivity(req, res, next));
/** GET /api/stats/global-rank - Lấy thứ hạng toàn cục */
router.get('/global-rank', auth_middleware_1.verifyToken, (req, res, next) => stats_controller_1.default.getGlobalRank(req, res, next));
/** GET /api/stats/global-leaderboard - Lấy bảng xếp hạng toàn cục */
router.get('/global-leaderboard', (req, res, next) => stats_controller_1.default.getGlobalLeaderboard(req, res, next));
/** GET /api/stats/enrolled-courses - Lấy khóa học đã đăng ký kèm tiến độ */
router.get('/enrolled-courses', auth_middleware_1.verifyToken, (req, res, next) => stats_controller_1.default.getEnrolledCourses(req, res, next));
/** GET /api/stats/evaluation - Lấy đánh giá 5 tiêu chí */
router.get('/evaluation', auth_middleware_1.verifyToken, (req, res, next) => stats_controller_1.default.getEvaluation(req, res, next));
exports.default = router;
//# sourceMappingURL=stats.routes.js.map