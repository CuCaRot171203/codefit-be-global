/**
 * Course Access Service - Enhanced với CFE- format codes
 */
declare class CourseAccessService {
    /**
     * Generate code với format CFE-XXXXXXXXXXXXXXXXXXXX
     */
    private generateCode;
    /**
     * Tạo access code cho khóa học (1 mã)
     */
    createAccessCode(courseId: string, createdBy: string): Promise<any>;
    /**
     * Tạo nhiều access codes (bulk)
     */
    createBulkAccessCodes(courseId: string, createdBy: string, count: number): Promise<any[]>;
    /**
     * Gán khóa học cho user cụ thể (bằng email)
     */
    grantAccessToUser(courseId: string, email: string, grantedBy: string): Promise<any>;
    /**
     * Gán khóa học cho nhiều users (bulk assignment)
     */
    assignToUsers(courseId: string, userIds: string[], adminId: string): Promise<any>;
    /**
     * Lấy danh sách users chưa enroll vào khóa học
     */
    getUsersNotEnrolled(courseId: string, search?: string): Promise<any[]>;
    /**
     * Kích hoạt khóa học bằng code
     */
    activateByCode(code: string, userId: string): Promise<any>;
    /**
     * Kích hoạt khóa học bằng code (không cần user đăng nhập - qua email link)
     */
    activateByCodeLink(code: string): Promise<any>;
    /**
     * Lấy danh sách codes của khóa học
     */
    getCodesByCourse(courseId: string): Promise<any[]>;
    /**
     * Xóa access code
     */
    deleteCode(codeId: string): Promise<void>;
    /**
     * Lấy danh sách enrollments của khóa học với thông tin user và progress
     */
    getEnrollments(courseId: string): Promise<any[]>;
    /**
     * Cập nhật số bài đã mở khóa cho user
     */
    updateUserUnlocks(courseId: string, userId: string, currentUnlocks: number): Promise<any>;
    /**
     * Mở khóa toàn bộ bài học cho user
     */
    unlockAllLessonsForUser(courseId: string, userId: string): Promise<any>;
}
declare const _default: CourseAccessService;
export default _default;
//# sourceMappingURL=courseAccess.service.d.ts.map