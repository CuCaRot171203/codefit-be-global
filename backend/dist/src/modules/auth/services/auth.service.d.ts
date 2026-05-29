import { BaseService } from '../../../base/base.service';
import authRepository from '../repositories/auth.repository';
import { RegisterDto, LoginDto, AuthResponse } from '../types/auth.types';
/**
 * AuthService - Xử lý business logic cho authentication
 * Quản lý đăng ký, đăng nhập, tạo và verify JWT token
 */
declare class AuthService extends BaseService<typeof authRepository> {
    constructor();
    /**
     * Đăng ký tài khoản mới
     * @param RegisterDto - email, username, password
     * @returns Promise<AuthResponse> - Thông tin user và JWT token
     */
    register({ email, username, password }: RegisterDto): Promise<AuthResponse>;
    /**
     * Đăng nhập
     * @param LoginDto - email, password
     * @returns Promise<AuthResponse> - Thông tin user và JWT token
     */
    login({ email, password }: LoginDto): Promise<AuthResponse>;
    /**
     * Lấy thông tin user theo ID
     * @param id - User ID
     * @returns User object hoặc null
     */
    getUserById(id: string): Promise<({
        role: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        };
    } & {
        id: string;
        email: string;
        username: string;
        password: string;
        roleId: string;
        avatar: string | null;
        bio: string | null;
        fullName: string | null;
        phone: string | null;
        school: string | null;
        learningLevel: string | null;
        referralCode: string | null;
        isOnboarded: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    /**
     * Format user response - Thêm JWT token vào response
     * @param user - User object từ database
     * @returns AuthResponse với user info và token
     */
    private formatUserResponse;
    /**
     * Generate JWT token
     * @param userId - User ID để encode vào token
     * @param roleId - Role ID để encode vào token
     * @param roleName - Role name để encode vào token
     * @returns JWT token string
     */
    generateToken(userId: string, roleId: string, roleName: string): string;
    /**
     * Verify JWT token
     * @param token - JWT token cần verify
     * @returns Decoded payload hoặc null nếu invalid
     */
    verifyToken(token: string): any;
}
declare const _default: AuthService;
export default _default;
//# sourceMappingURL=auth.service.d.ts.map