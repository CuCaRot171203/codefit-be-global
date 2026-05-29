"use strict";
/**
 * Certificate Repository
 *
 * Xử lý các thao tác database cho Certificate entity.
 * Quản lý việc tạo, đọc và truy vấn chứng chỉ.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const base_repository_1 = require("../../../base/base.repository");
const prisma = new client_1.PrismaClient();
/**
 * CertificateRepository - Quản lý database operations cho Certificate
 * @class CertificateRepository
 * @extends BaseRepository<Certificate>
 */
class CertificateRepository extends base_repository_1.BaseRepository {
    /** Prisma model được sử dụng cho các thao tác database */
    model = prisma.certificate;
    /**
     * Tìm tất cả chứng chỉ của một người dùng
     * @param userId - ID của người dùng
     * @returns Promise<Certificate[]> - Danh sách chứng chỉ của người dùng
     */
    async findByUserId(userId) {
        // Bước 1: Truy vấn database với điều kiện userId
        // Bước 2: Sắp xếp theo thời gian cấp giảm dần (mới nhất trước)
        return this.model.findMany({
            where: { userId },
            orderBy: { issuedAt: 'desc' }
        });
    }
    /**
     * Tìm chứng chỉ theo userId và courseId
     * @param userId - ID của người dùng
     * @param courseId - ID của khóa học
     * @returns Promise<Certificate | null> - Chứng chỉ tìm được hoặc null
     */
    async findByUserAndCourse(userId, courseId) {
        // Bước 1: Tìm chứng chỉ với điều kiện userId và courseId
        return this.model.findFirst({
            where: { userId, courseId }
        });
    }
    /**
     * Tạo mới một chứng chỉ
     * @param data - Thông tin chứng chỉ cần tạo
     * @returns Promise<Certificate> - Chứng chỉ đã được tạo
     */
    async generateCertificate(data) {
        // Bước 1: Kiểm tra xem chứng chỉ đã tồn tại chưa
        const existing = await this.findByUserAndCourse(data.userId, data.courseId);
        if (existing) {
            // Bước 2: Nếu đã có, trả về chứng chỉ cũ (không tạo trùng)
            return existing;
        }
        // Bước 3: Tạo URL chứng chỉ duy nhất
        const certificateUrl = `https://codefit.com/certificates/${crypto.randomUUID()}`;
        // Bước 4: Tạo chứng chỉ mới trong database
        return this.model.create({
            data: {
                userId: data.userId,
                courseId: data.courseId,
                courseTitle: data.courseTitle,
                userName: data.userName,
                issuedAt: new Date(),
                certificateUrl
            }
        });
    }
}
exports.default = new CertificateRepository();
//# sourceMappingURL=certificate.repository.js.map