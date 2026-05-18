/**
 * @fileoverview User Service
 * @description Service xử lý business logic liên quan đến User.
 */
import { BaseService } from '../../../base/base.service';
import userRepository from '../repositories/user.repository';
import { UpdateProfileDto, ChangePasswordDto, UserProfile } from '../types';
/**
 * @class UserService
 * @extends BaseService
 * @description Service quản lý các nghiệp vụ liên quan đến hồ sơ người dùng
 */
declare class UserService extends BaseService<typeof userRepository> {
    constructor();
    /**
     * @method getProfile
     * @description Lấy thông tin hồ sơ người dùng theo ID
     * @param {string} userId - ID của người dùng
     * @returns {Promise<UserProfile | null>} Thông tin hồ sơ hoặc null nếu không tìm thấy
     */
    getProfile(userId: string): Promise<UserProfile | null>;
    /**
     * @method updateProfile
     * @description Cập nhật thông tin hồ sơ người dùng
     * @param {string} userId - ID của người dùng
     * @param {UpdateProfileDto} dto - Dữ liệu cập nhật profile
     * @returns {Promise<UserProfile>} Thông tin hồ sơ sau khi cập nhật
     * @throws {Error} Khi không tìm thấy người dùng
     */
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserProfile>;
    /**
     * @method changePassword
     * @description Thay đổi mật khẩu người dùng
     * @param {string} userId - ID của người dùng
     * @param {ChangePasswordDto} dto - Dữ liệu chứa mật khẩu cũ và mới
     * @returns {Promise<{message: string}>} Thông báo thành công
     * @throws {Error} Khi không tìm thấy người dùng hoặc mật khẩu cũ không đúng
     */
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
declare const _default: UserService;
export default _default;
//# sourceMappingURL=user.service.d.ts.map