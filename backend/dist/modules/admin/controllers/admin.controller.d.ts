/**
 * @fileoverview Controller cho Admin module
 * @module admin/controllers
 */
import { Request, Response, NextFunction } from 'express';
declare class AdminController {
    getDashboardStats: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAllUsers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getUserById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAllCourses: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getCourseById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createCourse: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateCourse: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteCourse: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAllPayments: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getPaymentStats: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getRevenueByMonth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    cancelPayment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAllActivateCodes: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createActivateCode: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteActivateCode: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAllEnrollments: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAllPhases: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getPhaseById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createPhase: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updatePhase: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deletePhase: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAllLessons: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getLessonById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createLesson: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateLesson: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteLesson: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getTestcasesByLesson: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createTestcase: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateTestcase: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteTestcase: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getLectureCourses: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    assignCourseToLecture: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    unassignCourseFromLecture: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getInstructorDetail: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getLecturesByCourse: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAllMinitests: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMinitestById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createMinitest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateMinitest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteMinitest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMinitestStats: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMinitestSubmissions: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAllProblems: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getProblemsByCourseId: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createProblem: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateProblem: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteProblem: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    addProblemToHackathon: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    removeProblemFromHackathon: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAllHackathons: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getHackathonById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createHackathon: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateHackathon: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteHackathon: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAllProjects: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getProjectById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createProject: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateProject: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteProject: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    approveProjectSubmission: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    rejectProjectSubmission: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getLessonRequestById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAllLessonRequests: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteLessonRequest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    approveLessonRequest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    rejectLessonRequest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: AdminController;
export default _default;
//# sourceMappingURL=admin.controller.d.ts.map