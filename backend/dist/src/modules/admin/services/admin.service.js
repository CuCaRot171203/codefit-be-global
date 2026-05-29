"use strict";
/**
 * @fileoverview Service cho Admin module
 * @module admin/services
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_repository_1 = __importDefault(require("../repositories/admin.repository"));
const notification_service_1 = __importDefault(require("../../notification/services/notification.service"));
const prisma_1 = __importDefault(require("../../../prisma"));
class AdminService {
    // ============ Dashboard ============
    async getDashboardStats() {
        return admin_repository_1.default.getDashboardStats();
    }
    // ============ Users ============
    async getAllUsers(role) {
        return admin_repository_1.default.getAllUsers(role);
    }
    async getUserById(id) {
        const user = await admin_repository_1.default.getUserById(id);
        if (user) {
            // Fetch role name if roleId exists but role relation is missing
            if (user.roleId && !user.role) {
                const role = await prisma_1.default.role.findUnique({
                    where: { id: user.roleId },
                });
                return { ...user, role };
            }
        }
        return user;
    }
    async updateUser(id, data) {
        // If role is being updated, convert role name to roleId
        if (data.role) {
            const roleRecord = await prisma_1.default.role.findUnique({
                where: { name: data.role },
            });
            if (roleRecord) {
                data.roleId = roleRecord.id;
            }
            delete data.role;
        }
        return admin_repository_1.default.updateUser(id, data);
    }
    async deleteUser(id) {
        return admin_repository_1.default.deleteUser(id);
    }
    async countUsersByRole() {
        return admin_repository_1.default.countUsersByRole();
    }
    // ============ Courses ============
    async getAllCourses() {
        return admin_repository_1.default.getAllCourses();
    }
    async getCourseById(id) {
        return admin_repository_1.default.getCourseById(id);
    }
    async createCourse(data) {
        // Validation
        if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
            throw new Error('Tên khóa học không được trống');
        }
        if (data.price !== undefined && (typeof data.price !== 'number' || data.price < 0)) {
            throw new Error('Giá không được âm');
        }
        if (data.originalPrice !== undefined && (typeof data.originalPrice !== 'number' || data.originalPrice < 0)) {
            throw new Error('Giá gốc không được âm');
        }
        if (data.subscriptionPrice !== undefined && (typeof data.subscriptionPrice !== 'number' || data.subscriptionPrice < 0)) {
            throw new Error('Giá subscription không được âm');
        }
        // Validate subscription type
        const validSubscriptionTypes = ['FREE', 'PREMIUM', 'BOTH'];
        if (data.subscriptionType && !validSubscriptionTypes.includes(data.subscriptionType)) {
            throw new Error('Loại subscription không hợp lệ');
        }
        return admin_repository_1.default.createCourse(data);
    }
    async updateCourse(id, data) {
        // Validation
        if (data.title !== undefined && (typeof data.title !== 'string' || data.title.trim().length === 0)) {
            throw new Error('Tên khóa học không được trống');
        }
        if (data.price !== undefined && (typeof data.price !== 'number' || data.price < 0)) {
            throw new Error('Giá không được âm');
        }
        if (data.originalPrice !== undefined && (typeof data.originalPrice !== 'number' || data.originalPrice < 0)) {
            throw new Error('Giá gốc không được âm');
        }
        if (data.subscriptionPrice !== undefined && (typeof data.subscriptionPrice !== 'number' || data.subscriptionPrice < 0)) {
            throw new Error('Giá subscription không được âm');
        }
        // Validate subscription type
        const validSubscriptionTypes = ['FREE', 'PREMIUM', 'BOTH'];
        if (data.subscriptionType && !validSubscriptionTypes.includes(data.subscriptionType)) {
            throw new Error('Loại subscription không hợp lệ');
        }
        return admin_repository_1.default.updateCourse(id, data);
    }
    async deleteCourse(id) {
        return admin_repository_1.default.deleteCourse(id);
    }
    async countCourses() {
        return admin_repository_1.default.countCourses();
    }
    // ============ Payments ============
    async getAllPayments() {
        return admin_repository_1.default.getAllPayments();
    }
    async getPaymentStats() {
        return admin_repository_1.default.getPaymentStats();
    }
    async getRevenueByMonth() {
        return admin_repository_1.default.getRevenueByMonth();
    }
    async cancelPayment(paymentId) {
        const payment = await admin_repository_1.default.getAllPayments().then(() => admin_repository_1.default.findPaymentById(paymentId));
        if (!payment) {
            throw new Error('Payment not found');
        }
        if (payment.paymentStatus !== 'pending') {
            throw new Error('Only pending payments can be cancelled');
        }
        return admin_repository_1.default.updatePaymentStatus(paymentId, 'failed');
    }
    // ============ Activate Codes ============
    async getAllActivateCodes() {
        return admin_repository_1.default.getAllActivateCodes();
    }
    async createActivateCode(courseId, createdBy) {
        const code = this.generateActivateCode();
        return admin_repository_1.default.createActivateCode({
            code,
            courseId,
            createdBy,
            isUsed: false,
        });
    }
    async deleteActivateCode(id) {
        return admin_repository_1.default.deleteActivateCode(id);
    }
    generateActivateCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'CF-';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }
    // ============ Enrollments ============
    async getAllEnrollments() {
        return admin_repository_1.default.getAllEnrollments();
    }
    // ============ Phases (Chương học) ============
    async getAllPhases() {
        return admin_repository_1.default.getAllPhases();
    }
    async getPhasesByCourse(courseId) {
        return admin_repository_1.default.getPhasesByCourse(courseId);
    }
    async createPhase(data) {
        return admin_repository_1.default.createPhase(data);
    }
    async updatePhase(id, data) {
        return admin_repository_1.default.updatePhase(id, data);
    }
    async deletePhase(id) {
        return admin_repository_1.default.deletePhase(id);
    }
    // ============ Lessons (Bài học) ============
    async getAllLessons() {
        return admin_repository_1.default.getAllLessons();
    }
    async getLessonById(id) {
        return admin_repository_1.default.getLessonById(id);
    }
    async getLessonsByPhase(phaseId) {
        return admin_repository_1.default.getLessonsByPhase(phaseId);
    }
    async createLesson(data) {
        return admin_repository_1.default.createLesson(data);
    }
    async updateLesson(id, data) {
        return admin_repository_1.default.updateLesson(id, data);
    }
    async deleteLesson(id) {
        return admin_repository_1.default.deleteLesson(id);
    }
    // ============ Testcases (cho bài học code) ============
    async getTestcasesByLesson(lessonId) {
        return admin_repository_1.default.getTestcasesByLesson(lessonId);
    }
    async createTestcase(data) {
        return admin_repository_1.default.createTestcase(data);
    }
    async updateTestcase(id, data) {
        return admin_repository_1.default.updateTestcase(id, data);
    }
    async deleteTestcase(id) {
        return admin_repository_1.default.deleteTestcase(id);
    }
    // ============ Lecture Course Assignment ============
    async getLectureCourses(lectureId) {
        return admin_repository_1.default.getLectureCourses(lectureId);
    }
    async assignCourseToLecture(lectureId, courseId, assignedBy) {
        // Check if already assigned
        const isAssigned = await admin_repository_1.default.isLectureAssignedToCourse(lectureId, courseId);
        if (isAssigned) {
            throw new Error('Lecture is already assigned to this course');
        }
        // Check if course exists
        const course = await prisma_1.default.course.findUnique({ where: { id: courseId } });
        if (!course) {
            throw new Error('Course not found');
        }
        // Check if lecture exists and has lecture role
        const lecture = await prisma_1.default.user.findUnique({ where: { id: lectureId } });
        if (!lecture) {
            throw new Error('Lecture not found');
        }
        const lectureRole = await prisma_1.default.role.findUnique({ where: { id: lecture.roleId } });
        if (!lectureRole || lectureRole.name !== 'lecture') {
            throw new Error('User is not a lecture');
        }
        // Assign course to lecture
        const result = await admin_repository_1.default.assignCourseToLecture(lectureId, courseId, assignedBy);
        // Send notification to lecture
        try {
            console.log('[ADMIN] Creating notification for lecture:', lectureId, 'course:', course.title);
            const notification = await notification_service_1.default.createNotification({
                userId: lectureId,
                type: 'course_assignment',
                title: 'Bạn được chỉ định giảng dạy khóa học mới',
                message: `Bạn đã được chỉ định giảng dạy khóa học "${course.title}". Vui lòng kiểm tra và chuẩn bị nội dung.`,
                metadata: {
                    link: `/lecture/my-courses/${courseId}`,
                    courseId: courseId,
                    courseTitle: course.title
                }
            });
            console.log('[ADMIN] Notification created:', notification);
        }
        catch (err) {
            console.error('[ADMIN] Failed to send notification:', err);
        }
        return result;
    }
    async unassignCourseFromLecture(lectureId, courseId) {
        // Check if assignment exists
        const isAssigned = await admin_repository_1.default.isLectureAssignedToCourse(lectureId, courseId);
        if (!isAssigned) {
            throw new Error('Lecture is not assigned to this course');
        }
        // Get course info before removing
        const course = await prisma_1.default.course.findUnique({ where: { id: courseId } });
        // Remove assignment
        const result = await admin_repository_1.default.unassignCourseFromLecture(lectureId, courseId);
        // Send notification to lecture
        if (course) {
            try {
                await notification_service_1.default.createNotification({
                    userId: lectureId,
                    type: 'course_unassignment',
                    title: 'Bạn bị gỡ khỏi khóa học',
                    message: `Bạn đã bị gỡ khỏi khóa học "${course.title}". Nội dung giảng dạy đã được chuyển cho giảng viên khác.`
                });
            }
            catch (err) {
                console.error('Failed to send notification:', err);
            }
        }
        return result;
    }
    // ============ Instructor Detail (Assignment Overview) ============
    async getInstructorDetail(lectureId) {
        return admin_repository_1.default.getInstructorDetail(lectureId);
    }
    // ============ Get Lectures by Course ============
    async getLecturesByCourse(courseId) {
        return admin_repository_1.default.getLecturesByCourse(courseId);
    }
    // ============ Minitests (Admin) ============
    async getAllMinitests() {
        return admin_repository_1.default.getAllMinitests();
    }
    async getMinitestById(id) {
        return admin_repository_1.default.getMinitestById(id);
    }
    async createMinitest(data) {
        return admin_repository_1.default.createMinitest(data);
    }
    async updateMinitest(id, data) {
        return admin_repository_1.default.updateMinitest(id, data);
    }
    async deleteMinitest(id) {
        return admin_repository_1.default.deleteMinitest(id);
    }
    async getMinitestStats() {
        return admin_repository_1.default.getMinitestStats();
    }
    async getMinitestSubmissions(minitestId) {
        return admin_repository_1.default.getMinitestSubmissions(minitestId);
    }
    // ============ Problems (Admin) ============
    async getAllProblems() {
        return admin_repository_1.default.getAllProblems();
    }
    async getProblemsByCourseId(courseId) {
        return admin_repository_1.default.getProblemsByCourseId(courseId);
    }
    async createProblem(data) {
        return admin_repository_1.default.createProblem(data);
    }
    async updateProblem(id, data) {
        return admin_repository_1.default.updateProblem(id, data);
    }
    async addProblemToHackathon(problemId, hackathonId) {
        return admin_repository_1.default.addProblemToHackathon(problemId, hackathonId);
    }
    async removeProblemFromHackathon(problemId) {
        return admin_repository_1.default.removeProblemFromHackathon(problemId);
    }
    async deleteProblem(id) {
        return admin_repository_1.default.deleteProblem(id);
    }
    // ============ Hackathons / Final Tests (Admin) ============
    async getAllHackathons() {
        return admin_repository_1.default.getAllHackathons();
    }
    async getHackathonById(id) {
        return admin_repository_1.default.getHackathonById(id);
    }
    async createHackathon(data) {
        return admin_repository_1.default.createHackathon(data);
    }
    async updateHackathon(id, data) {
        return admin_repository_1.default.updateHackathon(id, data);
    }
    async deleteHackathon(id) {
        return admin_repository_1.default.deleteHackathon(id);
    }
    // ============ Projects / Final Projects (Admin) ============
    async getAllProjects() {
        return admin_repository_1.default.getAllProjects();
    }
    async getProjectById(id) {
        return admin_repository_1.default.getProjectById(id);
    }
    async createProject(data) {
        return admin_repository_1.default.createProject(data);
    }
    async updateProject(id, data) {
        return admin_repository_1.default.updateProject(id, data);
    }
    async deleteProject(id) {
        return admin_repository_1.default.deleteProject(id);
    }
    async approveProjectSubmission(submissionId) {
        return admin_repository_1.default.approveProjectSubmission(submissionId);
    }
    async rejectProjectSubmission(submissionId, reason) {
        return admin_repository_1.default.rejectProjectSubmission(submissionId, reason);
    }
    // ============ Lesson Requests (Admin duyệt) ============
    async getLessonRequestById(id) {
        return admin_repository_1.default.getLessonRequestById(id);
    }
    async getAllLessonRequests() {
        return admin_repository_1.default.getAllLessonRequests();
    }
    async deleteLessonRequest(id) {
        return admin_repository_1.default.deleteLessonRequest(id);
    }
    async approveLessonRequest(id) {
        return admin_repository_1.default.approveLessonRequest(id);
    }
    async rejectLessonRequest(id, reason) {
        return admin_repository_1.default.rejectLessonRequest(id, reason);
    }
}
exports.default = new AdminService();
//# sourceMappingURL=admin.service.js.map