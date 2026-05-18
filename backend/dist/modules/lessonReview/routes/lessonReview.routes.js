/**
 * Routes cho module LessonReview
 */
import { Router } from 'express';
import lessonReviewController from '../controllers/lessonReview.controller';
import { verifyToken, requireAdmin } from '../../../middleware/auth.middleware';
const router = Router();
// All routes require authentication and admin role
router.use(verifyToken);
router.use(requireAdmin);
// Get pending reviews
router.get('/pending', lessonReviewController.getPendingReviews);
// Get all reviews
router.get('/', lessonReviewController.getAllReviews);
// Get review details for a lesson
router.get('/:lessonId', lessonReviewController.getReviewDetails);
// Approve a lesson
router.put('/:lessonId/approve', lessonReviewController.approve);
// Reject a lesson
router.put('/:lessonId/reject', lessonReviewController.reject);
// Publish a lesson
router.put('/:lessonId/publish', lessonReviewController.publish);
// Batch approve lessons
router.put('/batch/approve', lessonReviewController.batchApprove);
// Batch publish lessons
router.put('/batch/publish', lessonReviewController.batchPublish);
export default router;
//# sourceMappingURL=lessonReview.routes.js.map