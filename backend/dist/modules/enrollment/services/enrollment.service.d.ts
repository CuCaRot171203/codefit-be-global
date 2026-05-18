/**
 * @fileoverview Service layer cho module Enrollment
 * Chứa business logic xử lý các nghiệp vụ liên quan đến enrollment
 * @module enrollment/services
 */
import { BaseService } from '../../../base/base.service';
import enrollmentRepository from '../repositories/enrollment.repository';
import { CreateEnrollmentDto } from '../types';
/**
 * Service class xử lý business logic cho enrollment
 * Thực hiện các nghiệp vụ: đăng ký, lấy thông tin, cập nhật tiến độ, hủy đăng ký
 */
declare class EnrollmentService extends BaseService<typeof enrollmentRepository> {
    constructor();
    /**
     * Đăng ký một khóa học cho người dùng
     * Kiểm tra điều kiện trước khi tạo enrollment mới
     * @param userId - ID của người dùng đăng ký
     * @param dto - Dữ liệu đăng ký (courseId, coachId)
     * @returns Promise<Enrollment> - Enrollment vừa được tạo
     * @throws Error nếu thiếu courseId hoặc đã đăng ký rồi
     */
    enroll(userId: string, dto: CreateEnrollmentDto): Promise<any>;
    /**
     * Lấy danh sách tất cả enrollment của một user
     * @param userId - ID của người dùng
     * @returns Promise<Enrollment[]> - Danh sách enrollment
     */
    getUserEnrollments(userId: string): Promise<any[]>;
    /**
     * Lấy thông tin một enrollment cụ thể
     * @param userId - ID của người dùng
     * @param courseId - ID của khóa học
     * @returns Promise<Enrollment | null> - Enrollment nếu tìm thấy
     */
    getEnrollment(userId: string, courseId: string): Promise<any | null>;
    /**
     * Cập nhật tiến độ học tập của một enrollment
     * Kiểm tra giá trị progress hợp lệ và enrollment tồn tại
     * @param enrollmentId - ID của enrollment cần cập nhật
     * @param progress - Tiến độ mới (0-100)
     * @returns Promise<Enrollment> - Enrollment sau khi cập nhật
     * @throws Error nếu progress không hợp lệ hoặc enrollment không tồn tại
     */
    updateProgress(enrollmentId: string, progress: number): Promise<any>;
    /**
     * Hủy đăng ký khóa học của người dùng
     * Tìm enrollment và xóa khỏi database
     * @param userId - ID của người dùng
     * @param courseId - ID của khóa học cần hủy đăng ký
     * @returns Promise<{message: string}> - Thông báo thành công
     * @throws Error nếu enrollment không tồn tại
     */
    unenroll(userId: string, courseId: string): Promise<{
        message: string;
    }>;
}
declare const _default: EnrollmentService;
export default _default;
//# sourceMappingURL=enrollment.service.d.ts.map