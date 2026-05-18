/**
 * Service xử lý business logic liên quan đến Hackathon
 * @module HackathonService
 */
import { BaseService } from '../../../base/base.service';
import hackathonRepository from '../repositories/hackathon.repository';
import { CreateHackathonDto, SubmitProjectDto } from '../types';
/**
 * Service class xử lý các nghiệp vụ liên quan đến hackathon
 * Kế thừa từ BaseService để sử dụng các phương thức CRUD cơ bản
 * @class HackathonService
 */
declare class HackathonService extends BaseService<typeof hackathonRepository> {
    constructor();
    /**
     * Tạo mới một hackathon
     * @param createdBy - ID của người tạo hackathon
     * @param dto - Dữ liệu tạo hackathon (title, description, startDate, endDate)
     * @returns Promise<any> Hackathon đã được tạo
     * @throws Error nếu thiếu các trường bắt buộc
     */
    create(createdBy: string, dto: CreateHackathonDto): Promise<any>;
    /**
     * Lấy thông tin hackathon theo ID
     * @param id - ID của hackathon cần lấy
     * @returns Promise<any | null> Hackathon hoặc null nếu không tìm thấy
     */
    getById(id: string): Promise<any | null>;
    /**
     * Lấy danh sách hackathon đang diễn ra
     * @returns Promise<any[]> Danh sách hackathon active
     */
    getActive(): Promise<any[]>;
    /**
     * Lấy danh sách hackathon sắp diễn ra
     * @returns Promise<any[]> Danh sách hackathon upcoming
     */
    getUpcoming(): Promise<any[]>;
    /**
     * Lấy danh sách hackathon đã kết thúc
     * @returns Promise<any[]> Danh sách hackathon đã kết thúc
     */
    getEnded(): Promise<any[]>;
    /**
     * Lấy danh sách hackathon đã đăng ký của một user
     * @param userId - ID của người dùng
     * @returns Promise<any[]> Danh sách hackathon đã đăng ký
     */
    getRegistered(userId: string): Promise<any[]>;
    /**
     * Lấy bảng xếp hạng của một hackathon
     * @param hackathonId - ID của hackathon
     * @param currentUserId - ID của user hiện tại (để highlight)
     * @returns Promise<any> Bảng xếp hạng
     */
    getLeaderboard(hackathonId: string, currentUserId?: string): Promise<any>;
    /**
     * Lấy danh sách tất cả hackathon
     * @returns Promise<any[]> Danh sách tất cả hackathon
     */
    getAll(): Promise<any[]>;
    /**
     * Xử lý tham gia hackathon của một người dùng
     * @param hackathonId - ID của hackathon muốn tham gia
     * @param userId - ID của người dùng
     * @param teamName - Tên nhóm (tùy chọn)
     * @returns Promise<any> Bản ghi tham gia
     * @throws Error nếu hackathon không tồn tại hoặc đã tham gia
     */
    join(hackathonId: string, userId: string, teamName?: string): Promise<any>;
    /**
     * Lấy danh sách người tham gia của một hackathon
     * @param hackathonId - ID của hackathon
     * @returns Promise<any[]> Danh sách người tham gia
     */
    getParticipants(hackathonId: string): Promise<any[]>;
    /**
     * Xử lý nộp dự án tham gia hackathon
     * @param hackathonId - ID của hackathon
     * @param userId - ID của người nộp
     * @param dto - Dữ liệu bài nộp (projectTitle, description, repositoryUrl, demoUrl)
     * @returns Promise<any> Bài nộp đã được tạo
     * @throws Error nếu hackathon không tồn tại hoặc user chưa tham gia
     */
    submitProject(hackathonId: string, userId: string, dto: SubmitProjectDto): Promise<any>;
    /**
     * Lấy danh sách bài nộp của một hackathon
     * @param hackathonId - ID của hackathon
     * @returns Promise<any[]> Danh sách bài nộp
     */
    getSubmissions(hackathonId: string): Promise<any[]>;
    /**
     * Lấy danh sách bài nộp của một người dùng
     * @param userId - ID của người dùng
     * @returns Promise<any[]> Danh sách bài nộp
     */
    getMySubmissions(userId: string): Promise<any[]>;
    /**
     * Chấm điểm một bài nộp
     * @param submissionId - ID của bài nộp cần chấm
     * @param score - Điểm số (0-100)
     * @returns Promise<any> Bài nộp đã được cập nhật
     * @throws Error nếu điểm không nằm trong khoảng 0-100
     */
    gradeSubmission(submissionId: string, score: number): Promise<any>;
    /**
     * Lấy danh sách bài problem của hackathon
     * @param hackathonId - ID của hackathon
     * @param userId - ID của user
     * @returns Danh sách problems + submissions của user
     */
    getProblems(hackathonId: string, userId: string): Promise<any>;
    /**
     * Chạy code bài trong hackathon (preview, không lưu)
     * @param hackathonId - ID của hackathon
     * @param userId - ID của user
     * @param problemId - ID của bài
     * @param code - Code của user
     * @param language - Ngôn ngữ lập trình
     */
    runProblem(hackathonId: string, userId: string, problemId: string, code: string, language: string): Promise<any>;
    /**
     * Nộp code bài trong hackathon (chấm điểm + lưu vào HackathonSubmission)
     * @param hackathonId - ID của hackathon
     * @param userId - ID của user
     * @param problemId - ID của bài
     * @param code - Code của user
     * @param language - Ngôn ngữ lập trình
     */
    submitProblem(hackathonId: string, userId: string, problemId: string, code: string, language: string): Promise<any>;
}
declare const _default: HackathonService;
export default _default;
//# sourceMappingURL=hackathon.service.d.ts.map