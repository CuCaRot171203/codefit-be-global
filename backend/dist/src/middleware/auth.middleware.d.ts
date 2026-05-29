import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from '../modules/auth/types/auth.types';
/**
 * Extend Express Request interface
 * Thêm property user để lưu thông tin user đã authenticate
 */
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
/**
 * Middleware xác thực JWT token
 * Verify token từ Authorization header và attach user vào request
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express NextFunction
 */
export declare const verifyToken: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Auth Middleware Object - Export các middleware functions
 */
export declare const authMiddleware: {
    verifyToken: (req: Request, res: Response, next: NextFunction) => void;
};
/**
 * Middleware kiểm tra quyền admin
 */
export declare const requireAdmin: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware kiểm tra quyền lecture hoặc admin
 */
export declare const requireLectureOrAdmin: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map