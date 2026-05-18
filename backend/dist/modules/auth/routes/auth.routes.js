import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { verifyToken } from '../../../middleware/auth.middleware';
/**
 * Auth Router - Định nghĩa các routes cho authentication
 * Base path: /api/auth
 */
const router = Router();
/**
 * POST /api/auth/register
 * Đăng ký tài khoản mới
 */
router.post('/register', (req, res, next) => authController.register(req, res, next));
/**
 * POST /api/auth/login
 * Đăng nhập và nhận JWT token
 */
router.post('/login', (req, res, next) => authController.login(req, res, next));
/**
 * GET /api/auth/me
 * Lấy thông tin user hiện tại
 * Cần có valid JWT token
 */
router.get('/me', verifyToken, (req, res, next) => authController.getMe(req, res, next));
export default router;
//# sourceMappingURL=auth.routes.js.map