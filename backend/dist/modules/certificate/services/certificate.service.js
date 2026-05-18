/**
 * Certificate Service
 *
 * Chứa business logic cho các thao tác với Certificate.
 * Xử lý việc tạo chứng chỉ khi hoàn thành khóa học và xác minh chứng chỉ.
 */
import { PrismaClient } from '@prisma/client';
import { BaseService } from '../../../base/base.service';
import certificateRepository from '../repositories/certificate.repository';
import emailService from '../../email/email.service';
const prisma = new PrismaClient();
/**
 * CertificateService - Business logic layer cho Certificate
 * @class CertificateService
 * @extends BaseService
 */
class CertificateService extends BaseService {
    constructor() {
        super(certificateRepository);
    }
    /**
     * Lấy tất cả chứng chỉ của một người dùng
     * @param userId - ID của người dùng
     * @returns Promise<Certificate[]> - Danh sách chứng chỉ
     */
    async getUserCertificates(userId) {
        // Bước 1: Gọi repository để tìm chứng chỉ theo userId
        return this.repository.findByUserId(userId);
    }
    /**
     * Lấy chứng chỉ của người dùng cho một khóa học cụ thể
     * @param userId - ID của người dùng
     * @param courseId - ID của khóa học
     * @returns Promise<Certificate | null> - Chứng chỉ tìm được hoặc null
     */
    async getCertificate(userId, courseId) {
        // Bước 1: Gọi repository để tìm chứng chỉ theo userId và courseId
        return this.repository.findByUserAndCourse(userId, courseId);
    }
    /**
     * Sinh chứng chỉ khi hoàn thành khóa học
     * @param userId - ID của người dùng
     * @param courseId - ID của khóa học
     * @returns Promise<Certificate> - Chứng chỉ đã được tạo
     * @throws Error - Nếu chưa đăng ký, chưa hoàn thành, hoặc không tìm thấy course/user
     */
    async generateForCourseCompletion(userId, courseId) {
        // Bước 1: Kiểm tra người dùng đã đăng ký khóa học chưa
        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: { userId, courseId }
            }
        });
        if (!enrollment) {
            throw new Error('Not enrolled in this course');
        }
        // Bước 2: Kiểm tra tiến độ đã đạt 100% chưa
        if (enrollment.progress < 100) {
            throw new Error('Course not completed yet');
        }
        // Bước 3: Lấy thông tin khóa học
        const course = await prisma.course.findUnique({
            where: { id: courseId }
        });
        if (!course) {
            throw new Error('Course not found');
        }
        // Bước 4: Lấy thông tin người dùng
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            throw new Error('User not found');
        }
        // Bước 5: Gọi repository để tạo chứng chỉ
        const certificate = await this.repository.generateCertificate({
            userId,
            courseId,
            courseTitle: course.title,
            userName: user.username
        });
        // Bước 6: Gửi email thông báo chứng chỉ (không blocking)
        if (user.email) {
            emailService.sendCertificateEmail(user.email, user.username, course.title, certificate.certificateUrl || '', certificate.id).catch(err => console.error('Failed to send certificate email:', err));
        }
        return certificate;
    }
    /**
     * Xác minh chứng chỉ theo ID
     * @param certificateId - ID của chứng chỉ
     * @returns Promise<Certificate | null> - Chứng chỉ tìm được hoặc null
     */
    async verifyCertificate(certificateId) {
        // Bước 1: Gọi repository để tìm chứng chỉ theo ID
        return this.repository.findById(certificateId);
    }
}
export default new CertificateService();
//# sourceMappingURL=certificate.service.js.map