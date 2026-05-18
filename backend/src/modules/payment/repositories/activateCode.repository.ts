/**
 * @fileoverview Repository layer cho ActivateCode module
 * Xử lý các thao tác database liên quan đến ActivateCode
 * @module activateCode/repositories
 */

import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

class ActivateCodeRepository {
  /**
   * Tạo activate code mới
   */
  async create(data: Prisma.ActivateCodeCreateInput) {
    return prisma.activateCode.create({ data });
  }

  /**
   * Tìm activate code theo code string
   */
  async findByCode(code: string) {
    return prisma.activateCode.findUnique({
      where: { code },
      include: { course: true }
    });
  }

  /**
   * Tìm activate codes theo course ID
   */
  async findByCourseId(courseId: string) {
    return prisma.activateCode.findMany({
      where: { courseId },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Tìm activate codes của một user đã sử dụng
   */
  async findByUserId(userId: string) {
    return prisma.activateCode.findMany({
      where: { usedBy: userId },
      include: { course: true },
      orderBy: { usedAt: 'desc' }
    });
  }

  /**
   * Đánh dấu activate code đã sử dụng
   */
  async markAsUsed(code: string, userId: string) {
    return prisma.activateCode.update({
      where: { code },
      data: {
        isUsed: true,
        usedBy: userId,
        usedAt: new Date()
      }
    });
  }

  /**
   * Xóa activate code
   */
  async delete(id: string) {
    return prisma.activateCode.delete({
      where: { id }
    });
  }
}

export default new ActivateCodeRepository();
