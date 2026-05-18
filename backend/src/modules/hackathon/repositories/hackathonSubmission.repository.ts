/**
 * Repository cho các thao tác CRUD với bảng HackathonSubmission trong database
 * @module HackathonSubmissionRepository
 */

import { PrismaClient } from '@prisma/client';

/** Khởi tạo PrismaClient để kết nối database */
const prisma = new PrismaClient();

/**
 * Interface định nghĩa cấu trúc dữ liệu HackathonSubmission
 * @interface HackathonSubmission
 */
interface HackathonSubmission {
  id: string;
  hackathonId: string;
  userId: string;
  projectTitle: string;
  description: string;
  repositoryUrl: string;
  demoUrl: string | null;
  score: number | null;
  submittedAt: Date;
}

/**
 * Repository class xử lý các thao tác với dữ liệu bài nộp dự án hackathon
 * @class HackathonSubmissionRepository
 */
class HackathonSubmissionRepository {
  /** Model Prisma để thao tác với bảng hackathonSubmission */
  private model = prisma.hackathonSubmission;

  /**
   * Tạo mới một bài nộp dự án
   * @param data - Dữ liệu bài nộp dự án
   * @returns Promise<HackathonSubmission> Bài nộp đã được tạo
   */
  async create(data: any): Promise<HackathonSubmission> {
    // Bước 1: Sử dụng Prisma create để thêm bản ghi mới vào database
    return this.model.create({ data });
  }

  /**
   * Tìm tất cả bài nộp của một hackathon cụ thể
   * @param hackathonId - ID của hackathon cần lấy danh sách bài nộp
   * @returns Promise<HackathonSubmission[]> Danh sách bài nộp
   */
  async findByHackathonId(hackathonId: string): Promise<HackathonSubmission[]> {
    // Bước 1: Query tất cả bản ghi có hackathonId tương ứng
    // Bước 2: Sắp xếp theo điểm số giảm dần (cao điểm nhất trước)
    return this.model.findMany({
      where: { hackathonId },
      orderBy: { score: 'desc' }
    });
  }

  /**
   * Tìm tất cả bài nộp của một người dùng cụ thể
   * @param userId - ID của người dùng cần lấy danh sách bài nộp
   * @returns Promise<HackathonSubmission[]> Danh sách bài nộp của user
   */
  async findByUserId(userId: string): Promise<HackathonSubmission[]> {
    // Bước 1: Query tất cả bản ghi có userId tương ứng
    // Bước 2: Sắp xếp theo thời gian nộp giảm dần (mới nhất trước)
    return this.model.findMany({
      where: { userId },
      orderBy: { submittedAt: 'desc' }
    });
  }

  /**
   * Cập nhật điểm số cho một bài nộp
   * @param id - ID của bài nộp cần cập nhật điểm
   * @param score - Điểm số mới (0-100)
   * @returns Promise<HackathonSubmission> Bài nộp đã được cập nhật
   */
  async updateScore(id: string, score: number): Promise<HackathonSubmission> {
    // Bước 1: Update bản ghi với id tương ứng
    // Bước 2: Cập nhật trường score với giá trị mới
    return this.model.update({
      where: { id },
      data: { score }
    });
  }
}

export default new HackathonSubmissionRepository();
