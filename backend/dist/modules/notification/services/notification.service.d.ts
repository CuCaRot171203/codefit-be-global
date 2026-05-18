/**
 * @file notification.service.ts
 * @description Service xử lý business logic cho module Notification.
 * Cung cấp các phương thức tạo, đọc, cập nhật và xóa notification.
 */
import { BaseService } from '../../../base/base.service';
import notificationRepository from '../repositories/notification.repository';
/**
 * Union type định nghĩa các loại notification có sẵn trong hệ thống.
 */
type NotificationType = 'submission_result' | 'submission_approved' | 'submission_rejected' | 'enrollment' | 'course_update' | 'course_assignment' | 'course_unassignment' | 'lesson_request' | 'lesson_submitted' | 'lesson_approved' | 'lesson_rejected' | 'lesson_published' | 'new_lesson_available' | 'hackathon_reminder' | 'hackathon_started' | 'hackathon_joined' | 'hackathon_ranking';
/**
 * Service class xử lý business logic cho Notification.
 * Kế thừa từ BaseService và triển khai các phương thức nghiệp vụ riêng.
 */
declare class NotificationService extends BaseService<typeof notificationRepository> {
    constructor();
    /**
     * Tạo mới một notification cho user.
     * @param params - Object chứa các tham số
     * @param params.userId - ID của user nhận notification
     * @param params.type - Loại notification
     * @param params.title - Tiêu đề của notification
     * @param params.message - Nội dung thông báo
     * @param params.metadata - Metadata bổ sung (link, etc.)
     * @returns Promise chứa notification đã được tạo
     */
    createNotification(params: {
        userId: string;
        type: NotificationType;
        title: string;
        message: string;
        metadata?: Record<string, any>;
    }): Promise<any>;
    /**
     * Tạo notification cho kết quả bài nộp (submission).
     * Tự động format message dựa trên trạng thái nộp bài.
     * @param userId - ID của user nhận notification
     * @param submissionId - ID của submission
     * @param problemTitle - Tên bài toán
     * @param status - Trạng thái submission (AC = Accepted, hoặc mã lỗi khác)
     * @returns Promise chứa notification đã được tạo
     */
    createSubmissionNotification(userId: string, submissionId: string, problemTitle: string, status: string): Promise<any>;
    /**
     * Lấy tất cả notifications của một user.
     * @param userId - ID của user cần lấy notifications
     * @returns Promise<any[]> - Danh sách tất cả notifications của user
     */
    getUserNotifications(userId: string): Promise<any[]>;
    /**
     * Lấy tất cả notifications chưa đọc của một user.
     * @param userId - ID của user cần lấy notifications chưa đọc
     * @returns Promise<any[]> - Danh sách notifications chưa đọc
     */
    getUnreadNotifications(userId: string): Promise<any[]>;
    /**
     * Đánh dấu một notification là đã đọc.
     * @param notificationId - ID của notification cần đánh dấu đã đọc
     * @returns Promise<any> - Notification sau khi được cập nhật
     * @throws Error - Ném lỗi nếu notification không tồn tại
     */
    markAsRead(notificationId: string): Promise<any>;
    /**
     * Đánh dấu tất cả notifications của user là đã đọc.
     * @param userId - ID của user cần đánh dấu tất cả notifications đã đọc
     * @returns Promise<{ count: number }> - Số lượng notifications đã được cập nhật
     */
    markAllAsRead(userId: string): Promise<{
        count: number;
    }>;
    /**
     * Đếm số lượng notifications chưa đọc của user.
     * @param userId - ID của user cần đếm notifications chưa đọc
     * @returns Promise<{ count: number }> - Số lượng notifications chưa đọc
     */
    getUnreadCount(userId: string): Promise<{
        count: number;
    }>;
    /**
     * Xóa một notification.
     * @param id - ID của notification cần xóa
     * @returns Promise<{ message: string }> - Thông báo xóa thành công
     * @throws Error - Ném lỗi nếu notification không tồn tại
     */
    deleteNotification(id: string): Promise<{
        message: string;
    }>;
    /**
     * Publish notification event qua Redis để xử lý real-time.
     * Phương thức private chỉ được gọi từ bên trong service.
     * @param userId - ID của user nhận notification
     * @param notification - Object notification cần publish
     * @returns Promise<void>
     */
    private publishNotification;
    /**
     * Lấy tất cả notifications đã gửi (notifications do admin tạo).
     * @param userId - ID của admin đang yêu cầu
     * @returns Promise<any[]> - Danh sách notifications đã gửi
     */
    getSentNotifications(userId: string): Promise<any[]>;
    /**
     * Lấy tất cả notifications (admin - tất cả users).
     * @returns Promise<any[]> - Danh sách tất cả notifications
     */
    getAllNotifications(): Promise<any[]>;
    /**
     * Gửi notification nhắc nhở hackathon sắp bắt đầu
     */
    createHackathonReminderNotification(userId: string, hackathonTitle: string, startTime: Date, hackathonId: string): Promise<any>;
    /**
     * Gửi notification xác nhận đã đăng ký hackathon
     */
    createHackathonJoinedNotification(userId: string, hackathonTitle: string, hackathonId: string): Promise<any>;
    /**
     * Gửi notification khi hackathon bắt đầu
     */
    createHackathonStartedNotification(userId: string, hackathonTitle: string, hackathonId: string): Promise<any>;
}
declare const _default: NotificationService;
export default _default;
//# sourceMappingURL=notification.service.d.ts.map