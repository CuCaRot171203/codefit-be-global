/**
 * LessonProgress Repository
 *
 * Xử lý các thao tác database cho tiến độ bài học.
 * Quản lý việc đánh dấu hoàn thành/chưa hoàn thành bài học của người dùng.
 */
import { BaseRepository } from '../../../base/base.repository';
/**
 * Interface định nghĩa cấu trúc LessonProgress
 * @interface LessonProgress
 */
interface LessonProgress {
    /** ID duy nhất của bản ghi tiến độ */
    id: string;
    /** ID của người dùng */
    userId: string;
    /** ID của bài học */
    lessonId: string;
    /** ID của khóa học chứa bài học */
    courseId: string | null;
    /** Trạng thái hoàn thành */
    isCompleted: boolean;
    /** Thời điểm hoàn thành (null nếu chưa hoàn thành) */
    completedAt: Date | null;
}
/**
 * LessonProgressRepository - Quản lý database operations cho tiến độ bài học
 * @class LessonProgressRepository
 * @extends BaseRepository<LessonProgress>
 */
declare class LessonProgressRepository extends BaseRepository<LessonProgress> {
    /** Prisma model được sử dụng cho các thao tác database */
    protected model: import(".prisma/client").Prisma.LessonProgressDelegate<import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    /**
     * Tìm tiến độ bài học của người dùng theo lessonId
     * @param userId - ID của người dùng
     * @param lessonId - ID của bài học
     * @returns Promise<LessonProgress | null> - Tiến độ tìm được hoặc null
     */
    findByUserAndLesson(userId: string, lessonId: string): Promise<any>;
    /**
     * Tìm tất cả tiến độ bài học của người dùng trong một khóa học
     * @param userId - ID của người dùng
     * @param courseId - ID của khóa học
     * @returns Promise<LessonProgress[]> - Danh sách tiến độ bài học
     */
    findByUserAndCourse(userId: string, courseId: string): Promise<any[]>;
    /**
     * Đánh dấu bài học là hoàn thành
     * @param userId - ID của người dùng
     * @param lessonId - ID của bài học
     * @param courseId - ID của khóa học
     * @returns Promise<LessonProgress> - Bản ghi tiến độ đã cập nhật/tạo mới
     */
    markComplete(userId: string, lessonId: string, courseId: string): Promise<any>;
    /**
     * Đánh dấu bài học là chưa hoàn thành
     * @param userId - ID của người dùng
     * @param lessonId - ID của bài học
     * @returns Promise<LessonProgress> - Bản ghi tiến độ đã cập nhật
     * @throws Error - Nếu không tìm thấy tiến độ bài học
     */
    markIncomplete(userId: string, lessonId: string): Promise<LessonProgress>;
}
declare const _default: LessonProgressRepository;
export default _default;
//# sourceMappingURL=lessonProgress.repository.d.ts.map