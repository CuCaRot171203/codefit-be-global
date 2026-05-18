/**
 * Lecture Controller
 *
 * Xử lý các HTTP requests liên quan đến Lecture/Dashboard giảng viên.
 * Quản lý việc lấy dashboard, khóa học, minitests, hackathons.
 */
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../base/base.controller';
/**
 * LectureController - HTTP layer cho Lecture operations
 * @class LectureController
 * @extends BaseController
 */
declare class LectureController extends BaseController {
    constructor();
    /**
     * Lấy dashboard stats cho giảng viên
     * GET /api/lecture/dashboard
     * Yêu cầu: User đã xác thực với role = 'lecture'
     */
    getDashboard: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy danh sách khóa học của giảng viên
     * GET /api/lecture/courses
     * Yêu cầu: User đã xác thực với role = 'lecture'
     */
    getMyCourses: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy chi tiết một khóa học của giảng viên
     * GET /api/lecture/courses/:courseId
     * Yêu cầu: User đã xác thực với role = 'lecture'
     */
    getCourseDetail: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy danh sách minitests trong các khóa học của giảng viên
     * GET /api/lecture/minitests
     * Yêu cầu: User đã xác thực với role = 'lecture'
     */
    getMyMinitests: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy danh sách hackathons trong các khóa học của giảng viên
     * GET /api/lecture/hackathons
     * Yêu cầu: User đã xác thực với role = 'lecture'
     */
    getMyHackathons: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Tạo chương mới cho khóa học
     * POST /api/lecture/phases
     */
    createPhase: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Tạo bài học mới trong chương
     * POST /api/lecture/lessons
     */
    createLesson: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy nội dung bài học để chỉnh sửa
     * GET /api/lecture/lesson-content/:lessonId
     */
    getLessonContent: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Cập nhật nội dung bài học
     * PUT /api/lecture/lesson-content/:lessonId/content
     */
    updateLessonContent: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Cập nhật cấu hình chấm điểm
     * PUT /api/lecture/lesson-content/:lessonId/scoring
     */
    updateLessonScoring: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Nộp bài học để admin duyệt
     * PUT /api/lecture/lessons/:lessonId/submit
     */
    submitLesson: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: LectureController;
export default _default;
//# sourceMappingURL=lecture.controller.d.ts.map