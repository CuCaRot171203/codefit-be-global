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
class CourseService extends BaseService<typeof courseRepository> {

  /**
   * Constructor khởi tạo service với repository đã được inject.
   */
  constructor() {
    super(courseRepository);
  }

  /**
   * Tạo mới một khóa học.
   * @param creatorId - ID của người tạo khóa học (từ token đã xác thực)
   * @param dto - Dữ liệu khóa học cần tạo (title, description, price, level)
   * @returns Promise<CourseWithPhases> - Khóa học đã được tạo
   * @throws Error - Nếu thiếu title hoặc description bắt buộc
   */
  async create(creatorId: string, dto: CreateCourseDto): Promise<CourseWithPhases> {
    // Bước 1: Validate dữ liệu đầu vào - kiểm tra các trường bắt buộc
    if (!dto.title || !dto.description) {
      throw new Error('Title and description are required');
    }

    // Bước 2: Chuẩn bị dữ liệu với giá trị mặc định cho các trường optional
    const courseData: any = {
      title: dto.title,
      description: dto.description,
      // Bước 3: Set giá trị mặc định cho price nếu không được cung cấp
      price: dto.price || 0,
      // Bước 4: Set giá trị mặc định cho level nếu không được cung cấp
      level: dto.level || 'beginner',
      // Bước 5: Gán creatorId từ user đã xác thực
      creatorId,
    };

    // Course metadata fields if present
    if ((dto as any).features !== undefined) {
      courseData.features = (dto as any).features;
    }
    if ((dto as any).includes !== undefined) {
      courseData.includes = (dto as any).includes;
    }

    // Bước 6: Gọi repository để tạo record mới trong database
    const course = await this.repository.create(courseData);

    // Transform to add empty phases array to match CourseWithPhases type
    return { ...course, phases: [] };
  }

  /**
   * Lấy danh sách tất cả các khóa học.
   * @returns Promise<CourseWithPhases[]> - Mảng các khóa học với phases rỗng
   */
  async getAll(): Promise<CourseWithPhases[]> {
    // Bước 1: Gọi repository để lấy tất cả courses từ database
    const courses = await this.repository.findAll();
    
    // Bước 2: Transform data - thêm property phases rỗng cho mỗi course
    return courses.map(c => ({ ...c, phases: [] }));
  }

  /**
   * Lấy thông tin một khóa học theo ID, kèm theo các phases và lessons.
   * @param id - ID của khóa học cần lấy
   * @returns Promise<CourseWithPhases | null> - Khóa học với phases hoặc null nếu không tìm thấy
   */
  async getById(id: string): Promise<CourseWithPhases | null> {
    // Bước 1: Gọi repository với phương thức findByIdWithPhases để lấy course kèm relations
    const course = await this.repository.findByIdWithPhases(id);
    
    // Bước 2: Kiểm tra nếu không tìm thấy thì trả về null
    if (!course) return null;
    
    // Bước 3: Trả về course cùng với các phases đã được include
    return course;
  }

  /**
   * Lấy danh sách khóa học của một creator cụ thể.
   * @param creatorId - ID của người tạo khóa học
   * @returns Promise<CourseWithPhases[]> - Mảng các khóa học của creator
   */
  async getByCreatorId(creatorId: string): Promise<CourseWithPhases[]> {
    // Bước 1: Gọi repository để lấy courses theo creatorId
    const courses = await this.repository.findByCreatorId(creatorId);
    
    // Bước 2: Transform data - thêm property phases rỗng cho mỗi course
    return courses.map(c => ({ ...c, phases: [] }));
  }

  /**
   * Cập nhật thông tin một khóa học.
   * @param id - ID của khóa học cần cập nhật
   * @param dto - Dữ liệu cần cập nhật (các trường optional)
   * @returns Promise<CourseWithPhases> - Khóa học đã được cập nhật
   * @throws Error - Nếu khóa học không tồn tại
   */
  async update(id: string, dto: UpdateCourseDto): Promise<CourseWithPhases> {
    // Bước 1: Kiểm tra khóa học có tồn tại không trước khi update
    const course = await this.repository.findById(id);
    if (!course) {
      throw new Error('Course not found');
    }

    // Bước 2: Chuẩn bị object chứa các trường cần update
    const updateData: any = {
      title: dto.title,
      description: dto.description,
      price: dto.price,
      level: dto.level
    };

    // Thêm các trường subscription nếu có
    if (dto.subscriptionType !== undefined) {
      updateData.subscriptionType = dto.subscriptionType;
    }
    if (dto.subscriptionPrice !== undefined) {
      updateData.subscriptionPrice = dto.subscriptionPrice;
    }
    if (dto.autoEnrollOnApproval !== undefined) {
      updateData.autoEnrollOnApproval = dto.autoEnrollOnApproval;
    }
    // Progressive unlock config
    if (dto.unlockLessonsCount !== undefined) {
      updateData.unlockLessonsCount = dto.unlockLessonsCount;
    }
    if (dto.unlockByPhase !== undefined) {
      updateData.unlockByPhase = dto.unlockByPhase;
    }
    // Course metadata
    if ((dto as any).features !== undefined) {
      updateData.features = (dto as any).features;
    }
    if ((dto as any).includes !== undefined) {
      updateData.includes = (dto as any).includes;
    }
    if ((dto as any).isFreeCourse !== undefined) {
      updateData.isFreeCourse = (dto as any).isFreeCourse;
    }

    // Bước 3: Gọi repository để cập nhật record trong database
    const updated = await this.repository.update(id, updateData);

    // Bước 4: Transform response - thêm property phases rỗng
    return { ...updated, phases: [] };
  }

  /**
   * Xóa một khóa học.
   * @param id - ID của khóa học cần xóa
   * @returns Promise<{ message: string }> - Thông báo xóa thành công
   * @throws Error - Nếu khóa học không tồn tại
   */
  async delete(id: string): Promise<{ message: string }> {
    // Bước 1: Kiểm tra khóa học có tồn tại không trước khi delete
    const course = await this.repository.findById(id);
    if (!course) {
      throw new Error('Course not found');
    }

    // Bước 2: Gọi repository để xóa record khỏi database
    await this.repository.delete(id);

    // Bước 3: Trả về thông báo thành công
    return { message: 'Course deleted successfully' };
  }
}

export default new CourseService();
