/**
 * LessonProgress Controller
 *
 * Xử lý các HTTP requests liên quan đến tiến độ bài học.
 * Tất cả các endpoints đều yêu cầu authentication qua verifyToken middleware.
 */
import { BaseController } from '../../../base/base.controller';
import lessonProgressService from '../services/lessonProgress.service';
/**
 * LessonProgressController - HTTP layer cho tiến độ bài học
 * @class LessonProgressController
 * @extends BaseController
 */
class LessonProgressController extends BaseController {
    constructor() {
        super(lessonProgressService);
    }
    /**
     * Lấy tiến độ của một bài học cụ thể
     * GET /api/lesson-progress/lesson/:lessonId
     * @param req - Request chứa params.lessonId và user từ token
     * @param res - Response trả về tiến độ bài học
     * @param next - Next function để xử lý lỗi
     */
    getLessonProgress = async (req, res, next) => {
        try {
            // Bước 1: Lấy userId từ token đã được verify
            const userId = req.user?.userId;
            if (!userId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            // Bước 2: Lấy lessonId từ URL params
            const { lessonId } = req.params;
            // Bước 3: Gọi service để lấy tiến độ bài học
            const progress = await this.service.getLessonProgress(userId, lessonId);
            // Bước 4: Trả về response với tiến độ bài học
            this.success(res, progress, 'Lesson progress retrieved successfully');
        }
        catch (error) {
            // Bước 5: Chuyển lỗi đến middleware xử lý lỗi
            next(error);
        }
    };
    /**
     * Lấy tất cả tiến độ bài học trong một khóa học
     * GET /api/lesson-progress/course/:courseId
     * @param req - Request chứa params.courseId và user từ token
     * @param res - Response trả về danh sách tiến độ bài học
     * @param next - Next function để xử lý lỗi
     */
    getCourseProgress = async (req, res, next) => {
        try {
            // Bước 1: Lấy userId từ token đã được verify
            const userId = req.user?.userId;
            if (!userId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            // Bước 2: Lấy courseId từ URL params
            const { courseId } = req.params;
            // Bước 3: Gọi service để lấy tất cả tiến độ bài học trong khóa học
            const progress = await this.service.getCourseProgress(userId, courseId);
            // Bước 4: Trả về response với danh sách tiến độ
            this.success(res, progress, 'Course progress retrieved successfully');
        }
        catch (error) {
            // Bước 5: Chuyển lỗi đến middleware xử lý lỗi
            next(error);
        }
    };
    /**
     * Đánh dấu bài học là hoàn thành
     * POST /api/lesson-progress/complete
     * @param req - Request chứa body với lessonId, courseId và user từ token
     * @param res - Response trả về tiến độ đã cập nhật
     * @param next - Next function để xử lý lỗi
     */
    markComplete = async (req, res, next) => {
        try {
            // Bước 1: Lấy userId từ token đã được verify
            const userId = req.user?.userId;
            if (!userId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            // Bước 2: Lấy lessonId và courseId từ request body
            const { lessonId, courseId } = req.body;
            // Bước 3: Gọi service để đánh dấu hoàn thành bài học
            const progress = await this.service.markLessonComplete(userId, lessonId, courseId);
            // Bước 4: Trả về response với tiến độ đã cập nhật
            this.success(res, progress, 'Lesson marked as complete');
        }
        catch (error) {
            // Bước 5: Chuyển lỗi đến middleware xử lý lỗi
            next(error);
        }
    };
    /**
     * Đánh dấu bài học là chưa hoàn thành
     * PUT /api/lesson-progress/lesson/:lessonId/incomplete
     * @param req - Request chứa params.lessonId và user từ token
     * @param res - Response trả về tiến độ đã cập nhật
     * @param next - Next function để xử lý lỗi
     */
    markIncomplete = async (req, res, next) => {
        try {
            // Bước 1: Lấy userId từ token đã được verify
            const userId = req.user?.userId;
            if (!userId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            // Bước 2: Lấy lessonId từ URL params
            const { lessonId } = req.params;
            // Bước 3: Gọi service để đánh dấu chưa hoàn thành bài học
            const progress = await this.service.markLessonIncomplete(userId, lessonId);
            // Bước 4: Trả về response với tiến độ đã cập nhật
            this.success(res, progress, 'Lesson marked as incomplete');
        }
        catch (error) {
            // Bước 5: Xác định status code dựa trên loại lỗi
            const status = error.message.includes('not found') ? 404 : 500;
            this.error(res, error.message, status);
        }
    };
}
export default new LessonProgressController();
//# sourceMappingURL=lessonProgress.controller.js.map