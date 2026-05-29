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
  async create(data: any): Promise<any> {
    // Bước 1: Sử dụng Prisma create để thêm bản ghi mới vào database
    // Handle missing fields by providing defaults
    const createData: any = {
      hackathonId: data.hackathonId,
      userId: data.userId,
      score: data.score ?? null,
      submittedAt: data.submittedAt || new Date(),
    };

    // Add problemId if present (for code submissions)
    if (data.problemId) {
      createData.problemId = data.problemId;
    }

    // Add project fields if present (for project submissions)
    if (data.projectTitle) {
      createData.projectTitle = data.projectTitle;
    }
    if (data.description !== undefined) {
      createData.description = data.description;
    }
    if (data.repositoryUrl !== undefined) {
      createData.repositoryUrl = data.repositoryUrl;
    }
    if (data.demoUrl !== undefined) {
      createData.demoUrl = data.demoUrl;
    }

    return this.model.create({ data: createData });
  }

  /**
   * Tìm tất cả bài nộp của một hackathon cụ thể
   * @param hackathonId - ID của hackathon cần lấy danh sách bài nộp
   * @returns Promise<HackathonSubmission[]> Danh sách bài nộp
   */
  async findByHackathonId(hackathonId: string): Promise<any[]> {
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
  async findByUserId(userId: string): Promise<any[]> {
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
  async updateScore(id: string, score: number): Promise<any> {
    // Bước 1: Update bản ghi với id tương ứng
    // Bước 2: Cập nhật trường score với giá trị mới
    return this.model.update({
      where: { id },
      data: { score }
    });
  }
}

export default new HackathonSubmissionRepository();
