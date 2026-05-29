"use strict";
/**
 * @fileoverview Repository layer cho Payment module
 * Xử lý các thao tác database liên quan đến Payment
 * @module payment/repositories
 */
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class PaymentRepository {
    /**
     * Tạo một payment mới
     */
    async create(data) {
        return prisma.payment.create({ data });
    }
    /**
     * Tìm payment theo ID
     */
    async findById(id) {
        return prisma.payment.findUnique({
            where: { id },
            include: { course: true, user: true }
        });
    }
    /**
     * Tìm payment theo PayOS order ID
     */
    async findByPayosOrderId(orderId) {
        return prisma.payment.findFirst({
            where: { payosOrderId: orderId },
            include: { course: true, user: true }
        });
    }
    /**
     * Tìm payments của một user
     */
    async findByUserId(userId) {
        return prisma.payment.findMany({
            where: { userId },
            include: { course: true },
            orderBy: { createdAt: 'desc' }
        });
    }
    /**
     * Tìm payment đang pending của user cho một course
     */
    async findPendingByUserAndCourse(userId, courseId) {
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
    async updateStatus(id, status, data) {
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
    async updatePayosOrderId(id, orderId) {
        return prisma.payment.update({
            where: { id },
            data: { payosOrderId: orderId }
        });
    }
}
exports.default = new PaymentRepository();
//# sourceMappingURL=payment.repository.js.map