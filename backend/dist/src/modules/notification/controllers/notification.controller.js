"use strict";
/**
 * @file notification.controller.ts
 * @description Controller xử lý các HTTP requests cho module Notification.
 * Nhận requests từ client, gọi service và trả về responses.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_controller_1 = require("../../../base/base.controller");
const notification_service_1 = __importDefault(require("../services/notification.service"));
/**
 * Controller class xử lý các HTTP endpoints cho Notification.
 * Kế thừa từ BaseController và triển khai các handlers riêng cho từng endpoint.
 */
class NotificationController extends base_controller_1.BaseController {
    /**
     * Constructor khởi tạo controller với notificationService.
     */
    constructor() {
        super(notification_service_1.default);
    }
    /**
     * Tạo mới một notification.
     * Endpoint: POST /notifications
     * @param req - Request object chứa userId, type, title, message trong body
     * @param res - Response object để trả về kết quả
     * @param next - NextFunction để xử lý lỗi
     */
    createNotification = async (req, res, next) => {
        try {
            // Bước 1: Extract thông tin notification từ request body
            const { userId, type, title, message, metadata } = req.body;
            // Bước 2: Gọi service để tạo notification mới
            const notification = await this.service.createNotification({
                userId,
                type,
                title,
                message,
                metadata
            });
            // Bước 3: Trả về response thành công với status 201
            this.success(res, notification, 'Notification created successfully', 201);
        }
        catch (error) {
            // Bước 4: Chuyển lỗi sang middleware xử lý exception
            next(error);
        }
    };
    /**
     * Lấy tất cả notifications của user hiện tại.
     * Endpoint: GET /notifications (yêu cầu authentication)
     * @param req - Request object chứa thông tin user đã xác thực
     * @param res - Response object để trả về danh sách notifications
     * @param next - NextFunction để xử lý lỗi
     */
    getMyNotifications = async (req, res, next) => {
        try {
            // Bước 1: Extract userId từ token đã được verify trong middleware
            const userId = req.user?.userId;
            console.log('[NOTIFICATION CONTROLLER] getMyNotifications - userId:', userId);
            // Bước 2: Kiểm tra user đã đăng nhập chưa
            if (!userId) {
                // Bước 3: Trả về lỗi 401 nếu chưa đăng nhập
                console.log('[NOTIFICATION CONTROLLER] No userId found!');
                this.error(res, 'Unauthorized', 401);
                return;
            }
            // Bước 4: Gọi service để lấy danh sách notifications
            const notifications = await this.service.getUserNotifications(userId);
            console.log('[NOTIFICATION CONTROLLER] Found notifications:', notifications.length);
            // Bước 5: Trả về response thành công
            this.success(res, notifications, 'Notifications retrieved successfully');
        }
        catch (error) {
            console.error('[NOTIFICATION CONTROLLER] Error:', error);
            // Bước 6: Chuyển lỗi sang middleware xử lý exception
            next(error);
        }
    };
    /**
     * Lấy tất cả notifications chưa đọc của user hiện tại.
     * Endpoint: GET /notifications/unread (yêu cầu authentication)
     * @param req - Request object chứa thông tin user đã xác thực
     * @param res - Response object để trả về danh sách notifications chưa đọc
     * @param next - NextFunction để xử lý lỗi
     */
    getUnread = async (req, res, next) => {
        try {
            // Bước 1: Extract userId từ token đã được verify trong middleware
            const userId = req.user?.userId;
            // Bước 2: Kiểm tra user đã đăng nhập chưa
            if (!userId) {
                // Bước 3: Trả về lỗi 401 nếu chưa đăng nhập
                this.error(res, 'Unauthorized', 401);
                return;
            }
            // Bước 4: Gọi service để lấy danh sách notifications chưa đọc
            const notifications = await this.service.getUnreadNotifications(userId);
            // Bước 5: Trả về response thành công
            this.success(res, notifications, 'Unread notifications retrieved successfully');
        }
        catch (error) {
            // Bước 6: Chuyển lỗi sang middleware xử lý exception
            next(error);
        }
    };
    /**
     * Đánh dấu một notification là đã đọc.
     * Endpoint: PUT /notifications/:id/read
     * @param req - Request object chứa id notification trong params
     * @param res - Response object để trả về notification đã cập nhật
     * @param next - NextFunction để xử lý lỗi
     */
    markAsRead = async (req, res, next) => {
        try {
            // Bước 1: Extract notification id từ request params
            const { id } = req.params;
            // Bước 2: Gọi service để đánh dấu notification đã đọc
            const notification = await this.service.markAsRead(id);
            // Bước 3: Trả về response thành công
            this.success(res, notification, 'Notification marked as read');
        }
        catch (error) {
            // Bước 4: Xử lý lỗi - trả về 404 nếu không tìm thấy, 500 cho lỗi khác
            const status = error.message.includes('not found') ? 404 : 500;
            this.error(res, error.message, status);
        }
    };
    /**
     * Đánh dấu tất cả notifications của user là đã đọc.
     * Endpoint: PUT /notifications/read-all (yêu cầu authentication)
     * @param req - Request object chứa thông tin user đã xác thực
     * @param res - Response object để trả về số lượng đã cập nhật
     * @param next - NextFunction để xử lý lỗi
     */
    markAllAsRead = async (req, res, next) => {
        try {
            // Bước 1: Extract userId từ token đã được verify trong middleware
            const userId = req.user?.userId;
            // Bước 2: Kiểm tra user đã đăng nhập chưa
            if (!userId) {
                // Bước 3: Trả về lỗi 401 nếu chưa đăng nhập
                this.error(res, 'Unauthorized', 401);
                return;
            }
            // Bước 4: Gọi service để đánh dấu tất cả notifications đã đọc
            const result = await this.service.markAllAsRead(userId);
            // Bước 5: Trả về response thành công
            this.success(res, result, 'All notifications marked as read');
        }
        catch (error) {
            // Bước 6: Chuyển lỗi sang middleware xử lý exception
            next(error);
        }
    };
    /**
     * Lấy số lượng notifications chưa đọc của user hiện tại.
     * Endpoint: GET /notifications/unread/count (yêu cầu authentication)
     * @param req - Request object chứa thông tin user đã xác thực
     * @param res - Response object để trả về số lượng
     * @param next - NextFunction để xử lý lỗi
     */
    getUnreadCount = async (req, res, next) => {
        try {
            // Bước 1: Extract userId từ token đã được verify trong middleware
            const userId = req.user?.userId;
            // Bước 2: Kiểm tra user đã đăng nhập chưa
            if (!userId) {
                // Bước 3: Trả về lỗi 401 nếu chưa đăng nhập
                this.error(res, 'Unauthorized', 401);
                return;
            }
            // Bước 4: Gọi service để lấy số lượng notifications chưa đọc
            const result = await this.service.getUnreadCount(userId);
            // Bước 5: Trả về response thành công
            this.success(res, result, 'Unread count retrieved successfully');
        }
        catch (error) {
            // Bước 6: Chuyển lỗi sang middleware xử lý exception
            next(error);
        }
    };
    /**
     * Xóa một notification.
     * Endpoint: DELETE /notifications/:id
     * @param req - Request object chứa id notification trong params
     * @param res - Response object để trả về kết quả xóa
     * @param next - NextFunction để xử lý lỗi
     */
    delete = async (req, res, next) => {
        try {
            // Bước 1: Extract notification id từ request params
            const { id } = req.params;
            // Bước 2: Gọi service để xóa notification
            const result = await this.service.deleteNotification(id);
            // Bước 3: Trả về response thành công
            this.success(res, result, 'Notification deleted successfully');
        }
        catch (error) {
            // Bước 4: Xử lý lỗi - trả về 404 nếu không tìm thấy, 500 cho lỗi khác
            const status = error.message.includes('not found') ? 404 : 500;
            this.error(res, error.message, status);
        }
    };
    /**
     * Lấy tất cả notifications đã gửi (notifications do admin tạo).
     * Endpoint: GET /notifications/sent
     * @param req - Request object
     * @param res - Response object
     * @param next - NextFunction
     */
    getSentNotifications = async (req, res, next) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            const notifications = await this.service.getSentNotifications(userId);
            this.success(res, notifications, 'Sent notifications retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Lấy tất cả notifications (admin - tất cả users).
     * Endpoint: GET /notifications/all
     * @param req - Request object
     * @param res - Response object
     * @param next - NextFunction
     */
    getAllNotifications = async (req, res, next) => {
        try {
            const notifications = await this.service.getAllNotifications();
            this.success(res, notifications, 'All notifications retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = new NotificationController();
//# sourceMappingURL=notification.controller.js.map