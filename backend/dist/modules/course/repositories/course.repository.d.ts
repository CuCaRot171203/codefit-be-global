/**
 * @file Repository layer cho module Course.
 * Xử lý các thao tác CRUD trực tiếp với database thông qua Prisma.
 * Cung cấp các phương thức truy vấn course từ bảng courses.
 * @module course/repository
 */
import { BaseRepository } from '../../../base/base.repository';
import { Course } from '../types';
/**
 * Repository class mở rộng BaseRepository để quản lý Course entity.
 * Cung cấp các phương thức truy vấn và thao tác dữ liệu Course trong database.
 */
declare class CourseRepository extends BaseRepository<Course> {
    /** Model Prisma cho bảng course */
    protected model: import(".prisma/client").Prisma.CourseDelegate<import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    /**
     * Lấy tất cả các khóa học, sắp xếp theo thời gian tạo giảm dần.
     * @returns Promise<Course[]> - Mảng tất cả các khóa học
     */
    findAll(): Promise<Course[]>;
    /**
     * Lấy tất cả khóa học của một creator cụ thể.
     * @param creatorId - ID của người tạo khóa học
     * @returns Promise<Course[]> - Mảng các khóa học thuộc về creator
     */
    findByCreatorId(creatorId: string): Promise<Course[]>;
    /**
     * Lấy thông tin khóa học theo ID kèm theo các phases và lessons liên quan.
     * Sử dụng eager loading để include toàn bộ cấu trúc phân cấp của khóa học.
     * @param id - ID của khóa học cần lấy
     * @returns Promise<any> - Khóa học kèm phases và lessons đã sắp xếp
     */
    findByIdWithPhases(id: string): Promise<any>;
}
declare const _default: CourseRepository;
export default _default;
//# sourceMappingURL=course.repository.d.ts.map