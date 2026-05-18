/**
 * Problem Controller
 * @description Handles HTTP request/response handling for Problem-related endpoints.
 */

import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../base/base.controller';
import problemService from '../services/problem.service';

/**
 * ProblemController class
 * @extends BaseController
 * @description Handles incoming HTTP requests and delegates to the ProblemService for business logic.
 */
class ProblemController extends BaseController {
  /**
   * Constructor
   * @description Initializes the controller with the problem service.
   */
  constructor() {
    super(problemService);
  }

  /**
   * Get all problems
   * @description Handles GET request to retrieve all problems.
   * @param req - Express request object
   * @param res - Express response object for sending response
   * @param next - Express next function for error handling
   */
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const problems = await this.service.getAll();
      this.success(res, problems, 'Problems retrieved successfully');
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Create a new problem
   * @description Handles POST request to create a new programming problem.
   * @param req - Express request object containing problem data in body
   * @param res - Express response object for sending response
   * @param next - Express next function for error handling
   */
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Bước 1: Nhận dữ liệu từ request body
      // Bước 2: Gọi service để tạo problem mới
      const problem = await this.service.create(req.body);

      // Bước 3: Gửi response thành công với status 201
      this.success(res, problem, 'Problem created successfully', 201);
    } catch (error: any) {
      // Bước 4: Chuyển error sang middleware xử lý lỗi
      next(error);
    }
  };

  /**
   * Get a problem by ID
   * @description Handles GET request to retrieve a specific problem by its ID.
   * @param req - Express request object containing problem ID in params
   * @param res - Express response object for sending response
   * @param next - Express next function for error handling
   */
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Bước 1: Lấy ID từ request params
      const { id } = req.params;

      // Bước 2: Gọi service để lấy problem theo ID
      const problem = await this.service.getById(id);

      // Bước 3: Kiểm tra problem có tồn tại không
      if (!problem) {
        this.error(res, 'Problem not found', 404);
        return;
      }

      // Bước 4: Gửi response thành công
      this.success(res, problem, 'Problem retrieved successfully');
    } catch (error: any) {
      // Bước 5: Chuyển error sang middleware xử lý lỗi
      next(error);
    }
  };

  /**
   * Get all public test cases for a problem
   * @description Handles GET request to retrieve only public test cases of a problem.
   * @param req - Express request object containing problemId in params
   * @param res - Express response object for sending response
   * @param next - Express next function for error handling
   */
  getPublicTestcases = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Bước 1: Lấy problemId từ request params
      const { problemId } = req.params;

      // Bước 2: Gọi service để lấy danh sách testcases công khai
      const testcases = await this.service.getPublicTestcases(problemId);

      // Bước 3: Gửi response thành công
      this.success(res, testcases, 'Public testcases retrieved successfully');
    } catch (error: any) {
      // Bước 4: Xử lý lỗi với status code phù hợp
      const status = error.message.includes('not found') ? 404 : 500;
      this.error(res, error.message, status);
    }
  };

  /**
   * Update an existing problem
   * @description Handles PUT request to update problem details.
   * @param req - Express request object containing ID in params and update data in body
   * @param res - Express response object for sending response
   * @param next - Express next function for error handling
   */
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Bước 1: Lấy ID từ request params
      const { id } = req.params;

      // Bước 2: Gọi service để cập nhật problem
      const problem = await this.service.update(id, req.body);

      // Bước 3: Gửi response thành công
      this.success(res, problem, 'Problem updated successfully');
    } catch (error: any) {
      // Bước 4: Chuyển error sang middleware xử lý lỗi
      next(error);
    }
  };

  /**
   * Delete a problem
   * @description Handles DELETE request to remove a problem from the system.
   * @param req - Express request object containing ID in params
   * @param res - Express response object for sending response
   * @param next - Express next function for error handling
   */
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Bước 1: Lấy ID từ request params
      const { id } = req.params;

      // Bước 2: Gọi service để xóa problem
      const result = await this.service.delete(id);

      // Bước 3: Gửi response thành công
      this.success(res, result, 'Problem deleted successfully');
    } catch (error: any) {
      // Bước 4: Xử lý lỗi với status code phù hợp
      const status = error.message.includes('not found') ? 404 : 500;
      next(error);
    }
  };
}

export default new ProblemController();
