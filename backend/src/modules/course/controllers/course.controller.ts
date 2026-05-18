/**
 * @file Controller layer cho module Course.
 * Xử lý các HTTP requests liên quan đến Course và responses.
 * Đóng vai trò interface giữa client và service layer.
 * @module course/controller
 */

import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../base/base.controller';
import courseService from '../services/course.service';

/**
 * Controller class mở rộng BaseController để xử lý HTTP requests cho Course.
 * Cung cấp các endpoints CRUD: tạo, đọc, cập nhật, xóa khóa học.
 */
class CourseController extends BaseController<typeof courseService> {

  /**
   * Constructor khởi tạo controller với service tương ứng.
   * Inject courseService vào base controller để sử dụng trong các methods.
   */
  constructor() {
    super(courseService);
  }

  /**
   * Tạo mới một khóa học.
   * Endpoint: POST /courses
   * Yêu cầu: User đã xác thực (token hợp lệ)
   * 
   * @param req - Request object chứa body với title, description, price, level
   * @param res - Response object để trả về kết quả
   * @param next - NextFunction để chuyển error sang middleware xử lý lỗi
   */
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Bước 1: Trích xuất creatorId từ user đã được xác thực (được gắn bởi auth middleware)
      const creatorId = req.user?.userId;
      
      // Bước 2: Kiểm tra user đã đăng nhập chưa
      if (!creatorId) {
        // Bước 3: Trả về lỗi 401 Unauthorized nếu không có token
        this.error(res, 'Unauthorized', 401);
        return;
      }

      // Bước 4: Gọi service để tạo khóa học với creatorId và dữ liệu từ body
      const course = await this.service.create(creatorId, req.body);
      
      // Bước 5: Trả về response thành công với status 201
      this.success(res, course, 'Course created successfully', 201);
    } catch (error: any) {
      // Bước 6: Chuyển error sang middleware xử lý lỗi nếu có exception
      next(error);
    }
  };

  /**
   * Lấy danh sách tất cả khóa học.
   * Endpoint: GET /courses
   * Không yêu cầu xác thực - public endpoint.
   * 
   * @param req - Request object (không sử dụng params/body)
   * @param res - Response object để trả về danh sách khóa học
   * @param next - NextFunction để chuyển error sang middleware xử lý lỗi
   */
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Bước 1: Gọi service để lấy danh sách tất cả khóa học
      const courses = await this.service.getAll();
      
      // Bước 2: Trả về response thành công với danh sách courses
      this.success(res, courses, 'Courses retrieved successfully');
    } catch (error: any) {
      // Bước 3: Chuyển error sang middleware xử lý lỗi nếu có exception
      next(error);
    }
  };

  /**
   * Lấy thông tin một khóa học theo ID.
   * Endpoint: GET /courses/:id
   * Không yêu cầu xác thực - public endpoint.
   * 
   * @param req - Request object chứa params.id là ID của khóa học
   * @param res - Response object để trả về thông tin khóa học
   * @param next - NextFunction để chuyển error sang middleware xử lý lỗi
   */
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Bước 1: Trích xuất id từ URL params
      const { id } = req.params;
      
      // Bước 2: Gọi service để lấy thông tin khóa học theo id
      const course = await this.service.getById(id);

      // Bước 3: Kiểm tra nếu không tìm thấy khóa học
      if (!course) {
        // Bước 4: Trả về lỗi 404 Not Found
        this.error(res, 'Course not found', 404);
        return;
      }

      // Bước 5: Trả về response thành công với thông tin khóa học
      this.success(res, course, 'Course retrieved successfully');
    } catch (error: any) {
      // Bước 6: Chuyển error sang middleware xử lý lỗi nếu có exception
      next(error);
    }
  };

  /**
   * Lấy danh sách khóa học của creator đang đăng nhập.
   * Endpoint: GET /courses/my/creator
   * Yêu cầu: User đã xác thực (token hợp lệ)
   * 
   * @param req - Request object chứa thông tin user từ token
   * @param res - Response object để trả về danh sách khóa học của creator
   * @param next - NextFunction để chuyển error sang middleware xử lý lỗi
   */
  getByCreator = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Bước 1: Trích xuất creatorId từ user đã được xác thực
      const creatorId = req.user?.userId;
      
      // Bước 2: Kiểm tra user đã đăng nhập chưa
      if (!creatorId) {
        // Bước 3: Trả về lỗi 401 Unauthorized nếu không có token
        this.error(res, 'Unauthorized', 401);
        return;
      }

      // Bước 4: Gọi service để lấy danh sách khóa học của creator
      const courses = await this.service.getByCreatorId(creatorId);
      
      // Bước 5: Trả về response thành công với danh sách courses
      this.success(res, courses, 'Courses retrieved successfully');
    } catch (error: any) {
      // Bước 6: Chuyển error sang middleware xử lý lỗi nếu có exception
      next(error);
    }
  };

  /**
   * Cập nhật thông tin một khóa học.
   * Endpoint: PUT /courses/:id
   * Yêu cầu: User đã xác thực (token hợp lệ)
   * 
   * @param req - Request object chứa params.id và body với các trường cần update
   * @param res - Response object để trả về khóa học đã được cập nhật
   * @param next - NextFunction để chuyển error sang middleware xử lý lỗi
   */
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Bước 1: Trích xuất id từ URL params
      const { id } = req.params;
      
      // Bước 2: Gọi service để cập nhật khóa học với dữ liệu từ body
      const course = await this.service.update(id, req.body);
      
      // Bước 3: Trả về response thành công với khóa học đã được cập nhật
      this.success(res, course, 'Course updated successfully');
    } catch (error: any) {
      // Bước 4: Xác định status code dựa trên loại lỗi (404 cho not found, 500 cho lỗi khác)
      const status = error.message.includes('not found') ? 404 : 500;
      // Bước 5: Chuyển error sang middleware xử lý lỗi
      next(error);
    }
  };

  /**
   * Xóa một khóa học.
   * Endpoint: DELETE /courses/:id
   * Yêu cầu: User đã xác thực (token hợp lệ)
   * 
   * @param req - Request object chứa params.id của khóa học cần xóa
   * @param res - Response object để trả về kết quả xóa
   * @param next - NextFunction để chuyển error sang middleware xử lý lỗi
   */
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Bước 1: Trích xuất id từ URL params
      const { id } = req.params;
      
      // Bước 2: Gọi service để xóa khóa học
      const result = await this.service.delete(id);
      
      // Bước 3: Trả về response thành công với thông báo
      this.success(res, result, 'Course deleted successfully');
    } catch (error: any) {
      // Bước 4: Xác định status code dựa trên loại lỗi
      const status = error.message.includes('not found') ? 404 : 500;
      // Bước 5: Chuyển error sang middleware xử lý lỗi
      next(error);
    }
  };
}

export default new CourseController();
