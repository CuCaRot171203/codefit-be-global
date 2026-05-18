/**
 * Project Routes
 * 
 * Định nghĩa các API routes cho Project module.
 */

import { Router } from 'express';
import projectController from '../controllers/project.controller';
import { verifyToken } from '../../../middleware/auth.middleware';

const router = Router();

/** POST /api/projects - Tạo mới một dự án (yêu cầu auth) */
router.post('/', verifyToken, (req, res, next) => projectController.create(req, res, next));

/** POST /api/projects/submit - Nộp dự án (yêu cầu auth) */
router.post('/submit', verifyToken, (req, res, next) => projectController.submitProject(req, res, next));

/** GET /api/projects/my - Lấy dự án của người dùng hiện tại (yêu cầu auth) */
router.get('/my', verifyToken, (req, res, next) => projectController.getMyProjects(req, res, next));

/** GET /api/projects/course/:courseId - Lấy dự án theo khóa học */
router.get('/course/:courseId', (req, res, next) => projectController.getCourseProjects(req, res, next));

/** GET /api/projects/:id - Lấy dự án theo ID */
router.get('/:id', (req, res, next) => projectController.getById(req, res, next));

/** PUT /api/projects/:id - Cập nhật dự án (yêu cầu auth) */
router.put('/:id', verifyToken, (req, res, next) => projectController.update(req, res, next));

/** DELETE /api/projects/:id - Xóa dự án (yêu cầu auth) */
router.delete('/:id', verifyToken, (req, res, next) => projectController.delete(req, res, next));

export default router;
