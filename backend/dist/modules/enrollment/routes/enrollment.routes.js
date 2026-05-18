/**
 * @fileoverview Routes configuration cho module Enrollment
 * Định nghĩa các HTTP endpoints liên quan đến enrollment
 * @module enrollment/routes
 */
import { Router } from 'express';
import enrollmentController from '../controllers/enrollment.controller';
import { verifyToken } from '../../../middleware/auth.middleware';
const router = Router();
/**
 * POST /api/enrollments
 * Đăng ký một khóa học mới
 * Yêu cầu: Token xác thực hợp lệ
 * Body: { courseId: string, coachId?: string }
 */
router.post('/', verifyToken, (req, res, next) => enrollmentController.enroll(req, res, next));
/**
 * GET /api/enrollments/my
 * Lấy danh sách tất cả enrollment của user hiện tại
 * Yêu cầu: Token xác thực hợp lệ
 */
router.get('/my', verifyToken, (req, res, next) => enrollmentController.getMyEnrollments(req, res, next));
/**
 * GET /api/enrollments
 * Lấy danh sách tất cả enrollment của user hiện tại
 * Yêu cầu: Token xác thực hợp lệ
 */
router.get('/', verifyToken, (req, res, next) => enrollmentController.getMyEnrollments(req, res, next));
/**
 * GET /enrollment/:courseId
 * Lấy thông tin một enrollment cụ thể theo courseId
 * Yêu cầu: Token xác thực hợp lệ
 * Params: courseId - ID của khóa học
 */
router.get('/:courseId', verifyToken, (req, res, next) => enrollmentController.getEnrollment(req, res, next));
/**
 * PUT /enrollment/:enrollmentId/progress
 * Cập nhật tiến độ học tập của một enrollment
 * Yêu cầu: Token xác thực hợp lệ
 * Params: enrollmentId - ID của enrollment
 * Body: { progress: number }
 */
router.put('/:enrollmentId/progress', verifyToken, (req, res, next) => enrollmentController.updateProgress(req, res, next));
/**
 * DELETE /enrollment/:courseId
 * Hủy đăng ký khóa học
 * Yêu cầu: Token xác thực hợp lệ
 * Params: courseId - ID của khóa học cần hủy
 */
router.delete('/:courseId', verifyToken, (req, res, next) => enrollmentController.unenroll(req, res, next));
export default router;
//# sourceMappingURL=enrollment.routes.js.map