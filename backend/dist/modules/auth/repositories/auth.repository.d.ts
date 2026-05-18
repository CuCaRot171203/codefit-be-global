import { BaseRepository } from '../../../base/base.repository';
import { User } from '../types/auth.types';
/**
 * AuthRepository - Xử lý database operations cho User/Auth
 * Kế thừa BaseRepository và định nghĩa các methods đặc thù cho auth
 */
declare class AuthRepository extends BaseRepository<User> {
    protected model: import(".prisma/client").Prisma.UserDelegate<import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    /**
     * Tìm user theo email
     * @param email - Email cần tìm
     * @returns User hoặc null nếu không tìm thấy
     */
    findByEmail(email: string): Promise<User | null>;
    /**
     * Tạo user mới
     * @param data - Dữ liệu user (email, username, password hash, role)
     * @returns User đã được tạo
     */
    create(data: any): Promise<User>;
}
declare const _default: AuthRepository;
export default _default;
//# sourceMappingURL=auth.repository.d.ts.map