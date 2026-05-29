"use strict";
/**
 * @fileoverview Controller cho Admin module
 * @module admin/controllers
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_service_1 = __importDefault(require("../services/admin.service"));
class AdminController {
    strParam(val) {
        return Array.isArray(val) ? val[0] : (val || '');
    }
    // ============ Dashboard ============
    getDashboardStats = async (req, res, next) => {
        try {
            const stats = await admin_service_1.default.getDashboardStats();
            res.json({ success: true, data: stats });
        }
        catch (error) {
            next(error);
        }
    };
    // ============ Users ============
    getAllUsers = async (req, res, next) => {
        try {
            const { role } = req.query;
            const users = await admin_service_1.default.getAllUsers(role);
            res.json({ success: true, data: users });
        }
        catch (error) {
            next(error);
        }
    };
    getUserById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const user = await admin_service_1.default.getUserById(id);
            if (!user) {
                res.status(404).json({ success: false, message: 'User not found' });
                return;
            }
            res.json({ success: true, data: user });
        }
        catch (error) {
            next(error);
        }
    };
    updateUser = async (req, res, next) => {
        try {
            const id = req.params.id;
            console.log('Update user request:', { id, body: req.body });
            const user = await admin_service_1.default.updateUser(id, req.body);
            console.log('Updated user:', user);
            res.json({ success: true, data: user, message: 'User updated successfully' });
        }
        catch (error) {
            next(error);
        }
    };
    deleteUser = async (req, res, next) => {
        try {
            const id = req.params.id;
            await admin_service_1.default.deleteUser(id);
            res.json({ success: true, message: 'User deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    };
    // ============ Courses ============
    getAllCourses = async (req, res, next) => {
        try {
            const courses = await admin_service_1.default.getAllCourses();
            res.json({ success: true, data: courses });
        }
        catch (error) {
            next(error);
        }
    };
    getCourseById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const course = await admin_service_1.default.getCourseById(id);
            if (!course) {
                res.status(404).json({ success: false, message: 'Course not found' });
                return;
            }
            res.json({ success: true, data: course });
        }
        catch (error) {
            next(error);
        }
    };
    createCourse = async (req, res, next) => {
        try {
            const course = await admin_service_1.default.createCourse(req.body);
            res.status(201).json({ success: true, data: course, message: 'Course created successfully' });
        }
        catch (error) {
            next(error);
        }
    };
    updateCourse = async (req, res, next) => {
        try {
            const id = req.params.id;
            const course = await admin_service_1.default.updateCourse(id, req.body);
            res.json({ success: true, data: course, message: 'Course updated successfully' });
        }
        catch (error) {
            next(error);
        }
    };
    deleteCourse = async (req, res, next) => {
        try {
            const id = req.params.id;
            await admin_service_1.default.deleteCourse(id);
            res.json({ success: true, message: 'Course deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    };
    // ============ Payments ============
    getAllPayments = async (req, res, next) => {
        try {
            const payments = await admin_service_1.default.getAllPayments();
            res.json({ success: true, data: payments });
        }
        catch (error) {
            next(error);
        }
    };
    getPaymentStats = async (req, res, next) => {
        try {
            const stats = await admin_service_1.default.getPaymentStats();
            res.json({ success: true, data: stats });
        }
        catch (error) {
            next(error);
        }
    };
    getRevenueByMonth = async (req, res, next) => {
        try {
            const revenue = await admin_service_1.default.getRevenueByMonth();
            res.json({ success: true, data: revenue });
        }
        catch (error) {
            next(error);
        }
    };
    cancelPayment = async (req, res, next) => {
        try {
            const id = req.params.id;
            const payment = await admin_service_1.default.cancelPayment(id);
            res.json({ success: true, data: payment, message: 'Payment cancelled successfully' });
        }
        catch (error) {
            next(error);
        }
    };
    // ============ Activate Codes ============
    getAllActivateCodes = async (req, res, next) => {
        try {
            const codes = await admin_service_1.default.getAllActivateCodes();
            res.json({ success: true, data: codes });
        }
        catch (error) {
            next(error);
        }
    };
    createActivateCode = async (req, res, next) => {
        try {
            const { courseId } = req.body;
            const createdBy = req.user?.userId;
            if (!courseId) {
                res.status(400).json({ success: false, message: 'courseId is required' });
                return;
            }
            const code = await admin_service_1.default.createActivateCode(courseId, createdBy);
            res.status(201).json({ success: true, data: code, message: 'Activate code created successfully' });
        }
        catch (error) {
            next(error);
        }
    };
    deleteActivateCode = async (req, res, next) => {
        try {
            const id = req.params.id;
            await admin_service_1.default.deleteActivateCode(id);
            res.json({ success: true, message: 'Activate code deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    };
    // ============ Enrollments ============
    getAllEnrollments = async (req, res, next) => {
        try {
            const enrollments = await admin_service_1.default.getAllEnrollments();
            res.json({ success: true, data: enrollments });
        }
        catch (error) {
            next(error);
        }
    };
    // ============ Phases (Chương học) ============
    getAllPhases = async (req, res, next) => {
        try {
            const { courseId } = req.query;
            const phases = courseId
                ? await admin_service_1.default.getPhasesByCourse(courseId)
                : await admin_service_1.default.getAllPhases();
            res.json({ success: true, data: phases });
        }
        catch (error) {
            next(error);
        }
    };
    getPhaseById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const phases = await admin_service_1.default.getPhasesByCourse(id);
            res.json({ success: true, data: phases });
        }
        catch (error) {
            next(error);
        }
    };
    createPhase = async (req, res, next) => {
        try {
            const { courseId, title } = req.body;
            if (!courseId || !title) {
                res.status(400).json({ success: false, message: 'courseId and title are required' });
                return;
            }
            const phase = await admin_service_1.default.createPhase({ courseId, title });
            res.status(201).json({ success: true, data: phase, message: 'Phase created successfully' });
        }
        catch (error) {
            next(error);
        }
    };
    updatePhase = async (req, res, next) => {
        try {
            const id = req.params.id;
            const phase = await admin_service_1.default.updatePhase(id, req.body);
            res.json({ success: true, data: phase, message: 'Phase updated successfully' });
        }
        catch (error) {
            next(error);
        }
    };
    deletePhase = async (req, res, next) => {
        try {
            const id = req.params.id;
            await admin_service_1.default.deletePhase(id);
            res.json({ success: true, message: 'Phase deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    };
    // ============ Lessons (Bài học) ============
    getAllLessons = async (req, res, next) => {
        try {
            const { phaseId } = req.query;
            const lessons = phaseId
                ? await admin_service_1.default.getLessonsByPhase(phaseId)
                : await admin_service_1.default.getAllLessons();
            res.json({ success: true, data: lessons });
        }
        catch (error) {
            next(error);
        }
    };
    getLessonById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const lesson = await admin_service_1.default.getLessonById(id);
            if (!lesson) {
                res.status(404).json({ success: false, message: 'Lesson not found' });
                return;
            }
            res.json({ success: true, data: lesson });
        }
        catch (error) {
            next(error);
        }
    };
    createLesson = async (req, res, next) => {
        try {
            const { phaseId, title, content, type, orderIndex } = req.body;
            if (!phaseId || !title || !content) {
                res.status(400).json({ success: false, message: 'phaseId, title, and content are required' });
                return;
            }
            const lesson = await admin_service_1.default.createLesson({ phaseId, title, content, type, orderIndex });
            res.status(201).json({ success: true, data: lesson, message: 'Lesson created successfully' });
        }
        catch (error) {
            next(error);
        }
    };
    updateLesson = async (req, res, next) => {
        try {
            const id = req.params.id;
            const lesson = await admin_service_1.default.updateLesson(id, req.body);
            res.json({ success: true, data: lesson, message: 'Lesson updated successfully' });
        }
        catch (error) {
            next(error);
        }
    };
    deleteLesson = async (req, res, next) => {
        try {
            const id = req.params.id;
            await admin_service_1.default.deleteLesson(id);
            res.json({ success: true, message: 'Lesson deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    };
    // ============ Testcases (cho bài học code) ============
    getTestcasesByLesson = async (req, res, next) => {
        try {
            const { lessonId } = req.params;
            const testcases = await admin_service_1.default.getTestcasesByLesson(lessonId);
            res.json({ success: true, data: testcases });
        }
        catch (error) {
            next(error);
        }
    };
    createTestcase = async (req, res, next) => {
        try {
            const { lessonId } = req.params;
            const { input, expectedOutput, isHidden, points } = req.body;
            if (!input || !expectedOutput) {
                res.status(400).json({ success: false, message: 'input and expectedOutput are required' });
                return;
            }
            const testcase = await admin_service_1.default.createTestcase({
                lessonId,
                input,
                expectedOutput,
                isHidden: isHidden ?? false,
                points: points ?? 10
            });
            res.status(201).json({ success: true, data: testcase, message: 'Testcase created successfully' });
        }
        catch (error) {
            next(error);
        }
    };
    updateTestcase = async (req, res, next) => {
        try {
            const id = req.params.id;
            const testcase = await admin_service_1.default.updateTestcase(id, req.body);
            res.json({ success: true, data: testcase, message: 'Testcase updated successfully' });
        }
        catch (error) {
            next(error);
        }
    };
    deleteTestcase = async (req, res, next) => {
        try {
            const id = req.params.id;
            await admin_service_1.default.deleteTestcase(id);
            res.json({ success: true, message: 'Testcase deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    };
    // ============ Lecture Course Assignment ============
    getLectureCourses = async (req, res, next) => {
        try {
            const { lectureId } = req.params;
            const courses = await admin_service_1.default.getLectureCourses(lectureId);
            res.json({ success: true, data: courses });
        }
        catch (error) {
            next(error);
        }
    };
    assignCourseToLecture = async (req, res, next) => {
        try {
            const { lectureId, courseId } = req.params;
            const assignedBy = req.user?.userId;
            console.log('[ADMIN CONTROLLER] assignCourseToLecture called:', { lectureId, courseId, assignedBy });
            const result = await admin_service_1.default.assignCourseToLecture(lectureId, courseId, assignedBy);
            res.status(201).json({ success: true, data: result, message: 'Course assigned to lecture successfully' });
        }
        catch (error) {
            next(error);
        }
    };
    unassignCourseFromLecture = async (req, res, next) => {
        try {
            const { lectureId, courseId } = req.params;
            await admin_service_1.default.unassignCourseFromLecture(lectureId, courseId);
            res.json({ success: true, message: 'Course unassigned from lecture successfully' });
        }
        catch (error) {
            next(error);
        }
    };
    // ============ Instructor Detail (Assignment Overview) ============
    getInstructorDetail = async (req, res, next) => {
        try {
            const { lectureId } = req.params;
            const detail = await admin_service_1.default.getInstructorDetail(lectureId);
            res.json({ success: true, data: detail });
        }
        catch (error) {
            if (error.message === 'Instructor not found') {
                res.status(404).json({ success: false, message: 'Instructor not found' });
                return;
            }
            next(error);
        }
    };
    // ============ Get Lectures by Course ============
    getLecturesByCourse = async (req, res, next) => {
        try {
            const courseId = req.params.courseId;
            const lectures = await admin_service_1.default.getLecturesByCourse(courseId);
            res.json({ success: true, data: lectures });
        }
        catch (error) {
            next(error);
        }
    };
    // ============ Minitests (Admin) ============
    getAllMinitests = async (req, res, next) => {
        try {
            const minitests = await admin_service_1.default.getAllMinitests();
            res.json({ success: true, data: minitests });
        }
        catch (error) {
            next(error);
        }
    };
    getMinitestById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const minitest = await admin_service_1.default.getMinitestById(id);
            if (!minitest) {
                res.status(404).json({ success: false, message: 'Minitest not found' });
                return;
            }
            res.json({ success: true, data: minitest });
        }
        catch (error) {
            next(error);
        }
    };
    createMinitest = async (req, res, next) => {
        try {
            const { phaseId, title, questionIds } = req.body;
            if (!phaseId || !title) {
                res.status(400).json({ success: false, message: 'phaseId and title are required' });
                return;
            }
            const minitest = await admin_service_1.default.createMinitest({ phaseId, title, questionIds });
            res.status(201).json({ success: true, data: minitest, message: 'Minitest created successfully' });
        }
        catch (error) {
            next(error);
        }
    };
    updateMinitest = async (req, res, next) => {
        try {
            const id = req.params.id;
            const minitest = await admin_service_1.default.updateMinitest(id, req.body);
            res.json({ success: true, data: minitest, message: 'Minitest updated successfully' });
        }
        catch (error) {
            next(error);
        }
    };
    deleteMinitest = async (req, res, next) => {
        try {
            const id = req.params.id;
            await admin_service_1.default.deleteMinitest(id);
            res.json({ success: true, message: 'Minitest deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    };
    // ============ Minitest Stats (Admin) ============
    getMinitestStats = async (req, res, next) => {
        try {
            const stats = await admin_service_1.default.getMinitestStats();
            res.json({ success: true, data: stats });
        }
        catch (error) {
            next(error);
        }
    };
    getMinitestSubmissions = async (req, res, next) => {
        try {
            const { minitestId } = req.params;
            const submissions = await admin_service_1.default.getMinitestSubmissions(minitestId);
            res.json({ success: true, data: submissions });
        }
        catch (error) {
            next(error);
        }
    };
    // ============ Problems (Admin) ============
    getAllProblems = async (req, res, next) => {
        try {
            const problems = await admin_service_1.default.getAllProblems();
            res.json({ success: true, data: problems });
        }
        catch (error) {
            next(error);
        }
    };
    getProblemsByCourseId = async (req, res, next) => {
        try {
            const courseId = req.params.courseId;
            if (!courseId) {
                res.status(400).json({ success: false, message: 'courseId is required' });
                return;
            }
            const problems = await admin_service_1.default.getProblemsByCourseId(courseId);
            res.json({ success: true, data: problems });
        }
        catch (error) {
            next(error);
        }
    };
    createProblem = async (req, res, next) => {
        try {
            const { title, description, difficulty, testcases, hackathonId } = req.body;
            if (!title || !description) {
                res.status(400).json({ success: false, message: 'title and description are required' });
                return;
            }
            const problem = await admin_service_1.default.createProblem({ title, description, difficulty, testcases, hackathonId });
            res.status(201).json({ success: true, data: problem, message: 'Problem created successfully' });
        }
        catch (error) {
            next(error);
        }
    };
    updateProblem = async (req, res, next) => {
        try {
            const id = req.params.id;
            const problem = await admin_service_1.default.updateProblem(id, req.body);
            res.json({ success: true, data: problem, message: 'Problem updated successfully' });
        }
        catch (error) {
            next(error);
        }
    };
    deleteProblem = async (req, res, next) => {
        try {
            const id = req.params.id;
            await admin_service_1.default.deleteProblem(id);
            res.json({ success: true, message: 'Problem deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    };
    addProblemToHackathon = async (req, res, next) => {
        try {
            const { problemId } = req.body;
            const { hackathonId } = req.params;
            if (!problemId || !hackathonId) {
                res.status(400).json({ success: false, message: 'problemId and hackathonId are required' });
                return;
            }
            const problem = await admin_service_1.default.addProblemToHackathon(problemId, hackathonId);
            res.json({ success: true, data: problem, message: 'Problem added to hackathon successfully' });
        }
        catch (error) {
            next(error);
        }
    };
    removeProblemFromHackathon = async (req, res, next) => {
        try {
            const { problemId } = req.params;
            const problem = await admin_service_1.default.removeProblemFromHackathon(problemId);
            res.json({ success: true, data: problem, message: 'Problem removed from hackathon successfully' });
        }
        catch (error) {
            next(error);
        }
    };
    // ============ Hackathons / Final Tests (Admin) ============
    getAllHackathons = async (req, res, next) => {
        try {
            const hackathons = await admin_service_1.default.getAllHackathons();
            res.json({ success: true, data: hackathons });
        }
        catch (error) {
            next(error);
        }
    };
    getHackathonById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const hackathon = await admin_service_1.default.getHackathonById(id);
            if (!hackathon) {
                res.status(404).json({ success: false, message: 'Hackathon not found' });
                return;
            }
            res.json({ success: true, data: hackathon });
        }
        catch (error) {
            next(error);
        }
    };
    createHackathon = async (req, res, next) => {
        try {
            const { courseId, lessonId, title, description, startTime, endTime, durationMinutes, maxParticipants, imageUrl, lessonIds, problems } = req.body;
            if (!title) {
                res.status(400).json({ success: false, message: 'title is required' });
                return;
            }
            const hackathon = await admin_service_1.default.createHackathon({
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
        }
        catch (error) {
            next(error);
        }
    };
    updateHackathon = async (req, res, next) => {
        try {
            const id = req.params.id;
            const hackathon = await admin_service_1.default.updateHackathon(id, req.body);
            res.json({ success: true, data: hackathon, message: 'Hackathon updated successfully' });
        }
        catch (error) {
            next(error);
        }
    };
    deleteHackathon = async (req, res, next) => {
        try {
            const id = req.params.id;
            await admin_service_1.default.deleteHackathon(id);
            res.json({ success: true, message: 'Hackathon deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    };
    // ============ Projects / Final Projects (Admin) ============
    getAllProjects = async (req, res, next) => {
        try {
            const projects = await admin_service_1.default.getAllProjects();
            res.json({ success: true, data: projects });
        }
        catch (error) {
            next(error);
        }
    };
    getProjectById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const project = await admin_service_1.default.getProjectById(id);
            if (!project) {
                res.status(404).json({ success: false, message: 'Project not found' });
                return;
            }
            res.json({ success: true, data: project });
        }
        catch (error) {
            next(error);
        }
    };
    createProject = async (req, res, next) => {
        try {
            const { courseId, title, description } = req.body;
            if (!courseId || !title) {
                res.status(400).json({ success: false, message: 'courseId and title are required' });
                return;
            }
            const project = await admin_service_1.default.createProject({
                courseId,
                title,
                description: description || ''
            });
            res.status(201).json({ success: true, data: project, message: 'Project created successfully' });
        }
        catch (error) {
            if (error.message && error.message.includes('Foreign key constraint')) {
                res.status(400).json({ success: false, message: 'Khóa học không tồn tại. Vui lòng kiểm tra lại courseId.' });
                return;
            }
            next(error);
        }
    };
    updateProject = async (req, res, next) => {
        try {
            const id = req.params.id;
            const project = await admin_service_1.default.updateProject(id, req.body);
            res.json({ success: true, data: project, message: 'Project updated successfully' });
        }
        catch (error) {
            next(error);
        }
    };
    deleteProject = async (req, res, next) => {
        try {
            const id = req.params.id;
            await admin_service_1.default.deleteProject(id);
            res.json({ success: true, message: 'Project deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    };
    approveProjectSubmission = async (req, res, next) => {
        try {
            const id = req.params.id;
            const result = await admin_service_1.default.approveProjectSubmission(id);
            res.json({ success: true, data: result, message: 'Project submission approved' });
        }
        catch (error) {
            next(error);
        }
    };
    rejectProjectSubmission = async (req, res, next) => {
        try {
            const id = req.params.id;
            const { reason } = req.body;
            const result = await admin_service_1.default.rejectProjectSubmission(id, reason);
            res.json({ success: true, data: result, message: 'Project submission rejected' });
        }
        catch (error) {
            next(error);
        }
    };
    // ============ Lesson Requests (Admin duyệt) ============
    getLessonRequestById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const data = await admin_service_1.default.getLessonRequestById(id);
            if (!data) {
                res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu' });
                return;
            }
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    };
    getAllLessonRequests = async (req, res, next) => {
        try {
            const requests = await admin_service_1.default.getAllLessonRequests();
            res.json({ success: true, data: requests });
        }
        catch (error) {
            next(error);
        }
    };
    deleteLessonRequest = async (req, res, next) => {
        try {
            const id = req.params.id;
            await admin_service_1.default.deleteLessonRequest(id);
            res.json({ success: true, message: 'Đã xóa yêu cầu' });
        }
        catch (error) {
            next(error);
        }
    };
    approveLessonRequest = async (req, res, next) => {
        try {
            const id = req.params.id;
            const result = await admin_service_1.default.approveLessonRequest(id);
            res.json({ success: true, data: result, message: 'Lesson request approved successfully' });
        }
        catch (error) {
            next(error);
        }
    };
    rejectLessonRequest = async (req, res, next) => {
        try {
            const id = req.params.id;
            const { reason } = req.body;
            const result = await admin_service_1.default.rejectLessonRequest(id, reason);
            res.json({ success: true, data: result, message: 'Lesson request rejected' });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = new AdminController();
//# sourceMappingURL=admin.controller.js.map