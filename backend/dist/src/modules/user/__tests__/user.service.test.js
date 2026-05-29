"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
class MockUserRepository {
    users = new Map();
    emailIndex = new Map();
    async findById(id) {
        return this.users.get(id) || null;
    }
    async findByEmail(email) {
        const userId = this.emailIndex.get(email);
        if (!userId)
            return null;
        return this.users.get(userId) || null;
    }
    async updateProfile(id, data) {
        const user = this.users.get(id);
        if (!user)
            throw new Error('User not found');
        const updated = { ...user, ...data };
        this.users.set(id, updated);
        return updated;
    }
    async updatePassword(id, hashedPassword) {
        const user = this.users.get(id);
        if (!user)
            throw new Error('User not found');
        const updated = { ...user, password: hashedPassword };
        this.users.set(id, updated);
        return updated;
    }
    createUser(data) {
        const user = {
            id: crypto.randomUUID(),
            email: data.email || 'test@example.com',
            username: data.username || 'testuser',
            password: data.password || '$2b$10$hashedpassword',
            role: data.role || 'user',
            avatar: data.avatar || null,
            bio: data.bio || null,
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
const mockRepository = new MockUserRepository();
class UserService {
    repository = mockRepository;
    async getProfile(userId) {
        return this.repository.findById(userId);
    }
    async updateProfile(userId, dto) {
        const user = await this.repository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return this.repository.updateProfile(userId, {
            username: dto.username,
            avatar: dto.avatar,
            bio: dto.bio
        });
    }
    async changePassword(userId, dto) {
        const user = await this.repository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        if (dto.newPassword.length < 6) {
            throw new Error('New password must be at least 6 characters');
        }
        const newHashedPassword = 'hashed_' + dto.newPassword;
        await this.repository.updatePassword(userId, newHashedPassword);
        return { message: 'Password changed successfully' };
    }
}
const userService = new UserService();
(0, globals_1.describe)('UserService', () => {
    let testUser;
    (0, globals_1.beforeEach)(() => {
        mockRepository.clear();
        testUser = mockRepository.createUser({
            email: 'test@example.com',
            username: 'testuser',
            password: 'hashed_password123'
        });
    });
    (0, globals_1.describe)('getProfile', () => {
        (0, globals_1.it)('should return user profile', async () => {
            const profile = await userService.getProfile(testUser.id);
            (0, globals_1.expect)(profile).toBeDefined();
            (0, globals_1.expect)(profile?.email).toBe('test@example.com');
            (0, globals_1.expect)(profile?.username).toBe('testuser');
        });
        (0, globals_1.it)('should return null for non-existent user', async () => {
            const profile = await userService.getProfile('non-existent-id');
            (0, globals_1.expect)(profile).toBeNull();
        });
    });
    (0, globals_1.describe)('updateProfile', () => {
        (0, globals_1.it)('should update username', async () => {
            const updated = await userService.updateProfile(testUser.id, { username: 'newusername' });
            (0, globals_1.expect)(updated.username).toBe('newusername');
        });
        (0, globals_1.it)('should update bio', async () => {
            const updated = await userService.updateProfile(testUser.id, { bio: 'New bio' });
            (0, globals_1.expect)(updated.bio).toBe('New bio');
        });
        (0, globals_1.it)('should update avatar', async () => {
            const updated = await userService.updateProfile(testUser.id, { avatar: 'https://avatar.url' });
            (0, globals_1.expect)(updated.avatar).toBe('https://avatar.url');
        });
        (0, globals_1.it)('should throw error for non-existent user', async () => {
            await (0, globals_1.expect)(userService.updateProfile('non-existent-id', { username: 'test' })).rejects.toThrow('User not found');
        });
    });
    (0, globals_1.describe)('changePassword', () => {
        (0, globals_1.it)('should change password successfully', async () => {
            const result = await userService.changePassword(testUser.id, {
                currentPassword: 'password123',
                newPassword: 'newpassword456'
            });
            (0, globals_1.expect)(result.message).toBe('Password changed successfully');
        });
        (0, globals_1.it)('should throw error for non-existent user', async () => {
            await (0, globals_1.expect)(userService.changePassword('non-existent-id', {
                currentPassword: 'password123',
                newPassword: 'newpassword456'
            })).rejects.toThrow('User not found');
        });
        (0, globals_1.it)('should throw error for short password', async () => {
            await (0, globals_1.expect)(userService.changePassword(testUser.id, {
                currentPassword: 'password123',
                newPassword: '123'
            })).rejects.toThrow('New password must be at least 6 characters');
        });
    });
});
//# sourceMappingURL=user.service.test.js.map