/**
 * Leaderboard Controller
 *
 * Xử lý các HTTP requests liên quan đến Leaderboard.
 * Cung cấp các endpoint để lấy bảng xếp hạng và thứ hạng cá nhân.
 */
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../base/base.controller';
/**
 * LeaderboardController - HTTP layer cho Leaderboard operations
 * @class LeaderboardController
 * @extends BaseController
 */
declare class LeaderboardController extends BaseController {
    constructor();
    /**
     * Lấy bảng xếp hạng toàn cục
     * GET /api/leaderboard
     * @param req - Request với query.limit (tùy chọn)
     * @param res - Response trả về danh sách leaderboard
     * @param next - Next function để xử lý lỗi
     */
    getGlobal: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy bảng xếp hạng theo khóa học
     * GET /api/leaderboard/course/:courseId
     * @param req - Request với params.courseId và query.limit
     * @param res - Response trả về danh sách leaderboard của khóa học
     * @param next - Next function để xử lý lỗi
     */
    getCourseLeaderboard: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Lấy thứ hạng của người dùng hiện tại
     * GET /api/leaderboard/my-rank
     * @param req - Request với user từ token
     * @param res - Response trả về thông tin rank của user
     * @param next - Next function để xử lý lỗi
     */
    getMyRank: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: LeaderboardController;
export default _default;
//# sourceMappingURL=leaderboard.controller.d.ts.map