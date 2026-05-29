/**
 * Base Repository - Cung cấp các CRUD operations cơ bản
 * Mỗi module sẽ extend class này và định nghĩa model tương ứng
 */
export declare class BaseRepository<T> {
    protected model: any;
    /**
     * Tìm một bản ghi theo ID
     * @param id - ID của bản ghi cần tìm
     * @returns Promise<T | null> - Bản ghi hoặc null nếu không tìm thấy
     */
    findById(id: string): Promise<T | null>;
    /**
     * Tìm nhiều bản ghi với điều kiện lọc
     * @param where - Điều kiện where của Prisma (optional)
     * @returns Promise<T[]> - Mảng các bản ghi
     */
    findMany(where?: any): Promise<T[]>;
    /**
     * Tạo mới một bản ghi
     * @param data - Dữ liệu của bản ghi mới
     * @returns Promise<T> - Bản ghi đã được tạo
     */
    create(data: any): Promise<T>;
    /**
     * Cập nhật một bản ghi theo ID
     * @param id - ID của bản ghi cần cập nhật
     * @param data - Dữ liệu cần cập nhật
     * @returns Promise<T> - Bản ghi đã được cập nhật
     */
    update(id: string, data: any): Promise<T>;
    /**
     * Xóa một bản ghi theo ID
     * @param id - ID của bản ghi cần xóa
     * @returns Promise<T> - Bản ghi đã được xóa
     */
    delete(id: string): Promise<T>;
}
export default BaseRepository;
//# sourceMappingURL=base.repository.d.ts.map