"use strict";
/**
 * Testcase Routes
 *
 * Định nghĩa các API routes cho Testcase module.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const testcase_controller_1 = __importDefault(require("../controllers/testcase.controller"));
const router = (0, express_1.Router)();
/** POST /api/testcases - Tạo mới một testcase */
router.post('/', (req, res, next) => testcase_controller_1.default.create(req, res, next));
/** GET /api/testcases/problem/:problemId - Lấy tất cả testcase của bài toán */
router.get('/problem/:problemId', (req, res, next) => testcase_controller_1.default.getByProblemId(req, res, next));
/** GET /api/testcases/problem/:problemId/public - Lấy testcase công khai của bài toán */
router.get('/problem/:problemId/public', (req, res, next) => testcase_controller_1.default.getPublicByProblemId(req, res, next));
/** GET /api/testcases/:id - Lấy một testcase theo ID */
router.get('/:id', (req, res, next) => testcase_controller_1.default.getById(req, res, next));
/** PUT /api/testcases/:id - Cập nhật một testcase */
router.put('/:id', (req, res, next) => testcase_controller_1.default.update(req, res, next));
/** DELETE /api/testcases/:id - Xóa một testcase */
router.delete('/:id', (req, res, next) => testcase_controller_1.default.delete(req, res, next));
exports.default = router;
//# sourceMappingURL=testcase.routes.js.map