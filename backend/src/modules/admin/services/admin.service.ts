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
  async getAllUsers(role?: string) {
    return adminRepository.getAllUsers(role);
  }

  async getUserById(id: string) {
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

  async updateUser(id: string, data: any) {
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

  async deleteUser(id: string) {
    return adminRepository.deleteUser(id);
  }

  async countUsersByRole() {
    return adminRepository.countUsersByRole();
  }

  // ============ Courses ============
  async getAllCourses() {
    return adminRepository.getAllCourses();
  }

  async getCourseById(id: string) {
    return adminRepository.getCourseById(id);
  }

  async createCourse(data: any) {
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

  async updateCourse(id: string, data: any) {
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

  async deleteCourse(id: string) {
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

  async cancelPayment(paymentId: string) {
    const payment = await adminRepository.getAllPayments().then(() => 
      adminRepository.findPaymentById(paymentId)
    );
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

  async createActivateCode(courseId: string, createdBy: string) {
    const code = this.generateActivateCode();
    return adminRepository.createActivateCode({
      code,
      courseId,
      createdBy,
      isUsed: false,
    });
  }

  async deleteActivateCode(id: string) {
    return adminRepository.deleteActivateCode(id);
  }

  private generateActivateCode(): string {
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

  async getPhasesByCourse(courseId: string) {
    return adminRepository.getPhasesByCourse(courseId);
  }

  async createPhase(data: any) {
    return adminRepository.createPhase(data);
  }

  async updatePhase(id: string, data: any) {
    return adminRepository.updatePhase(id, data);
  }

  async deletePhase(id: string) {
    return adminRepository.deletePhase(id);
  }

  // ============ Lessons (Bài học) ============
  async getAllLessons() {
    return adminRepository.getAllLessons();
  }

  async getLessonById(id: string) {
    return adminRepository.getLessonById(id);
  }

  async getLessonsByPhase(phaseId: string) {
    return adminRepository.getLessonsByPhase(phaseId);
  }

  async createLesson(data: any) {
    return adminRepository.createLesson(data);
  }

  async updateLesson(id: string, data: any) {
    return adminRepository.updateLesson(id, data);
  }

  async deleteLesson(id: string) {
    return adminRepository.deleteLesson(id);
  }

  // ============ Testcases (cho bài học code) ============
  async getTestcasesByLesson(lessonId: string) {
    return adminRepository.getTestcasesByLesson(lessonId);
  }

  async createTestcase(data: any) {
    return adminRepository.createTestcase(data);
  }

  async updateTestcase(id: string, data: any) {
    return adminRepository.updateTestcase(id, data);
  }

  async deleteTestcase(id: string) {
    return adminRepository.deleteTestcase(id);
  }

  // ============ Lecture Course Assignment ============
  async getLectureCourses(lectureId: string) {
    return adminRepository.getLectureCourses(lectureId);
  }

  async assignCourseToLecture(lectureId: string, courseId: string, assignedBy?: string) {
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
    } catch (err) {
      console.error('[ADMIN] Failed to send notification:', err);
    }

    return result;
  }

  async unassignCourseFromLecture(lectureId: string, courseId: string) {
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
      } catch (err) {
        console.error('Failed to send notification:', err);
      }
    }

    return result;
  }

  // ============ Instructor Detail (Assignment Overview) ============
  async getInstructorDetail(lectureId: string) {
    return adminRepository.getInstructorDetail(lectureId);
  }

  // ============ Get Lectures by Course ============
  async getLecturesByCourse(courseId: string) {
    return adminRepository.getLecturesByCourse(courseId);
  }

  // ============ Minitests (Admin) ============
  async getAllMinitests() {
    return adminRepository.getAllMinitests();
  }

  async getMinitestById(id: string) {
    return adminRepository.getMinitestById(id);
  }

  async createMinitest(data: { phaseId: string; title: string; questionIds?: string[] }) {
    return adminRepository.createMinitest(data);
  }

  async updateMinitest(id: string, data: { title?: string; questionIds?: string[] }) {
    return adminRepository.updateMinitest(id, data);
  }

  async deleteMinitest(id: string) {
    return adminRepository.deleteMinitest(id);
  }

  async getMinitestStats() {
    return adminRepository.getMinitestStats();
  }

  async getMinitestSubmissions(minitestId: string) {
    return adminRepository.getMinitestSubmissions(minitestId);
  }

  // ============ Problems (Admin) ============
  async getAllProblems() {
    return adminRepository.getAllProblems();
  }

  async getProblemsByCourseId(courseId: string) {
    return adminRepository.getProblemsByCourseId(courseId);
  }

  async createProblem(data: { title: string; description: string; difficulty?: string; testcases?: any[]; hackathonId?: string }) {
    return adminRepository.createProblem(data);
  }

  async updateProblem(id: string, data: any) {
    return adminRepository.updateProblem(id, data);
  }

  async addProblemToHackathon(problemId: string, hackathonId: string) {
    return adminRepository.addProblemToHackathon(problemId, hackathonId);
  }

  async removeProblemFromHackathon(problemId: string) {
    return adminRepository.removeProblemFromHackathon(problemId);
  }

  async deleteProblem(id: string) {
    return adminRepository.deleteProblem(id);
  }

  // ============ Hackathons / Final Tests (Admin) ============
  async getAllHackathons() {
    return adminRepository.getAllHackathons();
  }

  async getHackathonById(id: string) {
    return adminRepository.getHackathonById(id);
  }

  async createHackathon(data: {
    courseId?: string;
    lessonId?: string;
    title: string;
    description?: string;
    startTime?: Date;
    endTime?: Date;
    durationMinutes?: number;
    maxParticipants?: number;
    imageUrl?: string;
    lessonIds?: string[];
    problems?: {
      title: string;
      description: string;
      difficulty?: string;
      codeTemplate?: string;
      inputFormat?: string;
      outputFormat?: string;
      testcases?: {
        input: string;
        expectedOutput: string;
        isPublic?: boolean;
      }[];
    }[];
  }) {
    return adminRepository.createHackathon(data);
  }

  async updateHackathon(id: string, data: any) {
    return adminRepository.updateHackathon(id, data);
  }

  async deleteHackathon(id: string) {
    return adminRepository.deleteHackathon(id);
  }

  // ============ Projects / Final Projects (Admin) ============
  async getAllProjects() {
    return adminRepository.getAllProjects();
  }

  async getProjectById(id: string) {
    return adminRepository.getProjectById(id);
  }

  async createProject(data: { courseId: string; title: string; description?: string }) {
    return adminRepository.createProject(data);
  }

  async updateProject(id: string, data: any) {
    return adminRepository.updateProject(id, data);
  }

  async deleteProject(id: string) {
    return adminRepository.deleteProject(id);
  }

  async approveProjectSubmission(submissionId: string) {
    return adminRepository.approveProjectSubmission(submissionId);
  }

  async rejectProjectSubmission(submissionId: string, reason?: string) {
    return adminRepository.rejectProjectSubmission(submissionId, reason);
  }

  // ============ Lesson Requests (Admin duyệt) ============
  async getLessonRequestById(id: string) {
    return adminRepository.getLessonRequestById(id);
  }

  async getAllLessonRequests() {
    return adminRepository.getAllLessonRequests();
  }

  async deleteLessonRequest(id: string) {
    return adminRepository.deleteLessonRequest(id);
  }

  async approveLessonRequest(id: string) {
    return adminRepository.approveLessonRequest(id);
  }

  async rejectLessonRequest(id: string, reason?: string) {
    return adminRepository.rejectLessonRequest(id, reason);
  }
}

export default new AdminService();
