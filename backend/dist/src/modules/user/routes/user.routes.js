"use strict";
/**
 * @fileoverview User Routes Configuration
 * @description Định nghĩa các route liên quan đến user profile và authentication.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Áp dụng middleware xác thực cho tất cả các route trong module
router.use(auth_middleware_1.verifyToken);
/**
 * @route GET /profile
 * @description Lấy thông tin hồ sơ người dùng hiện tại
 * @access Private (yêu cầu đăng nhập)
 */
router.get('/profile', (req, res, next) => user_controller_1.default.getProfile(req, res, next));
/**
 * @route PUT /profile
 * @description Cập nhật thông tin hồ sơ người dùng
 * @access Private (yêu cầu đăng nhập)
 */
router.put('/profile', (req, res, next) => user_controller_1.default.updateProfile(req, res, next));
/**
 * @route POST /change-password
 * @description Thay đổi mật khẩu người dùng
 * @access Private (yêu cầu đăng nhập)
 */
router.post('/change-password', (req, res, next) => user_controller_1.default.changePassword(req, res, next));
exports.default = router;
//# sourceMappingURL=user.routes.js.map