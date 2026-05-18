/**
 * Certificate Controller
 *
 * Xử lý các HTTP requests liên quan đến Certificate.
 * Quản lý việc lấy, tạo và xác minh chứng chỉ.
 */
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../base/base.controller';
/**
 * CertificateController - HTTP layer cho Certificate operations
 * @class CertificateController
 * @extends BaseController
 */
declare class CertificateController extends BaseController {
    constructor();
    /**
     * Lấy tất cả chứng chỉ của người dùng hiện tại
     * GET /api/certificates/my
     * @param req - Request chứa user từ token
     * @param res - Response trả về danh sách chứng chỉ
     * @param next - Next function để xử lý lỗi
     */
    getMyCertificates: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy chứng chỉ cho một khóa học cụ thể
     * GET /api/certificates/course/:courseId
     * @param req - Request chứa params.courseId và user từ token
     * @param res - Response trả về chứng chỉ
     * @param next - Next function để xử lý lỗi
     */
    getCertificate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Sinh chứng chỉ khi hoàn thành khóa học
     * POST /api/certificates/generate
     * @param req - Request chứa body với courseId và user từ token
     * @param res - Response trả về chứng chỉ đã tạo
     * @param next - Next function để xử lý lỗi
     */
    generate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Xác minh chứng chỉ (công khai - không cần auth)
     * GET /api/certificates/verify/:certificateId
     * @param req - Request chứa params.certificateId
     * @param res - Response trả về thông tin chứng chỉ
     * @param next - Next function để xử lý lỗi
     */
    verify: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: CertificateController;
export default _default;
//# sourceMappingURL=certificate.controller.d.ts.map