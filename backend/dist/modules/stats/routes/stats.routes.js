/**
 * Stats Routes
 *
 * Định nghĩa các API routes cho Stats module.
 */
import { Router } from 'express';
import statsController from '../controllers/stats.controller';
import { verifyToken } from '../../../middleware/auth.middleware';
const router = Router();
/** GET /api/stats/me - Lấy thống kê của người dùng hiện tại (yêu cầu auth) */
router.get('/me', verifyToken, (req, res, next) => statsController.getMyStats(req, res, next));
/** GET /api/stats/course/:courseId - Lấy thống kê theo khóa học */
router.get('/course/:courseId', (req, res, next) => statsController.getCourseStats(req, res, next));
/** GET /api/stats/platform - Lấy thống kê tổng quan nền tảng */
router.get('/platform', (req, res, next) => statsController.getPlatformStats(req, res, next));
/** GET /api/stats/weekly-comparison - Lấy so sánh progress theo tuần (yêu cầu auth) */
router.get('/weekly-comparison', verifyToken, (req, res, next) => statsController.getWeeklyComparison(req, res, next));
/** GET /api/stats/score-breakdown - Lấy chi tiết điểm theo khóa học */
router.get('/score-breakdown', verifyToken, (req, res, next) => statsController.getScoreBreakdown(req, res, next));
/** GET /api/stats/login-days - Lấy số ngày login và streak */
router.get('/login-days', verifyToken, (req, res, next) => statsController.getLoginDays(req, res, next));
/** GET /api/stats/weekly-activity - Lấy hoạt động hàng tuần */
router.get('/weekly-activity', verifyToken, (req, res, next) => statsController.getWeeklyActivity(req, res, next));
/** GET /api/stats/global-rank - Lấy thứ hạng toàn cục */
router.get('/global-rank', verifyToken, (req, res, next) => statsController.getGlobalRank(req, res, next));
/** GET /api/stats/global-leaderboard - Lấy bảng xếp hạng toàn cục */
router.get('/global-leaderboard', (req, res, next) => statsController.getGlobalLeaderboard(req, res, next));
/** GET /api/stats/enrolled-courses - Lấy khóa học đã đăng ký kèm tiến độ */
router.get('/enrolled-courses', verifyToken, (req, res, next) => statsController.getEnrolledCourses(req, res, next));
/** GET /api/stats/evaluation - Lấy đánh giá 5 tiêu chí */
router.get('/evaluation', verifyToken, (req, res, next) => statsController.getEvaluation(req, res, next));
export default router;
//# sourceMappingURL=stats.routes.js.map