/**
 * Course Access Controller - Enhanced
 */
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../base/base.controller';
declare class CourseAccessController extends BaseController {
    /**
     * Tạo access code cho khóa học
     * POST /api/course-access/:courseId/codes
     */
    createCode: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Tạo nhiều access codes
     * POST /api/course-access/:courseId/codes/bulk
     */
    createBulkCodes: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Gán quyền cho user bằng email
     * POST /api/course-access/:courseId/grant
     */
    grantAccess: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Gán quyền cho nhiều users
     * POST /api/course-access/:courseId/assign-users
     */
    assignToUsers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy danh sách users chưa enroll
     * GET /api/course-access/:courseId/users/not-enrolled
     */
    getUsersNotEnrolled: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Kích hoạt khóa học bằng code (user)
     * POST /api/course-access/activate
     */
    activateByCode: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Validate code (không cần đăng nhập - cho email link)
     * GET /api/course-access/activate/:code
     */
    validateCodeLink: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy danh sách codes của khóa học
     * GET /api/course-access/:courseId/codes
     */
    getCodes: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Xóa access code
     * DELETE /api/course-access/codes/:codeId
     */
    deleteCode: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy danh sách users đã enroll
     * GET /api/course-access/:courseId/enrollments
     */
    getEnrollments: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Cập nhật số bài đã mở khóa cho user (admin unlock)
     * PUT /api/course-access/:courseId/enrollments/:userId/unlock
     */
    updateUserUnlocks: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Mở khóa toàn bộ bài học cho user
     * POST /api/course-access/:courseId/enrollments/:userId/unlock-all
     */
    unlockAllLessons: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: CourseAccessController;
export default _default;
//# sourceMappingURL=courseAccess.controller.d.ts.map