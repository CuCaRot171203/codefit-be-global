/**
 * @file Định nghĩa các routes cho module Course.
 * Cấu hình các HTTP endpoints liên quan đến Course và ánh xạ đến controller tương ứng.
 * Sử dụng Express Router để nhóm các routes liên quan.
 * @module course/routes
 */
import { Router } from 'express';
import courseController from '../controllers/course.controller';
import { verifyToken } from '../../../middleware/auth.middleware';
const router = Router();
/**
 * GET /courses
 * Lấy danh sách tất cả khóa học.
 * Không yêu cầu xác thực.
 *
 * @route GET /courses
 * @controller CourseController.getAll
 */
router.get('/', (req, res, next) => courseController.getAll(req, res, next));
/**
 * GET /courses/:id
 * Lấy thông tin một khóa học theo ID.
 * Không yêu cầu xác thực.
 *
 * @route GET /courses/:id
 * @param {string} id.params - ID của khóa học cần lấy
 * @controller CourseController.getById
 */
router.get('/:id', (req, res, next) => courseController.getById(req, res, next));
/**
 * POST /courses
 * Tạo mới một khóa học.
 * Yêu cầu: User đã xác thực (token hợp lệ).
 *
 * @route POST /courses
 * @middleware verifyToken - Middleware xác thực JWT token
 * @controller CourseController.create
 */
router.post('/', verifyToken, (req, res, next) => courseController.create(req, res, next));
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
router.put('/:id', verifyToken, (req, res, next) => courseController.update(req, res, next));
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
router.delete('/:id', verifyToken, (req, res, next) => courseController.delete(req, res, next));
/**
 * GET /courses/my/creator
 * Lấy danh sách khóa học của creator đang đăng nhập.
 * Yêu cầu: User đã xác thực (token hợp lệ).
 *
 * @route GET /courses/my/creator
 * @middleware verifyToken - Middleware xác thực JWT token
 * @controller CourseController.getByCreator
 */
router.get('/my/creator', verifyToken, (req, res, next) => courseController.getByCreator(req, res, next));
export default router;
//# sourceMappingURL=course.routes.js.map