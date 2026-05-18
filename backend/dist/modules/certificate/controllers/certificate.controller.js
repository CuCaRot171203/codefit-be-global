/**
 * Certificate Controller
 *
 * Xử lý các HTTP requests liên quan đến Certificate.
 * Quản lý việc lấy, tạo và xác minh chứng chỉ.
 */
import { BaseController } from '../../../base/base.controller';
import certificateService from '../services/certificate.service';
/**
 * CertificateController - HTTP layer cho Certificate operations
 * @class CertificateController
 * @extends BaseController
 */
class CertificateController extends BaseController {
    constructor() {
        super(certificateService);
    }
    /**
     * Lấy tất cả chứng chỉ của người dùng hiện tại
     * GET /api/certificates/my
     * @param req - Request chứa user từ token
     * @param res - Response trả về danh sách chứng chỉ
     * @param next - Next function để xử lý lỗi
     */
    getMyCertificates = async (req, res, next) => {
        try {
            // Bước 1: Lấy userId từ token đã được verify
            const userId = req.user?.userId;
            if (!userId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            // Bước 2: Gọi service để lấy danh sách chứng chỉ
            const certificates = await this.service.getUserCertificates(userId);
            // Bước 3: Trả về response với danh sách chứng chỉ
            this.success(res, certificates, 'Certificates retrieved successfully');
        }
        catch (error) {
            // Bước 4: Chuyển lỗi đến middleware xử lý lỗi
            next(error);
        }
    };
    /**
     * Lấy chứng chỉ cho một khóa học cụ thể
     * GET /api/certificates/course/:courseId
     * @param req - Request chứa params.courseId và user từ token
     * @param res - Response trả về chứng chỉ
     * @param next - Next function để xử lý lỗi
     */
    getCertificate = async (req, res, next) => {
        try {
            // Bước 1: Lấy userId từ token đã được verify
            const userId = req.user?.userId;
            if (!userId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            // Bước 2: Lấy courseId từ URL params
            const { courseId } = req.params;
            // Bước 3: Gọi service để lấy chứng chỉ
            const certificate = await this.service.getCertificate(userId, courseId);
            // Bước 4: Kiểm tra chứng chỉ có tồn tại không
            if (!certificate) {
                this.error(res, 'Certificate not found', 404);
                return;
            }
            // Bước 5: Trả về response với chứng chỉ tìm được
            this.success(res, certificate, 'Certificate retrieved successfully');
        }
        catch (error) {
            // Bước 6: Chuyển lỗi đến middleware xử lý lỗi
            next(error);
        }
    };
    /**
     * Sinh chứng chỉ khi hoàn thành khóa học
     * POST /api/certificates/generate
     * @param req - Request chứa body với courseId và user từ token
     * @param res - Response trả về chứng chỉ đã tạo
     * @param next - Next function để xử lý lỗi
     */
    generate = async (req, res, next) => {
        try {
            // Bước 1: Lấy userId từ token đã được verify
            const userId = req.user?.userId;
            if (!userId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            // Bước 2: Lấy courseId từ request body
            const { courseId } = req.body;
            // Bước 3: Gọi service để sinh chứng chỉ
            const certificate = await this.service.generateForCourseCompletion(userId, courseId);
            // Bước 4: Trả về response với chứng chỉ đã tạo
            this.success(res, certificate, 'Certificate generated successfully', 201);
        }
        catch (error) {
            // Bước 5: Xác định status code dựa trên loại lỗi
            const status = error.message.includes('Not') ? 404 : 400;
            this.error(res, error.message, status);
        }
    };
    /**
     * Xác minh chứng chỉ (công khai - không cần auth)
     * GET /api/certificates/verify/:certificateId
     * @param req - Request chứa params.certificateId
     * @param res - Response trả về thông tin chứng chỉ
     * @param next - Next function để xử lý lỗi
     */
    verify = async (req, res, next) => {
        try {
            // Bước 1: Lấy certificateId từ URL params
            const { certificateId } = req.params;
            // Bước 2: Gọi service để xác minh chứng chỉ
            const certificate = await this.service.verifyCertificate(certificateId);
            // Bước 3: Kiểm tra chứng chỉ có tồn tại không
            if (!certificate) {
                this.error(res, 'Certificate not found', 404);
                return;
            }
            // Bước 4: Trả về response với thông tin chứng chỉ
            this.success(res, certificate, 'Certificate verified successfully');
        }
        catch (error) {
            // Bước 5: Chuyển lỗi đến middleware xử lý lỗi
            next(error);
        }
    };
}
export default new CertificateController();
//# sourceMappingURL=certificate.controller.js.map