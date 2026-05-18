/**
 * @fileoverview Controller layer cho module Enrollment
 * Xử lý các HTTP requests liên quan đến enrollment
 * @module enrollment/controllers
 */

import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../base/base.controller';
import enrollmentService from '../services/enrollment.service';

/**
 * Controller xử lý các endpoints liên quan đến enrollment
 * Kế thừa từ BaseController và sử dụng enrollmentService
 */
class EnrollmentController extends BaseController {

  /**
   * Constructor - Khởi tạo controller với enrollmentService
   */
  constructor() {
    super(enrollmentService);
  }

  /**
   * POST /enrollment - Đăng ký khóa học mới
   * Yêu cầu user đã đăng nhập (có userId trong token)
   * @param req - Express Request object (chứa user.userId và body với courseId)
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  enroll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Bước 1: Lấy userId từ token đã được verify bởi middleware
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, 'Unauthorized', 401);
        return;
      }

      // Bước 2: Gọi service để tạo enrollment mới
      const enrollment = await this.service.enroll(userId, req.body);
      this.success(res, enrollment, 'Enrolled successfully', 201);
    } catch (error: any) {
      // Bước 3: Xử lý lỗi - trả về 400 nếu đã đăng ký, 500 cho lỗi khác
      const status = error.message.includes('Already') ? 400 : 500;
      this.error(res, error.message, status);
    }
  };

  /**
   * GET /enrollment - Lấy danh sách enrollment của user hiện tại
   * @param req - Express Request object
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  getMyEnrollments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Bước 1: Lấy userId từ token
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, 'Unauthorized', 401);
        return;
      }

      // Bước 2: Gọi service để lấy danh sách enrollments
      const enrollments = await this.service.getUserEnrollments(userId);
      this.success(res, enrollments, 'Enrollments retrieved successfully');
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * GET /enrollment/:courseId - Lấy thông tin một enrollment cụ thể
   * @param req - Express Request object (chứa params.courseId)
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  getEnrollment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        this.error(res, 'Unauthorized', 401);
        return;
      }

      const { courseId } = req.params;

      const enrollment = await this.service.getEnrollment(userId, courseId);

      if (!enrollment) {
        this.error(res, 'Enrollment not found', 404);
        return;
      }

      this.success(res, enrollment, 'Enrollment retrieved successfully');
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * PUT /enrollment/:enrollmentId/progress - Cập nhật tiến độ học tập
   * @param req - Express Request object (chứa params.enrollmentId, body.progress)
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  updateProgress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Bước 1: Lấy enrollmentId từ URL params
      const { enrollmentId } = req.params;

      // Bước 2: Lấy progress từ body request
      const { progress } = req.body;

      // Bước 3: Kiểm tra progress có phải là number không
      if (typeof progress !== 'number') {
        this.error(res, 'Progress must be a number', 400);
        return;
      }

      // Bước 4: Gọi service để cập nhật progress
      const enrollment = await this.service.updateProgress(enrollmentId, progress);
      this.success(res, enrollment, 'Progress updated successfully');
    } catch (error: any) {
      // Bước 5: Xử lý lỗi - 404 nếu không tìm thấy, 400 cho lỗi khác
      const status = error.message.includes('not found') ? 404 : 400;
      this.error(res, error.message, status);
    }
  };

  /**
   * DELETE /enrollment/:courseId - Hủy đăng ký khóa học
   * @param req - Express Request object (chứa params.courseId)
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  unenroll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Bước 1: Lấy userId từ token
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, 'Unauthorized', 401);
        return;
      }

      // Bước 2: Lấy courseId từ URL params
      const { courseId } = req.params;

      // Bước 3: Gọi service để hủy đăng ký
      const result = await this.service.unenroll(userId, courseId);
      this.success(res, result, 'Unenrolled successfully');
    } catch (error: any) {
      // Bước 4: Xử lý lỗi - 404 nếu không tìm thấy, 500 cho lỗi khác
      const status = error.message.includes('not found') ? 404 : 500;
      this.error(res, error.message, status);
    }
  };
}

export default new EnrollmentController();
