/**
 * @fileoverview Service layer cho module Progress
 * Chứa business logic liên quan đến tiến độ học tập và tích hợp Redis
 * @module progress/services
 */
import { BaseService } from '../../../base/base.service';
import progressRepository from '../repositories/progress.repository';
/**
 * Service class xử lý business logic liên quan đến progress
 * Kế thừa từ BaseService, tích hợp Redis để publish progress updates
 */
declare class ProgressService extends BaseService<typeof progressRepository> {
    constructor();
    /**
     * Lấy tiến độ học tập của user trong một khóa học
     * @param userId - ID của user
     * @param courseId - ID của khóa học
     * @returns Progress data hoặc null nếu không tìm thấy
     */
    getProgress(userId: string, courseId: string): Promise<any | null>;
    /**
     * Cập nhật tiến độ học tập của user trong khóa học
     * Validate dữ liệu đầu vào trước khi cập nhật, sau đó publish event lên Redis
     * @param userId - ID của user
     * @param courseId - ID của khóa học
     * @param completedLessons - Số bài đã hoàn thành
     * @param totalLessons - Tổng số bài học
     * @returns Progress đã được cập nhật
     * @throws Error nếu giá trị đầu vào không hợp lệ
     */
    updateProgress(userId: string, courseId: string, completedLessons: number, totalLessons: number): Promise<any>;
    /**
     * Tăng số bài học đã hoàn thành lên 1
     * Lấy progress hiện tại, tăng completedLessons lên 1 và gọi updateProgress
     * @param userId - ID của user
     * @param courseId - ID của khóa học
     * @returns Progress đã được cập nhật với completedLessons tăng thêm 1
     */
    incrementProgress(userId: string, courseId: string): Promise<any>;
    /**
     * Publish progress update event lên Redis channel
     * @param userId - ID của user
     * @param courseId - ID của khóa học
     * @param progress - Object chứa thông tin progress
     */
    private publishProgressUpdate;
}
declare const _default: ProgressService;
export default _default;
//# sourceMappingURL=progress.service.d.ts.map