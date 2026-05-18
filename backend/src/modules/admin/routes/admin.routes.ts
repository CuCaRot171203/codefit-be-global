/**
 * @fileoverview Routes cho Admin module
 * @module admin/routes
 */

import { Router } from 'express';
import adminController from '../controllers/admin.controller';
import { verifyToken, requireAdmin } from '../../../middleware/auth.middleware';

const router = Router();

// Apply auth and admin middleware to all admin routes
router.use(verifyToken);
router.use(requireAdmin);

// ============ Dashboard ============
router.get('/dashboard/stats', adminController.getDashboardStats);

// ============ Users ============
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// ============ Lecture Course Assignment ============
router.get('/lectures/:lectureId/courses', adminController.getLectureCourses);
router.post('/lectures/:lectureId/courses/:courseId', adminController.assignCourseToLecture);
router.delete('/lectures/:lectureId/courses/:courseId', adminController.unassignCourseFromLecture);

// ============ Get Lectures by Course ============
router.get('/courses/:courseId/lectures', adminController.getLecturesByCourse);

// ============ Instructor Detail (Assignment Overview) ============
// Public endpoint for testing - in production, add auth middleware
router.get('/lectures/:lectureId/detail', adminController.getInstructorDetail);

// ============ Courses ============
router.get('/courses', adminController.getAllCourses);
router.get('/courses/:id', adminController.getCourseById);
router.post('/courses', adminController.createCourse);
router.put('/courses/:id', adminController.updateCourse);
router.delete('/courses/:id', adminController.deleteCourse);

// ============ Payments ============
router.get('/payments', adminController.getAllPayments);
router.get('/payments/stats', adminController.getPaymentStats);
router.get('/payments/revenue', adminController.getRevenueByMonth);
router.patch('/payments/:id/cancel', adminController.cancelPayment);

// ============ Activate Codes ============
router.get('/activate-codes', adminController.getAllActivateCodes);
router.post('/activate-codes', adminController.createActivateCode);
router.delete('/activate-codes/:id', adminController.deleteActivateCode);

// ============ Enrollments ============
router.get('/enrollments', adminController.getAllEnrollments);

// ============ Phases (Chương học) ============
router.get('/phases', adminController.getAllPhases);
router.get('/phases/:id', adminController.getPhaseById);
router.post('/phases', adminController.createPhase);
router.put('/phases/:id', adminController.updatePhase);
router.delete('/phases/:id', adminController.deletePhase);

// ============ Lessons (Bài học) ============
router.get('/lessons', adminController.getAllLessons);
router.get('/lessons/:id', adminController.getLessonById);
router.post('/lessons', adminController.createLesson);
router.put('/lessons/:id', adminController.updateLesson);
router.delete('/lessons/:id', adminController.deleteLesson);

// ============ Testcases (cho bài học code) ============
router.get('/lessons/:lessonId/testcases', adminController.getTestcasesByLesson);
router.post('/lessons/:lessonId/testcases', adminController.createTestcase);
router.put('/testcases/:id', adminController.updateTestcase);
router.delete('/testcases/:id', adminController.deleteTestcase);

// ============ Minitests (Admin) ============
router.get('/minitests/stats', adminController.getMinitestStats);
router.get('/minitests', adminController.getAllMinitests);
router.get('/minitests/:id', adminController.getMinitestById);
router.get('/minitests/:minitestId/submissions', adminController.getMinitestSubmissions);
router.post('/minitests', adminController.createMinitest);
router.put('/minitests/:id', adminController.updateMinitest);
router.delete('/minitests/:id', adminController.deleteMinitest);

// ============ Problems (Admin) ============
router.get('/problems', adminController.getAllProblems);
router.get('/courses/:courseId/problems', adminController.getProblemsByCourseId);
router.post('/problems', adminController.createProblem);
router.put('/problems/:id', adminController.updateProblem);
router.delete('/problems/:id', adminController.deleteProblem);
router.post('/hackathons/:hackathonId/problems', adminController.addProblemToHackathon);
router.delete('/hackathons/:hackathonId/problems/:problemId', adminController.removeProblemFromHackathon);

// ============ Hackathons / Final Tests (Admin) ============
router.get('/hackathons', adminController.getAllHackathons);
router.get('/hackathons/:id', adminController.getHackathonById);
router.post('/hackathons', adminController.createHackathon);
router.put('/hackathons/:id', adminController.updateHackathon);
router.delete('/hackathons/:id', adminController.deleteHackathon);

// ============ Projects / Final Projects (Admin) ============
router.get('/projects', adminController.getAllProjects);
router.get('/projects/:id', adminController.getProjectById);
router.post('/projects', adminController.createProject);
router.put('/projects/:id', adminController.updateProject);
router.delete('/projects/:id', adminController.deleteProject);
router.put('/projects/:id/approve', adminController.approveProjectSubmission);
router.put('/projects/:id/reject', adminController.rejectProjectSubmission);

// ============ Lesson Requests (Admin duyệt) ============
router.get('/lesson-requests', adminController.getAllLessonRequests);
router.get('/lesson-requests/:id', adminController.getLessonRequestById);
router.delete('/lesson-requests/:id', adminController.deleteLessonRequest);
router.put('/lesson-requests/:id/approve', adminController.approveLessonRequest);
router.put('/lesson-requests/:id/reject', adminController.rejectLessonRequest);

export default router;
