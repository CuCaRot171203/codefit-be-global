/**
 * @fileoverview User Controller
 * @description Controller xử lý các HTTP request liên quan đến User profile.
 */
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../base/base.controller';
/**
 * @class UserController
 * @extends BaseController
 * @description Controller quản lý các endpoint API liên quan đến hồ sơ người dùng
 */
declare class UserController extends BaseController {
    constructor();
    /**
     * @method getProfile
     * @description Xử lý request lấy thông tin hồ sơ người dùng hiện tại
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @param {NextFunction} next - Express next middleware function
     * @returns {Promise<void>}
     */
    getProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * @method updateProfile
     * @description Xử lý request cập nhật thông tin hồ sơ người dùng
     * @param {Request} req - Express request object (chứa body với username, avatar, bio)
     * @param {Response} res - Express response object
     * @param {NextFunction} next - Express next middleware function
     * @returns {Promise<void>}
     */
    updateProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * @method changePassword
     * @description Xử lý request thay đổi mật khẩu người dùng
     * @param {Request} req - Express request object (chứa body với currentPassword, newPassword)
     * @param {Response} res - Express response object
     * @param {NextFunction} next - Express next middleware function
     * @returns {Promise<void>}
     */
    changePassword: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: UserController;
export default _default;
//# sourceMappingURL=user.controller.d.ts.map