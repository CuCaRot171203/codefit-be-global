/**
 * Certificate Service
 *
 * Chứa business logic cho các thao tác với Certificate.
 * Xử lý việc tạo chứng chỉ khi hoàn thành khóa học và xác minh chứng chỉ.
 */
import { BaseService } from '../../../base/base.service';
import certificateRepository from '../repositories/certificate.repository';
/**
 * CertificateService - Business logic layer cho Certificate
 * @class CertificateService
 * @extends BaseService
 */
declare class CertificateService extends BaseService<typeof certificateRepository> {
    constructor();
    /**
     * Lấy tất cả chứng chỉ của một người dùng
     * @param userId - ID của người dùng
     * @returns Promise<Certificate[]> - Danh sách chứng chỉ
     */
    getUserCertificates(userId: string): Promise<any[]>;
    /**
     * Lấy chứng chỉ của người dùng cho một khóa học cụ thể
     * @param userId - ID của người dùng
     * @param courseId - ID của khóa học
     * @returns Promise<Certificate | null> - Chứng chỉ tìm được hoặc null
     */
    getCertificate(userId: string, courseId: string): Promise<any | null>;
    /**
     * Sinh chứng chỉ khi hoàn thành khóa học
     * @param userId - ID của người dùng
     * @param courseId - ID của khóa học
     * @returns Promise<Certificate> - Chứng chỉ đã được tạo
     * @throws Error - Nếu chưa đăng ký, chưa hoàn thành, hoặc không tìm thấy course/user
     */
    generateForCourseCompletion(userId: string, courseId: string): Promise<any>;
    /**
     * Sinh chứng chỉ khi nộp project - không yêu cầu enrollment hay progress
     * @param userId - ID của người dùng
     * @param courseId - ID của khóa học
     * @returns Promise<Certificate> - Chứng chỉ đã được tạo
     * @throws Error - Nếu không tìm thấy course/user
     */
    generateForProjectSubmission(userId: string, courseId: string): Promise<any>;
    /**
     * Xác minh chứng chỉ theo ID
     * @param certificateId - ID của chứng chỉ
     * @returns Promise<Certificate | null> - Chứng chỉ tìm được hoặc null
     */
    verifyCertificate(certificateId: string): Promise<any | null>;
}
declare const _default: CertificateService;
export default _default;
//# sourceMappingURL=certificate.service.d.ts.map