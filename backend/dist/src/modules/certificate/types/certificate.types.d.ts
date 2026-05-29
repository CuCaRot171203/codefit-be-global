/**
 * Certificate Type Definitions
 *
 * Định nghĩa các interface và type cho Certificate entity và các DTOs liên quan.
 */
/**
 * Entity Certificate - Đại diện cho một chứng chỉ hoàn thành khóa học
 * @interface Certificate
 */
export interface Certificate {
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
 * DTO để yêu cầu tạo chứng chỉ
 * @interface GenerateCertificateDto
 */
export interface GenerateCertificateDto {
    /** ID của khóa học cần nhận chứng chỉ */
    courseId: string;
}
//# sourceMappingURL=certificate.types.d.ts.map