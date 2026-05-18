/**
 * Repository cho các thao tác CRUD với bảng Hackathon trong database
 * @module HackathonRepository
 */
import { BaseRepository } from '../../../base/base.repository';
/**
 * Interface định nghĩa cấu trúc dữ liệu Hackathon
 * @interface Hackathon
 */
interface Hackathon {
    id: string;
    courseId: string | null;
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    status: string;
    createdBy: string;
    createdAt: Date;
}
/**
 * Repository class xử lý các thao tác với dữ liệu Hackathon
 * Kế thừa từ BaseRepository để sử dụng các phương thức CRUD cơ bản
 * @class HackathonRepository
 * @extends BaseRepository<Hackathon>
 */
declare class HackathonRepository extends BaseRepository<Hackathon> {
    /** Model Prisma để thao tác với bảng hackathon */
    protected model: import(".prisma/client").Prisma.HackathonDelegate<import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    /**
     * Tìm hackathon theo ID (override để include course)
     */
    findById(id: string): Promise<any>;
    /**
     * Tìm tất cả các hackathon đang diễn ra (active)
     * Active = ngày bắt đầu <= ngày hiện tại <= ngày kết thúc
     * @returns Promise<Hackathon[]> Danh sách hackathon đang active
     */
    findActive(): Promise<Hackathon[]>;
    /**
     * Tìm tất cả các hackathon sắp diễn ra (upcoming)
     * Upcoming = ngày bắt đầu > ngày hiện tại
     * @returns Promise<Hackathon[]> Danh sách hackathon sắp diễn ra
     */
    findUpcoming(): Promise<Hackathon[]>;
    /**
     * Tìm tất cả các hackathon đã kết thúc (ended)
     * Ended = ngày kết thúc < ngày hiện tại
     * @returns Promise<Hackathon[]> Danh sách hackathon đã kết thúc
     */
    findEnded(): Promise<Hackathon[]>;
    /**
     * Tìm tất cả hackathon mà user đã đăng ký
     * @param userId - ID của người dùng
     * @returns Promise<any[]> Danh sách hackathon đã đăng ký
     */
    findRegisteredByUser(userId: string): Promise<any[]>;
    /**
     * Lấy bảng xếp hạng của một hackathon
     * @param hackathonId - ID của hackathon
     * @param currentUserId - ID của user hiện tại (để highlight)
     * @returns Promise<any> Bảng xếp hạng với thông tin participants và submissions
     */
    getLeaderboardData(hackathonId: string, currentUserId?: string): Promise<any>;
}
declare const _default: HackathonRepository;
export default _default;
//# sourceMappingURL=hackathon.repository.d.ts.map