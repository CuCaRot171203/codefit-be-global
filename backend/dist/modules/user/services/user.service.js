/**
 * @fileoverview User Service
 * @description Service xử lý business logic liên quan đến User.
 */
import bcrypt from 'bcrypt';
import { BaseService } from '../../../base/base.service';
import userRepository from '../repositories/user.repository';
/**
 * @class UserService
 * @extends BaseService
 * @description Service quản lý các nghiệp vụ liên quan đến hồ sơ người dùng
 */
class UserService extends BaseService {
    constructor() {
        super(userRepository);
    }
    /**
     * @method getProfile
     * @description Lấy thông tin hồ sơ người dùng theo ID
     * @param {string} userId - ID của người dùng
     * @returns {Promise<UserProfile | null>} Thông tin hồ sơ hoặc null nếu không tìm thấy
     */
    async getProfile(userId) {
        return this.repository.findById(userId);
    }
    /**
     * @method updateProfile
     * @description Cập nhật thông tin hồ sơ người dùng
     * @param {string} userId - ID của người dùng
     * @param {UpdateProfileDto} dto - Dữ liệu cập nhật profile
     * @returns {Promise<UserProfile>} Thông tin hồ sơ sau khi cập nhật
     * @throws {Error} Khi không tìm thấy người dùng
     */
    async updateProfile(userId, dto) {
        // Bước 1: Tìm kiếm người dùng theo ID
        const user = await this.repository.findById(userId);
        // Bước 2: Kiểm tra người dùng có tồn tại không
        if (!user) {
            throw new Error('User not found');
        }
        // Bước 3: Cập nhật thông tin hồ sơ (username, avatar, bio, fullName, school, learningLevel)
        const updatedUser = await this.repository.updateProfile(userId, {
            username: dto.username,
            avatar: dto.avatar,
            bio: dto.bio,
            fullName: dto.fullName,
            school: dto.school,
            learningLevel: dto.learningLevel,
            referralCode: dto.referralCode
        });
        // Bước 4: Nếu có đủ thông tin onboarding, đánh dấu đã hoàn thành
        if (dto.fullName && dto.school && dto.learningLevel) {
            await this.repository.markAsOnboarded(userId);
        }
        return updatedUser;
    }
    /**
     * @method changePassword
     * @description Thay đổi mật khẩu người dùng
     * @param {string} userId - ID của người dùng
     * @param {ChangePasswordDto} dto - Dữ liệu chứa mật khẩu cũ và mới
     * @returns {Promise<{message: string}>} Thông báo thành công
     * @throws {Error} Khi không tìm thấy người dùng hoặc mật khẩu cũ không đúng
     */
    async changePassword(userId, dto) {
        // Bước 1: Tìm kiếm người dùng theo ID
        const user = await this.repository.findById(userId);
        // Bước 2: Kiểm tra người dùng có tồn tại không
        if (!user) {
            throw new Error('User not found');
        }
        // Bước 3: Xác thực mật khẩu cũ
        const isValid = await bcrypt.compare(dto.currentPassword, user.password);
        if (!isValid) {
            throw new Error('Current password is incorrect');
        }
        // Bước 4: Kiểm tra độ dài mật khẩu mới (tối thiểu 6 ký tự)
        if (dto.newPassword.length < 6) {
            throw new Error('New password must be at least 6 characters');
        }
        // Bước 5: Hash mật khẩu mới
        const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
        // Bước 6: Cập nhật mật khẩu mới vào database
        await this.repository.updatePassword(userId, hashedPassword);
        return { message: 'Password changed successfully' };
    }
}
export default new UserService();
//# sourceMappingURL=user.service.js.map