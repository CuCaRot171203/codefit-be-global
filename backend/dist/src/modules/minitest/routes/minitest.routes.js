"use strict";
/**
 * Minitest Routes
 *
 * Định nghĩa các API routes cho Minitest module.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const minitest_controller_1 = __importDefault(require("../controllers/minitest.controller"));
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const router = (0, express_1.Router)();
/** POST /api/minitests - Tạo mới một bài minitest */
router.post('/', (req, res, next) => minitest_controller_1.default.create(req, res, next));
/** GET /api/minitests/:id - Lấy bài minitest theo ID */
router.get('/:id', (req, res, next) => minitest_controller_1.default.getById(req, res, next));
/** GET /api/minitests/course/:courseId - Lấy các bài minitest theo khóa học */
router.get('/course/:courseId', (req, res, next) => minitest_controller_1.default.getByCourseId(req, res, next));
/** POST /api/minitests/:id/submit - Nộp bài minitest (yêu cầu auth) */
router.post('/:id/submit', auth_middleware_1.verifyToken, (req, res, next) => minitest_controller_1.default.submit(req, res, next));
/** GET /api/minitests/:id/result - Lấy kết quả bài test của user cho một minitest cụ thể (yêu cầu auth) */
router.get('/:id/result', auth_middleware_1.verifyToken, (req, res, next) => minitest_controller_1.default.getResult(req, res, next));
/** GET /api/minitests/my/results - Lấy kết quả bài test của người dùng (yêu cầu auth) */
router.get('/my/results', auth_middleware_1.verifyToken, (req, res, next) => minitest_controller_1.default.getMyResults(req, res, next));
exports.default = router;
//# sourceMappingURL=minitest.routes.js.map