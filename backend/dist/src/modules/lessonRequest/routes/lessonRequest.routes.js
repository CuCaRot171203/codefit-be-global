"use strict";
/**
 * Routes cho module LessonRequest
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lessonRequest_controller_1 = __importDefault(require("../controllers/lessonRequest.controller"));
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Admin routes
router.post('/', auth_middleware_1.verifyToken, auth_middleware_1.requireAdmin, lessonRequest_controller_1.default.create);
router.get('/', auth_middleware_1.verifyToken, auth_middleware_1.requireAdmin, lessonRequest_controller_1.default.getAll);
router.get('/:id', auth_middleware_1.verifyToken, auth_middleware_1.requireAdmin, lessonRequest_controller_1.default.getById);
router.put('/:id', auth_middleware_1.verifyToken, auth_middleware_1.requireAdmin, lessonRequest_controller_1.default.update);
router.delete('/:id', auth_middleware_1.verifyToken, auth_middleware_1.requireAdmin, lessonRequest_controller_1.default.delete);
// Lecture routes
router.get('/lecture/my-requests', auth_middleware_1.verifyToken, lessonRequest_controller_1.default.getMyRequests);
router.get('/lecture/pending', auth_middleware_1.verifyToken, lessonRequest_controller_1.default.getPendingForMe);
router.put('/:id/start', auth_middleware_1.verifyToken, lessonRequest_controller_1.default.startWorking);
router.put('/:id/submit', auth_middleware_1.verifyToken, lessonRequest_controller_1.default.submitForReview);
router.put('/:id/cancel', auth_middleware_1.verifyToken, lessonRequest_controller_1.default.cancel);
exports.default = router;
//# sourceMappingURL=lessonRequest.routes.js.map