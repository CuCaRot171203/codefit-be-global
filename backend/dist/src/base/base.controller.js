"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
/**
 * Base Controller - Cung cấp các phương thức helper cho controller
 * Giúp chuẩn hóa response format và xử lý lỗi
 */
class BaseController {
    service;
    /**
     * Hàm khởi tạo BaseController
     * @param service - Service instance được inject vào controller
     */
    constructor(service) {
        this.service = service;
    }
    /**
     * Trả về response thành công
     * @param res - Express Response object
     * @param data - Dữ liệu trả về
     * @param message - Thông báo thành công
     * @param statusCode - HTTP status code (default: 200)
     */
    success(res, data, message, statusCode = 200) {
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
    error(res, message, statusCode = 400) {
        // Bước 1: Set HTTP status code theo loại lỗi
        // Bước 2: Trả về JSON với format chuẩn { success, message }
        return res.status(statusCode).json({
            success: false,
            message
        });
    }
}
exports.BaseController = BaseController;
exports.default = BaseController;
//# sourceMappingURL=base.controller.js.map