import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../base/base.controller';
/**
 * AuthController - Xử lý các HTTP requests liên quan đến authentication
 * Kế thừa BaseController để sử dụng các helper methods
 */
declare class AuthController extends BaseController {
    constructor();
    /**
     * Đăng ký tài khoản mới
     * POST /api/auth/register
     */
    register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Đăng nhập
     * POST /api/auth/login
     */
    login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy thông tin user hiện tại
     * GET /api/auth/me
     * Cần token hợp lệ trong Authorization header
     */
    getMe: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: AuthController;
export default _default;
//# sourceMappingURL=auth.controller.d.ts.map