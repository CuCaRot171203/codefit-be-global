/**
 * Certificate Repository
 *
 * Xử lý các thao tác database cho Certificate entity.
 * Quản lý việc tạo, đọc và truy vấn chứng chỉ.
 */
import { BaseRepository } from '../../../base/base.repository';
/**
 * Interface định nghĩa cấu trúc Certificate
 * @interface Certificate
 */
interface Certificate {
    /** ID duy nhất của chứng chỉ */
    id: string;
    /** ID của người nhận chứng chỉ */
    userId: string;
    /** ID của khóa học đã hoàn thành */
    courseId: string;
    /** Tiêu đề khóa học */
    courseTitle: string;
    /** Tên người nhận chứng chỉ */
    userName: string;
    /** Thời điểm cấp chứng chỉ */
    issuedAt: Date;
    /** URL xem/chia sẻ chứng chỉ */
    certificateUrl: string | null;
}
/**
 * CertificateRepository - Quản lý database operations cho Certificate
 * @class CertificateRepository
 * @extends BaseRepository<Certificate>
 */
declare class CertificateRepository extends BaseRepository<Certificate> {
    /** Prisma model được sử dụng cho các thao tác database */
    protected model: import(".prisma/client").Prisma.CertificateDelegate<import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    /**
     * Tìm tất cả chứng chỉ của một người dùng
     * @param userId - ID của người dùng
     * @returns Promise<Certificate[]> - Danh sách chứng chỉ của người dùng
     */
    findByUserId(userId: string): Promise<Certificate[]>;
    /**
     * Tìm chứng chỉ theo userId và courseId
     * @param userId - ID của người dùng
     * @param courseId - ID của khóa học
     * @returns Promise<Certificate | null> - Chứng chỉ tìm được hoặc null
     */
    findByUserAndCourse(userId: string, courseId: string): Promise<Certificate | null>;
    /**
     * Tạo mới một chứng chỉ
     * @param data - Thông tin chứng chỉ cần tạo
     * @returns Promise<Certificate> - Chứng chỉ đã được tạo
     */
    generateCertificate(data: {
        /** ID của người nhận chứng chỉ */
        userId: string;
        /** ID của khóa học */
        courseId: string;
        /** Tiêu đề khóa học */
        courseTitle: string;
        /** Tên người nhận */
        userName: string;
    }): Promise<Certificate>;
}
declare const _default: CertificateRepository;
export default _default;
//# sourceMappingURL=certificate.repository.d.ts.map