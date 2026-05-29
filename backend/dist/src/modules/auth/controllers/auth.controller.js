"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_controller_1 = require("../../../base/base.controller");
const auth_service_1 = __importDefault(require("../services/auth.service"));
/**
 * AuthController - Xử lý các HTTP requests liên quan đến authentication
 * Kế thừa BaseController để sử dụng các helper methods
 */
class AuthController extends base_controller_1.BaseController {
    constructor() {
        super(auth_service_1.default);
    }
    /**
     * Đăng ký tài khoản mới
     * POST /api/auth/register
     */
    register = async (req, res, next) => {
        try {
            // Bước 1: Gọi service để xử lý đăng ký
            const data = await this.service.register(req.body);
            // Bước 2: Trả về response thành công
            this.success(res, data, 'User registered successfully', 201);
        }
        catch (error) {
            this.error(res, error.message, 400);
        }
    };
    /**
     * Đăng nhập
     * POST /api/auth/login
     */
    login = async (req, res, next) => {
        try {
            // Bước 1: Gọi service để xử lý đăng nhập
            const data = await this.service.login(req.body);
            console.log('Login service response:', JSON.stringify(data));
            // Bước 2: Trả về response thành công
            this.success(res, data, 'Login successful', 200);
        }
        catch (error) {
            // Xử lý lỗi - Invalid credentials trả về 401
            const status = error.message === 'Invalid credentials' ? 401 : 400;
            this.error(res, error.message, status);
        }
    };
    /**
     * Lấy thông tin user hiện tại
     * GET /api/auth/me
     * Cần token hợp lệ trong Authorization header
     */
    getMe = async (req, res, next) => {
        try {
            // Bước 1: Lấy userId từ token đã được decode
            const userId = req.user?.userId;
            // Bước 2: Kiểm tra userId có tồn tại không
            if (!userId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            // Bước 3: Lấy thông tin user từ database
            const user = await this.service.getUserById(userId);
            // Bước 4: Kiểm tra user có tồn tại không
            if (!user) {
                this.error(res, 'User not found', 404);
                return;
            }
            // Bước 5: Trả về thông tin user (không trả về password)
            this.success(res, {
                id: user.id,
                email: user.email,
                username: user.username,
                fullName: user.fullName,
                avatar: user.avatar,
                bio: user.bio,
                phone: user.phone,
                school: user.school,
                roleId: user.roleId,
                roleName: user.role?.name,
                roleDescription: user.role?.description,
                isOnboarded: user.isOnboarded,
                createdAt: user.createdAt,
            }, 'User profile', 200);
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = new AuthController();
//# sourceMappingURL=auth.controller.js.map