/**
 * Leaderboard Service
 *
 * Chứa business logic cho các thao tác với Leaderboard.
 * Xử lý việc lấy thứ hạng và cập nhật điểm số người dùng.
 * Sử dụng Redis để truy vấn nhanh.
 */
import { BaseService } from '../../../base/base.service';
import leaderboardRepository from '../repositories/leaderboard.repository';
/**
 * LeaderboardService - Business logic layer cho Leaderboard
 * @class LeaderboardService
 * @extends BaseService
 */
declare class LeaderboardService extends BaseService<typeof leaderboardRepository> {
    constructor();
    /**
     * Lấy bảng xếp hạng toàn cục
     * @param limit - Số lượng entry tối đa (mặc định: 50)
     * @returns Promise<object[]> - Danh sách leaderboard toàn cục
     */
    getGlobal(limit?: number): Promise<any[]>;
    /**
     * Lấy bảng xếp hạng theo khóa học
     * @param courseId - ID của khóa học
     * @param limit - Số lượng entry tối đa (mặc định: 50)
     * @returns Promise<object[]> - Danh sách leaderboard của khóa học
     */
    getCourseLeaderboard(courseId: string, limit?: number): Promise<any[]>;
    /**
     * Lấy thứ hạng của một người dùng
     * @param userId - ID của người dùng
     * @returns Promise<object | null> - Thông tin rank hoặc null nếu không tìm thấy
     */
    getUserRank(userId: string): Promise<any | null>;
    /**
     * Cập nhật điểm số của người dùng khi có bài nộp thành công
     * @param userId - ID của người dùng
     * @param problemId - ID của bài toán (hiện không sử dụng, để dành cho future use)
     */
    updateUserScore(userId: string, problemId: string): Promise<void>;
}
declare const _default: LeaderboardService;
export default _default;
//# sourceMappingURL=leaderboard.service.d.ts.map