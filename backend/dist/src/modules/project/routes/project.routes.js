"use strict";
/**
 * Project Routes
 *
 * Định nghĩa các API routes cho Project module.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_controller_1 = __importDefault(require("../controllers/project.controller"));
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const router = (0, express_1.Router)();
/** POST /api/projects - Tạo mới một dự án (yêu cầu auth) */
router.post('/', auth_middleware_1.verifyToken, (req, res, next) => project_controller_1.default.create(req, res, next));
/** POST /api/projects/submit - Nộp dự án (yêu cầu auth) */
router.post('/submit', auth_middleware_1.verifyToken, (req, res, next) => project_controller_1.default.submitProject(req, res, next));
/** GET /api/projects/my - Lấy dự án của người dùng hiện tại (yêu cầu auth) */
router.get('/my', auth_middleware_1.verifyToken, (req, res, next) => project_controller_1.default.getMyProjects(req, res, next));
/** GET /api/projects/course/:courseId - Lấy dự án theo khóa học */
router.get('/course/:courseId', (req, res, next) => project_controller_1.default.getCourseProjects(req, res, next));
/** GET /api/projects/:id - Lấy dự án theo ID */
router.get('/:id', (req, res, next) => project_controller_1.default.getById(req, res, next));
/** PUT /api/projects/:id - Cập nhật dự án (yêu cầu auth) */
router.put('/:id', auth_middleware_1.verifyToken, (req, res, next) => project_controller_1.default.update(req, res, next));
/** DELETE /api/projects/:id - Xóa dự án (yêu cầu auth) */
router.delete('/:id', auth_middleware_1.verifyToken, (req, res, next) => project_controller_1.default.delete(req, res, next));
exports.default = router;
//# sourceMappingURL=project.routes.js.map