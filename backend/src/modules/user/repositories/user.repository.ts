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
  async findByEmail(email: string): Promise<any> {
    return this.model.findUnique({
      where: { email },
      include: { role: true },
    });
  }

  async findById(id: string): Promise<any> {
    return this.model.findUnique({
      where: { id },
      include: { role: true },
    });
  }

  async findByIdWithPassword(id: string): Promise<any> {
    return this.model.findUnique({
      where: { id },
      include: { role: true },
    });
  }

  async updateProfile(id: string, data: any): Promise<any> {
    return this.model.update({
      where: { id },
      data,
      include: { role: true },
    });
  }

  async updatePassword(id: string, hashedPassword: string): Promise<any> {
    return this.model.update({
      where: { id },
      data: { password: hashedPassword },
      include: { role: true },
    });
  }

  async markAsOnboarded(id: string): Promise<any> {
    return this.model.update({
      where: { id },
      data: { isOnboarded: true },
      include: { role: true },
    });
  }
}

export default new UserRepository();
