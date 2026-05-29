/**
 * @fileoverview Repository layer cho Payment module
 * Xử lý các thao tác database liên quan đến Payment
 * @module payment/repositories
 */

import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

class PaymentRepository {
  /**
   * Tạo một payment mới
   */
  async create(data: Prisma.PaymentCreateInput) {
    return prisma.payment.create({ data });
  }

  /**
   * Tìm payment theo ID
   */
  async findById(id: string) {
    return prisma.payment.findUnique({
      where: { id },
      include: { course: true, user: true }
    });
  }

  /**
   * Tìm payment theo PayOS order ID
   */
  async findByPayosOrderId(orderId: string) {
    return prisma.payment.findFirst({
      where: { payosOrderId: orderId } as any,
      include: { course: true, user: true }
    });
  }

  /**
   * Tìm payments của một user
   */
  async findByUserId(userId: string) {
    return prisma.payment.findMany({
      where: { userId },
      include: { course: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Tìm payment đang pending của user cho một course
   */
  async findPendingByUserAndCourse(userId: string, courseId: string) {
    return prisma.payment.findFirst({
      where: {
        userId,
        courseId,
        paymentStatus: 'pending'
      }
    });
  }

  /**
   * Cập nhật payment status
   */
  async updateStatus(id: string, status: string, data?: { 
    payosTransactionId?: string;
    qrCodeUrl?: string;
    completedAt?: Date;
  }) {
    return prisma.payment.update({
      where: { id },
      data: {
        paymentStatus: status,
        ...data
      }
    });
  }

  /**
   * Cập nhật PayOS order ID
   */
  async updatePayosOrderId(id: string, orderId: string) {
    return prisma.payment.update({
      where: { id },
      data: { payosOrderId: orderId }
    });
  }
}

export default new PaymentRepository();
