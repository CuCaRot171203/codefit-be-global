/**
 * Testcase Repository
 * 
 * Xử lý các thao tác database cho Testcase entity.
 * Testcase chứa dữ liệu đầu vào và đầu ra mong đợi để chấm bài.
 */

import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../../../base/base.repository';
import { Testcase } from '../../problem/types';

const prisma = new PrismaClient();

/**
 * TestcaseRepository - Quản lý database operations cho Testcase
 * @class TestcaseRepository
 * @extends BaseRepository<Testcase>
 */
class TestcaseRepository extends BaseRepository<Testcase> {
  /** Prisma model được sử dụng cho các thao tác database */
  protected model = prisma.testcase;

  /**
   * Tìm tất cả các testcase theo problemId
   * @param problemId - ID của bài toán cần lấy các testcase
   * @returns Promise<Testcase[]> - Danh sách các testcase của bài toán
   */
  async findByProblemId(problemId: string): Promise<Testcase[]> {
    // Bước 1: Truy vấn database với điều kiện problemId
    // Bước 2: Sắp xếp theo id tăng dần
    return this.model.findMany({
      where: { problemId },
      orderBy: { id: 'asc' }
    });
  }

  /**
   * Tìm các testcase công khai theo problemId
   * @param problemId - ID của bài toán
   * @returns Promise<Testcase[]> - Danh sách testcase công khai
   */
  async findPublicByProblemId(problemId: string): Promise<Testcase[]> {
    // Bước 1: Truy vấn database với điều kiện problemId và isPublic = true
    return this.model.findMany({
      where: {
        problemId,
        isPublic: true
      }
    });
  }

  /**
   * Tìm các testcase riêng tư theo problemId
   * @param problemId - ID của bài toán
   * @returns Promise<Testcase[]> - Danh sách testcase riêng tư
   */
  async findPrivateByProblemId(problemId: string): Promise<Testcase[]> {
    // Bước 1: Truy vấn database với điều kiện problemId và isPublic = false
    return this.model.findMany({
      where: {
        problemId,
        isPublic: false
      }
    });
  }
}

export default new TestcaseRepository();
