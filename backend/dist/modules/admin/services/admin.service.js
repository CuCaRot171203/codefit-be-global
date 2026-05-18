/**
 * @fileoverview Service cho Admin module
 * @module admin/services
 */
import adminRepository from '../repositories/admin.repository';
import notificationService from '../../notification/services/notification.service';
import prisma from '../../../prisma';
class AdminService {
    // ============ Dashboard ============
    async getDashboardStats() {
        return adminRepository.getDashboardStats();
    }
    // ============ Users ============
    async getAllUsers(role) {
        return adminRepository.getAllUsers(role);
    }
    async getUserById(id) {
        const user = await adminRepository.getUserById(id);
        if (user) {
            // Fetch role name if roleId exists but role relation is missing
            if (user.roleId && !user.role) {
                const role = await prisma.role.findUnique({
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
            const roleRecord = await prisma.role.findUnique({
                where: { name: data.role },
            });
            if (roleRecord) {
                data.roleId = roleRecord.id;
            }
            delete data.role;
        }
        return adminRepository.updateUser(id, data);
    }
    async deleteUser(id) {
        return adminRepository.deleteUser(id);
    }
    async countUsersByRole() {
        return adminRepository.countUsersByRole();
    }
    // ============ Courses ============
    async getAllCourses() {
        return adminRepository.getAllCourses();
    }
    async getCourseById(id) {
        return adminRepository.getCourseById(id);
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
        return adminRepository.createCourse(data);
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
        return adminRepository.updateCourse(id, data);
    }
    async deleteCourse(id) {
        return adminRepository.deleteCourse(id);
    }
    async countCourses() {
        return adminRepository.countCourses();
    }
    // ============ Payments ============
    async getAllPayments() {
        return adminRepository.getAllPayments();
    }
    async getPaymentStats() {
        return adminRepository.getPaymentStats();
    }
    async getRevenueByMonth() {
        return adminRepository.getRevenueByMonth();
    }
    async cancelPayment(paymentId) {
        const payment = await adminRepository.getAllPayments().then(() => adminRepository.findPaymentById(paymentId));
        if (!payment) {
            throw new Error('Payment not found');
        }
        if (payment.paymentStatus !== 'pending') {
            throw new Error('Only pending payments can be cancelled');
        }
        return adminRepository.updatePaymentStatus(paymentId, 'failed');
    }
    // ============ Activate Codes ============
    async getAllActivateCodes() {
        return adminRepository.getAllActivateCodes();
    }
    async createActivateCode(courseId, createdBy) {
        const code = this.generateActivateCode();
        return adminRepository.createActivateCode({
            code,
            courseId,
            createdBy,
            isUsed: false,
        });
    }
    async deleteActivateCode(id) {
        return adminRepository.deleteActivateCode(id);
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
        return adminRepository.getAllEnrollments();
    }
    // ============ Phases (Chương học) ============
    async getAllPhases() {
        return adminRepository.getAllPhases();
    }
    async getPhasesByCourse(courseId) {
        return adminRepository.getPhasesByCourse(courseId);
    }
    async createPhase(data) {
        return adminRepository.createPhase(data);
    }
    async updatePhase(id, data) {
        return adminRepository.updatePhase(id, data);
    }
    async deletePhase(id) {
        return adminRepository.deletePhase(id);
    }
    // ============ Lessons (Bài học) ============
    async getAllLessons() {
        return adminRepository.getAllLessons();
    }
    async getLessonById(id) {
        return adminRepository.getLessonById(id);
    }
    async getLessonsByPhase(phaseId) {
        return adminRepository.getLessonsByPhase(phaseId);
    }
    async createLesson(data) {
        return adminRepository.createLesson(data);
    }
    async updateLesson(id, data) {
        return adminRepository.updateLesson(id, data);
    }
    async deleteLesson(id) {
        return adminRepository.deleteLesson(id);
    }
    // ============ Testcases (cho bài học code) ============
    async getTestcasesByLesson(lessonId) {
        return adminRepository.getTestcasesByLesson(lessonId);
    }
    async createTestcase(data) {
        return adminRepository.createTestcase(data);
    }
    async updateTestcase(id, data) {
        return adminRepository.updateTestcase(id, data);
    }
    async deleteTestcase(id) {
        return adminRepository.deleteTestcase(id);
    }
    // ============ Lecture Course Assignment ============
    async getLectureCourses(lectureId) {
        return adminRepository.getLectureCourses(lectureId);
    }
    async assignCourseToLecture(lectureId, courseId, assignedBy) {
        // Check if already assigned
        const isAssigned = await adminRepository.isLectureAssignedToCourse(lectureId, courseId);
        if (isAssigned) {
            throw new Error('Lecture is already assigned to this course');
        }
        // Check if course exists
        const course = await prisma.course.findUnique({ where: { id: courseId } });
        if (!course) {
            throw new Error('Course not found');
        }
        // Check if lecture exists and has lecture role
        const lecture = await prisma.user.findUnique({ where: { id: lectureId } });
        if (!lecture) {
            throw new Error('Lecture not found');
        }
        const lectureRole = await prisma.role.findUnique({ where: { id: lecture.roleId } });
        if (!lectureRole || lectureRole.name !== 'lecture') {
            throw new Error('User is not a lecture');
        }
        // Assign course to lecture
        const result = await adminRepository.assignCourseToLecture(lectureId, courseId, assignedBy);
        // Send notification to lecture
        try {
            console.log('[ADMIN] Creating notification for lecture:', lectureId, 'course:', course.title);
            const notification = await notificationService.createNotification({
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
        const isAssigned = await adminRepository.isLectureAssignedToCourse(lectureId, courseId);
        if (!isAssigned) {
            throw new Error('Lecture is not assigned to this course');
        }
        // Get course info before removing
        const course = await prisma.course.findUnique({ where: { id: courseId } });
        // Remove assignment
        const result = await adminRepository.unassignCourseFromLecture(lectureId, courseId);
        // Send notification to lecture
        if (course) {
            try {
                await notificationService.createNotification({
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
        return adminRepository.getInstructorDetail(lectureId);
    }
    // ============ Get Lectures by Course ============
    async getLecturesByCourse(courseId) {
        return adminRepository.getLecturesByCourse(courseId);
    }
    // ============ Minitests (Admin) ============
    async getAllMinitests() {
        return adminRepository.getAllMinitests();
    }
    async getMinitestById(id) {
        return adminRepository.getMinitestById(id);
    }
    async createMinitest(data) {
        return adminRepository.createMinitest(data);
    }
    async updateMinitest(id, data) {
        return adminRepository.updateMinitest(id, data);
    }
    async deleteMinitest(id) {
        return adminRepository.deleteMinitest(id);
    }
    async getMinitestStats() {
        return adminRepository.getMinitestStats();
    }
    async getMinitestSubmissions(minitestId) {
        return adminRepository.getMinitestSubmissions(minitestId);
    }
    // ============ Problems (Admin) ============
    async getAllProblems() {
        return adminRepository.getAllProblems();
    }
    async getProblemsByCourseId(courseId) {
        return adminRepository.getProblemsByCourseId(courseId);
    }
    async createProblem(data) {
        return adminRepository.createProblem(data);
    }
    async updateProblem(id, data) {
        return adminRepository.updateProblem(id, data);
    }
    async addProblemToHackathon(problemId, hackathonId) {
        return adminRepository.addProblemToHackathon(problemId, hackathonId);
    }
    async removeProblemFromHackathon(problemId) {
        return adminRepository.removeProblemFromHackathon(problemId);
    }
    async deleteProblem(id) {
        return adminRepository.deleteProblem(id);
    }
    // ============ Hackathons / Final Tests (Admin) ============
    async getAllHackathons() {
        return adminRepository.getAllHackathons();
    }
    async getHackathonById(id) {
        return adminRepository.getHackathonById(id);
    }
    async createHackathon(data) {
        return adminRepository.createHackathon(data);
    }
    async updateHackathon(id, data) {
        return adminRepository.updateHackathon(id, data);
    }
    async deleteHackathon(id) {
        return adminRepository.deleteHackathon(id);
    }
    // ============ Projects / Final Projects (Admin) ============
    async getAllProjects() {
        return adminRepository.getAllProjects();
    }
    async getProjectById(id) {
        return adminRepository.getProjectById(id);
    }
    async createProject(data) {
        return adminRepository.createProject(data);
    }
    async updateProject(id, data) {
        return adminRepository.updateProject(id, data);
    }
    async deleteProject(id) {
        return adminRepository.deleteProject(id);
    }
    async approveProjectSubmission(submissionId) {
        return adminRepository.approveProjectSubmission(submissionId);
    }
    async rejectProjectSubmission(submissionId, reason) {
        return adminRepository.rejectProjectSubmission(submissionId, reason);
    }
    // ============ Lesson Requests (Admin duyệt) ============
    async getLessonRequestById(id) {
        return adminRepository.getLessonRequestById(id);
    }
    async getAllLessonRequests() {
        return adminRepository.getAllLessonRequests();
    }
    async deleteLessonRequest(id) {
        return adminRepository.deleteLessonRequest(id);
    }
    async approveLessonRequest(id) {
        return adminRepository.approveLessonRequest(id);
    }
    async rejectLessonRequest(id, reason) {
        return adminRepository.rejectLessonRequest(id, reason);
    }
}
export default new AdminService();
//# sourceMappingURL=admin.service.js.map