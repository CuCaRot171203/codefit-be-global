/**
 * Auth Types - Định nghĩa các interfaces cho authentication module
 */
/**
 * Role entity - Lưu trữ thông tin role trong database
 */
export interface Role {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * User entity - Lưu trữ thông tin user trong database
 */
export interface User {
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
    createdAt: Date;
    updatedAt: Date;
    role?: Role;
}
/**
 * DTO cho request đăng ký
 */
export interface RegisterDto {
    email: string;
    username: string;
    password: string;
}
/**
 * DTO cho request đăng nhập
 */
export interface LoginDto {
    email: string;
    password: string;
}
/**
 * Response format sau khi đăng ký/đăng nhập thành công
 */
export interface AuthResponse {
    user: {
        id: string;
        email: string;
        username: string;
        roleId: string;
        roleName: string;
        isOnboarded: boolean;
        createdAt: Date;
    };
    token: string;
}
/**
 * JWT Payload structure
 */
export interface JwtPayload {
    userId: string;
    roleId: string;
    roleName: string;
}
//# sourceMappingURL=auth.types.d.ts.map