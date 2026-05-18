/**
 * @fileoverview User Routes Configuration
 * @description Định nghĩa các route liên quan đến user profile và authentication.
 */

import { Router } from 'express';
import userController from '../controllers/user.controller';
import { verifyToken } from '../../../middleware/auth.middleware';

const router = Router();

// Áp dụng middleware xác thực cho tất cả các route trong module
router.use(verifyToken);

/**
 * @route GET /profile
 * @description Lấy thông tin hồ sơ người dùng hiện tại
 * @access Private (yêu cầu đăng nhập)
 */
router.get('/profile', (req, res, next) => userController.getProfile(req, res, next));

/**
 * @route PUT /profile
 * @description Cập nhật thông tin hồ sơ người dùng
 * @access Private (yêu cầu đăng nhập)
 */
router.put('/profile', (req, res, next) => userController.updateProfile(req, res, next));

/**
 * @route POST /change-password
 * @description Thay đổi mật khẩu người dùng
 * @access Private (yêu cầu đăng nhập)
 */
router.post('/change-password', (req, res, next) => userController.changePassword(req, res, next));

export default router;
