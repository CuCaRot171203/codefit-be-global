/**
 * Email Service - Gửi email thông báo
 * Sử dụng nodemailer hoặc dịch vụ email khác
 */
declare class EmailService {
    private transporter;
    private getTransporter;
    /**
     * Gửi email thông báo bài học mới cho user
     */
    sendNewLessonNotification(to: string, userName: string, courseTitle: string, lessonTitle: string, lessonUrl: string): Promise<void>;
    /**
     * Gửi email thông báo bài học được duyệt cho lecture
     */
    sendLessonApprovedNotification(to: string, lectureName: string, lessonTitle: string): Promise<void>;
    /**
     * Gửi email thông báo bài học bị từ chối cho lecture
     */
    sendLessonRejectedNotification(to: string, lectureName: string, lessonTitle: string, feedback: string): Promise<void>;
    /**
     * Gửi email thông báo điểm bài tập cho user
     */
    sendScoreNotification(to: string, userName: string, lessonTitle: string, courseTitle: string, score: number, passedTests: number, totalTests: number, lessonUrl: string): Promise<void>;
    /**
     * Gửi email thông báo được cấp quyền truy cập khóa học
     */
    sendCourseAccessGrantedNotification(to: string, userName: string, courseTitle: string, courseUrl?: string): Promise<void>;
    /**
     * Gửi email kèm mã kích hoạt khóa học
     */
    sendCourseAccessWithCode(to: string, userName: string, courseTitle: string, activationCode: string, courseUrl?: string): Promise<void>;
    /**
     * Gửi email nhắc nhở hackathon sắp bắt đầu
     */
    sendHackathonReminder(to: string, userName: string, hackathonTitle: string, startTime: Date, hackathonUrl?: string): Promise<void>;
    /**
     * Gửi email xác nhận đã đăng ký hackathon
     */
    sendHackathonJoined(to: string, userName: string, hackathonTitle: string, hackathonUrl?: string): Promise<void>;
    sendProjectSubmittedEmail(to: string, userName: string, projectTitle: string, courseTitle: string, projectUrl: string): Promise<void>;
    /**
     * Gửi email chứng chỉ hoàn thành khóa học
     */
    sendCertificateEmail(to: string, userName: string, courseTitle: string, certificateUrl: string, certificateId: string): Promise<void>;
}
declare const _default: EmailService;
export default _default;
//# sourceMappingURL=email.service.d.ts.map