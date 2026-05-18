/**
 * @fileoverview Service layer cho module Progress
 * Chứa business logic liên quan đến tiến độ học tập và tích hợp Redis
 * @module progress/services
 */
import { BaseService } from '../../../base/base.service';
import progressRepository from '../repositories/progress.repository';
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
/**
 * Service class xử lý business logic liên quan đến progress
 * Kế thừa từ BaseService, tích hợp Redis để publish progress updates
 */
class ProgressService extends BaseService {
    constructor() {
        super(progressRepository);
    }
    /**
     * Lấy tiến độ học tập của user trong một khóa học
     * @param userId - ID của user
     * @param courseId - ID của khóa học
     * @returns Progress data hoặc null nếu không tìm thấy
     */
    async getProgress(userId, courseId) {
        return this.repository.findByUserAndCourse(userId, courseId);
    }
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
    async updateProgress(userId, courseId, completedLessons, totalLessons) {
        // Bước 1: Validate các giá trị đầu vào
        // completedLessons phải >= 0 và totalLessons phải > 0
        if (completedLessons < 0 || totalLessons <= 0) {
            throw new Error('Invalid progress values');
        }
        // Bước 2: Gọi repository để cập nhật progress vào database
        const progress = await this.repository.updateProgress(userId, courseId, completedLessons, totalLessons);
        // Bước 3: Publish progress update event lên Redis để các service khác có thể subscribe
        await this.publishProgressUpdate(userId, courseId, progress);
        // Bước 4: Trả về progress đã được cập nhật
        return progress;
    }
    /**
     * Tăng số bài học đã hoàn thành lên 1
     * Lấy progress hiện tại, tăng completedLessons lên 1 và gọi updateProgress
     * @param userId - ID của user
     * @param courseId - ID của khóa học
     * @returns Progress đã được cập nhật với completedLessons tăng thêm 1
     */
    async incrementProgress(userId, courseId) {
        // Bước 1: Lấy progress hiện tại của user trong khóa học
        const current = await this.repository.findByUserAndCourse(userId, courseId);
        // Bước 2: Tính toán số bài đã hoàn thành (cộng thêm 1)
        // Nếu chưa có progress, mặc định completedLessons = 0, totalLessons = 1
        const completedLessons = (current?.completedLessons || 0) + 1;
        const totalLessons = current?.totalLessons || 1;
        // Bước 3: Gọi updateProgress với các giá trị mới
        return this.updateProgress(userId, courseId, completedLessons, totalLessons);
    }
    /**
     * Publish progress update event lên Redis channel
     * @param userId - ID của user
     * @param courseId - ID của khóa học
     * @param progress - Object chứa thông tin progress
     */
    async publishProgressUpdate(userId, courseId, progress) {
        try {
            // Bước 1: Publish message lên Redis channel với key theo format progress:{userId}
            // Message chứa type, userId, courseId và progress data
            await redis.publish(`progress:${userId}`, JSON.stringify({
                type: 'progress_update',
                userId,
                courseId,
                progress
            }));
        }
        catch (error) {
            // Log lỗi nếu không thể publish lên Redis
            // Không throw error để không ảnh hưởng đến main flow
            console.error('Redis publish error:', error);
        }
    }
}
export default new ProgressService();
//# sourceMappingURL=progress.service.js.map