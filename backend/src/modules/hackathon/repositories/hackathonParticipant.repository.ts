/**
 * Repository cho các thao tác CRUD với bảng HackathonParticipant trong database
 * @module HackathonParticipantRepository
 */

import { PrismaClient } from '@prisma/client';

/** Khởi tạo PrismaClient để kết nối database */
const prisma = new PrismaClient();

/**
 * Interface định nghĩa cấu trúc dữ liệu HackathonParticipant
 * @interface HackathonParticipant
 */
interface HackathonParticipant {
  id: string;
  hackathonId: string;
  userId: string;
  joinedAt: Date;
}

/**
 * Repository class xử lý các thao tác với dữ liệu người tham gia hackathon
 * @class HackathonParticipantRepository
 */
class HackathonParticipantRepository {
  /** Model Prisma để thao tác với bảng hackathonParticipant */
  private model = prisma.hackathonParticipant;

  /**
   * Tạo mới một bản ghi tham gia hackathon
   * @param data - Dữ liệu tham gia hackathon
   * @returns Promise<HackathonParticipant> Bản ghi tham gia đã được tạo
   */
  async create(data: any): Promise<HackathonParticipant> {
    // Bước 1: Sử dụng Prisma create để thêm bản ghi mới vào database
    return this.model.create({ data });
  }

  /**
   * Tìm bản ghi tham gia theo hackathonId và userId
   * Sử dụng unique constraint trên cặp (hackathonId, userId)
   * @param hackathonId - ID của hackathon
   * @param userId - ID của người dùng
   * @returns Promise<HackathonParticipant | null> Bản ghi tham gia hoặc null nếu không tìm thấy
   */
  async findByHackathonAndUser(hackathonId: string, userId: string): Promise<HackathonParticipant | null> {
    return this.model.findFirst({
      where: { hackathonId, userId }
    });
  }

  /**
   * Tìm tất cả người tham gia của một hackathon cụ thể
   * @param hackathonId - ID của hackathon cần lấy danh sách tham gia
   * @returns Promise<HackathonParticipant[]> Danh sách người tham gia
   */
  async findByHackathonId(hackathonId: string): Promise<any[]> {
    // Bước 1: Query tất cả bản ghi có hackathonId tương ứng
    // Bước 2: Sắp xếp theo thời gian tham gia giảm dần (mới nhất trước)
    // Bước 3: Include user data để lấy tên hiển thị
    return this.model.findMany({
      where: { hackathonId },
      orderBy: { joinedAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
  }

  /**
   * Xóa bản ghi tham gia hackathon
   * @param id - ID của bản ghi tham gia cần xóa
   * @returns Promise<void>
   */
  async delete(id: string): Promise<void> {
    // Bước 1: Xóa bản ghi với id tương ứng
    await this.model.delete({ where: { id } });
  }
}

export default new HackathonParticipantRepository();
