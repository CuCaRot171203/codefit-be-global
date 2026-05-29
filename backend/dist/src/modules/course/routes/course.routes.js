"use strict";
/**
 * @file Định nghĩa các routes cho module Course.
 * Cấu hình các HTTP endpoints liên quan đến Course và ánh xạ đến controller tương ứng.
 * Sử dụng Express Router để nhóm các routes liên quan.
 * @module course/routes
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const course_controller_1 = __importDefault(require("../controllers/course.controller"));
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const router = (0, express_1.Router)();
/**
 * GET /courses
 * Lấy danh sách tất cả khóa học.
 * Không yêu cầu xác thực.
 *
 * @route GET /courses
 * @controller CourseController.getAll
 */
router.get('/', (req, res, next) => course_controller_1.default.getAll(req, res, next));
/**
 * GET /courses/:id
 * Lấy thông tin một khóa học theo ID.
 * Không yêu cầu xác thực.
 *
 * @route GET /courses/:id
 * @param {string} id.params - ID của khóa học cần lấy
 * @controller CourseController.getById
 */
router.get('/:id', (req, res, next) => course_controller_1.default.getById(req, res, next));
/**
 * POST /courses
 * Tạo mới một khóa học.
 * Yêu cầu: User đã xác thực (token hợp lệ).
 *
 * @route POST /courses
 * @middleware verifyToken - Middleware xác thực JWT token
 * @controller CourseController.create
 */
router.post('/', auth_middleware_1.verifyToken, (req, res, next) => course_controller_1.default.create(req, res, next));
/**
 * PUT /courses/:id
 * Cập nhật thông tin một khóa học.
 * Yêu cầu: User đã xác thực (token hợp lệ).
 *
 * @route PUT /courses/:id
 * @param {string} id.params - ID của khóa học cần cập nhật
 * @middleware verifyToken - Middleware xác thực JWT token
 * @controller CourseController.update
 */
router.put('/:id', auth_middleware_1.verifyToken, (req, res, next) => course_controller_1.default.update(req, res, next));
/**
 * DELETE /courses/:id
 * Xóa một khóa học.
 * Yêu cầu: User đã xác thực (token hợp lệ).
 *
 * @route DELETE /courses/:id
 * @param {string} id.params - ID của khóa học cần xóa
 * @middleware verifyToken - Middleware xác thực JWT token
 * @controller CourseController.delete
 */
router.delete('/:id', auth_middleware_1.verifyToken, (req, res, next) => course_controller_1.default.delete(req, res, next));
/**
 * GET /courses/my/creator
 * Lấy danh sách khóa học của creator đang đăng nhập.
 * Yêu cầu: User đã xác thực (token hợp lệ).
 *
 * @route GET /courses/my/creator
 * @middleware verifyToken - Middleware xác thực JWT token
 * @controller CourseController.getByCreator
 */
router.get('/my/creator', auth_middleware_1.verifyToken, (req, res, next) => course_controller_1.default.getByCreator(req, res, next));
exports.default = router;
//# sourceMappingURL=course.routes.js.map