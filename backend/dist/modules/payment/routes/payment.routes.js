/**
 * @fileoverview Routes configuration cho Payment module
 * Định nghĩa các HTTP endpoints liên quan đến thanh toán
 * @module payment/routes
 */
import { Router } from 'express';
import paymentController from '../controllers/payment.controller';
import { verifyToken } from '../../../middleware/auth.middleware';
const router = Router();
/**
 * POST /api/payment/create
 * Tạo payment mới (QR hoặc direct)
 * Yêu cầu: Token xác thực hợp lệ
 * Body: { courseId: string, paymentMethod: 'qr' | 'direct' }
 */
router.post('/create', verifyToken, (req, res, next) => paymentController.createPayment(req, res, next));
/**
 * POST /api/payment/activate
 * Kích hoạt khóa học với mã code
 * Yêu cầu: Token xác thực hợp lệ
 * Body: { code: string, courseId?: string }
 */
router.post('/activate', verifyToken, (req, res, next) => paymentController.activateWithCode(req, res, next));
/**
 * GET /api/payment/my
 * Lấy danh sách payments của user hiện tại
 * Yêu cầu: Token xác thực hợp lệ
 */
router.get('/my', verifyToken, (req, res, next) => paymentController.getMyPayments(req, res, next));
/**
 * GET /api/payment/:id/status
 * Kiểm tra trạng thái payment
 * Yêu cầu: Token xác thực hợp lệ
 */
router.get('/:id/status', verifyToken, (req, res, next) => paymentController.checkPaymentStatus(req, res, next));
/**
 * POST /api/payment/:id/cancel
 * Hủy payment đang pending
 * Yêu cầu: Token xác thực hợp lệ
 */
router.post('/:id/cancel', verifyToken, (req, res, next) => paymentController.cancelPayment(req, res, next));
/**
 * GET /api/payment/:id
 * Lấy thông tin một payment cụ thể
 * Yêu cầu: Token xác thực hợp lệ
 */
router.get('/:id', verifyToken, (req, res, next) => paymentController.getPayment(req, res, next));
/**
 * POST /api/payment/sepay/ipn
 * IPN (Instant Payment Notification) từ SePay
 * Không yêu cầu xác thực - SePay sẽ gọi webhook này
 */
router.post('/sepay/ipn', (req, res, next) => paymentController.sepayIpn(req, res, next));
/**
 * POST /api/payment/sepay/callback
 * Callback từ SePay (redirect URL sau thanh toán)
 * Không yêu cầu xác thực
 */
router.post('/sepay/callback', (req, res, next) => paymentController.sepayCallback(req, res, next));
/**
 * POST /api/payment/admin/create-code
 * Tạo activate code mới (admin only)
 * Yêu cầu: Token xác thực hợp lệ với role admin
 */
router.post('/admin/create-code', verifyToken, (req, res, next) => paymentController.createActivateCode(req, res, next));
/**
 * POST /api/payment/payos/create
 * Tạo PayOS payment link cho khóa học
 * Yêu cầu: Token xác thực hợp lệ
 * Body: { courseId: string }
 */
router.post('/payos/create', verifyToken, (req, res, next) => paymentController.createPayOSPaymentLink(req, res, next));
/**
 * POST /api/payment/payos/cancel-payment
 * Hủy PayOS payment link đang pending
 * Yêu cầu: Token xác thực hợp lệ
 * Body: { paymentId: string, reason?: string }
 */
router.post('/payos/cancel-payment', verifyToken, (req, res, next) => paymentController.cancelPayOSPayment(req, res, next));
/**
 * POST /api/payment/payos/webhook
 * Webhook nhận thông báo thanh toán từ PayOS
 * Không yêu cầu xác thực - PayOS sẽ gọi webhook này
 */
router.post('/payos/webhook', (req, res, next) => paymentController.payosWebhook(req, res, next));
/**
 * POST /api/payment/payos/confirm
 * Xác nhận thanh toán PayOS thành công (gọi từ frontend khi PayOS redirect về returnUrl)
 * Yêu cầu: Token xác thực hợp lệ
 * Body: { paymentId: string }
 */
router.post('/payos/confirm', verifyToken, (req, res, next) => paymentController.confirmPayOSPayment(req, res, next));
export default router;
//# sourceMappingURL=payment.routes.js.map