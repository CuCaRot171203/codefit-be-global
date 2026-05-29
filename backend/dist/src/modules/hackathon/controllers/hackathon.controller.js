"use strict";
/**
 * Controller xử lý các HTTP requests liên quan đến Hackathon
 * @module HackathonController
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_controller_1 = require("../../../base/base.controller");
const hackathon_service_1 = __importDefault(require("../services/hackathon.service"));
/**
 * Controller class xử lý các HTTP requests cho hackathon
 * Kế thừa từ BaseController để sử dụng các phương thức response chuẩn
 * @class HackathonController
 */
class HackathonController extends base_controller_1.BaseController {
    /**
     * Constructor khởi tạo controller với hackathon service
     */
    constructor() {
        super(hackathon_service_1.default);
    }
    /**
     * Tạo mới một hackathon
     * POST /hackathons
     * @param req - Express Request object
     * @param res - Express Response object
     * @param next - Express NextFunction
     */
    create = async (req, res, next) => {
        try {
            // Bước 1: Lấy userId từ request (đã được xác thực bởi middleware)
            const userId = req.user?.userId;
            // Bước 2: Kiểm tra user đã đăng nhập chưa
            if (!userId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            // Bước 3: Gọi service để tạo hackathon mới
            // Bước 4: Trả về response thành công với status 201
            const hackathon = await this.service.create(userId, req.body);
            this.success(res, hackathon, 'Hackathon created successfully', 201);
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Lấy thông tin hackathon theo ID
     * GET /hackathons/:id
     * @param req - Express Request object (chứa id trong params)
     * @param res - Express Response object
     * @param next - Express NextFunction
     */
    getById = async (req, res, next) => {
        try {
            // Bước 1: Lấy id từ request params
            const { id } = req.params;
            // Bước 2: Gọi service để lấy thông tin hackathon
            const hackathon = await this.service.getById(id);
            // Bước 3: Kiểm tra hackathon có tồn tại không
            if (!hackathon) {
                this.error(res, 'Hackathon not found', 404);
                return;
            }
            // Bước 4: Trả về response thành công
            this.success(res, hackathon, 'Hackathon retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Lấy danh sách hackathon đang diễn ra
     * GET /hackathons/active
     * @param req - Express Request object
     * @param res - Express Response object
     * @param next - Express NextFunction
     */
    getActive = async (req, res, next) => {
        try {
            // Bước 1: Gọi service để lấy danh sách hackathon active
            const hackathons = await this.service.getActive();
            // Bước 2: Trả về response thành công
            this.success(res, hackathons, 'Active hackathons retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Lấy danh sách hackathon sắp diễn ra
     * GET /hackathons/upcoming
     * @param req - Express Request object
     * @param res - Express Response object
     * @param next - Express NextFunction
     */
    getUpcoming = async (req, res, next) => {
        try {
            // Bước 1: Gọi service để lấy danh sách hackathon upcoming
            const hackathons = await this.service.getUpcoming();
            // Bước 2: Trả về response thành công
            this.success(res, hackathons, 'Upcoming hackathons retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Lấy danh sách hackathon đã kết thúc
     * GET /hackathons/ended
     * @param req - Express Request object
     * @param res - Express Response object
     * @param next - Express NextFunction
     */
    getEnded = async (req, res, next) => {
        try {
            const hackathons = await this.service.getEnded();
            this.success(res, hackathons, 'Ended hackathons retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Lấy danh sách hackathon đã đăng ký của user hiện tại
     * GET /hackathons/registered
     * @param req - Express Request object
     * @param res - Express Response object
     * @param next - Express NextFunction
     */
    getRegistered = async (req, res, next) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            const hackathons = await this.service.getRegistered(userId);
            this.success(res, hackathons, 'Registered hackathons retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Lấy bảng xếp hạng của một hackathon
     * GET /hackathons/:id/leaderboard
     * @param req - Express Request object
     * @param res - Express Response object
     * @param next - Express NextFunction
     */
    getLeaderboard = async (req, res, next) => {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            const leaderboard = await this.service.getLeaderboard(id, userId);
            this.success(res, leaderboard, 'Leaderboard retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Tham gia một hackathon
     * POST /hackathons/:id/join
     * @param req - Express Request object (chứa id trong params, teamName trong body)
     * @param res - Express Response object
     * @param next - Express NextFunction
     */
    join = async (req, res, next) => {
        try {
            // Bước 1: Lấy userId từ request (đã được xác thực bởi middleware)
            const userId = req.user?.userId;
            // Bước 2: Kiểm tra user đã đăng nhập chưa
            if (!userId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            // Bước 3: Lấy hackathonId từ params và teamName từ body
            const { id } = req.params;
            const { teamName } = req.body;
            // Bước 4: Gọi service để xử lý tham gia hackathon
            const participant = await this.service.join(id, userId, teamName);
            // Bước 5: Trả về response thành công
            this.success(res, participant, 'Joined hackathon successfully');
        }
        catch (error) {
            // Bước 6: Xử lý lỗi - trả về 404 nếu không tìm thấy, 400 cho các lỗi khác
            const status = error.message.includes('not found') ? 404 : 400;
            this.error(res, error.message, status);
        }
    };
    /**
     * Lấy danh sách người tham gia của một hackathon
     * GET /hackathons/:id/participants
     * @param req - Express Request object (chứa id trong params)
     * @param res - Express Response object
     * @param next - Express NextFunction
     */
    getParticipants = async (req, res, next) => {
        try {
            // Bước 1: Lấy hackathonId từ params
            const { id } = req.params;
            // Bước 2: Gọi service để lấy danh sách participants
            const participants = await this.service.getParticipants(id);
            // Bước 3: Trả về response thành công
            this.success(res, participants, 'Participants retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Nộp dự án tham gia hackathon
     * POST /hackathons/:id/submit
     * @param req - Express Request object (chứa id trong params, project info trong body)
     * @param res - Express Response object
     * @param next - Express NextFunction
     */
    submitProject = async (req, res, next) => {
        try {
            // Bước 1: Lấy userId từ request (đã được xác thực bởi middleware)
            const userId = req.user?.userId;
            // Bước 2: Kiểm tra user đã đăng nhập chưa
            if (!userId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            // Bước 3: Lấy hackathonId từ params
            const { id } = req.params;
            // Bước 4: Gọi service để xử lý nộp dự án
            const submission = await this.service.submitProject(id, userId, req.body);
            // Bước 5: Trả về response thành công với status 201
            this.success(res, submission, 'Project submitted successfully', 201);
        }
        catch (error) {
            // Bước 6: Xử lý lỗi - trả về 404 nếu không tìm thấy, 400 cho các lỗi khác
            const status = error.message.includes('not found') ? 404 : 400;
            this.error(res, error.message, status);
        }
    };
    /**
     * Lấy danh sách bài nộp của một hackathon
     * GET /hackathons/:id/submissions
     * @param req - Express Request object (chứa id trong params)
     * @param res - Express Response object
     * @param next - Express NextFunction
     */
    getSubmissions = async (req, res, next) => {
        try {
            // Bước 1: Lấy hackathonId từ params
            const { id } = req.params;
            // Bước 2: Gọi service để lấy danh sách submissions
            const submissions = await this.service.getSubmissions(id);
            // Bước 3: Trả về response thành công
            this.success(res, submissions, 'Submissions retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Chấm điểm một bài nộp
     * PUT /hackathons/submissions/:submissionId/grade
     * @param req - Express Request object (chứa submissionId trong params, score trong body)
     * @param res - Express Response object
     * @param next - Express NextFunction
     */
    gradeSubmission = async (req, res, next) => {
        try {
            const { submissionId } = req.params;
            const { score } = req.body;
            const submission = await this.service.gradeSubmission(submissionId, score);
            this.success(res, submission, 'Submission graded successfully');
        }
        catch (error) {
            const status = error.message.includes('must be') ? 400 : 500;
            this.error(res, error.message, status);
        }
    };
    /**
     * Lấy danh sách bài problem của hackathon
     * GET /hackathons/:id/problems
     */
    getProblems = async (req, res, next) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            const { id } = req.params;
            const data = await this.service.getProblems(id, userId);
            this.success(res, data, 'Problems retrieved successfully');
        }
        catch (error) {
            const status = error.message.includes('not found') ? 404 : 400;
            this.error(res, error.message, status);
        }
    };
    /**
     * Chạy code bài trong hackathon (preview, không lưu)
     * POST /hackathons/:id/run-problem
     */
    runProblem = async (req, res, next) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            const { id } = req.params;
            const { problemId, code, language } = req.body;
            const results = await this.service.runProblem(id, userId, problemId, code, language);
            this.success(res, results, 'Code run completed');
        }
        catch (error) {
            const status = error.message.includes('not found') ? 404 : 400;
            this.error(res, error.message, status);
        }
    };
    /**
     * Nộp code bài trong hackathon (chấm điểm + lưu)
     * POST /hackathons/:id/submit-problem
     */
    submitProblem = async (req, res, next) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            const { id } = req.params;
            const { problemId, code, language } = req.body;
            const result = await this.service.submitProblem(id, userId, problemId, code, language);
            this.success(res, result, 'Problem submitted successfully', 201);
        }
        catch (error) {
            const status = error.message.includes('not found') ? 404 : 400;
            this.error(res, error.message, status);
        }
    };
}
exports.default = new HackathonController();
//# sourceMappingURL=hackathon.controller.js.map