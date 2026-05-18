import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../../../base/base.repository';
/**
 * Prisma Client Instance
 * Dùng để truy cập User model
 */
const prisma = new PrismaClient();
/**
 * AuthRepository - Xử lý database operations cho User/Auth
 * Kế thừa BaseRepository và định nghĩa các methods đặc thù cho auth
 */
class AuthRepository extends BaseRepository {
    model = prisma.user;
    /**
     * Tìm user theo email
     * @param email - Email cần tìm
     * @returns User hoặc null nếu không tìm thấy
     */
    async findByEmail(email) {
        return this.model.findUnique({ where: { email } });
    }
    /**
     * Tạo user mới
     * @param data - Dữ liệu user (email, username, password hash, role)
     * @returns User đã được tạo
     */
    async create(data) {
        return this.model.create({ data });
    }
}
export default new AuthRepository();
//# sourceMappingURL=auth.repository.js.map