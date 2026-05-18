/**
 * Problem Service
 * @description Contains business logic for managing programming problems.
 */
import { BaseService } from '../../../base/base.service';
import problemRepository from '../repositories/problem.repository';
/**
 * ProblemService class
 * @extends BaseService
 * @description Handles business logic and validation for problem operations.
 */
class ProblemService extends BaseService {
    constructor() {
        super(problemRepository);
    }
    /**
     * Get all problems
     * @description Retrieves all problems from the database.
     * @returns Promise resolving to an array of all problems
     */
    async getAll() {
        return this.repository.findMany();
    }
    /**
     * Create a new problem
     * @description Validates input data and creates a new problem in the database.
     * @param dto - Data Transfer Object containing problem details
     * @returns Promise resolving to the created problem
     * @throws Error if title or description is missing
     */
    async create(dto) {
        // Bước 1: Validate input - kiểm tra các trường bắt buộc
        if (!dto.title || !dto.description) {
            throw new Error('Title and description are required');
        }
        // Bước 2: Chuẩn bị dữ liệu với các giá trị mặc định nếu không được cung cấp
        // Bước 3: Gọi repository để tạo problem mới trong database
        const problem = await this.repository.create({
            title: dto.title,
            description: dto.description,
            difficulty: dto.difficulty || 'easy',
            timeLimit: dto.timeLimit || 1000,
            memoryLimit: dto.memoryLimit || 256
        });
        // Bước 4: Trả về kết quả đã được tạo
        return problem;
    }
    /**
     * Get a problem by ID with all testcases
     * @description Retrieves a problem along with its associated test cases.
     * @param id - The unique identifier of the problem
     * @returns Promise resolving to the problem with testcases or null
     */
    async getById(id) {
        // Bước 1: Gọi repository để lấy problem cùng với testcases
        return this.repository.findByIdWithTestcases(id);
    }
    /**
     * Get all public test cases for a problem
     * @description Retrieves only the test cases that are marked as public for user access.
     * @param problemId - The unique identifier of the problem
     * @returns Promise resolving to an array of public test cases
     * @throws Error if the problem is not found
     */
    async getPublicTestcases(problemId) {
        // Bước 1: Kiểm tra sự tồn tại của problem trước khi lấy testcases
        const problem = await this.repository.findById(problemId);
        if (!problem) {
            throw new Error('Problem not found');
        }
        // Bước 2: Gọi repository để lấy danh sách testcases công khai
        return this.repository.findPublicTestcases(problemId);
    }
    /**
     * Update an existing problem
     * @description Validates existence and updates problem data with provided fields.
     * @param id - The unique identifier of the problem to update
     * @param dto - Data Transfer Object containing fields to update
     * @returns Promise resolving to the updated problem
     * @throws Error if the problem is not found
     */
    async update(id, dto) {
        // Bước 1: Kiểm tra sự tồn tại của problem trong database
        const problem = await this.repository.findById(id);
        if (!problem) {
            throw new Error('Problem not found');
        }
        // Bước 2: Chuẩn bị object chứa các trường cần update
        // Bước 3: Gọi repository để cập nhật problem trong database
        return this.repository.update(id, {
            title: dto.title,
            description: dto.description,
            difficulty: dto.difficulty,
            timeLimit: dto.timeLimit,
            memoryLimit: dto.memoryLimit
        });
    }
    /**
     * Delete a problem
     * @description Removes a problem from the database after verifying its existence.
     * @param id - The unique identifier of the problem to delete
     * @returns Promise resolving to a success message
     * @throws Error if the problem is not found
     */
    async delete(id) {
        // Bước 1: Kiểm tra sự tồn tại của problem trước khi xóa
        const problem = await this.repository.findById(id);
        if (!problem) {
            throw new Error('Problem not found');
        }
        // Bước 2: Gọi repository để xóa problem khỏi database
        await this.repository.delete(id);
        // Bước 3: Trả về thông báo thành công
        return { message: 'Problem deleted successfully' };
    }
}
export default new ProblemService();
//# sourceMappingURL=problem.service.js.map