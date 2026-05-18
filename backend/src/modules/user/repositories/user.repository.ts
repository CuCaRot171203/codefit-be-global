/**
 * @fileoverview User Repository
 * @description Repository xử lý các thao tác database liên quan đến User.
 */

import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../../../base/base.repository';
import { UserProfile } from '../types';

const prisma = new PrismaClient();

/**
 * @class UserRepository
 * @extends BaseRepository
 * @description Repository quản lý các thao tác CRUD với bảng User trong database
 */
class UserRepository extends BaseRepository<UserProfile> {
  protected model = prisma.user;

  /**
   * @method findByEmail
   * @description Tìm kiếm người dùng theo email
   * @param {string} email - Email của người dùng cần tìm
   * @returns {Promise<UserProfile | null>} Thông tin người dùng hoặc null nếu không tìm thấy
   */
  async findByEmail(email: string): Promise<UserProfile | null> {
    return this.model.findUnique({ where: { email } });
  }

  /**
   * @method updateProfile
   * @description Cập nhật thông tin hồ sơ người dùng
   * @param {string} id - ID của người dùng cần cập nhật
   * @param {any} data - Dữ liệu cập nhật (username, avatar, bio)
   * @returns {Promise<UserProfile>} Thông tin người dùng sau khi cập nhật
   */
  async updateProfile(id: string, data: any): Promise<UserProfile> {
    return this.model.update({
      where: { id },
      data
    });
  }

  /**
   * @method updatePassword
   * @description Cập nhật mật khẩu người dùng
   * @param {string} id - ID của người dùng cần đổi mật khẩu
   * @param {string} hashedPassword - Mật khẩu đã được hash
   * @returns {Promise<UserProfile>} Thông tin người dùng sau khi cập nhật mật khẩu
   */
  async updatePassword(id: string, hashedPassword: string): Promise<UserProfile> {
    return this.model.update({
      where: { id },
      data: { password: hashedPassword }
    });
  }

  /**
   * @method markAsOnboarded
   * @description Đánh dấu người dùng đã hoàn thành onboarding
   * @param {string} id - ID của người dùng
   * @returns {Promise<UserProfile>} Thông tin người dùng sau khi cập nhật
   */
  async markAsOnboarded(id: string): Promise<UserProfile> {
    return this.model.update({
      where: { id },
      data: { isOnboarded: true }
    });
  }
}

export default new UserRepository();
