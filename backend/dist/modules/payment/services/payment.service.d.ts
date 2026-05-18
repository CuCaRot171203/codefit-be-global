/**
 * @fileoverview Service layer cho Payment module - Sử dụng SePay
 * Xử lý business logic liên quan đến thanh toán
 * @module payment/services
 */
declare class PaymentService {
    /**
     * Tạo payment mới cho thanh toán QR (SePay)
     */
    createPayment(userId: string, courseId: string, paymentMethod: 'qr' | 'direct'): Promise<{
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
     * Tạo SePay payment checkout
     */
    createSePayCheckout(userId: string, courseId: string): Promise<{
        payment: any;
        checkoutUrl: string;
        checkoutFormFields: {};
        qrCodeUrl: string;
        orderCode: string;
        isMock: boolean;
    } | {
        payment: {
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
        };
        checkoutUrl: string;
        checkoutFormFields: {
            signature: string;
            merchant?: string;
            operation?: "PURCHASE";
            payment_method?: "BANK_TRANSFER" | "NAPAS_BANK_TRANSFER";
            order_invoice_number: string;
            order_amount: number;
            currency: string;
            order_description: string;
            order_tax_amount?: number;
            customer_id?: string;
            success_url?: string;
            error_url?: string;
            cancel_url?: string;
            custom_data?: string;
        };
        orderCode: string;
    }>;
    /**
     * Tạo mock checkout cho development
     */
    private createMockCheckout;
    /**
     * Xử lý thanh toán trực tiếp với activate code
     */
    activateWithCode(userId: string, code: string): Promise<{
        enrollment: import("../../enrollment/types").Enrollment;
        payment: {
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
    }>;
    /**
     * Xác nhận thanh toán SePay thành công
     */
    confirmSePayPayment(orderCode: string): Promise<{
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
    } | {
        paymentStatus: string;
        enrollment: import("../../enrollment/types").Enrollment;
        id: string;
        createdAt: Date;
        courseId: string;
        userId: string;
        amount: number;
        paymentMethod: string;
        payosOrderId: string | null;
        payosTransactionId: string | null;
        qrCodeUrl: string | null;
        completedAt: Date | null;
    }>;
    /**
     * Lấy danh sách payments của user
     */
    getUserPayments(userId: string): Promise<{
        id: any;
        courseId: any;
        courseName: any;
        amount: any;
        paymentStatus: any;
        paymentMethod: any;
        payosOrderId: any;
        orderCode: any;
        createdAt: any;
        completedAt: any;
    }[]>;
    /**
     * Lấy thông tin payment
     */
    getPayment(paymentId: string): Promise<({
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
     * Check payment status
     * Kết hợp DB status + PayOS API để lấy trạng thái thật
     */
    checkPaymentStatus(paymentId: string): Promise<{
        id: string;
        paymentStatus: string;
        status: string;
        amount: number;
        paymentMethod: string;
        payosOrderId: string | null;
        orderCode: string | null;
        courseId: string;
        createdAt: Date;
        completedAt: Date | null;
    }>;
    /**
     * Hủy payment
     */
    cancelPayment(paymentId: string, userId: string): Promise<{
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
     * Tạo activate code mới (cho admin)
     */
    createActivateCode(courseId: string, createdBy: string): Promise<{
        id: string;
        createdAt: Date;
        courseId: string;
        type: import(".prisma/client").$Enums.CodeType;
        code: string;
        createdBy: string | null;
        usedBy: string | null;
        usedAt: Date | null;
        isUsed: boolean;
        expiresAt: Date | null;
    }>;
    /**
     * Generate random activate code
     */
    private generateActivateCode;
    /**
     * Tạo PayOS payment link cho khóa học
     */
    createPayOSPaymentLink(userId: string, courseId: string): Promise<{
        payment: {
            id: string;
            amount: number;
            paymentStatus: string;
        };
        checkoutUrl: string;
        qrCode: string;
        accountNumber: string;
        accountName: string;
        orderCode: string;
        payosOrderId: string;
        isMock?: undefined;
    } | {
        payment: {
            id: string;
            amount: number;
            paymentStatus: string;
        };
        checkoutUrl: null;
        qrCode: string;
        accountNumber: null;
        accountName: null;
        orderCode: string;
        payosOrderId: string;
        isMock: boolean;
    }>;
    /**
     * Xác nhận thanh toán PayOS thành công (từ webhook)
     */
    confirmPayOSPayment(orderCode: string, transactionId?: string): Promise<{
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
     * Xác nhận thanh toán PayOS bằng paymentId (gọi từ frontend khi PayOS redirect về)
     * CHỈ xác nhận nếu PayOS API xác nhận đã thanh toán thành công
     */
    confirmPayOSPaymentById(paymentId: string, userId: string): Promise<{
        paymentStatus: string;
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
        id: string;
        createdAt: Date;
        courseId: string;
        userId: string;
        amount: number;
        paymentMethod: string;
        payosOrderId: string | null;
        payosTransactionId: string | null;
        qrCodeUrl: string | null;
        completedAt: Date | null;
    }>;
    /**
     * Lấy trạng thái payment từ PayOS
     */
    getPayOSPaymentStatus(orderCode: string): Promise<{
        orderCode: string;
        status: import("@payos/node").PaymentLinkStatus;
        amount: number;
        paidAt: any;
    }>;
    /**
     * Hủy PayOS payment link
     */
    cancelPayOSPayment(paymentId: string, userId: string, reason?: string): Promise<{
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
declare const _default: PaymentService;
export default _default;
//# sourceMappingURL=payment.service.d.ts.map