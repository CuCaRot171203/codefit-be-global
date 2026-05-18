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
declare class CourseController extends BaseController<typeof courseService> {
    /**
     * Constructor khởi tạo controller với service tương ứng.
     * Inject courseService vào base controller để sử dụng trong các methods.
     */
    constructor();
    /**
     * Tạo mới một khóa học.
     * Endpoint: POST /courses
     * Yêu cầu: User đã xác thực (token hợp lệ)
     *
     * @param req - Request object chứa body với title, description, price, level
     * @param res - Response object để trả về kết quả
     * @param next - NextFunction để chuyển error sang middleware xử lý lỗi
     */
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy danh sách tất cả khóa học.
     * Endpoint: GET /courses
     * Không yêu cầu xác thực - public endpoint.
     *
     * @param req - Request object (không sử dụng params/body)
     * @param res - Response object để trả về danh sách khóa học
     * @param next - NextFunction để chuyển error sang middleware xử lý lỗi
     */
    getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy thông tin một khóa học theo ID.
     * Endpoint: GET /courses/:id
     * Không yêu cầu xác thực - public endpoint.
     *
     * @param req - Request object chứa params.id là ID của khóa học
     * @param res - Response object để trả về thông tin khóa học
     * @param next - NextFunction để chuyển error sang middleware xử lý lỗi
     */
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy danh sách khóa học của creator đang đăng nhập.
     * Endpoint: GET /courses/my/creator
     * Yêu cầu: User đã xác thực (token hợp lệ)
     *
     * @param req - Request object chứa thông tin user từ token
     * @param res - Response object để trả về danh sách khóa học của creator
     * @param next - NextFunction để chuyển error sang middleware xử lý lỗi
     */
    getByCreator: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Cập nhật thông tin một khóa học.
     * Endpoint: PUT /courses/:id
     * Yêu cầu: User đã xác thực (token hợp lệ)
     *
     * @param req - Request object chứa params.id và body với các trường cần update
     * @param res - Response object để trả về khóa học đã được cập nhật
     * @param next - NextFunction để chuyển error sang middleware xử lý lỗi
     */
    update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Xóa một khóa học.
     * Endpoint: DELETE /courses/:id
     * Yêu cầu: User đã xác thực (token hợp lệ)
     *
     * @param req - Request object chứa params.id của khóa học cần xóa
     * @param res - Response object để trả về kết quả xóa
     * @param next - NextFunction để chuyển error sang middleware xử lý lỗi
     */
    delete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: CourseController;
export default _default;
//# sourceMappingURL=course.controller.d.ts.map