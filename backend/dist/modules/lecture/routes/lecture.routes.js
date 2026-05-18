/**
 * Lecture Routes
 *
 * Định nghĩa các API routes cho Lecture module.
 * Tất cả các routes đều yêu cầu xác thực với role = 'lecture'
 */
import { Router } from 'express';
import lectureController from '../controllers/lecture.controller';
import lectureSubmissionController from '../controllers/lectureSubmission.controller';
import { verifyToken, requireLectureOrAdmin } from '../../../middleware/auth.middleware';
const router = Router();
// Áp dụng middleware xác thực cho tất cả routes
router.use(verifyToken);
/**
 * GET /api/lecture/dashboard
 * Lấy thống kê dashboard cho giảng viên
 * Yêu cầu: User đã xác thực với role = 'lecture' hoặc 'admin'
 */
router.get('/dashboard', requireLectureOrAdmin, (req, res, next) => {
    lectureController.getDashboard(req, res, next);
});
/**
 * GET /api/lecture/courses
 * Lấy danh sách khóa học của giảng viên
 * Yêu cầu: User đã xác thực với role = 'lecture' hoặc 'admin'
 */
router.get('/courses', requireLectureOrAdmin, (req, res, next) => {
    lectureController.getMyCourses(req, res, next);
});
/**
 * GET /api/lecture/courses/:courseId
 * Lấy chi tiết một khóa học của giảng viên
 * Yêu cầu: User đã xác thực với role = 'lecture' hoặc 'admin'
 */
router.get('/courses/:courseId', requireLectureOrAdmin, (req, res, next) => {
    lectureController.getCourseDetail(req, res, next);
});
/**
 * GET /api/lecture/minitests
 * Lấy danh sách minitests trong các khóa học của giảng viên
 * Yêu cầu: User đã xác thực với role = 'lecture' hoặc 'admin'
 */
router.get('/minitests', requireLectureOrAdmin, (req, res, next) => {
    lectureController.getMyMinitests(req, res, next);
});
/**
 * GET /api/lecture/hackathons
 * Lấy danh sách hackathons trong các khóa học của giảng viên
 * Yêu cầu: User đã xác thực với role = 'lecture' hoặc 'admin'
 */
router.get('/hackathons', requireLectureOrAdmin, (req, res, next) => {
    lectureController.getMyHackathons(req, res, next);
});
/**
 * GET /api/lecture/submissions
 * Lấy danh sách bài nộp của học viên trong khóa học của giảng viên
 */
router.get('/submissions', requireLectureOrAdmin, (req, res, next) => {
    lectureSubmissionController.getSubmissions(req, res, next);
});
/**
 * POST /api/lecture/submissions/:id/approve
 * Duyệt một bài nộp
 */
router.post('/submissions/:id/approve', requireLectureOrAdmin, (req, res, next) => {
    lectureSubmissionController.approveSubmission(req, res, next);
});
/**
 * POST /api/lecture/submissions/:id/reject
 * Từ chối một bài nộp
 */
router.post('/submissions/:id/reject', requireLectureOrAdmin, (req, res, next) => {
    lectureSubmissionController.rejectSubmission(req, res, next);
});
/**
 * POST /api/lecture/submissions/bulk-approve
 * Duyệt nhiều bài nộp và gửi email
 */
router.post('/submissions/bulk-approve', requireLectureOrAdmin, (req, res, next) => {
    lectureSubmissionController.bulkApprove(req, res, next);
});
/**
 * POST /api/lecture/phases
 * Tạo chương mới cho khóa học (lecture phải được assign vào khóa học)
 */
router.post('/phases', requireLectureOrAdmin, (req, res, next) => {
    lectureController.createPhase(req, res, next);
});
/**
 * POST /api/lecture/lessons
 * Tạo bài học mới trong chương (lecture phải được assign vào khóa học của chương đó)
 */
router.post('/lessons', requireLectureOrAdmin, (req, res, next) => {
    lectureController.createLesson(req, res, next);
});
/**
 * GET /api/lecture/lesson-content/:lessonId
 * Lấy nội dung bài học để chỉnh sửa
 */
router.get('/lesson-content/:lessonId', requireLectureOrAdmin, (req, res, next) => {
    lectureController.getLessonContent(req, res, next);
});
/**
 * PUT /api/lecture/lesson-content/:lessonId/content
 * Cập nhật nội dung bài học
 */
router.put('/lesson-content/:lessonId/content', requireLectureOrAdmin, (req, res, next) => {
    lectureController.updateLessonContent(req, res, next);
});
/**
 * PUT /api/lecture/lesson-content/:lessonId/scoring
 * Cập nhật cấu hình chấm điểm
 */
router.put('/lesson-content/:lessonId/scoring', requireLectureOrAdmin, (req, res, next) => {
    lectureController.updateLessonScoring(req, res, next);
});
/**
 * PUT /api/lecture/lessons/:lessonId/submit
 * Nộp bài học để admin duyệt
 */
router.put('/lessons/:lessonId/submit', requireLectureOrAdmin, (req, res, next) => {
    lectureController.submitLesson(req, res, next);
});
export default router;
//# sourceMappingURL=lecture.routes.js.map