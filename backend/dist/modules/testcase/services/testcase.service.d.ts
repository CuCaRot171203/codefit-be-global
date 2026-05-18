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
declare class TestcaseService extends BaseService<typeof testcaseRepository> {
    constructor();
    /**
     * Tạo mới một testcase
     * @param dto - Dữ liệu tạo testcase bao gồm problemId, input, expectedOutput
     * @returns Promise<Testcase> - Testcase vừa được tạo
     * @throws Error - Nếu thiếu các trường bắt buộc
     */
    create(dto: CreateTestcaseDto): Promise<any>;
    /**
     * Lấy tất cả các testcase của một bài toán
     * @param problemId - ID của bài toán
     * @returns Promise<Testcase[]> - Danh sách các testcase
     */
    getByProblemId(problemId: string): Promise<any[]>;
    /**
     * Lấy các testcase công khai của một bài toán
     * @param problemId - ID của bài toán
     * @returns Promise<Testcase[]> - Danh sách testcase công khai
     */
    getPublicByProblemId(problemId: string): Promise<any[]>;
    /**
     * Lấy một testcase theo ID
     * @param id - ID của testcase cần lấy
     * @returns Promise<Testcase | null> - Testcase tìm được hoặc null
     */
    getById(id: string): Promise<any | null>;
    /**
     * Cập nhật một testcase
     * @param id - ID của testcase cần cập nhật
     * @param dto - Dữ liệu cập nhật (input, expectedOutput, isPublic)
     * @returns Promise<Testcase> - Testcase sau khi cập nhật
     * @throws Error - Nếu testcase không tồn tại
     */
    update(id: string, dto: UpdateTestcaseDto): Promise<any>;
    /**
     * Xóa một testcase
     * @param id - ID của testcase cần xóa
     * @returns Promise<{ message: string }> - Thông báo thành công
     * @throws Error - Nếu testcase không tồn tại
     */
    delete(id: string): Promise<{
        message: string;
    }>;
}
declare const _default: TestcaseService;
export default _default;
//# sourceMappingURL=testcase.service.d.ts.map