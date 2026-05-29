"use strict";
/**
 * Feedback Routes
 *
 * Định nghĩa các API routes cho Feedback module.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const feedback_controller_1 = __importDefault(require("../controllers/feedback.controller"));
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const router = (0, express_1.Router)();
/** POST /api/feedback - Tạo mới feedback (yêu cầu auth) */
router.post('/', auth_middleware_1.verifyToken, (req, res, next) => feedback_controller_1.default.create(req, res, next));
/** GET /api/feedback/:targetId/:targetType - Lấy feedback theo target */
router.get('/:targetId/:targetType', (req, res, next) => feedback_controller_1.default.getByTarget(req, res, next));
/** GET /api/feedback/:targetId/:targetType/rating - Lấy rating trung bình của target */
router.get('/:targetId/:targetType/rating', (req, res, next) => feedback_controller_1.default.getAverageRating(req, res, next));
/** PUT /api/feedback/:id - Cập nhật feedback (yêu cầu auth) */
router.put('/:id', auth_middleware_1.verifyToken, (req, res, next) => feedback_controller_1.default.update(req, res, next));
/** DELETE /api/feedback/:id - Xóa feedback (yêu cầu auth) */
router.delete('/:id', auth_middleware_1.verifyToken, (req, res, next) => feedback_controller_1.default.delete(req, res, next));
exports.default = router;
//# sourceMappingURL=feedback.routes.js.map