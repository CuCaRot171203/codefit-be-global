"use strict";
/**
 * @fileoverview Service layer cho Payment module - Sử dụng SePay
 * Xử lý business logic liên quan đến thanh toán
 * @module payment/services
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sepay_pg_node_1 = require("sepay-pg-node");
const payos_1 = __importDefault(require("../../../utils/payos"));
const payment_repository_1 = __importDefault(require("../repositories/payment.repository"));
const activateCode_repository_1 = __importDefault(require("../repositories/activateCode.repository"));
const enrollment_repository_1 = __importDefault(require("../../enrollment/repositories/enrollment.repository"));
const course_repository_1 = __importDefault(require("../../course/repositories/course.repository"));
const email_service_1 = __importDefault(require("../../email/email.service"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Initialize SePay client
let sePayClient = null;
const sePayMerchantId = process.env.SEPAY_MERCHANT_ID;
const sePaySecretKey = process.env.SEPAY_SECRET_KEY;
const sePayEnv = process.env.SEPAY_ENV || 'sandbox';
console.log('[SePay] Merchant ID:', sePayMerchantId ? `${sePayMerchantId.substring(0, 8)}...` : 'NOT SET');
if (sePayMerchantId && sePaySecretKey) {
    try {
        sePayClient = new sepay_pg_node_1.SePayPgClient({
            env: sePayEnv,
            merchant_id: sePayMerchantId,
            secret_key: sePaySecretKey
        });
        console.log('[SePay] Initialized successfully');
    }
    catch (initError) {
        console.error('[SePay] Init error:', initError);
    }
}
else {
    console.log('[SePay] Not configured - missing credentials');
}
class PaymentService {
    /**
     * Tạo payment mới cho thanh toán QR (SePay)
     */
    async createPayment(userId, courseId, paymentMethod) {
        // Lấy thông tin khóa học
        const course = await course_repository_1.default.findById(courseId);
        if (!course) {
            throw new Error('Course not found');
        }
        // Kiểm tra đã đăng ký chưa
        const existingEnrollment = await enrollment_repository_1.default.findByUserIdAndCourseId(userId, courseId);
        if (existingEnrollment) {
            throw new Error('Already enrolled in this course');
        }
        // Use transaction to prevent race condition
        return await prisma.$transaction(async (tx) => {
            // Kiểm tra payment đang pending trong transaction
            const pendingPayment = await tx.payment.findFirst({
                where: {
                    userId,
                    courseId,
                    paymentStatus: 'pending',
                    paymentMethod: paymentMethod === 'qr' ? 'payos' : 'direct',
                },
            });
            if (pendingPayment) {
                return pendingPayment;
            }
            // Tạo payment mới
            const payment = await tx.payment.create({
                data: {
                    userId,
                    courseId,
                    amount: course.price,
                    paymentMethod: paymentMethod === 'qr' ? 'payos' : 'direct',
                    paymentStatus: paymentMethod === 'direct' ? 'completed' : 'pending'
                }
            });
            return payment;
        });
    }
    /**
     * Tạo SePay payment checkout
     */
    async createSePayCheckout(userId, courseId) {
        const payment = await this.createPayment(userId, courseId, 'qr');
        // Lấy thông tin khóa học
        const course = await course_repository_1.default.findById(courseId);
        // Generate order code
        const orderCode = `CODEFIT-${Date.now()}`;
        // Update payment với order ID
        await payment_repository_1.default.updatePayosOrderId(payment.id, orderCode);
        // Kiểm tra xem SePay có được config chưa
        const isSePayConfigured = process.env.SEPAY_MERCHANT_ID &&
            process.env.SEPAY_MERCHANT_ID !== 'YOUR_MERCHANT_ID';
        if (isSePayConfigured && sePayClient) {
            try {
                // Tạo checkout URL và form fields với SePay SDK
                const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
                const checkoutFormFields = sePayClient.checkout.initOneTimePaymentFields({
                    payment_method: 'BANK_TRANSFER',
                    order_invoice_number: orderCode,
                    order_amount: Math.round(payment.amount),
                    currency: 'VND',
                    order_description: `Thanh toan CodeFit #${orderCode}`,
                    success_url: `${frontendUrl}/user/payment/success?orderCode=${orderCode}&paymentId=${payment.id}&courseId=${courseId}`,
                    error_url: `${frontendUrl}/user/payment/error?orderCode=${orderCode}&paymentId=${payment.id}`,
                    cancel_url: `${frontendUrl}/user/payment/cancel?orderCode=${orderCode}&paymentId=${payment.id}`,
                });
                // Lấy checkout URL
                const checkoutUrl = sePayClient.checkout.initCheckoutUrl();
                console.log('[SePay] Checkout created for order:', orderCode);
                return {
                    payment,
                    checkoutUrl,
                    checkoutFormFields,
                    orderCode
                };
            }
            catch (sePayError) {
                console.error('SePay Error:', sePayError);
                return this.createMockCheckout(payment, course, orderCode);
            }
        }
        else {
            // Dùng mock
            return this.createMockCheckout(payment, course, orderCode);
        }
    }
    /**
     * Tạo mock checkout cho development
     */
    createMockCheckout(payment, course, orderCode) {
        // Tạo QR code URL với Google Charts API
        const qrData = JSON.stringify({
            courseId: payment.courseId,
            paymentId: payment.id,
            amount: payment.amount,
            orderCode: orderCode,
            timestamp: Date.now()
        });
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`;
        return {
            payment,
            checkoutUrl: `https://sepay.vn/mock-checkout/${payment.id}`,
            checkoutFormFields: {},
            qrCodeUrl,
            orderCode,
            isMock: true
        };
    }
    /**
     * Xử lý thanh toán trực tiếp với activate code
     */
    async activateWithCode(userId, code) {
        // Tìm activate code
        const activateCode = await activateCode_repository_1.default.findByCode(code);
        if (!activateCode) {
            throw new Error('Invalid activation code');
        }
        if (activateCode.isUsed) {
            throw new Error('This activation code has already been used');
        }
        if (activateCode.expiresAt && new Date(activateCode.expiresAt) < new Date()) {
            throw new Error('This activation code has expired');
        }
        // Kiểm tra user đã đăng ký chưa
        const existingEnrollment = await enrollment_repository_1.default.findByUserIdAndCourseId(userId, activateCode.courseId);
        if (existingEnrollment) {
            throw new Error('Already enrolled in this course');
        }
        // Tạo payment cho direct method
        const payment = await payment_repository_1.default.create({
            userId,
            courseId: activateCode.courseId,
            amount: 0,
            paymentMethod: 'direct',
            paymentStatus: 'completed',
            completedAt: new Date()
        });
        // Đánh dấu activate code đã sử dụng
        await activateCode_repository_1.default.markAsUsed(code, userId);
        // Tạo enrollment
        const enrollment = await enrollment_repository_1.default.create({
            userId,
            courseId: activateCode.courseId,
            progress: 0,
            paymentId: payment.id
        });
        return {
            enrollment,
            payment,
            course: activateCode.course
        };
    }
    /**
     * Xác nhận thanh toán SePay thành công
     */
    async confirmSePayPayment(orderCode) {
        const payment = await payment_repository_1.default.findByPayosOrderId(orderCode);
        if (!payment) {
            throw new Error('Payment not found');
        }
        if (payment.paymentStatus === 'completed') {
            return payment;
        }
        // Cập nhật payment status
        await payment_repository_1.default.updateStatus(payment.id, 'completed', {
            completedAt: new Date()
        });
        // Tạo enrollment
        const enrollment = await enrollment_repository_1.default.create({
            userId: payment.userId,
            courseId: payment.courseId,
            progress: 0,
            paymentId: payment.id
        });
        // Gửi email xác nhận thanh toán thành công
        try {
            const user = await prisma.user.findUnique({ where: { id: payment.userId } });
            const course = await course_repository_1.default.findById(payment.courseId);
            if (user && user.email && course?.title) {
                const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
                const courseUrl = `${frontendUrl}/user/courses/${payment.courseId}/content`;
                await email_service_1.default.sendCourseAccessGrantedNotification(user.email, user.fullName || user.username, course.title, courseUrl);
                console.log(`[SePay] Confirmation email sent to ${user.email}`);
            }
        }
        catch (emailError) {
            console.error('[SePay] Failed to send confirmation email:', emailError);
        }
        return {
            ...payment,
            paymentStatus: 'completed',
            enrollment
        };
    }
    /**
     * Lấy danh sách payments của user
     */
    async getUserPayments(userId) {
        const payments = await payment_repository_1.default.findByUserId(userId);
        return payments.map((p) => ({
            id: p.id,
            courseId: p.courseId,
            courseName: p.course?.title || '',
            amount: p.amount,
            paymentStatus: p.paymentStatus,
            paymentMethod: p.paymentMethod,
            payosOrderId: p.payosOrderId,
            orderCode: p.payosOrderId,
            createdAt: p.createdAt,
            completedAt: p.completedAt,
        }));
    }
    /**
     * Lấy thông tin payment
     */
    async getPayment(paymentId) {
        return payment_repository_1.default.findById(paymentId);
    }
    /**
     * Check payment status
     * Kết hợp DB status + PayOS API để lấy trạng thái thật
     */
    async checkPaymentStatus(paymentId) {
        const payment = await payment_repository_1.default.findById(paymentId);
        if (!payment) {
            throw new Error('Payment not found');
        }
        // Nếu đã completed/cancelled ở DB → trả ngay
        if (payment.paymentStatus !== 'pending') {
            return {
                id: payment.id,
                paymentStatus: payment.paymentStatus,
                status: payment.paymentStatus,
                amount: payment.amount,
                paymentMethod: payment.paymentMethod,
                payosOrderId: payment.payosOrderId,
                orderCode: payment.payosOrderId,
                courseId: payment.courseId,
                createdAt: payment.createdAt,
                completedAt: payment.completedAt
            };
        }
        // Nếu là PayOS + có payosOrderId → hỏi PayOS API
        if (payment.paymentMethod === 'payos' && payment.payosOrderId) {
            try {
                const payosData = await payos_1.default.paymentRequests.get(String(payment.payosOrderId));
                console.log(`[checkPaymentStatus] PayOS status for ${payment.payosOrderId}: ${payosData.status}`);
                // Nếu PayOS đã thanh toán thành công
                if (payosData.status === 'PAID') {
                    await payment_repository_1.default.updateStatus(payment.id, 'completed', {
                        completedAt: new Date(),
                        payosTransactionId: payosData.transactions?.[0]?.reference
                    });
                    // Tạo enrollment
                    const existingEnrollment = await enrollment_repository_1.default.findByUserIdAndCourseId(payment.userId, payment.courseId);
                    if (!existingEnrollment) {
                        await enrollment_repository_1.default.create({
                            userId: payment.userId,
                            courseId: payment.courseId,
                            progress: 0,
                            paymentId: payment.id
                        });
                    }
                    return {
                        id: payment.id,
                        paymentStatus: 'completed',
                        status: 'completed',
                        amount: payment.amount,
                        paymentMethod: payment.paymentMethod,
                        payosOrderId: payment.payosOrderId,
                        orderCode: payment.payosOrderId,
                        courseId: payment.courseId,
                        createdAt: payment.createdAt,
                        completedAt: new Date()
                    };
                }
                // PayOS vẫn chưa paid → trả pending
                return {
                    id: payment.id,
                    paymentStatus: payment.paymentStatus,
                    status: payment.paymentStatus,
                    amount: payment.amount,
                    paymentMethod: payment.paymentMethod,
                    payosOrderId: payment.payosOrderId,
                    orderCode: payment.payosOrderId,
                    courseId: payment.courseId,
                    createdAt: payment.createdAt,
                    completedAt: payment.completedAt
                };
            }
            catch (payosError) {
                // PayOS API fail → vẫn trả DB status
                console.error(`[checkPaymentStatus] PayOS API error for ${payment.payosOrderId}:`, payosError.message);
            }
        }
        return {
            id: payment.id,
            paymentStatus: payment.paymentStatus,
            status: payment.paymentStatus,
            amount: payment.amount,
            paymentMethod: payment.paymentMethod,
            payosOrderId: payment.payosOrderId,
            orderCode: payment.payosOrderId,
            courseId: payment.courseId,
            createdAt: payment.createdAt,
            completedAt: payment.completedAt
        };
    }
    /**
     * Hủy payment
     */
    async cancelPayment(paymentId, userId) {
        const payment = await payment_repository_1.default.findById(paymentId);
        if (!payment) {
            throw new Error('Payment not found');
        }
        if (payment.userId !== userId) {
            throw new Error('Unauthorized');
        }
        if (payment.paymentStatus !== 'pending') {
            throw new Error('Cannot cancel completed payment');
        }
        return payment_repository_1.default.updateStatus(paymentId, 'cancelled');
    }
    /**
     * Tạo activate code mới (cho admin)
     */
    async createActivateCode(courseId, createdBy) {
        // Generate random code
        const code = this.generateActivateCode();
        return activateCode_repository_1.default.create({
            code,
            courseId,
            createdBy,
            isUsed: false
        });
    }
    /**
     * Generate random activate code
     */
    generateActivateCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'CF-';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }
    /**
     * Tạo PayOS payment link cho khóa học
     */
    async createPayOSPaymentLink(userId, courseId) {
        const course = await course_repository_1.default.findById(courseId);
        if (!course) {
            throw new Error('Course not found');
        }
        const existingEnrollment = await enrollment_repository_1.default.findByUserIdAndCourseId(userId, courseId);
        if (existingEnrollment) {
            throw new Error('Already enrolled in this course');
        }
        const pendingPayment = await payment_repository_1.default.findPendingByUserAndCourse(userId, courseId);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        let payment = pendingPayment;
        if (!pendingPayment) {
            payment = await payment_repository_1.default.create({
                userId,
                courseId,
                amount: course.price,
                paymentMethod: 'payos',
                paymentStatus: 'pending'
            });
        }
        if (!payment) {
            throw new Error('Failed to create or retrieve payment');
        }
        // Always generate a fresh orderCode and update PayOS order ID
        const orderCode = Number(String(Date.now()).slice(-9));
        await payment_repository_1.default.updatePayosOrderId(payment.id, String(orderCode));
        try {
            const payosBody = {
                orderCode,
                amount: Math.round(course.price),
                description: `Thanh toan CodeFit`,
                returnUrl: `${frontendUrl}/user/payment/success?paymentId=${payment.id}&courseId=${courseId}`,
                cancelUrl: `${frontendUrl}/user/payment/cancel?paymentId=${payment.id}&courseId=${courseId}`,
                items: [
                    {
                        name: course.title,
                        quantity: 1,
                        price: Math.round(course.price)
                    }
                ]
            };
            const payosResponse = await payos_1.default.paymentRequests.create(payosBody);
            return {
                payment: {
                    id: payment.id,
                    amount: payment.amount,
                    paymentStatus: payment.paymentStatus
                },
                checkoutUrl: payosResponse.checkoutUrl,
                qrCode: payosResponse.qrCode,
                accountNumber: payosResponse.accountNumber,
                accountName: payosResponse.accountName,
                orderCode: String(orderCode),
                payosOrderId: String(orderCode)
            };
        }
        catch (payosError) {
            console.error('[PayOS] createPaymentLink error:', payosError);
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(JSON.stringify({
                paymentId: payment.id,
                orderCode: String(orderCode),
                amount: course.price,
                courseId
            }))}`;
            return {
                payment: {
                    id: payment.id,
                    amount: payment.amount,
                    paymentStatus: payment.paymentStatus
                },
                checkoutUrl: null,
                qrCode: qrCodeUrl,
                accountNumber: null,
                accountName: null,
                orderCode: String(orderCode),
                payosOrderId: String(orderCode),
                isMock: true
            };
        }
    }
    /**
     * Xác nhận thanh toán PayOS thành công (từ webhook)
     */
    async confirmPayOSPayment(orderCode, transactionId) {
        const payment = await payment_repository_1.default.findByPayosOrderId(orderCode);
        if (!payment) {
            throw new Error('Payment not found');
        }
        if (payment.paymentStatus === 'completed') {
            return payment;
        }
        await payment_repository_1.default.updateStatus(payment.id, 'completed', {
            completedAt: new Date(),
            payosTransactionId: transactionId
        });
        const existingEnrollment = await enrollment_repository_1.default.findByUserIdAndCourseId(payment.userId, payment.courseId);
        if (!existingEnrollment) {
            await enrollment_repository_1.default.create({
                userId: payment.userId,
                courseId: payment.courseId,
                progress: 0,
                paymentId: payment.id
            });
        }
        // Gửi email xác nhận thanh toán thành công
        try {
            const user = await prisma.user.findUnique({ where: { id: payment.userId } });
            const course = await course_repository_1.default.findById(payment.courseId);
            if (user && user.email && course?.title) {
                const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
                const courseUrl = `${frontendUrl}/user/courses/${payment.courseId}/content`;
                await email_service_1.default.sendCourseAccessGrantedNotification(user.email, user.fullName || user.username, course.title, courseUrl);
                console.log(`[PayOS] Confirmation email sent to ${user.email}`);
            }
        }
        catch (emailError) {
            console.error('[PayOS] Failed to send confirmation email:', emailError);
        }
        return {
            ...payment,
            paymentStatus: 'completed',
            completedAt: new Date()
        };
    }
    /**
     * Xác nhận thanh toán PayOS bằng paymentId (gọi từ frontend khi PayOS redirect về)
     * CHỈ xác nhận nếu PayOS API xác nhận đã thanh toán thành công
     */
    async confirmPayOSPaymentById(paymentId, userId) {
        const payment = await payment_repository_1.default.findById(paymentId);
        if (!payment) {
            throw new Error('Payment not found');
        }
        if (payment.userId !== userId) {
            throw new Error('Unauthorized');
        }
        if (payment.paymentStatus === 'completed') {
            return { ...payment, paymentStatus: 'completed' };
        }
        // Lấy transaction ID và verify từ PayOS
        let transactionId;
        let payosStatus;
        if (payment.payosOrderId) {
            try {
                const payosData = await payos_1.default.paymentRequests.get(String(payment.payosOrderId));
                payosStatus = payosData.status;
                transactionId = payosData.transactions?.[0]?.reference || undefined;
                console.log(`[confirmPayOSPaymentById] PayOS status for ${payment.payosOrderId}: ${payosStatus}`);
            }
            catch (payosError) {
                console.error(`[confirmPayOSPaymentById] PayOS API error:`, payosError.message);
                throw new Error('Không thể xác minh thanh toán với PayOS. Vui lòng thử lại sau.');
            }
        }
        else {
            throw new Error('Payment chưa có PayOS order ID');
        }
        // CHỈ confirm nếu PayOS đã PAID/COMPLETED
        if (payosStatus !== 'PAID' && payosStatus !== 'COMPLETED') {
            throw new Error(`Thanh toán chưa hoàn tất trên PayOS (trạng thái: ${payosStatus})`);
        }
        await payment_repository_1.default.updateStatus(payment.id, 'completed', {
            completedAt: new Date(),
            payosTransactionId: transactionId
        });
        const existingEnrollment = await enrollment_repository_1.default.findByUserIdAndCourseId(payment.userId, payment.courseId);
        if (!existingEnrollment) {
            await enrollment_repository_1.default.create({
                userId: payment.userId,
                courseId: payment.courseId,
                progress: 0,
                paymentId: payment.id
            });
        }
        // Gửi email xác nhận
        try {
            const user = await prisma.user.findUnique({ where: { id: payment.userId } });
            const course = await course_repository_1.default.findById(payment.courseId);
            if (user && user.email && course?.title) {
                const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
                const courseUrl = `${frontendUrl}/user/courses/${payment.courseId}/content`;
                await email_service_1.default.sendCourseAccessGrantedNotification(user.email, user.fullName || user.username, course.title, courseUrl);
            }
        }
        catch (emailError) {
            console.error('[confirmPayOSPaymentById] Failed to send email:', emailError);
        }
        return {
            ...payment,
            paymentStatus: 'completed',
            completedAt: new Date()
        };
    }
    /**
     * Lấy trạng thái payment từ PayOS
     */
    async getPayOSPaymentStatus(orderCode) {
        try {
            const payosData = await payos_1.default.paymentRequests.get(orderCode);
            return {
                orderCode,
                status: payosData.status,
                amount: payosData.amount
            };
        }
        catch (payosError) {
            throw new Error(`PayOS status check failed: ${payosError.message}`);
        }
    }
    /**
     * Hủy PayOS payment link
     */
    async cancelPayOSPayment(paymentId, userId, reason) {
        console.log(`[CancelPayOS] paymentId=${paymentId}, userId=${userId}`);
        const payment = await payment_repository_1.default.findById(paymentId);
        console.log(`[CancelPayOS] DB result:`, payment ? `found, status=${payment.paymentStatus}, dbUserId=${payment.userId}` : 'NOT FOUND');
        if (!payment) {
            throw new Error('Payment not found');
        }
        if (payment.userId !== userId) {
            throw new Error('Unauthorized');
        }
        if (payment.paymentStatus !== 'pending') {
            throw new Error('Cannot cancel non-pending payment');
        }
        if (payment.payosOrderId) {
            try {
                await payos_1.default.paymentRequests.cancel(payment.payosOrderId, reason);
            }
            catch (payosError) {
                console.warn('[PayOS] cancelPaymentLink warning:', payosError?.message);
            }
        }
        return payment_repository_1.default.updateStatus(paymentId, 'cancelled');
    }
}
exports.default = new PaymentService();
//# sourceMappingURL=payment.service.js.map