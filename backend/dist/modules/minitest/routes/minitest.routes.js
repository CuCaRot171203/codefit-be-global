/**
 * Minitest Routes
 *
 * Định nghĩa các API routes cho Minitest module.
 */
import { Router } from 'express';
import minitestController from '../controllers/minitest.controller';
import { verifyToken } from '../../../middleware/auth.middleware';
const router = Router();
/** POST /api/minitests - Tạo mới một bài minitest */
router.post('/', (req, res, next) => minitestController.create(req, res, next));
/** GET /api/minitests/:id - Lấy bài minitest theo ID */
router.get('/:id', (req, res, next) => minitestController.getById(req, res, next));
/** GET /api/minitests/course/:courseId - Lấy các bài minitest theo khóa học */
router.get('/course/:courseId', (req, res, next) => minitestController.getByCourseId(req, res, next));
/** POST /api/minitests/:id/submit - Nộp bài minitest (yêu cầu auth) */
router.post('/:id/submit', verifyToken, (req, res, next) => minitestController.submit(req, res, next));
/** GET /api/minitests/:id/result - Lấy kết quả bài test của user cho một minitest cụ thể (yêu cầu auth) */
router.get('/:id/result', verifyToken, (req, res, next) => minitestController.getResult(req, res, next));
/** GET /api/minitests/my/results - Lấy kết quả bài test của người dùng (yêu cầu auth) */
router.get('/my/results', verifyToken, (req, res, next) => minitestController.getMyResults(req, res, next));
export default router;
//# sourceMappingURL=minitest.routes.js.map