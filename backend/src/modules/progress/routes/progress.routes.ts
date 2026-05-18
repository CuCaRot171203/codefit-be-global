/**
 * @fileoverview Routes configuration cho module Progress
 * Định nghĩa các API endpoints liên quan đến tiến độ học tập
 * @module progress/routes
 */

import { Router } from 'express';
import progressController from '../controllers/progress.controller';
import { verifyToken } from '../../../middleware/auth.middleware';

const router = Router();

/**
 * Middleware xác thực token được áp dụng cho tất cả các routes trong module
 * Tất cả các request đến progress routes đều phải qua verifyToken middleware
 */
router.use(verifyToken);

/**
 * GET /:courseId
 * Lấy tiến độ học tập của user trong một khóa học
 * @param courseId - ID của khóa học cần lấy progress
 */
router.get('/:courseId', (req, res, next) => progressController.getProgress(req, res, next));

/**
 * PUT /:courseId
 * Cập nhật tiến độ học tập của user trong một khóa học
 * @param courseId - ID của khóa học cần cập nhật progress
 * @body completedLessons - Số bài đã hoàn thành
 * @body totalLessons - Tổng số bài học
 */
router.put('/:courseId', (req, res, next) => progressController.updateProgress(req, res, next));

export default router;
