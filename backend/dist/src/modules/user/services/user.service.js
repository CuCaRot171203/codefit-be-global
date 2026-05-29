"use strict";
/**
 * @fileoverview User Service
 * @description Service xu ly business logic lien quan den User.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const base_service_1 = require("../../../base/base.service");
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
class UserService extends base_service_1.BaseService {
    constructor() {
        super(user_repository_1.default);
    }
    async getProfile(userId) {
        return this.repository.findById(userId);
    }
    async updateProfile(userId, dto) {
        const user = await this.repository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const updatedUser = await this.repository.updateProfile(userId, {
            username: dto.username,
            avatar: dto.avatar,
            bio: dto.bio,
            fullName: dto.fullName,
            school: dto.school,
            learningLevel: dto.learningLevel,
            referralCode: dto.referralCode
        });
        if (dto.fullName && dto.school && dto.learningLevel) {
            await this.repository.markAsOnboarded(userId);
        }
        return updatedUser;
    }
    async changePassword(userId, dto) {
        const user = await this.repository.findByIdWithPassword(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const isValid = await bcrypt_1.default.compare(dto.currentPassword, user.password);
        if (!isValid) {
            throw new Error('Current password is incorrect');
        }
        if (dto.newPassword.length < 6) {
            throw new Error('New password must be at least 6 characters');
        }
        const hashedPassword = await bcrypt_1.default.hash(dto.newPassword, 10);
        await this.repository.updatePassword(userId, hashedPassword);
        return { message: 'Password changed successfully' };
    }
}
exports.default = new UserService();
//# sourceMappingURL=user.service.js.map