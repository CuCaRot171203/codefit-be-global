/**
 * LessonProgress Controller
 *
 * Xử lý các HTTP requests liên quan đến tiến độ bài học.
 * Tất cả các endpoints đều yêu cầu authentication qua verifyToken middleware.
 */
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../base/base.controller';
/**
 * LessonProgressController - HTTP layer cho tiến độ bài học
 * @class LessonProgressController
 * @extends BaseController
 */
declare class LessonProgressController extends BaseController {
    constructor();
    /**
     * Lấy tiến độ của một bài học cụ thể
     * GET /api/lesson-progress/lesson/:lessonId
     * @param req - Request chứa params.lessonId và user từ token
     * @param res - Response trả về tiến độ bài học
     * @param next - Next function để xử lý lỗi
     */
    getLessonProgress: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy tất cả tiến độ bài học trong một khóa học
     * GET /api/lesson-progress/course/:courseId
     * @param req - Request chứa params.courseId và user từ token
     * @param res - Response trả về danh sách tiến độ bài học
     * @param next - Next function để xử lý lỗi
     */
    getCourseProgress: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Đánh dấu bài học là hoàn thành
     * POST /api/lesson-progress/complete
     * @param req - Request chứa body với lessonId, courseId và user từ token
     * @param res - Response trả về tiến độ đã cập nhật
     * @param next - Next function để xử lý lỗi
     */
    markComplete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Đánh dấu bài học là chưa hoàn thành
     * PUT /api/lesson-progress/lesson/:lessonId/incomplete
     * @param req - Request chứa params.lessonId và user từ token
     * @param res - Response trả về tiến độ đã cập nhật
     * @param next - Next function để xử lý lỗi
     */
    markIncomplete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: LessonProgressController;
export default _default;
//# sourceMappingURL=lessonProgress.controller.d.ts.map