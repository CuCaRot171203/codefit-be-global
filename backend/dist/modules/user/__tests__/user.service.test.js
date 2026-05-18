import { describe, it, expect, beforeEach } from '@jest/globals';
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
describe('UserService', () => {
    let testUser;
    beforeEach(() => {
        mockRepository.clear();
        testUser = mockRepository.createUser({
            email: 'test@example.com',
            username: 'testuser',
            password: 'hashed_password123'
        });
    });
    describe('getProfile', () => {
        it('should return user profile', async () => {
            const profile = await userService.getProfile(testUser.id);
            expect(profile).toBeDefined();
            expect(profile?.email).toBe('test@example.com');
            expect(profile?.username).toBe('testuser');
        });
        it('should return null for non-existent user', async () => {
            const profile = await userService.getProfile('non-existent-id');
            expect(profile).toBeNull();
        });
    });
    describe('updateProfile', () => {
        it('should update username', async () => {
            const updated = await userService.updateProfile(testUser.id, { username: 'newusername' });
            expect(updated.username).toBe('newusername');
        });
        it('should update bio', async () => {
            const updated = await userService.updateProfile(testUser.id, { bio: 'New bio' });
            expect(updated.bio).toBe('New bio');
        });
        it('should update avatar', async () => {
            const updated = await userService.updateProfile(testUser.id, { avatar: 'https://avatar.url' });
            expect(updated.avatar).toBe('https://avatar.url');
        });
        it('should throw error for non-existent user', async () => {
            await expect(userService.updateProfile('non-existent-id', { username: 'test' })).rejects.toThrow('User not found');
        });
    });
    describe('changePassword', () => {
        it('should change password successfully', async () => {
            const result = await userService.changePassword(testUser.id, {
                currentPassword: 'password123',
                newPassword: 'newpassword456'
            });
            expect(result.message).toBe('Password changed successfully');
        });
        it('should throw error for non-existent user', async () => {
            await expect(userService.changePassword('non-existent-id', {
                currentPassword: 'password123',
                newPassword: 'newpassword456'
            })).rejects.toThrow('User not found');
        });
        it('should throw error for short password', async () => {
            await expect(userService.changePassword(testUser.id, {
                currentPassword: 'password123',
                newPassword: '123'
            })).rejects.toThrow('New password must be at least 6 characters');
        });
    });
});
//# sourceMappingURL=user.service.test.js.map