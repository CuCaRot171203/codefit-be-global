/**
 * Course Access Routes - Enhanced
 */

import { Router } from 'express';
import courseAccessController from './courseAccess.controller';
import { verifyToken, requireAdmin } from '../../middleware/auth.middleware';

const router = Router();

/**
 * Tạo access code
 * POST /api/course-access/:courseId/codes
 */
router.post('/:courseId/codes', verifyToken, requireAdmin, (req, res, next) => {
  courseAccessController.createCode(req, res, next);
});

/**
 * Tạo nhiều access codes
 * POST /api/course-access/:courseId/codes/bulk
 */
router.post('/:courseId/codes/bulk', verifyToken, requireAdmin, (req, res, next) => {
  courseAccessController.createBulkCodes(req, res, next);
});

/**
 * Gán quyền cho user bằng email
 * POST /api/course-access/:courseId/grant
 */
router.post('/:courseId/grant', verifyToken, requireAdmin, (req, res, next) => {
  courseAccessController.grantAccess(req, res, next);
});

/**
 * Gán quyền cho nhiều users
 * POST /api/course-access/:courseId/assign-users
 */
router.post('/:courseId/assign-users', verifyToken, requireAdmin, (req, res, next) => {
  courseAccessController.assignToUsers(req, res, next);
});

/**
 * Lấy danh sách users chưa enroll
 * GET /api/course-access/:courseId/users/not-enrolled
 */
router.get('/:courseId/users/not-enrolled', verifyToken, requireAdmin, (req, res, next) => {
  courseAccessController.getUsersNotEnrolled(req, res, next);
});

/**
 * Kích hoạt khóa học bằng code (user đã login)
 * POST /api/course-access/activate
 */
router.post('/activate', verifyToken, (req, res, next) => {
  courseAccessController.activateByCode(req, res, next);
});

/**
 * Validate code (không cần đăng nhập - cho email link)
 * GET /api/course-access/activate/:code
 */
router.get('/activate/:code', (req, res, next) => {
  courseAccessController.validateCodeLink(req, res, next);
});

/**
 * Lấy danh sách codes
 * GET /api/course-access/:courseId/codes
 */
router.get('/:courseId/codes', verifyToken, requireAdmin, (req, res, next) => {
  courseAccessController.getCodes(req, res, next);
});

/**
 * Xóa access code
 * DELETE /api/course-access/codes/:codeId
 */
router.delete('/codes/:codeId', verifyToken, requireAdmin, (req, res, next) => {
  courseAccessController.deleteCode(req, res, next);
});

/**
 * Lấy danh sách enrollments (users đã đăng ký)
 * GET /api/course-access/:courseId/enrollments
 */
router.get('/:courseId/enrollments', verifyToken, requireAdmin, (req, res, next) => {
  courseAccessController.getEnrollments(req, res, next);
});

/**
 * Cập nhật số bài mở khóa cho user
 * PUT /api/course-access/:courseId/enrollments/:userId/unlock
 */
router.put('/:courseId/enrollments/:userId/unlock', verifyToken, requireAdmin, (req, res, next) => {
  courseAccessController.updateUserUnlocks(req, res, next);
});

/**
 * Mở khóa toàn bộ bài học cho user
 * POST /api/course-access/:courseId/enrollments/:userId/unlock-all
 */
router.post('/:courseId/enrollments/:userId/unlock-all', verifyToken, requireAdmin, (req, res, next) => {
  courseAccessController.unlockAllLessons(req, res, next);
});

export default router;
