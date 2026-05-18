/**
 * LessonProgress Routes
 *
 * Định nghĩa các API routes cho tiến độ bài học.
 * Tất cả các routes đều yêu cầu authentication.
 */
import { Router } from 'express';
import lessonProgressController from '../controllers/lessonProgress.controller';
import { verifyToken } from '../../../middleware/auth.middleware';
const router = Router();
/** Áp dụng verifyToken middleware cho tất cả routes trong module này */
router.use(verifyToken);
/** GET /api/lesson-progress/lesson/:lessonId - Lấy tiến độ của một bài học */
router.get('/lesson/:lessonId', (req, res, next) => lessonProgressController.getLessonProgress(req, res, next));
/** GET /api/lesson-progress/course/:courseId - Lấy tất cả tiến độ trong một khóa học */
router.get('/course/:courseId', (req, res, next) => lessonProgressController.getCourseProgress(req, res, next));
/** POST /api/lesson-progress/complete - Đánh dấu bài học hoàn thành */
router.post('/complete', (req, res, next) => lessonProgressController.markComplete(req, res, next));
/** PUT /api/lesson-progress/lesson/:lessonId/incomplete - Đánh dấu bài học chưa hoàn thành */
router.put('/lesson/:lessonId/incomplete', (req, res, next) => lessonProgressController.markIncomplete(req, res, next));
export default router;
//# sourceMappingURL=lessonProgress.routes.js.map