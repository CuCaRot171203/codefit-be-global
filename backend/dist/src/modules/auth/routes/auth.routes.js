"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_middleware_1 = require("../../../middleware/auth.middleware");
/**
 * Auth Router - Định nghĩa các routes cho authentication
 * Base path: /api/auth
 */
const router = (0, express_1.Router)();
/**
 * POST /api/auth/register
 * Đăng ký tài khoản mới
 */
router.post('/register', (req, res, next) => auth_controller_1.default.register(req, res, next));
/**
 * POST /api/auth/login
 * Đăng nhập và nhận JWT token
 */
router.post('/login', (req, res, next) => auth_controller_1.default.login(req, res, next));
/**
 * GET /api/auth/me
 * Lấy thông tin user hiện tại
 * Cần có valid JWT token
 */
router.get('/me', auth_middleware_1.verifyToken, (req, res, next) => auth_controller_1.default.getMe(req, res, next));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map