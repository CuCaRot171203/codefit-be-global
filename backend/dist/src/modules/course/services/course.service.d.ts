/**
 * @file Service layer cho module Course.
 * Chứa logic nghiệp vụ xử lý các tác vụ liên quan đến Course.
 * Là cầu nối giữa Controller và Repository, xử lý validation và transformation data.
 * @module course/service
 */
import { BaseService } from '../../../base/base.service';
import courseRepository from '../repositories/course.repository';
import { CreateCourseDto, UpdateCourseDto, CourseWithPhases } from '../types';
/**
 * Service class mở rộng BaseService để xử lý logic nghiệp vụ cho Course.
 * Cung cấp các phương thức CRUD với validation và xử lý lỗi.
 */
declare class CourseService extends BaseService<typeof courseRepository> {
    /**
     * Constructor khởi tạo service với repository đã được inject.
     */
    constructor();
    /**
     * Tạo mới một khóa học.
     * @param creatorId - ID của người tạo khóa học (từ token đã xác thực)
     * @param dto - Dữ liệu khóa học cần tạo (title, description, price, level)
     * @returns Promise<CourseWithPhases> - Khóa học đã được tạo
     * @throws Error - Nếu thiếu title hoặc description bắt buộc
     */
    create(creatorId: string, dto: CreateCourseDto): Promise<CourseWithPhases>;
    /**
     * Lấy danh sách tất cả các khóa học.
     * @returns Promise<CourseWithPhases[]> - Mảng các khóa học với phases rỗng
     */
    getAll(): Promise<CourseWithPhases[]>;
    /**
     * Lấy thông tin một khóa học theo ID, kèm theo các phases và lessons.
     * @param id - ID của khóa học cần lấy
     * @returns Promise<CourseWithPhases | null> - Khóa học với phases hoặc null nếu không tìm thấy
     */
    getById(id: string): Promise<CourseWithPhases | null>;
    /**
     * Lấy danh sách khóa học của một creator cụ thể.
     * @param creatorId - ID của người tạo khóa học
     * @returns Promise<CourseWithPhases[]> - Mảng các khóa học của creator
     */
    getByCreatorId(creatorId: string): Promise<CourseWithPhases[]>;
    /**
     * Cập nhật thông tin một khóa học.
     * @param id - ID của khóa học cần cập nhật
     * @param dto - Dữ liệu cần cập nhật (các trường optional)
     * @returns Promise<CourseWithPhases> - Khóa học đã được cập nhật
     * @throws Error - Nếu khóa học không tồn tại
     */
    update(id: string, dto: UpdateCourseDto): Promise<CourseWithPhases>;
    /**
     * Xóa một khóa học.
     * @param id - ID của khóa học cần xóa
     * @returns Promise<{ message: string }> - Thông báo xóa thành công
     * @throws Error - Nếu khóa học không tồn tại
     */
    delete(id: string): Promise<{
        message: string;
    }>;
}
declare const _default: CourseService;
export default _default;
//# sourceMappingURL=course.service.d.ts.map