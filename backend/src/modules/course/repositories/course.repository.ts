/**
 * @file Repository layer cho module Course.
 * Xử lý các thao tác CRUD trực tiếp với database thông qua Prisma.
 * Cung cấp các phương thức truy vấn course từ bảng courses.
 * @module course/repository
 */

import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../../../base/base.repository';
import { Course } from '../types';

const prisma = new PrismaClient();

/**
 * Repository class mở rộng BaseRepository để quản lý Course entity.
 * Cung cấp các phương thức truy vấn và thao tác dữ liệu Course trong database.
 */
class CourseRepository extends BaseRepository<Course> {
  /** Model Prisma cho bảng course */
  protected model = prisma.course;

  /**
   * Lấy tất cả các khóa học, sắp xếp theo thời gian tạo giảm dần.
   * @returns Promise<Course[]> - Mảng tất cả các khóa học
   */
  async findAll(): Promise<Course[]> {
    return this.model.findMany({});
  }

  /**
   * Lấy tất cả khóa học của một creator cụ thể.
   * @param creatorId - ID của người tạo khóa học
   * @returns Promise<Course[]> - Mảng các khóa học thuộc về creator
   */
  async findByCreatorId(creatorId: string): Promise<Course[]> {
    return this.model.findMany({
      where: { creatorId },
    });
  }

  /**
   * Lấy thông tin khóa học theo ID kèm theo các phases và lessons liên quan.
   * Sử dụng eager loading để include toàn bộ cấu trúc phân cấp của khóa học.
   * @param id - ID của khóa học cần lấy
   * @returns Promise<any> - Khóa học kèm phases và lessons đã sắp xếp
   */
  async findByIdWithPhases(id: string): Promise<any> {
    // Bước 1: Sử dụng findUnique để lấy course theo ID
    return this.model.findUnique({
      // Bước 2: Điều kiện tìm kiếm theo id
      where: { id },
      // Bước 3: Include các phases liên quan (eager loading)
      include: {
        // Bước 4: Lấy tất cả phases của course, sắp xếp theo orderIndex
        phases: {
          orderBy: { orderIndex: 'asc' },
          // Bước 5: Với mỗi phase, include các lessons và minitests bên trong
          include: {
            // Bước 6: Lấy lessons của phase, sắp xếp theo orderIndex
            lessons: {
              orderBy: { orderIndex: 'asc' }
            },
            // Lấy minitests của phase
            minitests: true
          }
        },
        // Include hackathons (Final Test) của khóa học
        hackathons: {
          orderBy: { startTime: 'asc' },
          include: {
            problems: {
              include: {
                testcases: true
              }
            }
          }
        },
        // Include projects của khóa học
        projects: {
          orderBy: { id: 'asc' }
        }
      }
    });
  }
}

export default new CourseRepository();
