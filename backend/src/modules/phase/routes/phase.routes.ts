/**
 * Phase Routes
 * 
 * Định nghĩa các API routes cho Phase module.
 */

import { Router } from 'express';
import phaseController from '../controllers/phase.controller';

const router = Router();

/** POST /api/phases - Tạo mới một phase */
router.post('/', (req, res, next) => phaseController.create(req, res, next));

/** GET /api/phases/course/:courseId - Lấy các phase của một khóa học */
router.get('/course/:courseId', (req, res, next) => phaseController.getByCourseId(req, res, next));

/** GET /api/phases/:id - Lấy một phase theo ID */
router.get('/:id', (req, res, next) => phaseController.getById(req, res, next));

/** PUT /api/phases/:id - Cập nhật một phase */
router.put('/:id', (req, res, next) => phaseController.update(req, res, next));

/** DELETE /api/phases/:id - Xóa một phase */
router.delete('/:id', (req, res, next) => phaseController.delete(req, res, next));

export default router;
