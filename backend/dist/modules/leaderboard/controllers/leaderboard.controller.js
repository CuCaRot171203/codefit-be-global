/**
 * Leaderboard Controller
 *
 * Xử lý các HTTP requests liên quan đến Leaderboard.
 * Cung cấp các endpoint để lấy bảng xếp hạng và thứ hạng cá nhân.
 */
import { BaseController } from '../../../base/base.controller';
import leaderboardService from '../services/leaderboard.service';
/**
 * LeaderboardController - HTTP layer cho Leaderboard operations
 * @class LeaderboardController
 * @extends BaseController
 */
class LeaderboardController extends BaseController {
    constructor() {
        super(leaderboardService);
    }
    /**
     * Lấy bảng xếp hạng toàn cục
     * GET /api/leaderboard
     * @param req - Request với query.limit (tùy chọn)
     * @param res - Response trả về danh sách leaderboard
     * @param next - Next function để xử lý lỗi
     */
    getGlobal = async (req, res, next) => {
        try {
            // Bước 1: Parse limit từ query params, mặc định là 50
            const limit = parseInt(req.query.limit) || 50;
            // Bước 2: Gọi service để lấy leaderboard toàn cục
            const leaderboard = await this.service.getGlobal(limit);
            // Bước 3: Trả về response với danh sách leaderboard
            this.success(res, leaderboard, 'Leaderboard retrieved successfully');
        }
        catch (error) {
            // Bước 4: Chuyển lỗi đến middleware xử lý lỗi
            next(error);
        }
    };
    /**
     * Lấy bảng xếp hạng theo khóa học
     * GET /api/leaderboard/course/:courseId
     * @param req - Request với params.courseId và query.limit
     * @param res - Response trả về danh sách leaderboard của khóa học
     * @param next - Next function để xử lý lỗi
     */
    getCourseLeaderboard = async (req, res, next) => {
        try {
            // Bước 1: Lấy courseId từ URL params
            const { courseId } = req.params;
            // Bước 2: Parse limit từ query params, mặc định là 50
            const limit = parseInt(req.query.limit) || 50;
            // Bước 3: Gọi service để lấy leaderboard theo khóa học
            const leaderboard = await this.service.getCourseLeaderboard(courseId, limit);
            // Bước 4: Trả về response với danh sách leaderboard
            this.success(res, leaderboard, 'Course leaderboard retrieved successfully');
        }
        catch (error) {
            // Bước 5: Chuyển lỗi đến middleware xử lý lỗi
            next(error);
        }
    };
    /**
     * Lấy thứ hạng của người dùng hiện tại
     * GET /api/leaderboard/my-rank
     * @param req - Request với user từ token
     * @param res - Response trả về thông tin rank của user
     * @param next - Next function để xử lý lỗi
     */
    getMyRank = async (req, res, next) => {
        try {
            // Bước 1: Lấy userId từ token đã được verify
            const userId = req.user?.userId;
            if (!userId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            // Bước 2: Gọi service để lấy rank của user
            const rank = await this.service.getUserRank(userId);
            // Bước 3: Trả về response với thông tin rank
            this.success(res, rank, 'Rank retrieved successfully');
        }
        catch (error) {
            // Bước 4: Chuyển lỗi đến middleware xử lý lỗi
            next(error);
        }
    };
}
export default new LeaderboardController();
//# sourceMappingURL=leaderboard.controller.js.map