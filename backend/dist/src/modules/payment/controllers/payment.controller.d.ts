/**
 * @fileoverview Controller layer cho Payment module
 * Xử lý các HTTP requests liên quan đến thanh toán
 * @module payment/controllers
 */
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../base/base.controller';
/**
 * Controller xử lý các endpoints liên quan đến payment
 */
declare class PaymentController extends BaseController {
    constructor();
    /**
     * POST /payment/create - Tạo payment mới
     */
    createPayment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * POST /payment/activate - Kích hoạt với mã code
     */
    activateWithCode: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * GET /payment/my - Lấy danh sách payments của user
     */
    getMyPayments: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * GET /payment/:id - Lấy thông tin payment
     */
    getPayment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * GET /payment/:id/status - Check payment status
     */
    checkPaymentStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * POST /payment/:id/cancel - Hủy payment
     */
    cancelPayment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * POST /payment/sepay/ipn - IPN (Instant Payment Notification) từ SePay
     * SePay sẽ gọi endpoint này khi có thanh toán thành công
     */
    sepayIpn: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * POST /payment/sepay/callback - Callback từ SePay (redirect URL)
     */
    sepayCallback: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * POST /payment/admin/create-code - Tạo activate code (admin only)
     */
    createActivateCode: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * POST /payment/payos/create - Tạo PayOS payment link
     */
    createPayOSPaymentLink: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * POST /payment/payos/cancel - Hủy PayOS payment link
     */
    cancelPayOSPayment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * POST /payment/payos/confirm - Xác nhận PayOS thanh toán thành công (khi PayOS redirect về returnUrl)
     * Frontend gọi API này khi nhận redirect từ PayOS với code=00 hoặc status=PAID
     */
    confirmPayOSPayment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * POST /payment/payos/webhook - Webhook từ PayOS
     */
    payosWebhook: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: PaymentController;
export default _default;
//# sourceMappingURL=payment.controller.d.ts.map