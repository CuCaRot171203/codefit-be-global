"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const base_repository_1 = require("../../../base/base.repository");
/**
 * Prisma Client Instance
 * Dùng để truy cập User model
 */
const prisma = new client_1.PrismaClient();
/**
 * AuthRepository - Xử lý database operations cho User/Auth
 * Kế thừa BaseRepository và định nghĩa các methods đặc thù cho auth
 */
class AuthRepository extends base_repository_1.BaseRepository {
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
exports.default = new AuthRepository();
//# sourceMappingURL=auth.repository.js.map