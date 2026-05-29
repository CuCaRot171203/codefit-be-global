/**
 * LessonProgress Service
 * 
 * Chứa business logic cho các thao tác với tiến độ bài học.
 * Xử lý việc theo dõi và cập nhật trạng thái hoàn thành bài học.
 * Sử dụng Redis để publish sự kiện khi có thay đổi tiến độ.
 */

import { BaseService } from '../../../base/base.service';
import lessonProgressRepository from '../repositories/lessonProgress.repository';
import { redis } from '../../../utils/redis';

/**
 * LessonProgressService - Business logic layer cho tiến độ bài học
 * @class LessonProgressService
 * @extends BaseService
 */
class LessonProgressService extends BaseService<typeof lessonProgressRepository> {

  constructor() {
    super(lessonProgressRepository);
  }

  /**
   * Lấy tiến độ của một bài học cụ thể
   * @param userId - ID của người dùng
   * @param lessonId - ID của bài học
   * @returns Promise<LessonProgress | null> - Tiến độ bài học hoặc null
   */
  async getLessonProgress(userId: string, lessonId: string): Promise<any | null> {
    // Bước 1: Gọi repository để tìm tiến độ theo userId và lessonId
    return this.repository.findByUserAndLesson(userId, lessonId);
  }

  /**
   * Lấy tất cả tiến độ bài học của người dùng trong một khóa học
   * @param userId - ID của người dùng
   * @param courseId - ID của khóa học
   * @returns Promise<LessonProgress[]> - Danh sách tiến độ bài học
   */
  async getCourseProgress(userId: string, courseId: string): Promise<any[]> {
    // Bước 1: Gọi repository để tìm tất cả tiến độ theo userId và courseId
    return this.repository.findByUserAndCourse(userId, courseId);
  }

  /**
   * Đánh dấu bài học là hoàn thành
   * @param userId - ID của người dùng
   * @param lessonId - ID của bài học
   * @param courseId - ID của khóa học
   * @returns Promise<LessonProgress> - Bản ghi tiến độ đã cập nhật
   */
  async markLessonComplete(userId: string, lessonId: string, courseId: string): Promise<any> {
    // Bước 1: Cập nhật trạng thái hoàn thành trong database
    const progress = await this.repository.markComplete(userId, lessonId, courseId);

    // Bước 2: Publish sự kiện cập nhật tiến độ lên Redis
    await this.publishLessonUpdate(userId, lessonId, courseId, true);

    // Bước 3: Trả về bản ghi tiến độ đã cập nhật
    return progress;
  }

  /**
   * Đánh dấu bài học là chưa hoàn thành
   * @param userId - ID của người dùng
   * @param lessonId - ID của bài học
   * @returns Promise<LessonProgress> - Bản ghi tiến độ đã cập nhật
   */
  async markLessonIncomplete(userId: string, lessonId: string): Promise<any> {
    // Bước 1: Cập nhật trạng thái chưa hoàn thành trong database
    const progress = await this.repository.markIncomplete(userId, lessonId);

    // Bước 2: Publish sự kiện cập nhật tiến độ lên Redis
    await this.publishLessonUpdate(userId, lessonId, progress.courseId || '', false);

    // Bước 3: Trả về bản ghi tiến độ đã cập nhật
    return progress;
  }

  /**
   * Đếm số bài học đã hoàn thành trong một khóa học
   * @param userId - ID của người dùng
   * @param courseId - ID của khóa học
   * @returns Promise<number> - Số lượng bài học đã hoàn thành
   */
  async getCompletedCount(userId: string, courseId: string): Promise<number> {
    // Bước 1: Lấy tất cả tiến độ bài học của người dùng trong khóa học
    const progressList = await this.repository.findByUserAndCourse(userId, courseId);
    
    // Bước 2: Đếm số bài học có completed = true
    return progressList.filter(p => p.isCompleted).length;
  }

  /**
   * Publish sự kiện thay đổi tiến độ bài học lên Redis
   * @param userId - ID của người dùng
   * @param lessonId - ID của bài học
   * @param courseId - ID của khóa học
   * @param completed - Trạng thái hoàn thành mới
   * @private
   */
  private async publishLessonUpdate(
    userId: string,
    lessonId: string,
    courseId: string,
    completed: boolean
  ): Promise<void> {
    try {
      // Bước 1: Publish message lên Redis channel với key theo userId
      await redis.publish(`lesson:${userId}`, JSON.stringify({
        type: 'lesson_update',
        userId,
        lessonId,
        courseId,
        completed
      }));
    } catch (error) {
      // Bước 2: Log lỗi nếu không thể publish (không ảnh hưởng đến luồng chính)
      console.error('Redis publish error:', error);
    }
  }
}

export default new LessonProgressService();
