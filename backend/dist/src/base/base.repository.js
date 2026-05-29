"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
/**
 * Base Repository - Cung cấp các CRUD operations cơ bản
 * Mỗi module sẽ extend class này và định nghĩa model tương ứng
 */
class BaseRepository {
    model;
    /**
     * Tìm một bản ghi theo ID
     * @param id - ID của bản ghi cần tìm
     * @returns Promise<T | null> - Bản ghi hoặc null nếu không tìm thấy
     */
    async findById(id) {
        return this.model.findUnique({ where: { id } });
    }
    /**
     * Tìm nhiều bản ghi với điều kiện lọc
     * @param where - Điều kiện where của Prisma (optional)
     * @returns Promise<T[]> - Mảng các bản ghi
     */
    async findMany(where) {
        return this.model.findMany(where);
    }
    /**
     * Tạo mới một bản ghi
     * @param data - Dữ liệu của bản ghi mới
     * @returns Promise<T> - Bản ghi đã được tạo
     */
    async create(data) {
        return this.model.create({ data });
    }
    /**
     * Cập nhật một bản ghi theo ID
     * @param id - ID của bản ghi cần cập nhật
     * @param data - Dữ liệu cần cập nhật
     * @returns Promise<T> - Bản ghi đã được cập nhật
     */
    async update(id, data) {
        return this.model.update({ where: { id }, data });
    }
    /**
     * Xóa một bản ghi theo ID
     * @param id - ID của bản ghi cần xóa
     * @returns Promise<T> - Bản ghi đã được xóa
     */
    async delete(id) {
        return this.model.delete({ where: { id } });
    }
}
exports.BaseRepository = BaseRepository;
exports.default = BaseRepository;
//# sourceMappingURL=base.repository.js.map