/**
 * Feedback Routes
 *
 * Định nghĩa các API routes cho Feedback module.
 */

import { Router } from 'express';
import feedbackController from '../controllers/feedback.controller';
import { verifyToken } from '../../../middleware/auth.middleware';

const router = Router();

/** POST /api/feedback - Tạo mới feedback (yêu cầu auth) */
router.post('/', verifyToken, (req, res, next) => feedbackController.create(req, res, next));

/** GET /api/feedback - Lấy tất cả feedback */
router.get('/', (req, res, next) => feedbackController.getAll(req, res, next));

/** DELETE /api/feedback/:id - Xóa feedback (yêu cầu auth) */
router.delete('/:id', verifyToken, (req, res, next) => feedbackController.delete(req, res, next));

export default router;
