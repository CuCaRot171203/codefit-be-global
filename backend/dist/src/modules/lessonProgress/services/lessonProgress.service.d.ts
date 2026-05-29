/**
 * LessonProgress Service
 *
 * Chứa business logic cho các thao tác với tiến độ bài học.
 * Xử lý việc theo dõi và cập nhật trạng thái hoàn thành bài học.
 * Sử dụng Redis để publish sự kiện khi có thay đổi tiến độ.
 */
import { BaseService } from '../../../base/base.service';
import lessonProgressRepository from '../repositories/lessonProgress.repository';
/**
 * LessonProgressService - Business logic layer cho tiến độ bài học
 * @class LessonProgressService
 * @extends BaseService
 */
declare class LessonProgressService extends BaseService<typeof lessonProgressRepository> {
    constructor();
    /**
     * Lấy tiến độ của một bài học cụ thể
     * @param userId - ID của người dùng
     * @param lessonId - ID của bài học
     * @returns Promise<LessonProgress | null> - Tiến độ bài học hoặc null
     */
    getLessonProgress(userId: string, lessonId: string): Promise<any | null>;
    /**
     * Lấy tất cả tiến độ bài học của người dùng trong một khóa học
     * @param userId - ID của người dùng
     * @param courseId - ID của khóa học
     * @returns Promise<LessonProgress[]> - Danh sách tiến độ bài học
     */
    getCourseProgress(userId: string, courseId: string): Promise<any[]>;
    /**
     * Đánh dấu bài học là hoàn thành
     * @param userId - ID của người dùng
     * @param lessonId - ID của bài học
     * @param courseId - ID của khóa học
     * @returns Promise<LessonProgress> - Bản ghi tiến độ đã cập nhật
     */
    markLessonComplete(userId: string, lessonId: string, courseId: string): Promise<any>;
    /**
     * Đánh dấu bài học là chưa hoàn thành
     * @param userId - ID của người dùng
     * @param lessonId - ID của bài học
     * @returns Promise<LessonProgress> - Bản ghi tiến độ đã cập nhật
     */
    markLessonIncomplete(userId: string, lessonId: string): Promise<any>;
    /**
     * Đếm số bài học đã hoàn thành trong một khóa học
     * @param userId - ID của người dùng
     * @param courseId - ID của khóa học
     * @returns Promise<number> - Số lượng bài học đã hoàn thành
     */
    getCompletedCount(userId: string, courseId: string): Promise<number>;
    /**
     * Publish sự kiện thay đổi tiến độ bài học lên Redis
     * @param userId - ID của người dùng
     * @param lessonId - ID của bài học
     * @param courseId - ID của khóa học
     * @param completed - Trạng thái hoàn thành mới
     * @private
     */
    private publishLessonUpdate;
}
declare const _default: LessonProgressService;
export default _default;
//# sourceMappingURL=lessonProgress.service.d.ts.map