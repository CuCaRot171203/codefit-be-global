/**
 * @fileoverview User Controller
 * @description Controller xử lý các HTTP request liên quan đến User profile.
 */
import { BaseController } from '../../../base/base.controller';
import userService from '../services/user.service';
/**
 * @class UserController
 * @extends BaseController
 * @description Controller quản lý các endpoint API liên quan đến hồ sơ người dùng
 */
class UserController extends BaseController {
    constructor() {
        super(userService);
    }
    /**
     * @method getProfile
     * @description Xử lý request lấy thông tin hồ sơ người dùng hiện tại
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @param {NextFunction} next - Express next middleware function
     * @returns {Promise<void>}
     */
    getProfile = async (req, res, next) => {
        try {
            // Bước 1: Lấy userId từ token đã được xác thực
            const userId = req.user?.userId;
            // Bước 2: Kiểm tra userId có tồn tại không
            if (!userId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            // Bước 3: Gọi service để lấy thông tin hồ sơ
            const user = await this.service.getProfile(userId);
            // Bước 4: Kiểm tra người dùng có tồn tại không
            if (!user) {
                this.error(res, 'User not found', 404);
                return;
            }
            // Bước 5: Loại bỏ password khỏi response và trả về thông tin hồ sơ
            const { password, ...profile } = user;
            this.success(res, profile, 'Profile retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * @method updateProfile
     * @description Xử lý request cập nhật thông tin hồ sơ người dùng
     * @param {Request} req - Express request object (chứa body với username, avatar, bio)
     * @param {Response} res - Express response object
     * @param {NextFunction} next - Express next middleware function
     * @returns {Promise<void>}
     */
    updateProfile = async (req, res, next) => {
        try {
            // Bước 1: Lấy userId từ token đã được xác thực
            const userId = req.user?.userId;
            // Bước 2: Kiểm tra userId có tồn tại không
            if (!userId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            // Bước 3: Gọi service để cập nhật thông tin hồ sơ
            const user = await this.service.updateProfile(userId, req.body);
            // Bước 4: Loại bỏ password khỏi response và trả về thông tin đã cập nhật
            const { password, ...profile } = user;
            this.success(res, profile, 'Profile updated successfully');
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * @method changePassword
     * @description Xử lý request thay đổi mật khẩu người dùng
     * @param {Request} req - Express request object (chứa body với currentPassword, newPassword)
     * @param {Response} res - Express response object
     * @param {NextFunction} next - Express next middleware function
     * @returns {Promise<void>}
     */
    changePassword = async (req, res, next) => {
        try {
            // Bước 1: Lấy userId từ token đã được xác thực
            const userId = req.user?.userId;
            // Bước 2: Kiểm tra userId có tồn tại không
            if (!userId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            // Bước 3: Trích xuất mật khẩu cũ và mới từ request body
            const { currentPassword, newPassword } = req.body;
            // Bước 4: Kiểm tra các trường bắt buộc
            if (!currentPassword || !newPassword) {
                this.error(res, 'Current password and new password are required', 400);
                return;
            }
            // Bước 5: Gọi service để thay đổi mật khẩu
            const result = await this.service.changePassword(userId, { currentPassword, newPassword });
            // Bước 6: Trả về kết quả thành công
            this.success(res, result, 'Password changed successfully');
        }
        catch (error) {
            // Bước 7: Xử lý lỗi - xác định status code dựa trên loại lỗi
            const status = error.message.includes('incorrect') ? 400 : 500;
            next(error);
        }
    };
}
export default new UserController();
//# sourceMappingURL=user.controller.js.map