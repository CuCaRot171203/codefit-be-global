/**
 * Routes cho module Scoring
 */
import { Router } from 'express';
import scoringController from '../controllers/scoring.controller';
import { verifyToken } from '../../../middleware/auth.middleware';
const router = Router();
// All routes require authentication
router.use(verifyToken);
// Run code against test cases (preview, no save)
router.post('/run', scoringController.run);
// Submit code for scoring (saves submission)
router.post('/submit', scoringController.submit);
// Get my submissions for a lesson
router.get('/submissions/:lessonId', scoringController.getMySubmissions);
// Get submission details
router.get('/submission/:submissionId', scoringController.getSubmissionDetails);
export default router;
//# sourceMappingURL=scoring.routes.js.map