/**
 * @file notification.repository.ts
 * @description Repository xử lý các thao tác database cho module Notification.
 * Cung cấp các phương thức CRUD và truy vấn notification theo user.
 */

import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../../../base/base.repository';

/**
 * Khởi tạo PrismaClient singleton để kết nối database.
 */
const prisma = new PrismaClient();

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
class NotificationRepository extends BaseRepository<Notification> {
  /** Model Prisma được sử dụng cho các thao tác database. */
  protected model = prisma.notification;

  /**
   * Lấy tất cả notifications của một user, sắp xếp theo thời gian tạo giảm dần.
   * @param userId - ID của user cần lấy notifications
   * @returns Promise<Notification[]> - Danh sách notifications của user
   */
  async findByUserId(userId: string): Promise<Notification[]> {
    // Bước 1: Truy vấn database với điều kiện lọc theo userId
    // Bước 2: Sắp xếp kết quả theo createdAt giảm dần (mới nhất trước)
    return this.model.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userId: true,
        type: true,
        title: true,
        content: true,
        isRead: true,
        createdAt: true,
        metadata: true
      }
    });
  }

  /**
   * Lấy tất cả notifications chưa đọc của một user.
   * @param userId - ID của user cần lấy notifications chưa đọc
   * @returns Promise<Notification[]> - Danh sách notifications chưa đọc
   */
  async findUnreadByUserId(userId: string): Promise<Notification[]> {
    // Bước 1: Truy vấn database với điều kiện lọc userId và isRead = false
    // Bước 2: Sắp xếp kết quả theo createdAt giảm dần
    return this.model.findMany({
      where: { userId, isRead: false },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Đánh dấu một notification là đã đọc.
   * @param id - ID của notification cần đánh dấu đã đọc
   * @returns Promise<Notification> - Notification sau khi được cập nhật
   */
  async markAsRead(id: string): Promise<Notification> {
    // Bước 1: Cập nhật trường isRead = true cho notification có id tương ứng
    // Bước 2: Trả về notification đã được cập nhật
    return this.model.update({
      where: { id },
      data: { isRead: true }
    });
  }

  /**
   * Đánh dấu tất cả notifications của user là đã đọc.
   * @param userId - ID của user cần đánh dấu tất cả notifications đã đọc
   * @returns Promise<number> - Số lượng notifications đã được cập nhật
   */
  async markAllAsRead(userId: string): Promise<number> {
    // Bước 1: Cập nhật tất cả notifications của user có isRead = false
    // Bước 2: Trả về số lượng records đã được cập nhật
    const result = await this.model.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });
    return result.count;
  }

  /**
   * Đếm số lượng notifications chưa đọc của user.
   * @param userId - ID của user cần đếm notifications chưa đọc
   * @returns Promise<number> - Số lượng notifications chưa đọc
   */
  async countUnread(userId: string): Promise<number> {
    // Bước 1: Đếm số records thỏa điều kiện userId và isRead = false
    return this.model.count({
      where: { userId, isRead: false }
    });
  }

  /**
   * Lấy tất cả notifications đã gửi bởi một user (admin).
   * @param senderId - ID của user đã gửi notifications
   * @returns Promise<Notification[]> - Danh sách notifications đã gửi
   */
  async findBySenderId(senderId: string): Promise<any[]> {
    return this.model.findMany({
      where: { userId: senderId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            email: true
          }
        }
      }
    });
  }

  /**
   * Lấy tất cả notifications (admin).
   * @returns Promise<any[]> - Danh sách tất cả notifications
   */
  async findAll(): Promise<any[]> {
    return this.model.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            email: true
          }
        }
      }
    });
  }
}

export default new NotificationRepository();
