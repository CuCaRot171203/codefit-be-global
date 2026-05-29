import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { BaseService } from '../../../base/base.service';
import authRepository from '../repositories/auth.repository';
import { RegisterDto, LoginDto, AuthResponse, User } from '../types/auth.types';

const prisma = new PrismaClient();

/**
 * JWT Secret Key
 * Dùng để sign và verify JWT tokens
 */
const JWT_SECRET = process.env.JWT_SECRET || 'codefit-secret-key';

/**
 * AuthService - Xử lý business logic cho authentication
 * Quản lý đăng ký, đăng nhập, tạo và verify JWT token
 */
class AuthService extends BaseService<typeof authRepository> {
  constructor() {
    super(authRepository);
  }

  /**
   * Đăng ký tài khoản mới
   * @param RegisterDto - email, username, password
   * @returns Promise<AuthResponse> - Thông tin user và JWT token
   */
  async register({ email, username, password }: RegisterDto): Promise<AuthResponse> {
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.repository.create({
      email,
      username,
      password: hashedPassword,
      roleId: defaultRole.id,
    } as any);

    return this.formatUserResponse(user);
  }

  /**
   * Đăng nhập
   * @param LoginDto - email, password
   * @returns Promise<AuthResponse> - Thông tin user và JWT token
   */
  async login({ email, password }: LoginDto): Promise<AuthResponse> {
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

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Tạo UserSession để tracking login streak
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 6);
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
  async getUserById(id: string) {
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
  private formatUserResponse(user: any): AuthResponse {
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
  generateToken(userId: string, roleId: string, roleName: string): string {
    return jwt.sign({ userId, roleId, roleName }, JWT_SECRET, { expiresIn: '6h' });
  }

  /**
   * Verify JWT token
   * @param token - JWT token cần verify
   * @returns Decoded payload hoặc null nếu invalid
   */
  verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch {
      return null;
    }
  }
}

export default new AuthService();
