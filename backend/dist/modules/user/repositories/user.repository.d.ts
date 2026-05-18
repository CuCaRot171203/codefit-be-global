/**
 * @fileoverview User Repository
 * @description Repository xử lý các thao tác database liên quan đến User.
 */
import { BaseRepository } from '../../../base/base.repository';
import { UserProfile } from '../types';
/**
 * @class UserRepository
 * @extends BaseRepository
 * @description Repository quản lý các thao tác CRUD với bảng User trong database
 */
declare class UserRepository extends BaseRepository<UserProfile> {
    protected model: import(".prisma/client").Prisma.UserDelegate<import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    /**
     * @method findByEmail
     * @description Tìm kiếm người dùng theo email
     * @param {string} email - Email của người dùng cần tìm
     * @returns {Promise<UserProfile | null>} Thông tin người dùng hoặc null nếu không tìm thấy
     */
    findByEmail(email: string): Promise<UserProfile | null>;
    /**
     * @method updateProfile
     * @description Cập nhật thông tin hồ sơ người dùng
     * @param {string} id - ID của người dùng cần cập nhật
     * @param {any} data - Dữ liệu cập nhật (username, avatar, bio)
     * @returns {Promise<UserProfile>} Thông tin người dùng sau khi cập nhật
     */
    updateProfile(id: string, data: any): Promise<UserProfile>;
    /**
     * @method updatePassword
     * @description Cập nhật mật khẩu người dùng
     * @param {string} id - ID của người dùng cần đổi mật khẩu
     * @param {string} hashedPassword - Mật khẩu đã được hash
     * @returns {Promise<UserProfile>} Thông tin người dùng sau khi cập nhật mật khẩu
     */
    updatePassword(id: string, hashedPassword: string): Promise<UserProfile>;
    /**
     * @method markAsOnboarded
     * @description Đánh dấu người dùng đã hoàn thành onboarding
     * @param {string} id - ID của người dùng
     * @returns {Promise<UserProfile>} Thông tin người dùng sau khi cập nhật
     */
    markAsOnboarded(id: string): Promise<UserProfile>;
}
declare const _default: UserRepository;
export default _default;
//# sourceMappingURL=user.repository.d.ts.map