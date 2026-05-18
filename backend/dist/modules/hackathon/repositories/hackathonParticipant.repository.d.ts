/**
 * Repository cho các thao tác CRUD với bảng HackathonParticipant trong database
 * @module HackathonParticipantRepository
 */
/**
 * Interface định nghĩa cấu trúc dữ liệu HackathonParticipant
 * @interface HackathonParticipant
 */
interface HackathonParticipant {
    id: string;
    hackathonId: string;
    userId: string;
    joinedAt: Date;
}
/**
 * Repository class xử lý các thao tác với dữ liệu người tham gia hackathon
 * @class HackathonParticipantRepository
 */
declare class HackathonParticipantRepository {
    /** Model Prisma để thao tác với bảng hackathonParticipant */
    private model;
    /**
     * Tạo mới một bản ghi tham gia hackathon
     * @param data - Dữ liệu tham gia hackathon
     * @returns Promise<HackathonParticipant> Bản ghi tham gia đã được tạo
     */
    create(data: any): Promise<HackathonParticipant>;
    /**
     * Tìm bản ghi tham gia theo hackathonId và userId
     * Sử dụng unique constraint trên cặp (hackathonId, userId)
     * @param hackathonId - ID của hackathon
     * @param userId - ID của người dùng
     * @returns Promise<HackathonParticipant | null> Bản ghi tham gia hoặc null nếu không tìm thấy
     */
    findByHackathonAndUser(hackathonId: string, userId: string): Promise<HackathonParticipant | null>;
    /**
     * Tìm tất cả người tham gia của một hackathon cụ thể
     * @param hackathonId - ID của hackathon cần lấy danh sách tham gia
     * @returns Promise<HackathonParticipant[]> Danh sách người tham gia
     */
    findByHackathonId(hackathonId: string): Promise<any[]>;
    /**
     * Xóa bản ghi tham gia hackathon
     * @param id - ID của bản ghi tham gia cần xóa
     * @returns Promise<void>
     */
    delete(id: string): Promise<void>;
}
declare const _default: HackathonParticipantRepository;
export default _default;
//# sourceMappingURL=hackathonParticipant.repository.d.ts.map