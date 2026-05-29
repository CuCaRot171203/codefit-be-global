"use strict";
/**
 * Certificate Routes
 *
 * Định nghĩa các API routes cho Certificate module.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const certificate_controller_1 = __importDefault(require("../controllers/certificate.controller"));
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const router = (0, express_1.Router)();
/** GET /api/certificates/my - Lấy chứng chỉ của người dùng hiện tại (yêu cầu auth) */
router.get('/my', auth_middleware_1.verifyToken, (req, res, next) => certificate_controller_1.default.getMyCertificates(req, res, next));
/** GET /api/certificates/course/:courseId - Lấy chứng chỉ theo khóa học (yêu cầu auth) */
router.get('/course/:courseId', auth_middleware_1.verifyToken, (req, res, next) => certificate_controller_1.default.getCertificate(req, res, next));
/** POST /api/certificates/generate - Sinh chứng chỉ khi hoàn thành khóa học (yêu cầu auth) */
router.post('/generate', auth_middleware_1.verifyToken, (req, res, next) => certificate_controller_1.default.generate(req, res, next));
/** GET /api/certificates/verify/:certificateId - Xác minh chứng chỉ (công khai) */
router.get('/verify/:certificateId', (req, res, next) => certificate_controller_1.default.verify(req, res, next));
exports.default = router;
//# sourceMappingURL=certificate.routes.js.map