import { Response } from 'express';

/**
 * Base Controller - Cung cấp các phương thức helper cho controller
 * Giúp chuẩn hóa response format và xử lý lỗi
 */
export class BaseController {
  protected service: any;

  /**
   * Hàm khởi tạo BaseController
   * @param service - Service instance được inject vào controller
   */
  constructor(service: any) {
    this.service = service;
  }

  /**
   * Trả về response thành công
   * @param res - Express Response object
   * @param data - Dữ liệu trả về
   * @param message - Thông báo thành công
   * @param statusCode - HTTP status code (default: 200)
   */
  protected success(res: Response, data: any, message: string, statusCode: number = 200): Response {
    // Bước 1: Set HTTP status code
    // Bước 2: Trả về JSON với format chuẩn { success, message, data }
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  /**
   * Trả về response lỗi
   * @param res - Express Response object
   * @param message - Thông báo lỗi
   * @param statusCode - HTTP status code (default: 400)
   */
  protected error(res: Response, message: string, statusCode: number = 400): Response {
    // Bước 1: Set HTTP status code theo loại lỗi
    // Bước 2: Trả về JSON với format chuẩn { success, message }
    return res.status(statusCode).json({
      success: false,
      message
    });
  }
}

export default BaseController;
