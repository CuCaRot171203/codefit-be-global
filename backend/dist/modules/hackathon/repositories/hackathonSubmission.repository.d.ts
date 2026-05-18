/**
 * Repository cho các thao tác CRUD với bảng HackathonSubmission trong database
 * @module HackathonSubmissionRepository
 */
/**
 * Interface định nghĩa cấu trúc dữ liệu HackathonSubmission
 * @interface HackathonSubmission
 */
interface HackathonSubmission {
    id: string;
    hackathonId: string;
    userId: string;
    projectTitle: string;
    description: string;
    repositoryUrl: string;
    demoUrl: string | null;
    score: number | null;
    submittedAt: Date;
}
/**
 * Repository class xử lý các thao tác với dữ liệu bài nộp dự án hackathon
 * @class HackathonSubmissionRepository
 */
declare class HackathonSubmissionRepository {
    /** Model Prisma để thao tác với bảng hackathonSubmission */
    private model;
    /**
     * Tạo mới một bài nộp dự án
     * @param data - Dữ liệu bài nộp dự án
     * @returns Promise<HackathonSubmission> Bài nộp đã được tạo
     */
    create(data: any): Promise<HackathonSubmission>;
    /**
     * Tìm tất cả bài nộp của một hackathon cụ thể
     * @param hackathonId - ID của hackathon cần lấy danh sách bài nộp
     * @returns Promise<HackathonSubmission[]> Danh sách bài nộp
     */
    findByHackathonId(hackathonId: string): Promise<HackathonSubmission[]>;
    /**
     * Tìm tất cả bài nộp của một người dùng cụ thể
     * @param userId - ID của người dùng cần lấy danh sách bài nộp
     * @returns Promise<HackathonSubmission[]> Danh sách bài nộp của user
     */
    findByUserId(userId: string): Promise<HackathonSubmission[]>;
    /**
     * Cập nhật điểm số cho một bài nộp
     * @param id - ID của bài nộp cần cập nhật điểm
     * @param score - Điểm số mới (0-100)
     * @returns Promise<HackathonSubmission> Bài nộp đã được cập nhật
     */
    updateScore(id: string, score: number): Promise<HackathonSubmission>;
}
declare const _default: HackathonSubmissionRepository;
export default _default;
//# sourceMappingURL=hackathonSubmission.repository.d.ts.map