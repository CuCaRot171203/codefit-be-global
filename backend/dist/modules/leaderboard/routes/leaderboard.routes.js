/**
 * Leaderboard Routes
 *
 * Định nghĩa các API routes cho Leaderboard module.
 */
import { Router } from 'express';
import leaderboardController from '../controllers/leaderboard.controller';
import { verifyToken } from '../../../middleware/auth.middleware';
const router = Router();
/** GET /api/leaderboard - Lấy bảng xếp hạng toàn cục */
router.get('/', (req, res, next) => leaderboardController.getGlobal(req, res, next));
/** GET /api/leaderboard/course/:courseId - Lấy bảng xếp hạng theo khóa học */
router.get('/course/:courseId', (req, res, next) => leaderboardController.getCourseLeaderboard(req, res, next));
/** GET /api/leaderboard/my-rank - Lấy thứ hạng của người dùng hiện tại (yêu cầu auth) */
router.get('/my-rank', verifyToken, (req, res, next) => leaderboardController.getMyRank(req, res, next));
export default router;
//# sourceMappingURL=leaderboard.routes.js.map