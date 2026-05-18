import jwt from 'jsonwebtoken';
/**
 * JWT Secret Key
 * Đọc từ environment variable hoặc dùng default fallback
 */
const JWT_SECRET = process.env.JWT_SECRET || 'codefit-secret-key';
/**
 * Middleware xác thực JWT token
 * Verify token từ Authorization header và attach user vào request
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express NextFunction
 */
export const verifyToken = (req, res, next) => {
    try {
        // Bước 1: Lấy Authorization header
        const authHeader = req.headers.authorization;
        console.log('Auth middleware - Authorization header:', authHeader ? `${authHeader.substring(0, 50)}...` : 'null');
        // Bước 2: Kiểm tra header có tồn tại và format đúng "Bearer <token>"
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('Auth middleware - No valid Bearer token');
            res.status(401).json({
                success: false,
                message: 'No token provided'
            });
            return;
        }
        // Bước 3: Extract token từ header
        const token = authHeader.split(' ')[1];
        console.log('Auth middleware - Token extracted, length:', token?.length);
        // Bước 4: Verify token và decode payload
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Auth middleware - Token verified, userId:', decoded?.userId, 'roleName:', decoded?.roleName);
        // Bước 5: Attach user vào request object
        req.user = decoded;
        // Bước 6: Chuyển sang middleware tiếp theo
        next();
    }
    catch (error) {
        console.log('Auth middleware - Token verification failed:', error);
        let errorMessage = 'Invalid or expired token';
        if (error instanceof jwt.JsonWebTokenError) {
            if (error.message === 'jwt malformed') {
                errorMessage = 'Token format is invalid';
            }
            else if (error.message === 'invalid signature') {
                errorMessage = 'Token signature is invalid';
            }
            else if (error.message === 'jwt expired') {
                errorMessage = 'Token has expired';
            }
            else {
                errorMessage = 'Token verification failed';
            }
        }
        else if (error instanceof jwt.TokenExpiredError) {
            errorMessage = 'Token has expired';
        }
        else if (error instanceof jwt.NotBeforeError) {
            errorMessage = 'Token is not yet valid';
        }
        res.status(401).json({
            success: false,
            message: errorMessage,
            code: 'AUTH_ERROR'
        });
    }
};
/**
 * Auth Middleware Object - Export các middleware functions
 */
export const authMiddleware = {
    verifyToken
};
/**
 * Middleware kiểm tra quyền admin
 */
export const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.roleName !== 'admin') {
        res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
        return;
    }
    next();
};
/**
 * Middleware kiểm tra quyền lecture hoặc admin
 */
export const requireLectureOrAdmin = (req, res, next) => {
    if (!req.user || (req.user.roleName !== 'admin' && req.user.roleName !== 'lecture')) {
        res.status(403).json({
            success: false,
            message: 'Lecture or Admin access required'
        });
        return;
    }
    next();
};
//# sourceMappingURL=auth.middleware.js.map