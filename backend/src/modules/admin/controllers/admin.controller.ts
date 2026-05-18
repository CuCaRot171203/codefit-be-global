/**
 * @fileoverview Controller cho Admin module
 * @module admin/controllers
 */

import { Request, Response, NextFunction } from 'express';
import adminService from '../services/admin.service';

class AdminController {

  // ============ Dashboard ============
  getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await adminService.getDashboardStats();
      res.json({ success: true, data: stats });
    } catch (error: any) {
      next(error);
    }
  };

  // ============ Users ============
  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role } = req.query;
      const users = await adminService.getAllUsers(role as string | undefined);
      res.json({ success: true, data: users });
    } catch (error: any) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await adminService.getUserById(id);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      res.json({ success: true, data: user });
    } catch (error: any) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      console.log('Update user request:', { id, body: req.body });
      const user = await adminService.updateUser(id, req.body);
      console.log('Updated user:', user);
      res.json({ success: true, data: user, message: 'User updated successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await adminService.deleteUser(id);
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  // ============ Courses ============
  getAllCourses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = await adminService.getAllCourses();
      res.json({ success: true, data: courses });
    } catch (error: any) {
      next(error);
    }
  };

  getCourseById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const course = await adminService.getCourseById(id);
      if (!course) {
        res.status(404).json({ success: false, message: 'Course not found' });
        return;
      }
      res.json({ success: true, data: course });
    } catch (error: any) {
      next(error);
    }
  };

  createCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const course = await adminService.createCourse(req.body);
      res.status(201).json({ success: true, data: course, message: 'Course created successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  updateCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const course = await adminService.updateCourse(id, req.body);
      res.json({ success: true, data: course, message: 'Course updated successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await adminService.deleteCourse(id);
      res.json({ success: true, message: 'Course deleted successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  // ============ Payments ============
  getAllPayments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payments = await adminService.getAllPayments();
      res.json({ success: true, data: payments });
    } catch (error: any) {
      next(error);
    }
  };

  getPaymentStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await adminService.getPaymentStats();
      res.json({ success: true, data: stats });
    } catch (error: any) {
      next(error);
    }
  };

  getRevenueByMonth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const revenue = await adminService.getRevenueByMonth();
      res.json({ success: true, data: revenue });
    } catch (error: any) {
      next(error);
    }
  };

  cancelPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const payment = await adminService.cancelPayment(id);
      res.json({ success: true, data: payment, message: 'Payment cancelled successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  // ============ Activate Codes ============
  getAllActivateCodes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const codes = await adminService.getAllActivateCodes();
      res.json({ success: true, data: codes });
    } catch (error: any) {
      next(error);
    }
  };

  createActivateCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId } = req.body;
      const createdBy = req.user?.userId;
      if (!courseId) {
        res.status(400).json({ success: false, message: 'courseId is required' });
        return;
      }
      const code = await adminService.createActivateCode(courseId, createdBy);
      res.status(201).json({ success: true, data: code, message: 'Activate code created successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  deleteActivateCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await adminService.deleteActivateCode(id);
      res.json({ success: true, message: 'Activate code deleted successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  // ============ Enrollments ============
  getAllEnrollments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const enrollments = await adminService.getAllEnrollments();
      res.json({ success: true, data: enrollments });
    } catch (error: any) {
      next(error);
    }
  };

  // ============ Phases (Chương học) ============
  getAllPhases = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId } = req.query;
      const phases = courseId 
        ? await adminService.getPhasesByCourse(courseId as string)
        : await adminService.getAllPhases();
      res.json({ success: true, data: phases });
    } catch (error: any) {
      next(error);
    }
  };

  getPhaseById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const phases = await adminService.getPhasesByCourse(id);
      res.json({ success: true, data: phases });
    } catch (error: any) {
      next(error);
    }
  };

  createPhase = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, title } = req.body;
      if (!courseId || !title) {
        res.status(400).json({ success: false, message: 'courseId and title are required' });
        return;
      }
      const phase = await adminService.createPhase({ courseId, title });
      res.status(201).json({ success: true, data: phase, message: 'Phase created successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  updatePhase = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const phase = await adminService.updatePhase(id, req.body);
      res.json({ success: true, data: phase, message: 'Phase updated successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  deletePhase = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await adminService.deletePhase(id);
      res.json({ success: true, message: 'Phase deleted successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  // ============ Lessons (Bài học) ============
  getAllLessons = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { phaseId } = req.query;
      const lessons = phaseId 
        ? await adminService.getLessonsByPhase(phaseId as string)
        : await adminService.getAllLessons();
      res.json({ success: true, data: lessons });
    } catch (error: any) {
      next(error);
    }
  };

  getLessonById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const lesson = await adminService.getLessonById(id);
      if (!lesson) {
        res.status(404).json({ success: false, message: 'Lesson not found' });
        return;
      }
      res.json({ success: true, data: lesson });
    } catch (error: any) {
      next(error);
    }
  };

  createLesson = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { phaseId, title, content, type, orderIndex } = req.body;
      if (!phaseId || !title || !content) {
        res.status(400).json({ success: false, message: 'phaseId, title, and content are required' });
        return;
      }
      const lesson = await adminService.createLesson({ phaseId, title, content, type, orderIndex });
      res.status(201).json({ success: true, data: lesson, message: 'Lesson created successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  updateLesson = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const lesson = await adminService.updateLesson(id, req.body);
      res.json({ success: true, data: lesson, message: 'Lesson updated successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  deleteLesson = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await adminService.deleteLesson(id);
      res.json({ success: true, message: 'Lesson deleted successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  // ============ Testcases (cho bài học code) ============
  getTestcasesByLesson = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { lessonId } = req.params;
      const testcases = await adminService.getTestcasesByLesson(lessonId);
      res.json({ success: true, data: testcases });
    } catch (error: any) {
      next(error);
    }
  };

  createTestcase = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { lessonId } = req.params;
      const { input, expectedOutput, isHidden, points } = req.body;
      if (!input || !expectedOutput) {
        res.status(400).json({ success: false, message: 'input and expectedOutput are required' });
        return;
      }
      const testcase = await adminService.createTestcase({
        lessonId,
        input,
        expectedOutput,
        isHidden: isHidden ?? false,
        points: points ?? 10
      });
      res.status(201).json({ success: true, data: testcase, message: 'Testcase created successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  updateTestcase = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const testcase = await adminService.updateTestcase(id, req.body);
      res.json({ success: true, data: testcase, message: 'Testcase updated successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  deleteTestcase = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await adminService.deleteTestcase(id);
      res.json({ success: true, message: 'Testcase deleted successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  // ============ Lecture Course Assignment ============
  getLectureCourses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { lectureId } = req.params;
      const courses = await adminService.getLectureCourses(lectureId);
      res.json({ success: true, data: courses });
    } catch (error: any) {
      next(error);
    }
  };

  assignCourseToLecture = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { lectureId, courseId } = req.params;
      const assignedBy = req.user?.userId;
      console.log('[ADMIN CONTROLLER] assignCourseToLecture called:', { lectureId, courseId, assignedBy });
      const result = await adminService.assignCourseToLecture(lectureId, courseId, assignedBy);
      res.status(201).json({ success: true, data: result, message: 'Course assigned to lecture successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  unassignCourseFromLecture = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { lectureId, courseId } = req.params;
      await adminService.unassignCourseFromLecture(lectureId, courseId);
      res.json({ success: true, message: 'Course unassigned from lecture successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  // ============ Instructor Detail (Assignment Overview) ============
  getInstructorDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { lectureId } = req.params;
      const detail = await adminService.getInstructorDetail(lectureId);
      res.json({ success: true, data: detail });
    } catch (error: any) {
      if (error.message === 'Instructor not found') {
        res.status(404).json({ success: false, message: 'Instructor not found' });
        return;
      }
      next(error);
    }
  };

  // ============ Get Lectures by Course ============
  getLecturesByCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId } = req.params;
      const lectures = await adminService.getLecturesByCourse(courseId);
      res.json({ success: true, data: lectures });
    } catch (error: any) {
      next(error);
    }
  };

  // ============ Minitests (Admin) ============
  getAllMinitests = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const minitests = await adminService.getAllMinitests();
      res.json({ success: true, data: minitests });
    } catch (error: any) {
      next(error);
    }
  };

  getMinitestById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const minitest = await adminService.getMinitestById(id);
      if (!minitest) {
        res.status(404).json({ success: false, message: 'Minitest not found' });
        return;
      }
      res.json({ success: true, data: minitest });
    } catch (error: any) {
      next(error);
    }
  };

  createMinitest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { phaseId, title, questionIds } = req.body;
      if (!phaseId || !title) {
        res.status(400).json({ success: false, message: 'phaseId and title are required' });
        return;
      }
      const minitest = await adminService.createMinitest({ phaseId, title, questionIds });
      res.status(201).json({ success: true, data: minitest, message: 'Minitest created successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  updateMinitest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const minitest = await adminService.updateMinitest(id, req.body);
      res.json({ success: true, data: minitest, message: 'Minitest updated successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  deleteMinitest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await adminService.deleteMinitest(id);
      res.json({ success: true, message: 'Minitest deleted successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  // ============ Minitest Stats (Admin) ============
  getMinitestStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await adminService.getMinitestStats();
      res.json({ success: true, data: stats });
    } catch (error: any) {
      next(error);
    }
  };

  getMinitestSubmissions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { minitestId } = req.params;
      const submissions = await adminService.getMinitestSubmissions(minitestId);
      res.json({ success: true, data: submissions });
    } catch (error: any) {
      next(error);
    }
  };

  // ============ Problems (Admin) ============
  getAllProblems = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const problems = await adminService.getAllProblems();
      res.json({ success: true, data: problems });
    } catch (error: any) {
      next(error);
    }
  };

  getProblemsByCourseId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId } = req.params;
      if (!courseId) {
        res.status(400).json({ success: false, message: 'courseId is required' });
        return;
      }
      const problems = await adminService.getProblemsByCourseId(courseId);
      res.json({ success: true, data: problems });
    } catch (error: any) {
      next(error);
    }
  };

  createProblem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, description, difficulty, testcases, hackathonId } = req.body;
      if (!title || !description) {
        res.status(400).json({ success: false, message: 'title and description are required' });
        return;
      }
      const problem = await adminService.createProblem({ title, description, difficulty, testcases, hackathonId });
      res.status(201).json({ success: true, data: problem, message: 'Problem created successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  updateProblem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const problem = await adminService.updateProblem(id, req.body);
      res.json({ success: true, data: problem, message: 'Problem updated successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  deleteProblem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await adminService.deleteProblem(id);
      res.json({ success: true, message: 'Problem deleted successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  addProblemToHackathon = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { problemId } = req.body;
      const { hackathonId } = req.params;
      if (!problemId || !hackathonId) {
        res.status(400).json({ success: false, message: 'problemId and hackathonId are required' });
        return;
      }
      const problem = await adminService.addProblemToHackathon(problemId, hackathonId);
      res.json({ success: true, data: problem, message: 'Problem added to hackathon successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  removeProblemFromHackathon = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { problemId } = req.params;
      const problem = await adminService.removeProblemFromHackathon(problemId);
      res.json({ success: true, data: problem, message: 'Problem removed from hackathon successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  // ============ Hackathons / Final Tests (Admin) ============
  getAllHackathons = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const hackathons = await adminService.getAllHackathons();
      res.json({ success: true, data: hackathons });
    } catch (error: any) {
      next(error);
    }
  };

  getHackathonById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const hackathon = await adminService.getHackathonById(id);
      if (!hackathon) {
        res.status(404).json({ success: false, message: 'Hackathon not found' });
        return;
      }
      res.json({ success: true, data: hackathon });
    } catch (error: any) {
      next(error);
    }
  };

  createHackathon = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, lessonId, title, description, startTime, endTime, durationMinutes, maxParticipants, imageUrl, lessonIds, problems } = req.body;
      if (!title) {
        res.status(400).json({ success: false, message: 'title is required' });
        return;
      }
      const hackathon = await adminService.createHackathon({
        courseId,
        lessonId,
        title,
        description: description || '',
        startTime: startTime ? new Date(startTime) : new Date(),
        endTime: endTime ? new Date(endTime) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        durationMinutes: durationMinutes || 120,
        maxParticipants: maxParticipants || 100,
        imageUrl: imageUrl || null,
        lessonIds: lessonIds || [],
        problems: problems || [],
      });
      res.status(201).json({ success: true, data: hackathon, message: 'Hackathon created successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  updateHackathon = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const hackathon = await adminService.updateHackathon(id, req.body);
      res.json({ success: true, data: hackathon, message: 'Hackathon updated successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  deleteHackathon = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await adminService.deleteHackathon(id);
      res.json({ success: true, message: 'Hackathon deleted successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  // ============ Projects / Final Projects (Admin) ============
  getAllProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projects = await adminService.getAllProjects();
      res.json({ success: true, data: projects });
    } catch (error: any) {
      next(error);
    }
  };

  getProjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const project = await adminService.getProjectById(id);
      if (!project) {
        res.status(404).json({ success: false, message: 'Project not found' });
        return;
      }
      res.json({ success: true, data: project });
    } catch (error: any) {
      next(error);
    }
  };

  createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, title, description } = req.body;
      if (!courseId || !title) {
        res.status(400).json({ success: false, message: 'courseId and title are required' });
        return;
      }

      const project = await adminService.createProject({
        courseId,
        title,
        description: description || ''
      });

      res.status(201).json({ success: true, data: project, message: 'Project created successfully' });
    } catch (error: any) {
      if (error.message && error.message.includes('Foreign key constraint')) {
        res.status(400).json({ success: false, message: 'Khóa học không tồn tại. Vui lòng kiểm tra lại courseId.' });
        return;
      }
      next(error);
    }
  };

  updateProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const project = await adminService.updateProject(id, req.body);
      res.json({ success: true, data: project, message: 'Project updated successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  deleteProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await adminService.deleteProject(id);
      res.json({ success: true, message: 'Project deleted successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  approveProjectSubmission = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await adminService.approveProjectSubmission(id);
      res.json({ success: true, data: result, message: 'Project submission approved' });
    } catch (error: any) {
      next(error);
    }
  };

  rejectProjectSubmission = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const result = await adminService.rejectProjectSubmission(id, reason);
      res.json({ success: true, data: result, message: 'Project submission rejected' });
    } catch (error: any) {
      next(error);
    }
  };

  // ============ Lesson Requests (Admin duyệt) ============
  getLessonRequestById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = await adminService.getLessonRequestById(id);
      if (!data) {
        res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu' });
        return;
      }
      res.json({ success: true, data });
    } catch (error: any) {
      next(error);
    }
  };

  getAllLessonRequests = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requests = await adminService.getAllLessonRequests();
      res.json({ success: true, data: requests });
    } catch (error: any) {
      next(error);
    }
  };

  deleteLessonRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await adminService.deleteLessonRequest(id);
      res.json({ success: true, message: 'Đã xóa yêu cầu' });
    } catch (error: any) {
      next(error);
    }
  };

  approveLessonRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await adminService.approveLessonRequest(id);
      res.json({ success: true, data: result, message: 'Lesson request approved successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  rejectLessonRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const result = await adminService.rejectLessonRequest(id, reason);
      res.json({ success: true, data: result, message: 'Lesson request rejected' });
    } catch (error: any) {
      next(error);
    }
  };
}

export default new AdminController();
