/**
 * @fileoverview Repository layer cho Payment module
 * Xử lý các thao tác database liên quan đến Payment
 * @module payment/repositories
 */
import { Prisma } from '@prisma/client';
declare class PaymentRepository {
    /**
     * Tạo một payment mới
     */
    create(data: Prisma.PaymentCreateInput): Promise<{
        id: string;
        createdAt: Date;
        courseId: string;
        userId: string;
        amount: number;
        paymentMethod: string;
        paymentStatus: string;
        payosOrderId: string | null;
        payosTransactionId: string | null;
        qrCodeUrl: string | null;
        completedAt: Date | null;
    }>;
    /**
     * Tìm payment theo ID
     */
    findById(id: string): Promise<({
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            username: string;
            password: string;
            roleId: string;
            avatar: string | null;
            bio: string | null;
            fullName: string | null;
            phone: string | null;
            school: string | null;
            learningLevel: string | null;
            referralCode: string | null;
            isOnboarded: boolean;
            isActive: boolean;
        };
        course: {
            image: string | null;
            id: string;
            description: string;
            createdAt: Date;
            includes: string | null;
            title: string;
            price: number;
            originalPrice: number | null;
            duration: string | null;
            level: string;
            creatorId: string | null;
            subscriptionType: import(".prisma/client").$Enums.SubscriptionType;
            subscriptionPrice: number | null;
            autoEnrollOnApproval: boolean;
            unlockLessonsCount: number;
            unlockByPhase: boolean;
            features: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        courseId: string;
        userId: string;
        amount: number;
        paymentMethod: string;
        paymentStatus: string;
        payosOrderId: string | null;
        payosTransactionId: string | null;
        qrCodeUrl: string | null;
        completedAt: Date | null;
    }) | null>;
    /**
     * Tìm payment theo PayOS order ID
     */
    findByPayosOrderId(orderId: string): Promise<{
        id: string;
        createdAt: Date;
        courseId: string;
        userId: string;
        amount: number;
        paymentMethod: string;
        paymentStatus: string;
        payosOrderId: string | null;
        payosTransactionId: string | null;
        qrCodeUrl: string | null;
        completedAt: Date | null;
    } | null>;
    /**
     * Tìm payments của một user
     */
    findByUserId(userId: string): Promise<({
        course: {
            image: string | null;
            id: string;
            description: string;
            createdAt: Date;
            includes: string | null;
            title: string;
            price: number;
            originalPrice: number | null;
            duration: string | null;
            level: string;
            creatorId: string | null;
            subscriptionType: import(".prisma/client").$Enums.SubscriptionType;
            subscriptionPrice: number | null;
            autoEnrollOnApproval: boolean;
            unlockLessonsCount: number;
            unlockByPhase: boolean;
            features: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        courseId: string;
        userId: string;
        amount: number;
        paymentMethod: string;
        paymentStatus: string;
        payosOrderId: string | null;
        payosTransactionId: string | null;
        qrCodeUrl: string | null;
        completedAt: Date | null;
    })[]>;
    /**
     * Tìm payment đang pending của user cho một course
     */
    findPendingByUserAndCourse(userId: string, courseId: string): Promise<{
        id: string;
        createdAt: Date;
        courseId: string;
        userId: string;
        amount: number;
        paymentMethod: string;
        paymentStatus: string;
        payosOrderId: string | null;
        payosTransactionId: string | null;
        qrCodeUrl: string | null;
        completedAt: Date | null;
    } | null>;
    /**
     * Cập nhật payment status
     */
    updateStatus(id: string, status: string, data?: {
        payosTransactionId?: string;
        qrCodeUrl?: string;
        completedAt?: Date;
    }): Promise<{
        id: string;
        createdAt: Date;
        courseId: string;
        userId: string;
        amount: number;
        paymentMethod: string;
        paymentStatus: string;
        payosOrderId: string | null;
        payosTransactionId: string | null;
        qrCodeUrl: string | null;
        completedAt: Date | null;
    }>;
    /**
     * Cập nhật PayOS order ID
     */
    updatePayosOrderId(id: string, orderId: string): Promise<{
        id: string;
        createdAt: Date;
        courseId: string;
        userId: string;
        amount: number;
        paymentMethod: string;
        paymentStatus: string;
        payosOrderId: string | null;
        payosTransactionId: string | null;
        qrCodeUrl: string | null;
        completedAt: Date | null;
    }>;
}
declare const _default: PaymentRepository;
export default _default;
//# sourceMappingURL=payment.repository.d.ts.map