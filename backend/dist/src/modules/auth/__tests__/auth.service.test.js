"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const vitest_1 = require("vitest");
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
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
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
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
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
        return jsonwebtoken_1.default.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
    }
    verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, JWT_SECRET);
        }
        catch {
            return null;
        }
    }
}
const authService = new AuthService();
(0, vitest_1.describe)('AuthService', () => {
    (0, vitest_1.beforeEach)(() => {
        mockRepository.clear();
    });
    (0, vitest_1.describe)('register', () => {
        (0, vitest_1.it)('should register a new user successfully', async () => {
            const result = await authService.register({
                email: 'test@example.com',
                username: 'testuser',
                password: 'password123'
            });
            (0, vitest_1.expect)(result).toBeDefined();
            (0, vitest_1.expect)(result.user.email).toBe('test@example.com');
            (0, vitest_1.expect)(result.user.username).toBe('testuser');
            (0, vitest_1.expect)(result.token).toBeDefined();
        });
        (0, vitest_1.it)('should throw error when email is missing', async () => {
            await (0, vitest_1.expect)(authService.register({
                email: '',
                username: 'testuser',
                password: 'password123'
            })).rejects.toThrow('Email, username, and password are required');
        });
        (0, vitest_1.it)('should throw error when username is missing', async () => {
            await (0, vitest_1.expect)(authService.register({
                email: 'test@example.com',
                username: '',
                password: 'password123'
            })).rejects.toThrow('Email, username, and password are required');
        });
        (0, vitest_1.it)('should throw error when password is missing', async () => {
            await (0, vitest_1.expect)(authService.register({
                email: 'test@example.com',
                username: 'testuser',
                password: ''
            })).rejects.toThrow('Email, username, and password are required');
        });
        (0, vitest_1.it)('should throw error when email already exists', async () => {
            await authService.register({
                email: 'test@example.com',
                username: 'testuser1',
                password: 'password123'
            });
            await (0, vitest_1.expect)(authService.register({
                email: 'test@example.com',
                username: 'testuser2',
                password: 'password123'
            })).rejects.toThrow('Email already registered');
        });
        (0, vitest_1.it)('should hash password before saving', async () => {
            await authService.register({
                email: 'test@example.com',
                username: 'testuser',
                password: 'password123'
            });
            const savedUser = await mockRepository.findByEmail('test@example.com');
            (0, vitest_1.expect)(savedUser?.password).not.toBe('password123');
            (0, vitest_1.expect)(savedUser?.password.startsWith('$2')).toBe(true);
        });
        (0, vitest_1.it)('should generate valid JWT token', async () => {
            const result = await authService.register({
                email: 'test@example.com',
                username: 'testuser',
                password: 'password123'
            });
            const decoded = authService.verifyToken(result.token);
            (0, vitest_1.expect)(decoded).toBeDefined();
            (0, vitest_1.expect)(decoded.userId).toBe(result.user.id);
        });
        (0, vitest_1.it)('should assign user role by default', async () => {
            await authService.register({
                email: 'test@example.com',
                username: 'testuser',
                password: 'password123'
            });
            const savedUser = await mockRepository.findByEmail('test@example.com');
            (0, vitest_1.expect)(savedUser?.role).toBe('user');
        });
    });
    (0, vitest_1.describe)('login', () => {
        (0, vitest_1.beforeEach)(async () => {
            await authService.register({
                email: 'test@example.com',
                username: 'testuser',
                password: 'password123'
            });
        });
        (0, vitest_1.it)('should login successfully with correct credentials', async () => {
            const result = await authService.login({
                email: 'test@example.com',
                password: 'password123'
            });
            (0, vitest_1.expect)(result).toBeDefined();
            (0, vitest_1.expect)(result.user.email).toBe('test@example.com');
            (0, vitest_1.expect)(result.token).toBeDefined();
        });
        (0, vitest_1.it)('should throw error when email is missing', async () => {
            await (0, vitest_1.expect)(authService.login({
                email: '',
                password: 'password123'
            })).rejects.toThrow('Email and password are required');
        });
        (0, vitest_1.it)('should throw error when password is missing', async () => {
            await (0, vitest_1.expect)(authService.login({
                email: 'test@example.com',
                password: ''
            })).rejects.toThrow('Email and password are required');
        });
        (0, vitest_1.it)('should throw error when user does not exist', async () => {
            await (0, vitest_1.expect)(authService.login({
                email: 'nonexistent@example.com',
                password: 'password123'
            })).rejects.toThrow('Invalid credentials');
        });
        (0, vitest_1.it)('should throw error when password is incorrect', async () => {
            await (0, vitest_1.expect)(authService.login({
                email: 'test@example.com',
                password: 'wrongpassword'
            })).rejects.toThrow('Invalid credentials');
        });
        (0, vitest_1.it)('should return valid token on successful login', async () => {
            const result = await authService.login({
                email: 'test@example.com',
                password: 'password123'
            });
            const decoded = authService.verifyToken(result.token);
            (0, vitest_1.expect)(decoded.userId).toBeDefined();
        });
        (0, vitest_1.it)('should return user role on successful login', async () => {
            const result = await authService.login({
                email: 'test@example.com',
                password: 'password123'
            });
            (0, vitest_1.expect)(result.user.role).toBeDefined();
            (0, vitest_1.expect)(result.user.role).toBe('user');
        });
        (0, vitest_1.it)('should return isOnboarded flag on successful login', async () => {
            const result = await authService.login({
                email: 'test@example.com',
                password: 'password123'
            });
            (0, vitest_1.expect)(result.user.isOnboarded).toBeDefined();
            (0, vitest_1.expect)(result.user.isOnboarded).toBe(false);
        });
    });
    (0, vitest_1.describe)('generateToken', () => {
        (0, vitest_1.it)('should generate a valid JWT token', () => {
            const userId = 'test-user-id';
            const token = authService.generateToken(userId);
            (0, vitest_1.expect)(token).toBeDefined();
            (0, vitest_1.expect)(typeof token).toBe('string');
            (0, vitest_1.expect)(token.split('.')).toHaveLength(3);
        });
        (0, vitest_1.it)('should include userId in token payload', () => {
            const userId = 'test-user-id';
            const token = authService.generateToken(userId);
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            (0, vitest_1.expect)(decoded.userId).toBe(userId);
        });
    });
    (0, vitest_1.describe)('verifyToken', () => {
        (0, vitest_1.it)('should verify valid token', () => {
            const userId = 'test-user-id';
            const token = authService.generateToken(userId);
            const decoded = authService.verifyToken(token);
            (0, vitest_1.expect)(decoded).toBeDefined();
            (0, vitest_1.expect)(decoded.userId).toBe(userId);
        });
        (0, vitest_1.it)('should return null for invalid token', () => {
            const decoded = authService.verifyToken('invalid-token');
            (0, vitest_1.expect)(decoded).toBeNull();
        });
        (0, vitest_1.it)('should return null for tampered token', () => {
            const token = authService.generateToken('user-id');
            const tamperedToken = token.slice(0, -5) + 'xxxxx';
            const decoded = authService.verifyToken(tamperedToken);
            (0, vitest_1.expect)(decoded).toBeNull();
        });
    });
    (0, vitest_1.describe)('getUserById', () => {
        (0, vitest_1.it)('should return user by id', async () => {
            const registerResult = await authService.register({
                email: 'test@example.com',
                username: 'testuser',
                password: 'password123'
            });
            const user = await authService.getUserById(registerResult.user.id);
            (0, vitest_1.expect)(user).toBeDefined();
            (0, vitest_1.expect)(user?.email).toBe('test@example.com');
        });
        (0, vitest_1.it)('should return null for non-existent user', async () => {
            const user = await authService.getUserById('non-existent-id');
            (0, vitest_1.expect)(user).toBeNull();
        });
    });
});
//# sourceMappingURL=auth.service.test.js.map