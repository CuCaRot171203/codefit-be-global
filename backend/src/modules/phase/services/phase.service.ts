/**
 * Phase Service
 * 
 * Chứa business logic cho các thao tác với Phase.
 * Xử lý validation và gọi repository để tương tác với database.
 */

import { BaseService } from '../../../base/base.service';
import phaseRepository from '../repositories/phase.repository';
import { CreatePhaseDto, UpdatePhaseDto } from '../types';

/**
 * PhaseService - Business logic layer cho Phase
 * @class PhaseService
 * @extends BaseService
 */
class PhaseService extends BaseService<typeof phaseRepository> {

  constructor() {
    super(phaseRepository);
  }

  /**
   * Tạo mới một phase
   * @param dto - Dữ liệu tạo phase bao gồm courseId và title
   * @returns Promise<Phase> - Phase vừa được tạo
   * @throws Error - Nếu thiếu courseId hoặc title
   */
  async create(dto: CreatePhaseDto): Promise<any> {
    // Bước 1: Validate dữ liệu đầu vào
    if (!dto.courseId || !dto.title) {
      throw new Error('courseId and title are required');
    }

    // Bước 2: Tạo phase mới với các trường được cung cấp
    // Bước 3: Sử dụng orderIndex từ dto hoặc mặc định là 0
    const phase = await this.repository.create({
      courseId: dto.courseId,
      title: dto.title,
      orderIndex: dto.orderIndex || 0
    } as any);

    return phase;
  }

  /**
   * Tạo phase với auto orderIndex
   * @param params - courseId và title
   * @returns Promise<Phase>
   */
  async createPhase(params: { courseId: string; title: string }): Promise<any> {
    // Get max orderIndex for this course
    const phases = await this.repository.findByCourseId(params.courseId);
    const maxOrder = phases.reduce((max, p) => Math.max(max, p.orderIndex || 0), -1);
    
    return this.create({
      courseId: params.courseId,
      title: params.title,
      orderIndex: maxOrder + 1,
    });
  }

  /**
   * Lấy tất cả các phase của một khóa học
   * @param courseId - ID của khóa học
   * @returns Promise<Phase[]> - Danh sách các phase
   */
  async getByCourseId(courseId: string): Promise<any[]> {
    // Bước 1: Gọi repository để lấy các phase theo courseId
    return this.repository.findByCourseId(courseId);
  }

  /**
   * Lấy một phase theo ID
   * @param id - ID của phase cần lấy
   * @returns Promise<Phase | null> - Phase tìm được hoặc null
   */
  async getById(id: string): Promise<any | null> {
    // Bước 1: Gọi repository để tìm phase theo ID
    return this.repository.findById(id);
  }

  /**
   * Cập nhật một phase
   * @param id - ID của phase cần cập nhật
   * @param dto - Dữ liệu cập nhật (title và/hoặc orderIndex)
   * @returns Promise<Phase> - Phase sau khi cập nhật
   * @throws Error - Nếu phase không tồn tại
   */
  async update(id: string, dto: UpdatePhaseDto): Promise<any> {
    // Bước 1: Kiểm tra phase có tồn tại hay không
    const phase = await this.repository.findById(id);
    if (!phase) {
      throw new Error('Phase not found');
    }

    // Bước 2: Cập nhật các trường được phép (title, orderIndex)
    const updated = await this.repository.update(id, {
      title: dto.title,
      orderIndex: dto.orderIndex
    } as any);

    return updated;
  }

  /**
   * Xóa một phase
   * @param id - ID của phase cần xóa
   * @returns Promise<{ message: string }> - Thông báo thành công
   * @throws Error - Nếu phase không tồn tại
   */
  async delete(id: string): Promise<{ message: string }> {
    // Bước 1: Kiểm tra phase có tồn tại hay không
    const phase = await this.repository.findById(id);
    if (!phase) {
      throw new Error('Phase not found');
    }

    // Bước 2: Thực hiện xóa phase
    await this.repository.delete(id);

    // Bước 3: Trả về thông báo thành công
    return { message: 'Phase deleted successfully' };
  }
}

export default new PhaseService();
