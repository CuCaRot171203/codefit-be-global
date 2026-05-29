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
    findByEmail(email: string): Promise<any>;
    findById(id: string): Promise<any>;
    findByIdWithPassword(id: string): Promise<any>;
    updateProfile(id: string, data: any): Promise<any>;
    updatePassword(id: string, hashedPassword: string): Promise<any>;
    markAsOnboarded(id: string): Promise<any>;
}
declare const _default: UserRepository;
export default _default;
//# sourceMappingURL=user.repository.d.ts.map