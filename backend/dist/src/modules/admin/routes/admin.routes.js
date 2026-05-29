"use strict";
/**
 * @fileoverview Routes cho Admin module
 * @module admin/routes
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = __importDefault(require("../controllers/admin.controller"));
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Apply auth and admin middleware to all admin routes
router.use(auth_middleware_1.verifyToken);
router.use(auth_middleware_1.requireAdmin);
// ============ Dashboard ============
router.get('/dashboard/stats', admin_controller_1.default.getDashboardStats);
// ============ Users ============
router.get('/users', admin_controller_1.default.getAllUsers);
router.get('/users/:id', admin_controller_1.default.getUserById);
router.put('/users/:id', admin_controller_1.default.updateUser);
router.delete('/users/:id', admin_controller_1.default.deleteUser);
// ============ Lecture Course Assignment ============
router.get('/lectures/:lectureId/courses', admin_controller_1.default.getLectureCourses);
router.post('/lectures/:lectureId/courses/:courseId', admin_controller_1.default.assignCourseToLecture);
router.delete('/lectures/:lectureId/courses/:courseId', admin_controller_1.default.unassignCourseFromLecture);
// ============ Get Lectures by Course ============
router.get('/courses/:courseId/lectures', admin_controller_1.default.getLecturesByCourse);
// ============ Instructor Detail (Assignment Overview) ============
// Public endpoint for testing - in production, add auth middleware
router.get('/lectures/:lectureId/detail', admin_controller_1.default.getInstructorDetail);
// ============ Courses ============
router.get('/courses', admin_controller_1.default.getAllCourses);
router.get('/courses/:id', admin_controller_1.default.getCourseById);
router.post('/courses', admin_controller_1.default.createCourse);
router.put('/courses/:id', admin_controller_1.default.updateCourse);
router.delete('/courses/:id', admin_controller_1.default.deleteCourse);
// ============ Payments ============
router.get('/payments', admin_controller_1.default.getAllPayments);
router.get('/payments/stats', admin_controller_1.default.getPaymentStats);
router.get('/payments/revenue', admin_controller_1.default.getRevenueByMonth);
router.patch('/payments/:id/cancel', admin_controller_1.default.cancelPayment);
// ============ Activate Codes ============
router.get('/activate-codes', admin_controller_1.default.getAllActivateCodes);
router.post('/activate-codes', admin_controller_1.default.createActivateCode);
router.delete('/activate-codes/:id', admin_controller_1.default.deleteActivateCode);
// ============ Enrollments ============
router.get('/enrollments', admin_controller_1.default.getAllEnrollments);
// ============ Phases (Chương học) ============
router.get('/phases', admin_controller_1.default.getAllPhases);
router.get('/phases/:id', admin_controller_1.default.getPhaseById);
router.post('/phases', admin_controller_1.default.createPhase);
router.put('/phases/:id', admin_controller_1.default.updatePhase);
router.delete('/phases/:id', admin_controller_1.default.deletePhase);
// ============ Lessons (Bài học) ============
router.get('/lessons', admin_controller_1.default.getAllLessons);
router.get('/lessons/:id', admin_controller_1.default.getLessonById);
router.post('/lessons', admin_controller_1.default.createLesson);
router.put('/lessons/:id', admin_controller_1.default.updateLesson);
router.delete('/lessons/:id', admin_controller_1.default.deleteLesson);
// ============ Testcases (cho bài học code) ============
router.get('/lessons/:lessonId/testcases', admin_controller_1.default.getTestcasesByLesson);
router.post('/lessons/:lessonId/testcases', admin_controller_1.default.createTestcase);
router.put('/testcases/:id', admin_controller_1.default.updateTestcase);
router.delete('/testcases/:id', admin_controller_1.default.deleteTestcase);
// ============ Minitests (Admin) ============
router.get('/minitests/stats', admin_controller_1.default.getMinitestStats);
router.get('/minitests', admin_controller_1.default.getAllMinitests);
router.get('/minitests/:id', admin_controller_1.default.getMinitestById);
router.get('/minitests/:minitestId/submissions', admin_controller_1.default.getMinitestSubmissions);
router.post('/minitests', admin_controller_1.default.createMinitest);
router.put('/minitests/:id', admin_controller_1.default.updateMinitest);
router.delete('/minitests/:id', admin_controller_1.default.deleteMinitest);
// ============ Problems (Admin) ============
router.get('/problems', admin_controller_1.default.getAllProblems);
router.get('/courses/:courseId/problems', admin_controller_1.default.getProblemsByCourseId);
router.post('/problems', admin_controller_1.default.createProblem);
router.put('/problems/:id', admin_controller_1.default.updateProblem);
router.delete('/problems/:id', admin_controller_1.default.deleteProblem);
router.post('/hackathons/:hackathonId/problems', admin_controller_1.default.addProblemToHackathon);
router.delete('/hackathons/:hackathonId/problems/:problemId', admin_controller_1.default.removeProblemFromHackathon);
// ============ Hackathons / Final Tests (Admin) ============
router.get('/hackathons', admin_controller_1.default.getAllHackathons);
router.get('/hackathons/:id', admin_controller_1.default.getHackathonById);
router.post('/hackathons', admin_controller_1.default.createHackathon);
router.put('/hackathons/:id', admin_controller_1.default.updateHackathon);
router.delete('/hackathons/:id', admin_controller_1.default.deleteHackathon);
// ============ Projects / Final Projects (Admin) ============
router.get('/projects', admin_controller_1.default.getAllProjects);
router.get('/projects/:id', admin_controller_1.default.getProjectById);
router.post('/projects', admin_controller_1.default.createProject);
router.put('/projects/:id', admin_controller_1.default.updateProject);
router.delete('/projects/:id', admin_controller_1.default.deleteProject);
router.put('/projects/:id/approve', admin_controller_1.default.approveProjectSubmission);
router.put('/projects/:id/reject', admin_controller_1.default.rejectProjectSubmission);
// ============ Lesson Requests (Admin duyệt) ============
router.get('/lesson-requests', admin_controller_1.default.getAllLessonRequests);
router.get('/lesson-requests/:id', admin_controller_1.default.getLessonRequestById);
router.delete('/lesson-requests/:id', admin_controller_1.default.deleteLessonRequest);
router.put('/lesson-requests/:id/approve', admin_controller_1.default.approveLessonRequest);
router.put('/lesson-requests/:id/reject', admin_controller_1.default.rejectLessonRequest);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map