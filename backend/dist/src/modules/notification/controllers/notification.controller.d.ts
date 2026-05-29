/**
 * @file notification.controller.ts
 * @description Controller xử lý các HTTP requests cho module Notification.
 * Nhận requests từ client, gọi service và trả về responses.
 */
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../base/base.controller';
/**
 * Controller class xử lý các HTTP endpoints cho Notification.
 * Kế thừa từ BaseController và triển khai các handlers riêng cho từng endpoint.
 */
declare class NotificationController extends BaseController {
    /**
     * Constructor khởi tạo controller với notificationService.
     */
    constructor();
    /**
     * Tạo mới một notification.
     * Endpoint: POST /notifications
     * @param req - Request object chứa userId, type, title, message trong body
     * @param res - Response object để trả về kết quả
     * @param next - NextFunction để xử lý lỗi
     */
    createNotification: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy tất cả notifications của user hiện tại.
     * Endpoint: GET /notifications (yêu cầu authentication)
     * @param req - Request object chứa thông tin user đã xác thực
     * @param res - Response object để trả về danh sách notifications
     * @param next - NextFunction để xử lý lỗi
     */
    getMyNotifications: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy tất cả notifications chưa đọc của user hiện tại.
     * Endpoint: GET /notifications/unread (yêu cầu authentication)
     * @param req - Request object chứa thông tin user đã xác thực
     * @param res - Response object để trả về danh sách notifications chưa đọc
     * @param next - NextFunction để xử lý lỗi
     */
    getUnread: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Đánh dấu một notification là đã đọc.
     * Endpoint: PUT /notifications/:id/read
     * @param req - Request object chứa id notification trong params
     * @param res - Response object để trả về notification đã cập nhật
     * @param next - NextFunction để xử lý lỗi
     */
    markAsRead: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Đánh dấu tất cả notifications của user là đã đọc.
     * Endpoint: PUT /notifications/read-all (yêu cầu authentication)
     * @param req - Request object chứa thông tin user đã xác thực
     * @param res - Response object để trả về số lượng đã cập nhật
     * @param next - NextFunction để xử lý lỗi
     */
    markAllAsRead: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy số lượng notifications chưa đọc của user hiện tại.
     * Endpoint: GET /notifications/unread/count (yêu cầu authentication)
     * @param req - Request object chứa thông tin user đã xác thực
     * @param res - Response object để trả về số lượng
     * @param next - NextFunction để xử lý lỗi
     */
    getUnreadCount: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Xóa một notification.
     * Endpoint: DELETE /notifications/:id
     * @param req - Request object chứa id notification trong params
     * @param res - Response object để trả về kết quả xóa
     * @param next - NextFunction để xử lý lỗi
     */
    delete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy tất cả notifications đã gửi (notifications do admin tạo).
     * Endpoint: GET /notifications/sent
     * @param req - Request object
     * @param res - Response object
     * @param next - NextFunction
     */
    getSentNotifications: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy tất cả notifications (admin - tất cả users).
     * Endpoint: GET /notifications/all
     * @param req - Request object
     * @param res - Response object
     * @param next - NextFunction
     */
    getAllNotifications: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: NotificationController;
export default _default;
//# sourceMappingURL=notification.controller.d.ts.map