import { Response } from 'express';
/**
 * Base Controller - Cung cấp các phương thức helper cho controller
 * Giúp chuẩn hóa response format và xử lý lỗi
 */
export declare class BaseController {
    protected service: any;
    /**
     * Hàm khởi tạo BaseController
     * @param service - Service instance được inject vào controller
     */
    constructor(service: any);
    /**
     * Trả về response thành công
     * @param res - Express Response object
     * @param data - Dữ liệu trả về
     * @param message - Thông báo thành công
     * @param statusCode - HTTP status code (default: 200)
     */
    protected success(res: Response, data: any, message: string, statusCode?: number): Response;
    /**
     * Trả về response lỗi
     * @param res - Express Response object
     * @param message - Thông báo lỗi
     * @param statusCode - HTTP status code (default: 400)
     */
    protected error(res: Response, message: string, statusCode?: number): Response;
}
export default BaseController;
//# sourceMappingURL=base.controller.d.ts.map