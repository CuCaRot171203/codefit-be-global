"use strict";
/**
 * @fileoverview Routes configuration cho Payment module
 * Định nghĩa các HTTP endpoints liên quan đến thanh toán
 * @module payment/routes
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = __importDefault(require("../controllers/payment.controller"));
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const router = (0, express_1.Router)();
/**
 * POST /api/payment/create
 * Tạo payment mới (QR hoặc direct)
 * Yêu cầu: Token xác thực hợp lệ
 * Body: { courseId: string, paymentMethod: 'qr' | 'direct' }
 */
router.post('/create', auth_middleware_1.verifyToken, (req, res, next) => payment_controller_1.default.createPayment(req, res, next));
/**
 * POST /api/payment/activate
 * Kích hoạt khóa học với mã code
 * Yêu cầu: Token xác thực hợp lệ
 * Body: { code: string, courseId?: string }
 */
router.post('/activate', auth_middleware_1.verifyToken, (req, res, next) => payment_controller_1.default.activateWithCode(req, res, next));
/**
 * GET /api/payment/my
 * Lấy danh sách payments của user hiện tại
 * Yêu cầu: Token xác thực hợp lệ
 */
router.get('/my', auth_middleware_1.verifyToken, (req, res, next) => payment_controller_1.default.getMyPayments(req, res, next));
/**
 * GET /api/payment/:id/status
 * Kiểm tra trạng thái payment
 * Yêu cầu: Token xác thực hợp lệ
 */
router.get('/:id/status', auth_middleware_1.verifyToken, (req, res, next) => payment_controller_1.default.checkPaymentStatus(req, res, next));
/**
 * POST /api/payment/:id/cancel
 * Hủy payment đang pending
 * Yêu cầu: Token xác thực hợp lệ
 */
router.post('/:id/cancel', auth_middleware_1.verifyToken, (req, res, next) => payment_controller_1.default.cancelPayment(req, res, next));
/**
 * GET /api/payment/:id
 * Lấy thông tin một payment cụ thể
 * Yêu cầu: Token xác thực hợp lệ
 */
router.get('/:id', auth_middleware_1.verifyToken, (req, res, next) => payment_controller_1.default.getPayment(req, res, next));
/**
 * POST /api/payment/sepay/ipn
 * IPN (Instant Payment Notification) từ SePay
 * Không yêu cầu xác thực - SePay sẽ gọi webhook này
 */
router.post('/sepay/ipn', (req, res, next) => payment_controller_1.default.sepayIpn(req, res, next));
/**
 * POST /api/payment/sepay/callback
 * Callback từ SePay (redirect URL sau thanh toán)
 * Không yêu cầu xác thực
 */
router.post('/sepay/callback', (req, res, next) => payment_controller_1.default.sepayCallback(req, res, next));
/**
 * POST /api/payment/admin/create-code
 * Tạo activate code mới (admin only)
 * Yêu cầu: Token xác thực hợp lệ với role admin
 */
router.post('/admin/create-code', auth_middleware_1.verifyToken, (req, res, next) => payment_controller_1.default.createActivateCode(req, res, next));
/**
 * POST /api/payment/payos/create
 * Tạo PayOS payment link cho khóa học
 * Yêu cầu: Token xác thực hợp lệ
 * Body: { courseId: string }
 */
router.post('/payos/create', auth_middleware_1.verifyToken, (req, res, next) => payment_controller_1.default.createPayOSPaymentLink(req, res, next));
/**
 * POST /api/payment/payos/cancel-payment
 * Hủy PayOS payment link đang pending
 * Yêu cầu: Token xác thực hợp lệ
 * Body: { paymentId: string, reason?: string }
 */
router.post('/payos/cancel-payment', auth_middleware_1.verifyToken, (req, res, next) => payment_controller_1.default.cancelPayOSPayment(req, res, next));
/**
 * POST /api/payment/payos/webhook
 * Webhook nhận thông báo thanh toán từ PayOS
 * Không yêu cầu xác thực - PayOS sẽ gọi webhook này
 */
router.post('/payos/webhook', (req, res, next) => payment_controller_1.default.payosWebhook(req, res, next));
/**
 * POST /api/payment/payos/confirm
 * Xác nhận thanh toán PayOS thành công (gọi từ frontend khi PayOS redirect về returnUrl)
 * Yêu cầu: Token xác thực hợp lệ
 * Body: { paymentId: string }
 */
router.post('/payos/confirm', auth_middleware_1.verifyToken, (req, res, next) => payment_controller_1.default.confirmPayOSPayment(req, res, next));
exports.default = router;
//# sourceMappingURL=payment.routes.js.map