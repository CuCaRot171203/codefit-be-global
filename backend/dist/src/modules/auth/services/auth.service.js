"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const base_service_1 = require("../../../base/base.service");
const auth_repository_1 = __importDefault(require("../repositories/auth.repository"));
const prisma = new client_1.PrismaClient();
/**
 * JWT Secret Key
 * Dùng để sign và verify JWT tokens
 */
const JWT_SECRET = process.env.JWT_SECRET || 'codefit-secret-key';
/**
 * AuthService - Xử lý business logic cho authentication
 * Quản lý đăng ký, đăng nhập, tạo và verify JWT token
 */
class AuthService extends base_service_1.BaseService {
    constructor() {
        super(auth_repository_1.default);
    }
    /**
     * Đăng ký tài khoản mới
     * @param RegisterDto - email, username, password
     * @returns Promise<AuthResponse> - Thông tin user và JWT token
     */
    async register({ email, username, password }) {
        if (!email || !username || !password) {
            throw new Error('Email, username, and password are required');
        }
        const existingUser = await this.repository.findByEmail(email);
        if (existingUser) {
            throw new Error('Email already registered');
        }
        const defaultRole = await prisma.role.findUnique({
            where: { name: 'user' },
        });
        if (!defaultRole) {
            throw new Error('Default role not found. Please run seed first.');
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await this.repository.create({
            email,
            username,
            password: hashedPassword,
            roleId: defaultRole.id,
        });
        return this.formatUserResponse(user);
    }
    /**
     * Đăng nhập
     * @param LoginDto - email, password
     * @returns Promise<AuthResponse> - Thông tin user và JWT token
     */
    async login({ email, password }) {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }
        const user = await prisma.user.findUnique({
            where: { email },
            include: { role: true },
        });
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        // Tạo UserSession để tracking login streak
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        await prisma.userSession.create({
            data: {
                userId: user.id,
                token: 'login-' + user.id + '-' + Date.now(),
                expiredAt: expiresAt,
            },
        });
        return this.formatUserResponse(user);
    }
    /**
     * Lấy thông tin user theo ID
     * @param id - User ID
     * @returns User object hoặc null
     */
    async getUserById(id) {
        return prisma.user.findUnique({
            where: { id },
            include: { role: true },
        });
    }
    /**
     * Format user response - Thêm JWT token vào response
     * @param user - User object từ database
     * @returns AuthResponse với user info và token
     */
    formatUserResponse(user) {
        const token = this.generateToken(user.id, user.roleId, user.role?.name || 'user');
        return {
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                roleId: user.roleId,
                roleName: user.role?.name || 'user',
                isOnboarded: user.isOnboarded || false,
                createdAt: user.createdAt,
            },
            token,
        };
    }
    /**
     * Generate JWT token
     * @param userId - User ID để encode vào token
     * @param roleId - Role ID để encode vào token
     * @param roleName - Role name để encode vào token
     * @returns JWT token string
     */
    generateToken(userId, roleId, roleName) {
        return jsonwebtoken_1.default.sign({ userId, roleId, roleName }, JWT_SECRET, { expiresIn: '7d' });
    }
    /**
     * Verify JWT token
     * @param token - JWT token cần verify
     * @returns Decoded payload hoặc null nếu invalid
     */
    verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, JWT_SECRET);
        }
        catch {
            return null;
        }
    }
}
exports.default = new AuthService();
//# sourceMappingURL=auth.service.js.map