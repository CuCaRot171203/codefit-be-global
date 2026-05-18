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

/** GET /api/feedback/:targetId/:targetType - Lấy feedback theo target */
router.get('/:targetId/:targetType', (req, res, next) => feedbackController.getByTarget(req, res, next));

/** GET /api/feedback/:targetId/:targetType/rating - Lấy rating trung bình của target */
router.get('/:targetId/:targetType/rating', (req, res, next) => feedbackController.getAverageRating(req, res, next));

/** PUT /api/feedback/:id - Cập nhật feedback (yêu cầu auth) */
router.put('/:id', verifyToken, (req, res, next) => feedbackController.update(req, res, next));

/** DELETE /api/feedback/:id - Xóa feedback (yêu cầu auth) */
router.delete('/:id', verifyToken, (req, res, next) => feedbackController.delete(req, res, next));

export default router;
