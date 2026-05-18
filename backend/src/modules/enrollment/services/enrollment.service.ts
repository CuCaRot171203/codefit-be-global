/**
 * @fileoverview Service layer cho module Enrollment
 * Chứa business logic xử lý các nghiệp vụ liên quan đến enrollment
 * @module enrollment/services
 */

import { BaseService } from '../../../base/base.service';
import enrollmentRepository from '../repositories/enrollment.repository';
import { CreateEnrollmentDto } from '../types';
import prisma from '../../../prisma';

/**
 * Service class xử lý business logic cho enrollment
 * Thực hiện các nghiệp vụ: đăng ký, lấy thông tin, cập nhật tiến độ, hủy đăng ký
 */
class EnrollmentService extends BaseService<typeof enrollmentRepository> {

  constructor() {
    super(enrollmentRepository);
  }

  /**
   * Đăng ký một khóa học cho người dùng
   * Kiểm tra điều kiện trước khi tạo enrollment mới
   * @param userId - ID của người dùng đăng ký
   * @param dto - Dữ liệu đăng ký (courseId, coachId)
   * @returns Promise<Enrollment> - Enrollment vừa được tạo
   * @throws Error nếu thiếu courseId hoặc đã đăng ký rồi
   */
  async enroll(userId: string, dto: CreateEnrollmentDto): Promise<any> {
    // Bước 1: Kiểm tra courseId có được cung cấp hay không
    if (!dto.courseId) {
      throw new Error('courseId is required');
    }

    // Bước 2: Kiểm tra xem user đã đăng ký khóa học này chưa
    const existing = await this.repository.findByUserIdAndCourseId(userId, dto.courseId);
    if (existing) {
      throw new Error('Already enrolled in this course');
    }

    // Bước 3: Lấy unlock config từ course
    const course = await prisma.course.findUnique({
      where: { id: dto.courseId },
      select: { unlockLessonsCount: true }
    });

    const unlockLessonsCount = course?.unlockLessonsCount ?? 3;

    // Bước 4: Tạo enrollment mới với progressive unlock
    const enrollment = await this.repository.create({
      userId,
      courseId: dto.courseId,
      progress: 0,
      coachId: dto.coachId || null,
      // Progressive unlock: mở khóa unlockLessonsCount bài đầu tiên
      currentUnlocks: unlockLessonsCount,
      completedLessons: 0,
    } as any);

    return enrollment;
  }

  /**
   * Lấy danh sách tất cả enrollment của một user
   * @param userId - ID của người dùng
   * @returns Promise<Enrollment[]> - Danh sách enrollment
   */
  async getUserEnrollments(userId: string): Promise<any[]> {
    return this.repository.findByUserId(userId);
  }

  /**
   * Lấy thông tin một enrollment cụ thể
   * @param userId - ID của người dùng
   * @param courseId - ID của khóa học
   * @returns Promise<Enrollment | null> - Enrollment nếu tìm thấy
   */
  async getEnrollment(userId: string, courseId: string): Promise<any | null> {
    return this.repository.findByUserIdAndCourseId(userId, courseId);
  }

  /**
   * Cập nhật tiến độ học tập của một enrollment
   * Kiểm tra giá trị progress hợp lệ và enrollment tồn tại
   * @param enrollmentId - ID của enrollment cần cập nhật
   * @param progress - Tiến độ mới (0-100)
   * @returns Promise<Enrollment> - Enrollment sau khi cập nhật
   * @throws Error nếu progress không hợp lệ hoặc enrollment không tồn tại
   */
  async updateProgress(enrollmentId: string, progress: number): Promise<any> {
    // Bước 1: Kiểm tra giá trị progress có nằm trong khoảng 0-100
    if (progress < 0 || progress > 100) {
      throw new Error('Progress must be between 0 and 100');
    }

    // Bước 2: Kiểm tra enrollment có tồn tại không
    const enrollment = await this.repository.findById(enrollmentId);
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }

    // Bước 3: Cập nhật progress vào database
    return this.repository.updateProgress(enrollmentId, progress);
  }

  /**
   * Hủy đăng ký khóa học của người dùng
   * Tìm enrollment và xóa khỏi database
   * @param userId - ID của người dùng
   * @param courseId - ID của khóa học cần hủy đăng ký
   * @returns Promise<{message: string}> - Thông báo thành công
   * @throws Error nếu enrollment không tồn tại
   */
  async unenroll(userId: string, courseId: string): Promise<{ message: string }> {
    // Bước 1: Tìm enrollment theo userId và courseId
    const enrollment = await this.repository.findByUserIdAndCourseId(userId, courseId);
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }

    // Bước 2: Xóa enrollment khỏi database
    await this.repository.delete(enrollment.id);
    return { message: 'Unenrolled successfully' };
  }
}

export default new EnrollmentService();
