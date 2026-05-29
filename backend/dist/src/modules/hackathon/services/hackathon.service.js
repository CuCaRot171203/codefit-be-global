"use strict";
/**
 * Service xử lý business logic liên quan đến Hackathon
 * @module HackathonService
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_service_1 = require("../../../base/base.service");
const hackathon_repository_1 = __importDefault(require("../repositories/hackathon.repository"));
const hackathonParticipant_repository_1 = __importDefault(require("../repositories/hackathonParticipant.repository"));
const hackathonSubmission_repository_1 = __importDefault(require("../repositories/hackathonSubmission.repository"));
const notification_service_1 = __importDefault(require("../../notification/services/notification.service"));
const email_service_1 = __importDefault(require("../../email/email.service"));
const scoring_service_1 = __importDefault(require("../../scoring/services/scoring.service"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Service class xử lý các nghiệp vụ liên quan đến hackathon
 * Kế thừa từ BaseService để sử dụng các phương thức CRUD cơ bản
 * @class HackathonService
 */
class HackathonService extends base_service_1.BaseService {
    constructor() {
        super(hackathon_repository_1.default);
    }
    /**
     * Tạo mới một hackathon
     * @param createdBy - ID của người tạo hackathon
     * @param dto - Dữ liệu tạo hackathon (title, description, startDate, endDate)
     * @returns Promise<any> Hackathon đã được tạo
     * @throws Error nếu thiếu các trường bắt buộc
     */
    async create(createdBy, dto) {
        // Bước 1: Validate các trường bắt buộc
        if (!dto.title || !dto.startDate || !dto.endDate) {
            throw new Error('Title, startDate, and endDate are required');
        }
        // Bước 2: Tạo bản ghi hackathon mới với status mặc định là 'upcoming'
        // Bước 3: Gọi repository để lưu vào database
        return this.repository.create({
            title: dto.title,
            description: dto.description,
            startDate: dto.startDate,
            endDate: dto.endDate,
            status: 'upcoming',
            createdBy
        });
    }
    /**
     * Lấy thông tin hackathon theo ID
     * @param id - ID của hackathon cần lấy
     * @returns Promise<any | null> Hackathon hoặc null nếu không tìm thấy
     */
    async getById(id) {
        return this.repository.findById(id);
    }
    /**
     * Lấy danh sách hackathon đang diễn ra
     * @returns Promise<any[]> Danh sách hackathon active
     */
    async getActive() {
        return this.repository.findActive();
    }
    /**
     * Lấy danh sách hackathon sắp diễn ra
     * @returns Promise<any[]> Danh sách hackathon upcoming
     */
    async getUpcoming() {
        return this.repository.findUpcoming();
    }
    /**
     * Lấy danh sách hackathon đã kết thúc
     * @returns Promise<any[]> Danh sách hackathon đã kết thúc
     */
    async getEnded() {
        return this.repository.findEnded();
    }
    /**
     * Lấy danh sách hackathon đã đăng ký của một user
     * @param userId - ID của người dùng
     * @returns Promise<any[]> Danh sách hackathon đã đăng ký
     */
    async getRegistered(userId) {
        return this.repository.findRegisteredByUser(userId);
    }
    /**
     * Lấy bảng xếp hạng của một hackathon
     * @param hackathonId - ID của hackathon
     * @param currentUserId - ID của user hiện tại (để highlight)
     * @returns Promise<any> Bảng xếp hạng
     */
    async getLeaderboard(hackathonId, currentUserId) {
        return this.repository.getLeaderboardData(hackathonId, currentUserId);
    }
    /**
     * Lấy danh sách tất cả hackathon
     * @returns Promise<any[]> Danh sách tất cả hackathon
     */
    async getAll() {
        return this.repository.findAll();
    }
    /**
     * Xử lý tham gia hackathon của một người dùng
     * @param hackathonId - ID của hackathon muốn tham gia
     * @param userId - ID của người dùng
     * @param teamName - Tên nhóm (tùy chọn)
     * @returns Promise<any> Bản ghi tham gia
     * @throws Error nếu hackathon không tồn tại hoặc đã tham gia
     */
    async join(hackathonId, userId, teamName) {
        // Bước 1: Kiểm tra hackathon có tồn tại không
        const hackathon = await this.repository.findById(hackathonId);
        if (!hackathon) {
            throw new Error('Hackathon not found');
        }
        // Bước 2: Chỉ cho phép đăng ký khi hackathon đang diễn ra
        const now = new Date();
        const start = new Date(hackathon.startDate || hackathon.startTime);
        const end = new Date(hackathon.endDate || hackathon.endTime);
        if (now < start) {
            throw new Error('Hackathon has not started yet');
        }
        if (now > end) {
            throw new Error('Hackathon has already ended');
        }
        // Bước 3: Kiểm tra user đã tham gia hackathon này chưa
        const existing = await hackathonParticipant_repository_1.default.findByHackathonAndUser(hackathonId, userId);
        if (existing) {
            throw new Error('Already joined this hackathon');
        }
        // Bước 4: Kiểm tra số lượng người tham gia
        const currentParticipants = await hackathonParticipant_repository_1.default.findByHackathonId(hackathonId);
        const maxParticipants = hackathon.maxParticipants || 100;
        if (currentParticipants.length >= maxParticipants) {
            throw new Error('Hackathon is full');
        }
        // Bước 5: Tạo bản ghi tham gia mới
        const participant = await hackathonParticipant_repository_1.default.create({
            hackathonId,
            userId,
            joinedAt: new Date()
        });
        // Bước 6: Gửi notification và email xác nhận đăng ký
        try {
            await notification_service_1.default.createHackathonJoinedNotification(userId, hackathon.title, hackathonId);
            // Lấy email của user để gửi email
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { email: true, fullName: true }
            });
            if (user?.email) {
                await email_service_1.default.sendHackathonJoined(user.email, user.fullName || 'User', hackathon.title);
            }
        }
        catch (notifError) {
            console.error('Failed to send hackathon joined notification:', notifError);
        }
        return participant;
    }
    /**
     * Lấy danh sách người tham gia của một hackathon
     * @param hackathonId - ID của hackathon
     * @returns Promise<any[]> Danh sách người tham gia
     */
    async getParticipants(hackathonId) {
        return hackathonParticipant_repository_1.default.findByHackathonId(hackathonId);
    }
    /**
     * Xử lý nộp dự án tham gia hackathon
     * @param hackathonId - ID của hackathon
     * @param userId - ID của người nộp
     * @param dto - Dữ liệu bài nộp (projectTitle, description, repositoryUrl, demoUrl)
     * @returns Promise<any> Bài nộp đã được tạo
     * @throws Error nếu hackathon không tồn tại hoặc user chưa tham gia
     */
    async submitProject(hackathonId, userId, dto) {
        // Bước 1: Kiểm tra hackathon có tồn tại không
        const hackathon = await this.repository.findById(hackathonId);
        if (!hackathon) {
            throw new Error('Hackathon not found');
        }
        // Bước 2: Chỉ cho phép nộp bài khi hackathon đang diễn ra
        const now = new Date();
        const start = new Date(hackathon.startDate || hackathon.startTime);
        const end = new Date(hackathon.endDate || hackathon.endTime);
        if (now < start) {
            throw new Error('Hackathon has not started yet');
        }
        if (now > end) {
            throw new Error('Hackathon has already ended');
        }
        // Bước 3: Kiểm tra user đã tham gia hackathon chưa
        const participant = await hackathonParticipant_repository_1.default.findByHackathonAndUser(hackathonId, userId);
        if (!participant) {
            throw new Error('Must join hackathon before submitting');
        }
        // Bước 4: Tạo bài nộp mới
        return hackathonSubmission_repository_1.default.create({
            hackathonId,
            userId,
            projectTitle: dto.projectTitle,
            description: dto.description,
            repositoryUrl: dto.repositoryUrl,
            demoUrl: dto.demoUrl || null,
            score: null,
            submittedAt: new Date()
        });
    }
    /**
     * Lấy danh sách bài nộp của một hackathon
     * @param hackathonId - ID của hackathon
     * @returns Promise<any[]> Danh sách bài nộp
     */
    async getSubmissions(hackathonId) {
        return hackathonSubmission_repository_1.default.findByHackathonId(hackathonId);
    }
    /**
     * Lấy danh sách bài nộp của một người dùng
     * @param userId - ID của người dùng
     * @returns Promise<any[]> Danh sách bài nộp
     */
    async getMySubmissions(userId) {
        return hackathonSubmission_repository_1.default.findByUserId(userId);
    }
    /**
     * Chấm điểm một bài nộp
     * @param submissionId - ID của bài nộp cần chấm
     * @param score - Điểm số (0-100)
     * @returns Promise<any> Bài nộp đã được cập nhật
     * @throws Error nếu điểm không nằm trong khoảng 0-100
     */
    async gradeSubmission(submissionId, score) {
        // Bước 1: Validate điểm số nằm trong khoảng 0-100
        if (score < 0 || score > 100) {
            throw new Error('Score must be between 0 and 100');
        }
        // Bước 2: Gọi repository để cập nhật điểm
        return hackathonSubmission_repository_1.default.updateScore(submissionId, score);
    }
    /**
     * Lấy danh sách bài problem của hackathon
     * @param hackathonId - ID của hackathon
     * @param userId - ID của user
     * @returns Danh sách problems + submissions của user
     */
    async getProblems(hackathonId, userId) {
        const hackathon = await this.repository.findById(hackathonId);
        if (!hackathon) {
            throw new Error('Hackathon not found');
        }
        // Kiểm tra user đã tham gia chưa
        const participant = await hackathonParticipant_repository_1.default.findByHackathonAndUser(hackathonId, userId);
        if (!participant) {
            throw new Error('You must join the hackathon first');
        }
        // Lấy lessonIds từ hackathon (JSON array string)
        let problemIds = [];
        if (hackathon.lessonIds) {
            try {
                problemIds = JSON.parse(hackathon.lessonIds);
            }
            catch {
                problemIds = [];
            }
        }
        if (problemIds.length === 0) {
            return { problems: [], submissions: [] };
        }
        // Lấy thông tin problems
        const problems = await prisma.problem.findMany({
            where: { id: { in: problemIds } },
            select: { id: true, title: true, description: true, difficulty: true, timeLimit: true }
        });
        // Lấy submissions của user cho các bài này
        const submissions = await prisma.lessonSubmission.findMany({
            where: {
                userId,
                lessonId: { in: problemIds }
            },
            orderBy: { createdAt: 'desc' }
        });
        return { problems, submissions };
    }
    /**
     * Chạy code bài trong hackathon (preview, không lưu)
     * @param hackathonId - ID của hackathon
     * @param userId - ID của user
     * @param problemId - ID của bài
     * @param code - Code của user
     * @param language - Ngôn ngữ lập trình
     */
    async runProblem(hackathonId, userId, problemId, code, language) {
        const hackathon = await this.repository.findById(hackathonId);
        if (!hackathon)
            throw new Error('Hackathon not found');
        const now = new Date();
        const start = new Date(hackathon.startTime);
        const end = new Date(hackathon.endTime);
        if (now < start)
            throw new Error('Hackathon has not started yet');
        if (now > end)
            throw new Error('Hackathon has already ended');
        const participant = await hackathonParticipant_repository_1.default.findByHackathonAndUser(hackathonId, userId);
        if (!participant)
            throw new Error('You must join the hackathon first');
        // Chạy scoring service
        const results = await scoring_service_1.default.runCode(problemId, code, language || 'javascript');
        return results;
    }
    /**
     * Nộp code bài trong hackathon (chấm điểm + lưu vào HackathonSubmission)
     * @param hackathonId - ID của hackathon
     * @param userId - ID của user
     * @param problemId - ID của bài
     * @param code - Code của user
     * @param language - Ngôn ngữ lập trình
     */
    async submitProblem(hackathonId, userId, problemId, code, language) {
        const hackathon = await this.repository.findById(hackathonId);
        if (!hackathon)
            throw new Error('Hackathon not found');
        const now = new Date();
        const start = new Date(hackathon.startTime);
        const end = new Date(hackathon.endTime);
        if (now < start)
            throw new Error('Hackathon has not started yet');
        if (now > end)
            throw new Error('Hackathon has already ended');
        const participant = await hackathonParticipant_repository_1.default.findByHackathonAndUser(hackathonId, userId);
        if (!participant)
            throw new Error('You must join the hackathon first');
        // Chấm điểm bằng scoring service
        const { score, passedTests, totalTests } = await scoring_service_1.default.calculateScore(problemId, code, language || 'javascript');
        // Lưu vào HackathonSubmission
        const submission = await hackathonSubmission_repository_1.default.create({
            hackathonId,
            userId,
            problemId,
            score,
            submittedAt: new Date()
        });
        // Cập nhật điểm cao nhất vào LessonSubmission
        const existingLessonSubmission = await prisma.lessonSubmission.findFirst({
            where: { lessonId: problemId, userId }
        });
        if (!existingLessonSubmission || existingLessonSubmission.score < score) {
            await prisma.lessonSubmission.upsert({
                where: { id: existingLessonSubmission?.id || 'dummy' },
                create: {
                    lessonId: problemId,
                    userId,
                    code,
                    language: language || 'javascript',
                    score,
                    passedTests,
                    totalTests,
                    hintsUsed: 0,
                    status: 'COMPILED',
                },
                update: { code, language: language || 'javascript', score, passedTests, totalTests }
            });
        }
        return {
            ...submission,
            passedTests,
            totalTests,
            allPassed: passedTests === totalTests && totalTests > 0
        };
    }
}
exports.default = new HackathonService();
//# sourceMappingURL=hackathon.service.js.map