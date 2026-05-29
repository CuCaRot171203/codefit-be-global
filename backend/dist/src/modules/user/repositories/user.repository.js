"use strict";
/**
 * @fileoverview User Repository
 * @description Repository xử lý các thao tác database liên quan đến User.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const base_repository_1 = require("../../../base/base.repository");
const prisma = new client_1.PrismaClient();
/**
 * @class UserRepository
 * @extends BaseRepository
 * @description Repository quản lý các thao tác CRUD với bảng User trong database
 */
class UserRepository extends base_repository_1.BaseRepository {
    model = prisma.user;
    /**
     * @method findByEmail
     * @description Tìm kiếm người dùng theo email
     * @param {string} email - Email của người dùng cần tìm
     * @returns {Promise<UserProfile | null>} Thông tin người dùng hoặc null nếu không tìm thấy
     */
    async findByEmail(email) {
        return this.model.findUnique({
            where: { email },
            include: { role: true },
        });
    }
    async findById(id) {
        return this.model.findUnique({
            where: { id },
            include: { role: true },
        });
    }
    async findByIdWithPassword(id) {
        return this.model.findUnique({
            where: { id },
            include: { role: true },
        });
    }
    async updateProfile(id, data) {
        return this.model.update({
            where: { id },
            data,
            include: { role: true },
        });
    }
    async updatePassword(id, hashedPassword) {
        return this.model.update({
            where: { id },
            data: { password: hashedPassword },
            include: { role: true },
        });
    }
    async markAsOnboarded(id) {
        return this.model.update({
            where: { id },
            data: { isOnboarded: true },
            include: { role: true },
        });
    }
}
exports.default = new UserRepository();
//# sourceMappingURL=user.repository.js.map