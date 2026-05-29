"use strict";
/**
 * @file notification.routes.ts
 * @description Định nghĩa các routes cho module Notification.
 * Ánh xạ HTTP methods và paths tới các controller handlers tương ứng.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = __importDefault(require("../controllers/notification.controller"));
const auth_middleware_1 = require("../../../middleware/auth.middleware");
/**
 * Router instance để định nghĩa các routes cho notification.
 */
const router = (0, express_1.Router)();
/**
 * Route tạo mới notification.
 * Endpoint: POST /notifications
 * Không yêu cầu authentication (có thể được gọi từ hệ thống nội bộ).
 */
router.post('/', (req, res, next) => notification_controller_1.default.createNotification(req, res, next));
/**
 * Áp dụng middleware xác thực cho tất cả routes phía dưới.
 * Từ đây trở xuống, tất cả requests cần có token hợp lệ.
 */
router.use(auth_middleware_1.verifyToken);
/**
 * Route lấy tất cả notifications của user hiện tại.
 * Endpoint: GET /notifications
 * Yêu cầu: Authentication (verifyToken middleware).
 */
router.get('/', (req, res, next) => notification_controller_1.default.getMyNotifications(req, res, next));
/**
 * Route lấy tất cả notifications chưa đọc của user hiện tại.
 * Endpoint: GET /notifications/unread
 * Yêu cầu: Authentication (verifyToken middleware).
 */
router.get('/unread', (req, res, next) => notification_controller_1.default.getUnread(req, res, next));
/**
 * Route lấy số lượng notifications chưa đọc của user hiện tại.
 * Endpoint: GET /notifications/unread/count
 * Yêu cầu: Authentication (verifyToken middleware).
 */
router.get('/unread/count', (req, res, next) => notification_controller_1.default.getUnreadCount(req, res, next));
/**
 * Route đánh dấu một notification là đã đọc.
 * Endpoint: PUT /notifications/:id/read
 * Yêu cầu: Authentication (verifyToken middleware).
 * @param id - ID của notification cần đánh dấu đã đọc (từ URL params)
 */
router.put('/:id/read', (req, res, next) => notification_controller_1.default.markAsRead(req, res, next));
/**
 * Route đánh dấu tất cả notifications của user là đã đọc.
 * Endpoint: PUT /notifications/read-all
 * Yêu cầu: Authentication (verifyToken middleware).
 */
router.put('/read-all', (req, res, next) => notification_controller_1.default.markAllAsRead(req, res, next));
/**
 * Route lấy tất cả notifications đã gửi (admin).
 * Endpoint: GET /notifications/sent
 * Yêu cầu: Authentication (verifyToken middleware).
 */
router.get('/sent', (req, res, next) => notification_controller_1.default.getSentNotifications(req, res, next));
/**
 * Route lấy tất cả notifications (admin - tất cả users).
 * Endpoint: GET /notifications/all
 * Yêu cầu: Authentication (verifyToken middleware).
 */
router.get('/all', (req, res, next) => notification_controller_1.default.getAllNotifications(req, res, next));
/**
 * Route xóa một notification.
 * Endpoint: DELETE /notifications/:id
 * Yêu cầu: Authentication (verifyToken middleware).
 * @param id - ID của notification cần xóa (từ URL params)
 */
router.delete('/:id', (req, res, next) => notification_controller_1.default.delete(req, res, next));
exports.default = router;
//# sourceMappingURL=notification.routes.js.map