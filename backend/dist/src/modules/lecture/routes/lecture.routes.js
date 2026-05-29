"use strict";
/**
 * Lecture Routes
 *
 * Định nghĩa các API routes cho Lecture module.
 * Tất cả các routes đều yêu cầu xác thực với role = 'lecture'
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lecture_controller_1 = __importDefault(require("../controllers/lecture.controller"));
const lectureSubmission_controller_1 = __importDefault(require("../controllers/lectureSubmission.controller"));
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Áp dụng middleware xác thực cho tất cả routes
router.use(auth_middleware_1.verifyToken);
/**
 * GET /api/lecture/dashboard
 * Lấy thống kê dashboard cho giảng viên
 * Yêu cầu: User đã xác thực với role = 'lecture' hoặc 'admin'
 */
router.get('/dashboard', auth_middleware_1.requireLectureOrAdmin, (req, res, next) => {
    lecture_controller_1.default.getDashboard(req, res, next);
});
/**
 * GET /api/lecture/courses
 * Lấy danh sách khóa học của giảng viên
 * Yêu cầu: User đã xác thực với role = 'lecture' hoặc 'admin'
 */
router.get('/courses', auth_middleware_1.requireLectureOrAdmin, (req, res, next) => {
    lecture_controller_1.default.getMyCourses(req, res, next);
});
/**
 * GET /api/lecture/courses/:courseId
 * Lấy chi tiết một khóa học của giảng viên
 * Yêu cầu: User đã xác thực với role = 'lecture' hoặc 'admin'
 */
router.get('/courses/:courseId', auth_middleware_1.requireLectureOrAdmin, (req, res, next) => {
    lecture_controller_1.default.getCourseDetail(req, res, next);
});
/**
 * GET /api/lecture/minitests
 * Lấy danh sách minitests trong các khóa học của giảng viên
 * Yêu cầu: User đã xác thực với role = 'lecture' hoặc 'admin'
 */
router.get('/minitests', auth_middleware_1.requireLectureOrAdmin, (req, res, next) => {
    lecture_controller_1.default.getMyMinitests(req, res, next);
});
/**
 * GET /api/lecture/hackathons
 * Lấy danh sách hackathons trong các khóa học của giảng viên
 * Yêu cầu: User đã xác thực với role = 'lecture' hoặc 'admin'
 */
router.get('/hackathons', auth_middleware_1.requireLectureOrAdmin, (req, res, next) => {
    lecture_controller_1.default.getMyHackathons(req, res, next);
});
/**
 * GET /api/lecture/submissions
 * Lấy danh sách bài nộp của học viên trong khóa học của giảng viên
 */
router.get('/submissions', auth_middleware_1.requireLectureOrAdmin, (req, res, next) => {
    lectureSubmission_controller_1.default.getSubmissions(req, res, next);
});
/**
 * POST /api/lecture/submissions/:id/approve
 * Duyệt một bài nộp
 */
router.post('/submissions/:id/approve', auth_middleware_1.requireLectureOrAdmin, (req, res, next) => {
    lectureSubmission_controller_1.default.approveSubmission(req, res, next);
});
/**
 * POST /api/lecture/submissions/:id/reject
 * Từ chối một bài nộp
 */
router.post('/submissions/:id/reject', auth_middleware_1.requireLectureOrAdmin, (req, res, next) => {
    lectureSubmission_controller_1.default.rejectSubmission(req, res, next);
});
/**
 * POST /api/lecture/submissions/bulk-approve
 * Duyệt nhiều bài nộp và gửi email
 */
router.post('/submissions/bulk-approve', auth_middleware_1.requireLectureOrAdmin, (req, res, next) => {
    lectureSubmission_controller_1.default.bulkApprove(req, res, next);
});
/**
 * POST /api/lecture/phases
 * Tạo chương mới cho khóa học (lecture phải được assign vào khóa học)
 */
router.post('/phases', auth_middleware_1.requireLectureOrAdmin, (req, res, next) => {
    lecture_controller_1.default.createPhase(req, res, next);
});
/**
 * POST /api/lecture/lessons
 * Tạo bài học mới trong chương (lecture phải được assign vào khóa học của chương đó)
 */
router.post('/lessons', auth_middleware_1.requireLectureOrAdmin, (req, res, next) => {
    lecture_controller_1.default.createLesson(req, res, next);
});
/**
 * GET /api/lecture/lesson-content/:lessonId
 * Lấy nội dung bài học để chỉnh sửa
 */
router.get('/lesson-content/:lessonId', auth_middleware_1.requireLectureOrAdmin, (req, res, next) => {
    lecture_controller_1.default.getLessonContent(req, res, next);
});
/**
 * PUT /api/lecture/lesson-content/:lessonId/content
 * Cập nhật nội dung bài học
 */
router.put('/lesson-content/:lessonId/content', auth_middleware_1.requireLectureOrAdmin, (req, res, next) => {
    lecture_controller_1.default.updateLessonContent(req, res, next);
});
/**
 * PUT /api/lecture/lesson-content/:lessonId/scoring
 * Cập nhật cấu hình chấm điểm
 */
router.put('/lesson-content/:lessonId/scoring', auth_middleware_1.requireLectureOrAdmin, (req, res, next) => {
    lecture_controller_1.default.updateLessonScoring(req, res, next);
});
/**
 * PUT /api/lecture/lessons/:lessonId/submit
 * Nộp bài học để admin duyệt
 */
router.put('/lessons/:lessonId/submit', auth_middleware_1.requireLectureOrAdmin, (req, res, next) => {
    lecture_controller_1.default.submitLesson(req, res, next);
});
exports.default = router;
//# sourceMappingURL=lecture.routes.js.map