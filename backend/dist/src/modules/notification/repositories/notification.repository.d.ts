/**
 * @file notification.repository.ts
 * @description Repository xử lý các thao tác database cho module Notification.
 * Cung cấp các phương thức CRUD và truy vấn notification theo user.
 */
import { BaseRepository } from '../../../base/base.repository';
/**
 * Interface định nghĩa cấu trúc của một Notification.
 */
interface Notification {
    id: string;
    userId: string;
    type: string;
    title: string;
    content: string;
    isRead: boolean;
    createdAt: Date;
    metadata?: string | null;
}
/**
 * Repository class xử lý các thao tác database cho Notification.
 * Kế thừa từ BaseRepository và triển khai các phương thức truy vấn riêng.
 */
declare class NotificationRepository extends BaseRepository<Notification> {
    /** Model Prisma được sử dụng cho các thao tác database. */
    protected model: import(".prisma/client").Prisma.NotificationDelegate<import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    /**
     * Lấy tất cả notifications của một user, sắp xếp theo thời gian tạo giảm dần.
     * @param userId - ID của user cần lấy notifications
     * @returns Promise<Notification[]> - Danh sách notifications của user
     */
    findByUserId(userId: string): Promise<Notification[]>;
    /**
     * Lấy tất cả notifications chưa đọc của một user.
     * @param userId - ID của user cần lấy notifications chưa đọc
     * @returns Promise<Notification[]> - Danh sách notifications chưa đọc
     */
    findUnreadByUserId(userId: string): Promise<Notification[]>;
    /**
     * Đánh dấu một notification là đã đọc.
     * @param id - ID của notification cần đánh dấu đã đọc
     * @returns Promise<Notification> - Notification sau khi được cập nhật
     */
    markAsRead(id: string): Promise<Notification>;
    /**
     * Đánh dấu tất cả notifications của user là đã đọc.
     * @param userId - ID của user cần đánh dấu tất cả notifications đã đọc
     * @returns Promise<number> - Số lượng notifications đã được cập nhật
     */
    markAllAsRead(userId: string): Promise<number>;
    /**
     * Đếm số lượng notifications chưa đọc của user.
     * @param userId - ID của user cần đếm notifications chưa đọc
     * @returns Promise<number> - Số lượng notifications chưa đọc
     */
    countUnread(userId: string): Promise<number>;
    /**
     * Lấy tất cả notifications đã gửi bởi một user (admin).
     * @param senderId - ID của user đã gửi notifications
     * @returns Promise<Notification[]> - Danh sách notifications đã gửi
     */
    findBySenderId(senderId: string): Promise<any[]>;
    /**
     * Lấy tất cả notifications (admin).
     * @returns Promise<any[]> - Danh sách tất cả notifications
     */
    findAll(): Promise<any[]>;
}
declare const _default: NotificationRepository;
export default _default;
//# sourceMappingURL=notification.repository.d.ts.map