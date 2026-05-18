/**
 * @file notification.routes.ts
 * @description Định nghĩa các routes cho module Notification.
 * Ánh xạ HTTP methods và paths tới các controller handlers tương ứng.
 */

import { Router } from 'express';
import notificationController from '../controllers/notification.controller';
import { verifyToken } from '../../../middleware/auth.middleware';

/**
 * Router instance để định nghĩa các routes cho notification.
 */
const router = Router();

/**
 * Route tạo mới notification.
 * Endpoint: POST /notifications
 * Không yêu cầu authentication (có thể được gọi từ hệ thống nội bộ).
 */
router.post('/', (req, res, next) => notificationController.createNotification(req, res, next));

/**
 * Áp dụng middleware xác thực cho tất cả routes phía dưới.
 * Từ đây trở xuống, tất cả requests cần có token hợp lệ.
 */
router.use(verifyToken);

/**
 * Route lấy tất cả notifications của user hiện tại.
 * Endpoint: GET /notifications
 * Yêu cầu: Authentication (verifyToken middleware).
 */
router.get('/', (req, res, next) => notificationController.getMyNotifications(req, res, next));

/**
 * Route lấy tất cả notifications chưa đọc của user hiện tại.
 * Endpoint: GET /notifications/unread
 * Yêu cầu: Authentication (verifyToken middleware).
 */
router.get('/unread', (req, res, next) => notificationController.getUnread(req, res, next));

/**
 * Route lấy số lượng notifications chưa đọc của user hiện tại.
 * Endpoint: GET /notifications/unread/count
 * Yêu cầu: Authentication (verifyToken middleware).
 */
router.get('/unread/count', (req, res, next) => notificationController.getUnreadCount(req, res, next));

/**
 * Route đánh dấu một notification là đã đọc.
 * Endpoint: PUT /notifications/:id/read
 * Yêu cầu: Authentication (verifyToken middleware).
 * @param id - ID của notification cần đánh dấu đã đọc (từ URL params)
 */
router.put('/:id/read', (req, res, next) => notificationController.markAsRead(req, res, next));

/**
 * Route đánh dấu tất cả notifications của user là đã đọc.
 * Endpoint: PUT /notifications/read-all
 * Yêu cầu: Authentication (verifyToken middleware).
 */
router.put('/read-all', (req, res, next) => notificationController.markAllAsRead(req, res, next));

/**
 * Route lấy tất cả notifications đã gửi (admin).
 * Endpoint: GET /notifications/sent
 * Yêu cầu: Authentication (verifyToken middleware).
 */
router.get('/sent', (req, res, next) => notificationController.getSentNotifications(req, res, next));

/**
 * Route lấy tất cả notifications (admin - tất cả users).
 * Endpoint: GET /notifications/all
 * Yêu cầu: Authentication (verifyToken middleware).
 */
router.get('/all', (req, res, next) => notificationController.getAllNotifications(req, res, next));

/**
 * Route xóa một notification.
 * Endpoint: DELETE /notifications/:id
 * Yêu cầu: Authentication (verifyToken middleware).
 * @param id - ID của notification cần xóa (từ URL params)
 */
router.delete('/:id', (req, res, next) => notificationController.delete(req, res, next));

export default router;
