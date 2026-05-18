/**
 * Routes cho module LessonRequest
 */
import { Router } from 'express';
import lessonRequestController from '../controllers/lessonRequest.controller';
import { verifyToken, requireAdmin } from '../../../middleware/auth.middleware';
const router = Router();
// Admin routes
router.post('/', verifyToken, requireAdmin, lessonRequestController.create);
router.get('/', verifyToken, requireAdmin, lessonRequestController.getAll);
router.get('/:id', verifyToken, requireAdmin, lessonRequestController.getById);
router.put('/:id', verifyToken, requireAdmin, lessonRequestController.update);
router.delete('/:id', verifyToken, requireAdmin, lessonRequestController.delete);
// Lecture routes
router.get('/lecture/my-requests', verifyToken, lessonRequestController.getMyRequests);
router.get('/lecture/pending', verifyToken, lessonRequestController.getPendingForMe);
router.put('/:id/start', verifyToken, lessonRequestController.startWorking);
router.put('/:id/submit', verifyToken, lessonRequestController.submitForReview);
router.put('/:id/cancel', verifyToken, lessonRequestController.cancel);
export default router;
//# sourceMappingURL=lessonRequest.routes.js.map