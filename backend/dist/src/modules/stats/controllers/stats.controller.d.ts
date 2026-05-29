/**
 * Stats Controller
 *
 * Xử lý các HTTP requests liên quan đến thống kê.
 * Cung cấp các endpoint để lấy thống kê người dùng, khóa học và nền tảng.
 */
import { Request, Response, NextFunction } from 'express';
/**
 * StatsController - HTTP layer cho Stats operations
 * @class StatsController
 */
declare class StatsController {
    /**
     * Lấy thống kê của người dùng hiện tại
     * GET /api/stats/me
     * @param req - Request chứa user từ token
     * @param res - Response trả về thông tin thống kê
     * @param next - Next function để xử lý lỗi
     */
    getMyStats(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Lấy thống kê của một khóa học
     * GET /api/stats/course/:courseId
     * @param req - Request chứa params.courseId
     * @param res - Response trả về thông tin thống kê khóa học
     * @param next - Next function để xử lý lỗi
     */
    getCourseStats(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Lấy thống kê tổng quan của nền tảng
     * GET /api/stats/platform
     * @param req - Request
     * @param res - Response trả về thông tin thống kê nền tảng
     * @param next - Next function để xử lý lỗi
     */
    getPlatformStats(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Lấy so sánh progress theo tuần
     * GET /api/stats/weekly-comparison
     * @param req - Request chứa user từ token
     * @param res - Response trả về thông tin so sánh tuần
     * @param next - Next function để xử lý lỗi
     */
    getWeeklyComparison(req: Request, res: Response, next: NextFunction): Promise<void>;
    getScoreBreakdown(req: Request, res: Response, next: NextFunction): Promise<void>;
    getLoginDays(req: Request, res: Response, next: NextFunction): Promise<void>;
    getWeeklyActivity(req: Request, res: Response, next: NextFunction): Promise<void>;
    getGlobalRank(req: Request, res: Response, next: NextFunction): Promise<void>;
    getGlobalLeaderboard(req: Request, res: Response, next: NextFunction): Promise<void>;
    getEnrolledCourses(req: Request, res: Response, next: NextFunction): Promise<void>;
    getEvaluation(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const _default: StatsController;
export default _default;
//# sourceMappingURL=stats.controller.d.ts.map