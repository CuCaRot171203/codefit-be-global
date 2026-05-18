import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { describe, it, expect, beforeEach } from 'vitest';
const JWT_SECRET = process.env.JWT_SECRET || 'codefit-secret-key';
class MockAuthRepository {
    users = new Map();
    emailIndex = new Map();
    async findByEmail(email) {
        const userId = this.emailIndex.get(email);
        if (!userId)
            return null;
        return this.users.get(userId) || null;
    }
    async findById(id) {
        return this.users.get(id) || null;
    }
    async create(data) {
        const user = {
            id: crypto.randomUUID(),
            email: data.email,
            username: data.username,
            password: data.password,
            role: data.role || 'user',
            isOnboarded: data.isOnboarded || false,
            createdAt: new Date()
        };
        this.users.set(user.id, user);
        this.emailIndex.set(user.email, user.id);
        return user;
    }
    clear() {
        this.users.clear();
        this.emailIndex.clear();
    }
}
const mockRepository = new MockAuthRepository();
class AuthService {
    repository = mockRepository;
    async register({ email, username, password }) {
        if (!email || !username || !password) {
            throw new Error('Email, username, and password are required');
        }
        const existingUser = await this.repository.findByEmail(email);
        if (existingUser) {
            throw new Error('Email already registered');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.repository.create({
            email,
            username,
            password: hashedPassword,
            role: 'user'
        });
        return this.formatUserResponse(user);
    }
    async login({ email, password }) {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }
        const user = await this.repository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        return this.formatUserResponse(user);
    }
    async getUserById(id) {
        return this.repository.findById(id);
    }
    formatUserResponse(user) {
        const token = this.generateToken(user.id);
        return {
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
                isOnboarded: user.isOnboarded,
                createdAt: user.createdAt
            },
            token
        };
    }
    generateToken(userId) {
        return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
    }
    verifyToken(token) {
        try {
            return jwt.verify(token, JWT_SECRET);
        }
        catch {
            return null;
        }
    }
}
const authService = new AuthService();
describe('AuthService', () => {
    beforeEach(() => {
        mockRepository.clear();
    });
    describe('register', () => {
        it('should register a new user successfully', async () => {
            const result = await authService.register({
                email: 'test@example.com',
                username: 'testuser',
                password: 'password123'
            });
            expect(result).toBeDefined();
            expect(result.user.email).toBe('test@example.com');
            expect(result.user.username).toBe('testuser');
            expect(result.token).toBeDefined();
        });
        it('should throw error when email is missing', async () => {
            await expect(authService.register({
                email: '',
                username: 'testuser',
                password: 'password123'
            })).rejects.toThrow('Email, username, and password are required');
        });
        it('should throw error when username is missing', async () => {
            await expect(authService.register({
                email: 'test@example.com',
                username: '',
                password: 'password123'
            })).rejects.toThrow('Email, username, and password are required');
        });
        it('should throw error when password is missing', async () => {
            await expect(authService.register({
                email: 'test@example.com',
                username: 'testuser',
                password: ''
            })).rejects.toThrow('Email, username, and password are required');
        });
        it('should throw error when email already exists', async () => {
            await authService.register({
                email: 'test@example.com',
                username: 'testuser1',
                password: 'password123'
            });
            await expect(authService.register({
                email: 'test@example.com',
                username: 'testuser2',
                password: 'password123'
            })).rejects.toThrow('Email already registered');
        });
        it('should hash password before saving', async () => {
            await authService.register({
                email: 'test@example.com',
                username: 'testuser',
                password: 'password123'
            });
            const savedUser = await mockRepository.findByEmail('test@example.com');
            expect(savedUser?.password).not.toBe('password123');
            expect(savedUser?.password.startsWith('$2')).toBe(true);
        });
        it('should generate valid JWT token', async () => {
            const result = await authService.register({
                email: 'test@example.com',
                username: 'testuser',
                password: 'password123'
            });
            const decoded = authService.verifyToken(result.token);
            expect(decoded).toBeDefined();
            expect(decoded.userId).toBe(result.user.id);
        });
        it('should assign user role by default', async () => {
            await authService.register({
                email: 'test@example.com',
                username: 'testuser',
                password: 'password123'
            });
            const savedUser = await mockRepository.findByEmail('test@example.com');
            expect(savedUser?.role).toBe('user');
        });
    });
    describe('login', () => {
        beforeEach(async () => {
            await authService.register({
                email: 'test@example.com',
                username: 'testuser',
                password: 'password123'
            });
        });
        it('should login successfully with correct credentials', async () => {
            const result = await authService.login({
                email: 'test@example.com',
                password: 'password123'
            });
            expect(result).toBeDefined();
            expect(result.user.email).toBe('test@example.com');
            expect(result.token).toBeDefined();
        });
        it('should throw error when email is missing', async () => {
            await expect(authService.login({
                email: '',
                password: 'password123'
            })).rejects.toThrow('Email and password are required');
        });
        it('should throw error when password is missing', async () => {
            await expect(authService.login({
                email: 'test@example.com',
                password: ''
            })).rejects.toThrow('Email and password are required');
        });
        it('should throw error when user does not exist', async () => {
            await expect(authService.login({
                email: 'nonexistent@example.com',
                password: 'password123'
            })).rejects.toThrow('Invalid credentials');
        });
        it('should throw error when password is incorrect', async () => {
            await expect(authService.login({
                email: 'test@example.com',
                password: 'wrongpassword'
            })).rejects.toThrow('Invalid credentials');
        });
        it('should return valid token on successful login', async () => {
            const result = await authService.login({
                email: 'test@example.com',
                password: 'password123'
            });
            const decoded = authService.verifyToken(result.token);
            expect(decoded.userId).toBeDefined();
        });
        it('should return user role on successful login', async () => {
            const result = await authService.login({
                email: 'test@example.com',
                password: 'password123'
            });
            expect(result.user.role).toBeDefined();
            expect(result.user.role).toBe('user');
        });
        it('should return isOnboarded flag on successful login', async () => {
            const result = await authService.login({
                email: 'test@example.com',
                password: 'password123'
            });
            expect(result.user.isOnboarded).toBeDefined();
            expect(result.user.isOnboarded).toBe(false);
        });
    });
    describe('generateToken', () => {
        it('should generate a valid JWT token', () => {
            const userId = 'test-user-id';
            const token = authService.generateToken(userId);
            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
            expect(token.split('.')).toHaveLength(3);
        });
        it('should include userId in token payload', () => {
            const userId = 'test-user-id';
            const token = authService.generateToken(userId);
            const decoded = jwt.verify(token, JWT_SECRET);
            expect(decoded.userId).toBe(userId);
        });
    });
    describe('verifyToken', () => {
        it('should verify valid token', () => {
            const userId = 'test-user-id';
            const token = authService.generateToken(userId);
            const decoded = authService.verifyToken(token);
            expect(decoded).toBeDefined();
            expect(decoded.userId).toBe(userId);
        });
        it('should return null for invalid token', () => {
            const decoded = authService.verifyToken('invalid-token');
            expect(decoded).toBeNull();
        });
        it('should return null for tampered token', () => {
            const token = authService.generateToken('user-id');
            const tamperedToken = token.slice(0, -5) + 'xxxxx';
            const decoded = authService.verifyToken(tamperedToken);
            expect(decoded).toBeNull();
        });
    });
    describe('getUserById', () => {
        it('should return user by id', async () => {
            const registerResult = await authService.register({
                email: 'test@example.com',
                username: 'testuser',
                password: 'password123'
            });
            const user = await authService.getUserById(registerResult.user.id);
            expect(user).toBeDefined();
            expect(user?.email).toBe('test@example.com');
        });
        it('should return null for non-existent user', async () => {
            const user = await authService.getUserById('non-existent-id');
            expect(user).toBeNull();
        });
    });
});
//# sourceMappingURL=auth.service.test.js.map