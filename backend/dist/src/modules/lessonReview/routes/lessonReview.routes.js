"use strict";
/**
 * Routes cho module LessonReview
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lessonReview_controller_1 = __importDefault(require("../controllers/lessonReview.controller"));
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const router = (0, express_1.Router)();
// All routes require authentication and admin role
router.use(auth_middleware_1.verifyToken);
router.use(auth_middleware_1.requireAdmin);
// Get pending reviews
router.get('/pending', lessonReview_controller_1.default.getPendingReviews);
// Get all reviews
router.get('/', lessonReview_controller_1.default.getAllReviews);
// Get review details for a lesson
router.get('/:lessonId', lessonReview_controller_1.default.getReviewDetails);
// Approve a lesson
router.put('/:lessonId/approve', lessonReview_controller_1.default.approve);
// Reject a lesson
router.put('/:lessonId/reject', lessonReview_controller_1.default.reject);
// Publish a lesson
router.put('/:lessonId/publish', lessonReview_controller_1.default.publish);
// Batch approve lessons
router.put('/batch/approve', lessonReview_controller_1.default.batchApprove);
// Batch publish lessons
router.put('/batch/publish', lessonReview_controller_1.default.batchPublish);
exports.default = router;
//# sourceMappingURL=lessonReview.routes.js.map