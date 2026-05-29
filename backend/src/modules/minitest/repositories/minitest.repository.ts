/**
 * Minitest Repository
 * 
 * Xử lý các thao tác database cho Minitest entity.
 * Quản lý việc tạo, đọc và truy vấn các bài kiểm tra nhỏ.
 */

import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../../../base/base.repository';

const prisma = new PrismaClient();

/**
 * Interface định nghĩa cấu trúc Minitest
 * @interface Minitest
 */
interface Minitest {
  /** ID duy nhất của bài test */
  id: string;
  /** Tiêu đề bài test */
  title: string;
  /** Mô tả bài test */
  description: string;
  /** ID của khóa học liên kết */
  courseId: string | null;
  /** Độ khó của bài test */
  difficulty: string;
  /** Thời gian làm bài (giây) */
  timeLimit: number;
  /** Thời điểm tạo */
  createdAt: Date;
}

/**
 * MinitestRepository - Quản lý database operations cho Minitest
 * @class MinitestRepository
 * @extends BaseRepository<Minitest>
 */
class MinitestRepository extends BaseRepository<Minitest> {
  /** Prisma model được sử dụng cho các thao tác database */
  protected model = prisma.minitest;

  /**
   * Tìm bài test theo ID kèm danh sách câu hỏi
   * @param id - ID của bài test cần tìm
   * @returns Promise<Minitest | null> - Bài test với câu hỏi hoặc null
   */
  async findByIdWithQuestions(id: string): Promise<any> {
    // Bước 1: Tìm bài test theo ID
    // Bước 2: Include các câu hỏi và sắp xếp theo orderIndex tăng dần
    return this.model.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });
  }

  /**
   * Tìm các bài test theo courseId
   * @param courseId - ID của khóa học
   * @returns Promise<Minitest[]> - Danh sách bài test của khóa học
   */
  async findByCourseId(courseId: string): Promise<any[]> {
    const phases = await prisma.phase.findMany({
      where: { courseId },
      select: { id: true },
    });
    const phaseIds = phases.map(p => p.id);

    return this.model.findMany({
      where: { phaseId: { in: phaseIds } },
      include: {
        phase: { select: { id: true, title: true, orderIndex: true } },
        questions: { include: { problem: true } },
      },
      orderBy: [
        { phase: { orderIndex: 'asc' } },
        { orderIndex: 'asc' }
      ]
    });
  }
}

export default new MinitestRepository();
