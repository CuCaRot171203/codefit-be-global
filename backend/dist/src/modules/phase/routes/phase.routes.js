"use strict";
/**
 * Phase Routes
 *
 * Định nghĩa các API routes cho Phase module.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const phase_controller_1 = __importDefault(require("../controllers/phase.controller"));
const router = (0, express_1.Router)();
/** POST /api/phases - Tạo mới một phase */
router.post('/', (req, res, next) => phase_controller_1.default.create(req, res, next));
/** GET /api/phases/course/:courseId - Lấy các phase của một khóa học */
router.get('/course/:courseId', (req, res, next) => phase_controller_1.default.getByCourseId(req, res, next));
/** GET /api/phases/:id - Lấy một phase theo ID */
router.get('/:id', (req, res, next) => phase_controller_1.default.getById(req, res, next));
/** PUT /api/phases/:id - Cập nhật một phase */
router.put('/:id', (req, res, next) => phase_controller_1.default.update(req, res, next));
/** DELETE /api/phases/:id - Xóa một phase */
router.delete('/:id', (req, res, next) => phase_controller_1.default.delete(req, res, next));
exports.default = router;
//# sourceMappingURL=phase.routes.js.map