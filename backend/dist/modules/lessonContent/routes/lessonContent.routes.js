/**
 * Routes cho module LessonContent
 */
import { Router } from 'express';
import lessonContentController from '../controllers/lessonContent.controller';
import { verifyToken, requireLectureOrAdmin } from '../../../middleware/auth.middleware';
const router = Router();
// All routes require authentication
router.use(verifyToken);
// Get lesson content
router.get('/:lessonId', lessonContentController.getByLessonId);
// Update lesson content (lecture only)
router.put('/:lessonId/content', requireLectureOrAdmin, lessonContentController.updateContent);
// Get scoring config
router.get('/:lessonId/scoring', lessonContentController.getScoringConfig);
// Update scoring config
router.put('/:lessonId/scoring', requireLectureOrAdmin, lessonContentController.updateScoringConfig);
export default router;
//# sourceMappingURL=lessonContent.routes.js.map