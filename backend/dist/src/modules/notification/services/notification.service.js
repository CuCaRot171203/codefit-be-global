"use strict";
/**
 * @file notification.service.ts
 * @description Service xử lý business logic cho module Notification.
 * Cung cấp các phương thức tạo, đọc, cập nhật và xóa notification.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_service_1 = require("../../../base/base.service");
const notification_repository_1 = __importDefault(require("../repositories/notification.repository"));
const ioredis_1 = __importDefault(require("ioredis"));
/**
 * Khởi tạo Redis client để publish notifications real-time.
 */
const redis = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379');
/**
 * Service class xử lý business logic cho Notification.
 * Kế thừa từ BaseService và triển khai các phương thức nghiệp vụ riêng.
 */
class NotificationService extends base_service_1.BaseService {
    constructor() {
        super(notification_repository_1.default);
    }
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
    async createNotification(params) {
        const { userId, type, title, message, metadata } = params;
        console.log('[NOTIFICATION SERVICE] Creating notification:', { userId, type, title, message, metadata });
        // Bước 1: Tạo notification record trong database với isRead = false
        const notification = await this.repository.create({
            userId,
            type,
            title,
            content: message,
            isRead: false,
            metadata: metadata ? JSON.stringify(metadata) : null
        });
        console.log('[NOTIFICATION SERVICE] Notification created in DB:', notification);
        // Bước 2: Publish notification event qua Redis để xử lý real-time
        await this.publishNotification(userId, notification);
        // Bước 3: Trả về notification đã tạo
        return notification;
    }
    /**
     * Tạo notification cho kết quả bài nộp (submission).
     * Tự động format message dựa trên trạng thái nộp bài.
     * @param userId - ID của user nhận notification
     * @param submissionId - ID của submission
     * @param problemTitle - Tên bài toán
     * @param status - Trạng thái submission (AC = Accepted, hoặc mã lỗi khác)
     * @returns Promise chứa notification đã được tạo
     */
    async createSubmissionNotification(userId, submissionId, problemTitle, status) {
        // Bước 1: Format message dựa trên trạng thái submission
        const statusMessage = status === 'AC' ? 'Accepted' : `Failed: ${status}`;
        // Bước 2: Tạo tiêu đề notification
        const title = `Submission Result - ${problemTitle}`;
        // Bước 3: Tạo message mô tả kết quả
        const message = `Your submission has been ${statusMessage}`;
        // Bước 4: Gọi phương thức createNotification với type 'submission_result'
        const notification = await this.createNotification({
            userId,
            type: 'submission_result',
            title,
            message
        });
        return notification;
    }
    /**
     * Lấy tất cả notifications của một user.
     * @param userId - ID của user cần lấy notifications
     * @returns Promise<any[]> - Danh sách tất cả notifications của user
     */
    async getUserNotifications(userId) {
        // Bước 1: Gọi repository để lấy notifications theo userId
        return this.repository.findByUserId(userId);
    }
    /**
     * Lấy tất cả notifications chưa đọc của một user.
     * @param userId - ID của user cần lấy notifications chưa đọc
     * @returns Promise<any[]> - Danh sách notifications chưa đọc
     */
    async getUnreadNotifications(userId) {
        // Bước 1: Gọi repository để lấy notifications chưa đọc theo userId
        return this.repository.findUnreadByUserId(userId);
    }
    /**
     * Đánh dấu một notification là đã đọc.
     * @param notificationId - ID của notification cần đánh dấu đã đọc
     * @returns Promise<any> - Notification sau khi được cập nhật
     * @throws Error - Ném lỗi nếu notification không tồn tại
     */
    async markAsRead(notificationId) {
        // Bước 1: Kiểm tra notification có tồn tại hay không
        const notification = await this.repository.findById(notificationId);
        if (!notification) {
            // Bước 2: Ném lỗi nếu notification không tồn tại
            throw new Error('Notification not found');
        }
        // Bước 3: Gọi repository để đánh dấu notification đã đọc
        return this.repository.markAsRead(notificationId);
    }
    /**
     * Đánh dấu tất cả notifications của user là đã đọc.
     * @param userId - ID của user cần đánh dấu tất cả notifications đã đọc
     * @returns Promise<{ count: number }> - Số lượng notifications đã được cập nhật
     */
    async markAllAsRead(userId) {
        // Bước 1: Gọi repository để đánh dấu tất cả notifications đã đọc
        // Bước 2: Trả về object chứa số lượng đã cập nhật
        const count = await this.repository.markAllAsRead(userId);
        return { count };
    }
    /**
     * Đếm số lượng notifications chưa đọc của user.
     * @param userId - ID của user cần đếm notifications chưa đọc
     * @returns Promise<{ count: number }> - Số lượng notifications chưa đọc
     */
    async getUnreadCount(userId) {
        // Bước 1: Gọi repository để đếm notifications chưa đọc
        // Bước 2: Trả về object chứa số lượng
        const count = await this.repository.countUnread(userId);
        return { count };
    }
    /**
     * Xóa một notification.
     * @param id - ID của notification cần xóa
     * @returns Promise<{ message: string }> - Thông báo xóa thành công
     * @throws Error - Ném lỗi nếu notification không tồn tại
     */
    async deleteNotification(id) {
        // Bước 1: Kiểm tra notification có tồn tại hay không
        const notification = await this.repository.findById(id);
        if (!notification) {
            // Bước 2: Ném lỗi nếu notification không tồn tại
            throw new Error('Notification not found');
        }
        // Bước 3: Gọi repository để xóa notification
        await this.repository.delete(id);
        // Bước 4: Trả về thông báo thành công
        return { message: 'Notification deleted successfully' };
    }
    /**
     * Publish notification event qua Redis để xử lý real-time.
     * Phương thức private chỉ được gọi từ bên trong service.
     * @param userId - ID của user nhận notification
     * @param notification - Object notification cần publish
     * @returns Promise<void>
     */
    async publishNotification(userId, notification) {
        try {
            // Bước 1: Publish message đến Redis channel `notification:{userId}`
            // Bước 2: Message format bao gồm type event và notification data
            await redis.publish(`notification:${userId}`, JSON.stringify({
                type: 'new_notification',
                notification
            }));
        }
        catch (error) {
            // Bước 3: Log lỗi nếu Redis publish thất bại (không throw để không ảnh hưởng flow chính)
            console.error('Redis publish error:', error);
        }
    }
    /**
     * Lấy tất cả notifications đã gửi (notifications do admin tạo).
     * @param userId - ID của admin đang yêu cầu
     * @returns Promise<any[]> - Danh sách notifications đã gửi
     */
    async getSentNotifications(userId) {
        // Lấy notifications where userId matches (notifications do chính admin tạo)
        // Hoặc lấy tất cả nếu admin
        return this.repository.findBySenderId(userId);
    }
    /**
     * Lấy tất cả notifications (admin - tất cả users).
     * @returns Promise<any[]> - Danh sách tất cả notifications
     */
    async getAllNotifications() {
        return this.repository.findAll();
    }
    /**
     * Gửi notification nhắc nhở hackathon sắp bắt đầu
     */
    async createHackathonReminderNotification(userId, hackathonTitle, startTime, hackathonId) {
        const timeUntilStart = Math.ceil((startTime.getTime() - Date.now()) / (1000 * 60));
        let timeText = '';
        if (timeUntilStart >= 60) {
            timeText = `${Math.ceil(timeUntilStart / 60)} giờ`;
        }
        else {
            timeText = `${timeUntilStart} phút`;
        }
        return this.createNotification({
            userId,
            type: 'hackathon_reminder',
            title: `Sự kiện "${hackathonTitle}" sắp bắt đầu!`,
            message: `Hackathon "${hackathonTitle}" sẽ bắt đầu trong ${timeText}. Hãy chuẩn bị sẵn sàng!`,
            metadata: { hackathonId }
        });
    }
    /**
     * Gửi notification xác nhận đã đăng ký hackathon
     */
    async createHackathonJoinedNotification(userId, hackathonTitle, hackathonId) {
        return this.createNotification({
            userId,
            type: 'hackathon_joined',
            title: `Đã đăng ký "${hackathonTitle}" thành công!`,
            message: `Bạn đã đăng ký tham gia hackathon "${hackathonTitle}". Chúc bạn may mắn!`,
            metadata: { hackathonId }
        });
    }
    /**
     * Gửi notification khi hackathon bắt đầu
     */
    async createHackathonStartedNotification(userId, hackathonTitle, hackathonId) {
        return this.createNotification({
            userId,
            type: 'hackathon_started',
            title: `Hackathon "${hackathonTitle}" đã bắt đầu!`,
            message: `Hackathon "${hackathonTitle}" đã chính thức bắt đầu. Vào thi ngay!`,
            metadata: { hackathonId }
        });
    }
}
exports.default = new NotificationService();
//# sourceMappingURL=notification.service.js.map