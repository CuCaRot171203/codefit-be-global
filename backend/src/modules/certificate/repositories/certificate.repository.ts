/**
 * Certificate Repository
 * 
 * Xử lý các thao tác database cho Certificate entity.
 * Quản lý việc tạo, đọc và truy vấn chứng chỉ.
 */

import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../../../base/base.repository';

const prisma = new PrismaClient();

/**
 * Interface định nghĩa cấu trúc Certificate
 * @interface Certificate
 */
interface Certificate {
  /** ID duy nhất của chứng chỉ */
  id: string;
  /** ID của người nhận chứng chỉ */
  userId: string;
  /** ID của khóa học đã hoàn thành */
  courseId: string;
  /** Tiêu đề khóa học */
  courseTitle: string;
  /** Tên người nhận chứng chỉ */
  userName: string;
  /** Thời điểm cấp chứng chỉ */
  issuedAt: Date;
  /** URL xem/chia sẻ chứng chỉ */
  certificateUrl: string | null;
}

/**
 * CertificateRepository - Quản lý database operations cho Certificate
 * @class CertificateRepository
 * @extends BaseRepository<Certificate>
 */
class CertificateRepository extends BaseRepository<Certificate> {
  /** Prisma model được sử dụng cho các thao tác database */
  protected model = prisma.certificate;

  /**
   * Tìm tất cả chứng chỉ của một người dùng
   * @param userId - ID của người dùng
   * @returns Promise<Certificate[]> - Danh sách chứng chỉ của người dùng
   */
  async findByUserId(userId: string): Promise<Certificate[]> {
    // Bước 1: Truy vấn database với điều kiện userId
    // Bước 2: Sắp xếp theo thời gian cấp giảm dần (mới nhất trước)
    return this.model.findMany({
      where: { userId },
      orderBy: { issuedAt: 'desc' }
    });
  }

  /**
   * Tìm chứng chỉ theo userId và courseId
   * @param userId - ID của người dùng
   * @param courseId - ID của khóa học
   * @returns Promise<Certificate | null> - Chứng chỉ tìm được hoặc null
   */
  async findByUserAndCourse(userId: string, courseId: string): Promise<Certificate | null> {
    // Bước 1: Tìm chứng chỉ với điều kiện userId và courseId
    return this.model.findFirst({
      where: { userId, courseId }
    });
  }

  /**
   * Tạo mới một chứng chỉ
   * @param data - Thông tin chứng chỉ cần tạo
   * @returns Promise<Certificate> - Chứng chỉ đã được tạo
   */
  async generateCertificate(data: {
    /** ID của người nhận chứng chỉ */
    userId: string;
    /** ID của khóa học */
    courseId: string;
    /** Tiêu đề khóa học */
    courseTitle: string;
    /** Tên người nhận */
    userName: string;
  }): Promise<Certificate> {
    // Bước 1: Kiểm tra xem chứng chỉ đã tồn tại chưa
    const existing = await this.findByUserAndCourse(data.userId, data.courseId);
    if (existing) {
      // Bước 2: Nếu đã có, trả về chứng chỉ cũ (không tạo trùng)
      return existing;
    }

    // Bước 3: Tạo URL chứng chỉ duy nhất
    const certificateUrl = `https://codefit.com/certificates/${crypto.randomUUID()}`;

    // Bước 4: Tạo chứng chỉ mới trong database
    return this.model.create({
      data: {
        userId: data.userId,
        courseId: data.courseId,
        courseTitle: data.courseTitle,
        userName: data.userName,
        issuedAt: new Date(),
        certificateUrl
      }
    });
  }
}

export default new CertificateRepository();
