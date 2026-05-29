/**
 * Course Access Controller - Enhanced
 */

import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../base/base.controller';
import courseAccessService from './courseAccess.service';

class CourseAccessController extends BaseController {
  constructor() {
    // @ts-ignore - BaseController expects generic type but we use any for flexibility
    super(undefined as any);
  }
  
  /**
   * Tạo access code cho khóa học
   * POST /api/course-access/:courseId/codes
   */
  createCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId } = req.params;
      const adminId = req.user?.userId;

      const code = await courseAccessService.createAccessCode(Array.isArray(courseId) ? courseId[0] : courseId, adminId || '');
      this.success(res, code, 'Access code created', 201);
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Tạo nhiều access codes
   * POST /api/course-access/:courseId/codes/bulk
   */
  createBulkCodes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId } = req.params;
      const { count = 1 } = req.body;
      const adminId = req.user?.userId;

      const codes = await courseAccessService.createBulkAccessCodes(Array.isArray(courseId) ? courseId[0] : courseId, adminId || '', count);
      this.success(res, codes, `${codes.length} codes created`, 201);
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Gán quyền cho user bằng email
   * POST /api/course-access/:courseId/grant
   */
  grantAccess = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId } = req.params;
      const { email } = req.body;
      const adminId = req.user?.userId;

      const result = await courseAccessService.grantAccessToUser(Array.isArray(courseId) ? courseId[0] : courseId, email, adminId || '');
      this.success(res, result, 'Access granted to user');
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Gán quyền cho nhiều users
   * POST /api/course-access/:courseId/assign-users
   */
  assignToUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId } = req.params;
      const { userIds } = req.body;
      const adminId = req.user?.userId;

      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        this.error(res, 'userIds is required and must be an array', 400);
        return;
      }

      const result = await courseAccessService.assignToUsers(Array.isArray(courseId) ? courseId[0] : courseId, userIds, adminId || '');
      this.success(res, result, `${result.assignedCount} users assigned`);
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Lấy danh sách users chưa enroll
   * GET /api/course-access/:courseId/users/not-enrolled
   */
  getUsersNotEnrolled = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId } = req.params;
      const { search } = req.query;

      const users = await courseAccessService.getUsersNotEnrolled(Array.isArray(courseId) ? courseId[0] : courseId, search as string);
      this.success(res, users, 'Users retrieved');
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Kích hoạt khóa học bằng code (user)
   * POST /api/course-access/activate
   */
  activateByCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        this.error(res, 'Unauthorized', 401);
        return;
      }

      const result = await courseAccessService.activateByCode(code, userId);
      this.success(res, result, 'Course activated successfully');
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Validate code (không cần đăng nhập - cho email link)
   * GET /api/course-access/activate/:code
   */
  validateCodeLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code } = req.params;

      const result = await courseAccessService.activateByCodeLink(Array.isArray(code) ? code[0] : code);
      this.success(res, result, 'Code is valid');
    } catch (error: any) {
      this.error(res, error.message, 400);
    }
  };

  /**
   * Lấy danh sách codes của khóa học
   * GET /api/course-access/:courseId/codes
   */
  getCodes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId } = req.params;

      const codes = await courseAccessService.getCodesByCourse(Array.isArray(courseId) ? courseId[0] : courseId);
      this.success(res, codes, 'Codes retrieved');
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Xóa access code
   * DELETE /api/course-access/codes/:codeId
   */
  deleteCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { codeId } = req.params;

      await courseAccessService.deleteCode(Array.isArray(codeId) ? codeId[0] : codeId);
      this.success(res, null, 'Code deleted');
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Lấy danh sách users đã enroll
   * GET /api/course-access/:courseId/enrollments
   */
  getEnrollments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId } = req.params;

      const enrollments = await courseAccessService.getEnrollments(Array.isArray(courseId) ? courseId[0] : courseId);
      this.success(res, enrollments, 'Enrollments retrieved');
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Cập nhật số bài đã mở khóa cho user (admin unlock)
   * PUT /api/course-access/:courseId/enrollments/:userId/unlock
   */
  updateUserUnlocks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, userId } = req.params;
      const { currentUnlocks } = req.body;

      if (typeof currentUnlocks !== 'number' || currentUnlocks < 0) {
        this.error(res, 'currentUnlocks must be a positive number', 400);
        return;
      }

      const result = await courseAccessService.updateUserUnlocks(
        Array.isArray(courseId) ? courseId[0] : courseId,
        Array.isArray(userId) ? userId[0] : userId,
        currentUnlocks
      );
      this.success(res, result, 'Unlocks updated successfully');
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Mở khóa toàn bộ bài học cho user
   * POST /api/course-access/:courseId/enrollments/:userId/unlock-all
   */
  unlockAllLessons = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, userId } = req.params;

      const result = await courseAccessService.unlockAllLessonsForUser(
        Array.isArray(courseId) ? courseId[0] : courseId,
        Array.isArray(userId) ? userId[0] : userId
      );
      this.success(res, result, 'All lessons unlocked for user');
    } catch (error: any) {
      next(error);
    }
  };
}

export default new CourseAccessController();
