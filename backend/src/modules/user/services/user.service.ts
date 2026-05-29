/**
 * @fileoverview User Service
 * @description Service xu ly business logic lien quan den User.
 */

import bcrypt from 'bcrypt';
import { BaseService } from '../../../base/base.service';
import userRepository from '../repositories/user.repository';
import { UpdateProfileDto, ChangePasswordDto } from '../types';

class UserService extends BaseService<typeof userRepository> {

  constructor() {
    super(userRepository);
  }

  async getProfile(userId: string): Promise<any> {
    return this.repository.findById(userId);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<any> {
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

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<{ message: string }> {
    const user = await this.repository.findByIdWithPassword(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const isValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isValid) {
      throw new Error('Current password is incorrect');
    }
    if (dto.newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters');
    }
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.repository.updatePassword(userId, hashedPassword);
    return { message: 'Password changed successfully' };
  }
}

export default new UserService();
