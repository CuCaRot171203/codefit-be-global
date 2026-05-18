/**
 * Controller xử lý các HTTP requests liên quan đến Hackathon
 * @module HackathonController
 */
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../base/base.controller';
/**
 * Controller class xử lý các HTTP requests cho hackathon
 * Kế thừa từ BaseController để sử dụng các phương thức response chuẩn
 * @class HackathonController
 */
declare class HackathonController extends BaseController {
    /**
     * Constructor khởi tạo controller với hackathon service
     */
    constructor();
    /**
     * Tạo mới một hackathon
     * POST /hackathons
     * @param req - Express Request object
     * @param res - Express Response object
     * @param next - Express NextFunction
     */
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy thông tin hackathon theo ID
     * GET /hackathons/:id
     * @param req - Express Request object (chứa id trong params)
     * @param res - Express Response object
     * @param next - Express NextFunction
     */
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy danh sách hackathon đang diễn ra
     * GET /hackathons/active
     * @param req - Express Request object
     * @param res - Express Response object
     * @param next - Express NextFunction
     */
    getActive: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy danh sách hackathon sắp diễn ra
     * GET /hackathons/upcoming
     * @param req - Express Request object
     * @param res - Express Response object
     * @param next - Express NextFunction
     */
    getUpcoming: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy danh sách hackathon đã kết thúc
     * GET /hackathons/ended
     * @param req - Express Request object
     * @param res - Express Response object
     * @param next - Express NextFunction
     */
    getEnded: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy danh sách hackathon đã đăng ký của user hiện tại
     * GET /hackathons/registered
     * @param req - Express Request object
     * @param res - Express Response object
     * @param next - Express NextFunction
     */
    getRegistered: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy bảng xếp hạng của một hackathon
     * GET /hackathons/:id/leaderboard
     * @param req - Express Request object
     * @param res - Express Response object
     * @param next - Express NextFunction
     */
    getLeaderboard: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Tham gia một hackathon
     * POST /hackathons/:id/join
     * @param req - Express Request object (chứa id trong params, teamName trong body)
     * @param res - Express Response object
     * @param next - Express NextFunction
     */
    join: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy danh sách người tham gia của một hackathon
     * GET /hackathons/:id/participants
     * @param req - Express Request object (chứa id trong params)
     * @param res - Express Response object
     * @param next - Express NextFunction
     */
    getParticipants: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Nộp dự án tham gia hackathon
     * POST /hackathons/:id/submit
     * @param req - Express Request object (chứa id trong params, project info trong body)
     * @param res - Express Response object
     * @param next - Express NextFunction
     */
    submitProject: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy danh sách bài nộp của một hackathon
     * GET /hackathons/:id/submissions
     * @param req - Express Request object (chứa id trong params)
     * @param res - Express Response object
     * @param next - Express NextFunction
     */
    getSubmissions: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Chấm điểm một bài nộp
     * PUT /hackathons/submissions/:submissionId/grade
     * @param req - Express Request object (chứa submissionId trong params, score trong body)
     * @param res - Express Response object
     * @param next - Express NextFunction
     */
    gradeSubmission: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy danh sách bài problem của hackathon
     * GET /hackathons/:id/problems
     */
    getProblems: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Chạy code bài trong hackathon (preview, không lưu)
     * POST /hackathons/:id/run-problem
     */
    runProblem: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Nộp code bài trong hackathon (chấm điểm + lưu)
     * POST /hackathons/:id/submit-problem
     */
    submitProblem: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: HackathonController;
export default _default;
//# sourceMappingURL=hackathon.controller.d.ts.map