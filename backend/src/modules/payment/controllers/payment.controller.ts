/**
 * @fileoverview Controller layer cho Payment module
 * Xử lý các HTTP requests liên quan đến thanh toán
 * @module payment/controllers
 */

import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../base/base.controller';
import paymentService from '../services/payment.service';
import payOS from '../../../utils/payos';

/**
 * Controller xử lý các endpoints liên quan đến payment
 */
class PaymentController extends BaseController {
  constructor() {
    super(paymentService);
  }

  /**
   * POST /payment/create - Tạo payment mới
   */
  createPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, 'Unauthorized', 401);
        return;
      }

      const { courseId, paymentMethod } = req.body;
      
      if (!courseId) {
        this.error(res, 'courseId is required', 400);
        return;
      }

      if (paymentMethod === 'qr') {
        const result = await this.service.createSePayCheckout(userId, courseId);
        this.success(res, result, 'Payment created successfully', 201);
      } else {
        this.error(res, 'Direct payment requires activation code', 400);
      }
    } catch (error: any) {
      const status = error.message.includes('not found') ? 404 : 
                     error.message.includes('Already') ? 400 : 500;
      this.error(res, error.message, status);
    }
  };

  /**
   * POST /payment/activate - Kích hoạt với mã code
   */
  activateWithCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, 'Unauthorized', 401);
        return;
      }

      const { code, courseId } = req.body;
      
      if (!code) {
        this.error(res, 'Activation code is required', 400);
        return;
      }

      const result = await this.service.activateWithCode(userId, code);
      this.success(res, result, 'Course activated successfully', 201);
    } catch (error: any) {
      const status = error.message.includes('not found') || error.message.includes('Invalid') ? 404 : 
                     error.message.includes('already') ? 400 : 500;
      this.error(res, error.message, status);
    }
  };

  /**
   * GET /payment/my - Lấy danh sách payments của user
   */
  getMyPayments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, 'Unauthorized', 401);
        return;
      }

      const payments = await this.service.getUserPayments(userId);
      this.success(res, payments, 'Payments retrieved successfully');
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * GET /payment/:id - Lấy thông tin payment
   */
  getPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, 'Unauthorized', 401);
        return;
      }

      const { id } = req.params;
      const payment = await this.service.getPayment(id);

      if (!payment) {
        this.error(res, 'Payment not found', 404);
        return;
      }

      this.success(res, payment, 'Payment retrieved successfully');
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * GET /payment/:id/status - Check payment status
   */
  checkPaymentStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const status = await this.service.checkPaymentStatus(id);
      this.success(res, status, 'Payment status retrieved successfully');
    } catch (error: any) {
      const status = error.message.includes('not found') ? 404 : 500;
      this.error(res, error.message, status);
    }
  };

  /**
   * POST /payment/:id/cancel - Hủy payment
   */
  cancelPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, 'Unauthorized', 401);
        return;
      }

      const { id } = req.params;
      const result = await this.service.cancelPayment(id, userId);
      this.success(res, result, 'Payment cancelled successfully');
    } catch (error: any) {
      const status = error.message.includes('not found') ? 404 : 
                     error.message.includes('Unauthorized') ? 403 : 500;
      this.error(res, error.message, status);
    }
  };

  /**
   * POST /payment/sepay/ipn - IPN (Instant Payment Notification) từ SePay
   * SePay sẽ gọi endpoint này khi có thanh toán thành công
   */
  sepayIpn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('[SePay IPN] Received:', JSON.stringify(req.body, null, 2));

      // SePay IPN payload thường có các trường:
      // - order_invoice_number: mã đơn hàng
      // - amount: số tiền
      // - status: trạng thái thanh toán
      const { order_invoice_number, amount, status, transaction_id } = req.body;

      // Xử lý thanh toán thành công
      if (status === 'SUCCESS' || status === 'success' || status === 'PAID') {
        console.log('[SePay IPN] Payment success for order:', order_invoice_number);
        await this.service.confirmSePayPayment(order_invoice_number);
        console.log('[SePay IPN] Enrollment created successfully');
      }

      // Response 200 để SePay biết đã nhận được
      res.status(200).json({ received: true, message: 'IPN processed' });
    } catch (error: any) {
      console.error('SePay IPN error:', error);
      // Vẫn response 200 để SePay không retry
      res.status(200).json({ received: true, message: 'Error logged' });
    }
  };

  /**
   * POST /payment/sepay/callback - Callback từ SePay (redirect URL)
   */
  sepayCallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderCode, status } = req.body;

      if (status === 'success' || status === 'PAID') {
        await this.service.confirmSePayPayment(orderCode.toString());
      }

      this.success(res, { received: true }, 'Callback processed');
    } catch (error: any) {
      console.error('SePay callback error:', error);
      this.error(res, error.message, 500);
    }
  };

  /**
   * POST /payment/admin/create-code - Tạo activate code (admin only)
   */
  createActivateCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      const userRole = req.user?.role;
      
      if (!userId) {
        this.error(res, 'Unauthorized', 401);
        return;
      }

      if (userRole !== 'admin') {
        this.error(res, 'Admin access required', 403);
        return;
      }

      const { courseId } = req.body;
      
      if (!courseId) {
        this.error(res, 'courseId is required', 400);
        return;
      }

      const result = await this.service.createActivateCode(courseId, userId);
      this.success(res, result, 'Activate code created successfully', 201);
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * POST /payment/payos/create - Tạo PayOS payment link
   */
  createPayOSPaymentLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, 'Unauthorized', 401);
        return;
      }

      const { courseId } = req.body;

      if (!courseId) {
        this.error(res, 'courseId is required', 400);
        return;
      }

      const result = await this.service.createPayOSPaymentLink(userId, courseId);
      this.success(res, result, 'PayOS payment link created', 201);
    } catch (error: any) {
      const status = error.message.includes('not found') ? 404 :
                     error.message.includes('Already') ? 400 : 500;
      this.error(res, error.message, status);
    }
  };

  /**
   * POST /payment/payos/cancel - Hủy PayOS payment link
   */
  cancelPayOSPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, 'Unauthorized', 401);
        return;
      }

      const { paymentId, reason } = req.body;

      if (!paymentId) {
        this.error(res, 'paymentId is required', 400);
        return;
      }

      const result = await this.service.cancelPayOSPayment(paymentId, userId, reason);
      this.success(res, result, 'PayOS payment cancelled');
    } catch (error: any) {
      const status = error.message.includes('not found') ? 404 :
                     error.message.includes('Unauthorized') ? 403 :
                     error.message.includes('Cannot cancel') ? 400 : 500;
      this.error(res, error.message, status);
    }
  };

  /**
   * POST /payment/payos/confirm - Xác nhận PayOS thanh toán thành công (khi PayOS redirect về returnUrl)
   * Frontend gọi API này khi nhận redirect từ PayOS với code=00 hoặc status=PAID
   */
  confirmPayOSPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, 'Unauthorized', 401);
        return;
      }

      const { paymentId } = req.body;

      if (!paymentId) {
        this.error(res, 'paymentId is required', 400);
        return;
      }

      const result = await this.service.confirmPayOSPaymentById(paymentId, userId);
      this.success(res, result, 'Payment confirmed successfully');
    } catch (error: any) {
      const status = error.message.includes('not found') ? 404 :
                     error.message.includes('Unauthorized') ? 403 : 500;
      this.error(res, error.message, status);
    }
  };

  /**
   * POST /payment/payos/webhook - Webhook từ PayOS
   */
  payosWebhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('[PayOS Webhook] Received:', JSON.stringify(req.body, null, 2));

      const webhookData = await payOS.webhooks.verify(req.body);

      console.log('[PayOS Webhook] Verified data:', JSON.stringify(webhookData, null, 2));

      const orderCode = String(webhookData.orderCode);

      await this.service.confirmPayOSPayment(
        orderCode,
        webhookData.transactionId || undefined
      );

      console.log('[PayOS Webhook] Payment confirmed for order:', orderCode);

      res.status(200).json({ error: 0, message: 'Ok' });
    } catch (error: any) {
      console.error('[PayOS Webhook] Error:', error.message);
      res.status(200).json({ error: 0, message: 'Webhook processed' });
    }
  };
}

export default new PaymentController();
