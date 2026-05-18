/**
 * Testcase Service
 * 
 * Chứa business logic cho các thao tác với Testcase.
 * Xử lý validation và gọi repository để tương tác với database.
 */

import { BaseService } from '../../../base/base.service';
import testcaseRepository from '../repositories/testcase.repository';
import { CreateTestcaseDto, UpdateTestcaseDto } from '../../problem/types';

/**
 * TestcaseService - Business logic layer cho Testcase
 * @class TestcaseService
 * @extends BaseService
 */
class TestcaseService extends BaseService<typeof testcaseRepository> {

  constructor() {
    super(testcaseRepository);
  }

  /**
   * Tạo mới một testcase
   * @param dto - Dữ liệu tạo testcase bao gồm problemId, input, expectedOutput
   * @returns Promise<Testcase> - Testcase vừa được tạo
   * @throws Error - Nếu thiếu các trường bắt buộc
   */
  async create(dto: CreateTestcaseDto): Promise<any> {
    // Bước 1: Validate dữ liệu đầu vào - yêu cầu problemId, input, expectedOutput
    if (!dto.problemId || !dto.input || !dto.expectedOutput) {
      throw new Error('problemId, input, and expectedOutput are required');
    }

    // Bước 2: Tạo testcase mới với các trường được cung cấp
    // Bước 3: isPublic mặc định là false nếu không được chỉ định
    const testcase = await this.repository.create({
      problemId: dto.problemId,
      input: dto.input,
      expectedOutput: dto.expectedOutput,
      isPublic: dto.isPublic ?? false
    } as any);

    return testcase;
  }

  /**
   * Lấy tất cả các testcase của một bài toán
   * @param problemId - ID của bài toán
   * @returns Promise<Testcase[]> - Danh sách các testcase
   */
  async getByProblemId(problemId: string): Promise<any[]> {
    // Bước 1: Gọi repository để lấy tất cả testcase theo problemId
    return this.repository.findByProblemId(problemId);
  }

  /**
   * Lấy các testcase công khai của một bài toán
   * @param problemId - ID của bài toán
   * @returns Promise<Testcase[]> - Danh sách testcase công khai
   */
  async getPublicByProblemId(problemId: string): Promise<any[]> {
    // Bước 1: Gọi repository để lấy testcase công khai theo problemId
    return this.repository.findPublicByProblemId(problemId);
  }

  /**
   * Lấy một testcase theo ID
   * @param id - ID của testcase cần lấy
   * @returns Promise<Testcase | null> - Testcase tìm được hoặc null
   */
  async getById(id: string): Promise<any | null> {
    // Bước 1: Gọi repository để tìm testcase theo ID
    return this.repository.findById(id);
  }

  /**
   * Cập nhật một testcase
   * @param id - ID của testcase cần cập nhật
   * @param dto - Dữ liệu cập nhật (input, expectedOutput, isPublic)
   * @returns Promise<Testcase> - Testcase sau khi cập nhật
   * @throws Error - Nếu testcase không tồn tại
   */
  async update(id: string, dto: UpdateTestcaseDto): Promise<any> {
    // Bước 1: Kiểm tra testcase có tồn tại hay không
    const testcase = await this.repository.findById(id);
    if (!testcase) {
      throw new Error('Testcase not found');
    }

    // Bước 2: Cập nhật các trường được phép
    return this.repository.update(id, {
      input: dto.input,
      expectedOutput: dto.expectedOutput,
      isPublic: dto.isPublic
    } as any);
  }

  /**
   * Xóa một testcase
   * @param id - ID của testcase cần xóa
   * @returns Promise<{ message: string }> - Thông báo thành công
   * @throws Error - Nếu testcase không tồn tại
   */
  async delete(id: string): Promise<{ message: string }> {
    // Bước 1: Kiểm tra testcase có tồn tại hay không
    const testcase = await this.repository.findById(id);
    if (!testcase) {
      throw new Error('Testcase not found');
    }

    // Bước 2: Thực hiện xóa testcase
    await this.repository.delete(id);

    // Bước 3: Trả về thông báo thành công
    return { message: 'Testcase deleted successfully' };
  }
}

export default new TestcaseService();
