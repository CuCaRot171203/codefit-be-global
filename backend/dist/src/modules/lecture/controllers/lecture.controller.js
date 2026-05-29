"use strict";
/**
 * Lecture Controller
 *
 * Xử lý các HTTP requests liên quan đến Lecture/Dashboard giảng viên.
 * Quản lý việc lấy dashboard, khóa học, minitests, hackathons.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_controller_1 = require("../../../base/base.controller");
const lecture_service_1 = __importDefault(require("../services/lecture.service"));
const phase_service_1 = __importDefault(require("../../phase/services/phase.service"));
const lesson_service_1 = __importDefault(require("../../lesson/services/lesson.service"));
const lessonContent_service_1 = __importDefault(require("../../lessonContent/services/lessonContent.service"));
const notification_service_1 = __importDefault(require("../../notification/services/notification.service"));
const prisma_1 = __importDefault(require("../../../prisma"));
/**
 * LectureController - HTTP layer cho Lecture operations
 * @class LectureController
 * @extends BaseController
 */
class LectureController extends base_controller_1.BaseController {
    constructor() {
        super(lecture_service_1.default);
    }
    /**
     * Lấy dashboard stats cho giảng viên
     * GET /api/lecture/dashboard
     * Yêu cầu: User đã xác thực với role = 'lecture'
     */
    getDashboard = async (req, res, next) => {
        try {
            const lectureId = req.user?.userId;
            if (!lectureId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            const stats = await lecture_service_1.default.getDashboardStats(lectureId);
            this.success(res, stats, 'Dashboard stats retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Lấy danh sách khóa học của giảng viên
     * GET /api/lecture/courses
     * Yêu cầu: User đã xác thực với role = 'lecture'
     */
    getMyCourses = async (req, res, next) => {
        try {
            const lectureId = req.user?.userId;
            if (!lectureId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            const courses = await lecture_service_1.default.getMyCourses(lectureId);
            this.success(res, courses, 'Courses retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Lấy chi tiết một khóa học của giảng viên
     * GET /api/lecture/courses/:courseId
     * Yêu cầu: User đã xác thực với role = 'lecture'
     */
    getCourseDetail = async (req, res, next) => {
        try {
            const lectureId = req.user?.userId;
            if (!lectureId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            const { courseId } = req.params;
            const course = await lecture_service_1.default.getCourseDetail(courseId, lectureId);
            this.success(res, course, 'Course detail retrieved successfully');
        }
        catch (error) {
            const status = error.message.includes('not found') ? 404 : 500;
            this.error(res, error.message, status);
        }
    };
    /**
     * Lấy danh sách minitests trong các khóa học của giảng viên
     * GET /api/lecture/minitests
     * Yêu cầu: User đã xác thực với role = 'lecture'
     */
    getMyMinitests = async (req, res, next) => {
        try {
            const lectureId = req.user?.userId;
            if (!lectureId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            const minitests = await lecture_service_1.default.getMyMinitests(lectureId);
            this.success(res, minitests, 'Minitests retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Lấy danh sách hackathons trong các khóa học của giảng viên
     * GET /api/lecture/hackathons
     * Yêu cầu: User đã xác thực với role = 'lecture'
     */
    getMyHackathons = async (req, res, next) => {
        try {
            const lectureId = req.user?.userId;
            if (!lectureId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            const hackathons = await lecture_service_1.default.getMyHackathons(lectureId);
            this.success(res, hackathons, 'Hackathons retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Tạo chương mới cho khóa học
     * POST /api/lecture/phases
     */
    createPhase = async (req, res, next) => {
        try {
            const lectureId = req.user?.userId;
            if (!lectureId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            const { courseId, title } = req.body;
            // Verify lecture is assigned to this course
            const lectureCourse = await prisma_1.default.lectureCourse.findFirst({
                where: { courseId, lectureId },
            });
            if (!lectureCourse) {
                this.error(res, 'Bạn không có quyền tạo chương cho khóa học này', 403);
                return;
            }
            const phase = await phase_service_1.default.createPhase({ courseId, title });
            this.success(res, phase, 'Chương đã được tạo', 201);
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Tạo bài học mới trong chương
     * POST /api/lecture/lessons
     */
    createLesson = async (req, res, next) => {
        try {
            const lectureId = req.user?.userId;
            if (!lectureId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            const { phaseId, title, type } = req.body;
            // Get phase and verify lecture has access to course
            const phase = await prisma_1.default.phase.findUnique({
                where: { id: phaseId },
                include: { course: true },
            });
            if (!phase) {
                this.error(res, 'Chương không tồn tại', 404);
                return;
            }
            // Verify lecture is assigned to this course
            const lectureCourse = await prisma_1.default.lectureCourse.findFirst({
                where: { courseId: phase.courseId, lectureId },
            });
            if (!lectureCourse) {
                this.error(res, 'Bạn không có quyền tạo bài học cho khóa học này', 403);
                return;
            }
            // Create lesson with DRAFT status
            const lesson = await lesson_service_1.default.createLesson({
                phaseId,
                title,
                type,
                status: 'DRAFT',
            });
            // Create lesson request record (status IN_PROGRESS means lecture is working on it)
            const lessonRequest = await prisma_1.default.lessonRequest.create({
                data: {
                    lectureId,
                    lessonId: lesson.id,
                    status: 'IN_PROGRESS',
                },
            });
            this.success(res, { ...lesson, lessonRequestId: lessonRequest.id }, 'Bài học đã được tạo', 201);
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Lấy nội dung bài học để chỉnh sửa
     * GET /api/lecture/lesson-content/:lessonId
     */
    getLessonContent = async (req, res, next) => {
        try {
            const lectureId = req.user?.userId;
            if (!lectureId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            const { lessonId } = req.params;
            // Get lesson and verify lecture has access
            const lesson = await prisma_1.default.lesson.findUnique({
                where: { id: lessonId },
                include: {
                    phase: {
                        include: { course: true },
                    },
                    lessonContent: true,
                    lessonRequest: true,
                },
            });
            if (!lesson) {
                this.error(res, 'Bài học không tồn tại', 404);
                return;
            }
            // Verify lecture is assigned to this course
            const lectureCourse = await prisma_1.default.lectureCourse.findFirst({
                where: { courseId: lesson.phase.courseId, lectureId },
            });
            if (!lectureCourse) {
                this.error(res, 'Bạn không có quyền chỉnh sửa bài học này', 403);
                return;
            }
            this.success(res, lesson, 'Lesson content retrieved');
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Cập nhật nội dung bài học
     * PUT /api/lecture/lesson-content/:lessonId/content
     */
    updateLessonContent = async (req, res, next) => {
        try {
            const lectureId = req.user?.userId;
            if (!lectureId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            const { lessonId } = req.params;
            const { content, testCases, hints, starterCode, timeLimit, memoryLimit } = req.body;
            // Verify lecture has access
            const lesson = await prisma_1.default.lesson.findUnique({
                where: { id: lessonId },
                include: {
                    phase: { include: { course: true } },
                    lessonRequest: true,
                },
            });
            if (!lesson) {
                this.error(res, 'Bài học không tồn tại', 404);
                return;
            }
            // Check if lesson is editable (DRAFT or IN_PROGRESS)
            if (lesson.status !== 'DRAFT' && lesson.status !== 'IN_PROGRESS') {
                this.error(res, 'Bài học không thể chỉnh sửa ở trạng thái này', 400);
                return;
            }
            // Verify lecture is assigned to this course
            const lectureCourse = await prisma_1.default.lectureCourse.findFirst({
                where: { courseId: lesson.phase.courseId, lectureId },
            });
            if (!lectureCourse) {
                this.error(res, 'Bạn không có quyền chỉnh sửa bài học này', 403);
                return;
            }
            // Update or create lesson content
            const result = await lessonContent_service_1.default.updateLessonContent(lessonId, {
                content,
                testCases: typeof testCases === 'string' ? testCases : JSON.stringify(testCases),
                hints: typeof hints === 'string' ? hints : JSON.stringify(hints),
                starterCode,
                timeLimit,
                memoryLimit,
            });
            this.success(res, result, 'Nội dung đã được lưu');
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Cập nhật cấu hình chấm điểm
     * PUT /api/lecture/lesson-content/:lessonId/scoring
     */
    updateLessonScoring = async (req, res, next) => {
        try {
            const lectureId = req.user?.userId;
            if (!lectureId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            const { lessonId } = req.params;
            const { baseScore, penaltyPerHint, timeBonusEnabled, timeBonusThreshold, timeBonusValue } = req.body;
            // Verify lecture has access
            const lesson = await prisma_1.default.lesson.findUnique({
                where: { id: lessonId },
                include: { phase: { include: { course: true } } },
            });
            if (!lesson) {
                this.error(res, 'Bài học không tồn tại', 404);
                return;
            }
            const lectureCourse = await prisma_1.default.lectureCourse.findFirst({
                where: { courseId: lesson.phase.courseId, lectureId },
            });
            if (!lectureCourse) {
                this.error(res, 'Bạn không có quyền chỉnh sửa bài học này', 403);
                return;
            }
            const result = await lessonContent_service_1.default.updateScoring(lessonId, {
                baseScore,
                penaltyPerHint,
                timeBonusEnabled,
                timeBonusThreshold,
                timeBonusValue,
            });
            this.success(res, result, 'Cấu hình chấm điểm đã được lưu');
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Nộp bài học để admin duyệt
     * PUT /api/lecture/lessons/:lessonId/submit
     */
    submitLesson = async (req, res, next) => {
        try {
            const lectureId = req.user?.userId;
            if (!lectureId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            const { lessonId } = req.params;
            // Verify lecture has access
            const lesson = await prisma_1.default.lesson.findUnique({
                where: { id: lessonId },
                include: {
                    phase: { include: { course: true } },
                    lessonRequest: true,
                    lessonContent: true,
                },
            });
            if (!lesson) {
                this.error(res, 'Bài học không tồn tại', 404);
                return;
            }
            // Verify lecture is assigned to this course
            const lectureCourse = await prisma_1.default.lectureCourse.findFirst({
                where: { courseId: lesson.phase.courseId, lectureId },
            });
            if (!lectureCourse) {
                this.error(res, 'Bạn không có quyền nộp bài học này', 403);
                return;
            }
            // Update lesson status
            await prisma_1.default.lesson.update({
                where: { id: lessonId },
                data: { status: 'PENDING_REVIEW' },
            });
            // Update or create lesson request status
            if (lesson.lessonRequest && lesson.lessonRequest.id) {
                await prisma_1.default.lessonRequest.update({
                    where: { id: lesson.lessonRequest.id },
                    data: { status: 'PENDING' },
                });
            }
            else {
                // Create lesson request if not exists
                await prisma_1.default.lessonRequest.create({
                    data: {
                        lectureId,
                        lessonId,
                        status: 'PENDING',
                    },
                });
            }
            // Send notification to admins
            const admins = await prisma_1.default.user.findMany({
                where: { role: { name: 'admin' } },
            });
            for (const admin of admins) {
                await notification_service_1.default.createNotification({
                    userId: admin.id,
                    type: 'lesson_submitted',
                    title: 'Bài học được nộp để duyệt',
                    message: `Giảng viên đã nộp bài học "${lesson.title}" để duyệt. Vui lòng kiểm tra và duyệt.`,
                });
            }
            this.success(res, null, 'Bài học đã được nộp để duyệt');
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = new LectureController();
//# sourceMappingURL=lecture.controller.js.map