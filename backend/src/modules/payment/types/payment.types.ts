/**
 * @fileoverview Types definitions cho Payment module
 * @module payment/types
 */

export interface CreatePaymentDto {
  courseId: string;
  paymentMethod: 'qr' | 'direct';
}

export interface PaymentResponse {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  payosOrderId?: string;
  qrCodeUrl?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface ActivateCodeDto {
  code: string;
  courseId?: string;
}

export interface PayOSCreatePaymentData {
  orderCode: number;
  amount: number;
  description: string;
  returnUrl: string;
  cancelUrl: string;
  buyerName?: string;
  buyerEmail?: string;
}
