/**
 * Stats Controller
 * 
 * Xử lý các HTTP requests liên quan đến thống kê.
 * Cung cấp các endpoint để lấy thống kê người dùng, khóa học và nền tảng.
 */

import { Request, Response, NextFunction } from 'express';
import statsService from '../services/stats.service';

/**
 * StatsController - HTTP layer cho Stats operations
 * @class StatsController
 */
class StatsController {

  /**
   * Lấy thống kê của người dùng hiện tại
   * GET /api/stats/me
   * @param req - Request chứa user từ token
   * @param res - Response trả về thông tin thống kê
   * @param next - Next function để xử lý lỗi
   */
  async getMyStats(req: Request, res: Response, next: NextFunction) {
    try {
      // Bước 1: Lấy userId từ token đã được verify
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      
      // Bước 2: Gọi service để lấy thống kê người dùng
      const stats = await statsService.getUserStats(userId);
      
      // Bước 3: Trả về response với thông tin thống kê
      res.json({ success: true, data: stats, message: 'Stats retrieved successfully' });
    } catch (error: any) {
      // Bước 4: Chuyển lỗi đến middleware xử lý lỗi
      next(error);
    }
  }

  /**
   * Lấy thống kê của một khóa học
   * GET /api/stats/course/:courseId
   * @param req - Request chứa params.courseId
   * @param res - Response trả về thông tin thống kê khóa học
   * @param next - Next function để xử lý lỗi
   */
  async getCourseStats(req: Request, res: Response, next: NextFunction) {
    try {
      // Bước 1: Lấy courseId từ URL params
      const courseId = req.params.courseId as string;
      const stats = await statsService.getCourseStats(courseId);
      
      // Bước 3: Trả về response với thông tin thống kê
      res.json({ success: true, data: stats, message: 'Course stats retrieved successfully' });
    } catch (error: any) {
      // Bước 4: Chuyển lỗi đến middleware xử lý lỗi
      next(error);
    }
  }

  /**
   * Lấy thống kê tổng quan của nền tảng
   * GET /api/stats/platform
   * @param req - Request
   * @param res - Response trả về thông tin thống kê nền tảng
   * @param next - Next function để xử lý lỗi
   */
  async getPlatformStats(req: Request, res: Response, next: NextFunction) {
    try {
      // Bước 1: Gọi service để lấy thống kê nền tảng
      const stats = await statsService.getPlatformStats();

      // Bước 2: Trả về response với thông tin thống kê
      res.json({ success: true, data: stats, message: 'Platform stats retrieved successfully' });
    } catch (error: any) {
      // Bước 3: Chuyển lỗi đến middleware xử lý lỗi
      next(error);
    }
  }

  /**
   * Lấy so sánh progress theo tuần
   * GET /api/stats/weekly-comparison
   * @param req - Request chứa user từ token
   * @param res - Response trả về thông tin so sánh tuần
   * @param next - Next function để xử lý lỗi
   */
  async getWeeklyComparison(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const comparison = await statsService.getWeeklyComparison(userId);
      res.json({ success: true, data: comparison });
    } catch (error: any) {
      next(error);
    }
  }

  async getScoreBreakdown(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const data = await statsService.getUserScoreBreakdown(userId);
      res.json({ success: true, data });
    } catch (error: any) {
      next(error);
    }
  }

  async getLoginDays(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const data = await statsService.getUserLoginDays(userId);
      res.json({ success: true, data });
    } catch (error: any) {
      next(error);
    }
  }

  async getWeeklyActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const data = await statsService.getUserWeeklyActivity(userId);
      res.json({ success: true, data });
    } catch (error: any) {
      next(error);
    }
  }

  async getGlobalRank(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const data = await statsService.getUserGlobalRank(userId);
      res.json({ success: true, data });
    } catch (error: any) {
      next(error);
    }
  }

  async getGlobalLeaderboard(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await statsService.getGlobalLeaderboard();
      res.json({ success: true, data });
    } catch (error: any) {
      next(error);
    }
  }

  async getEnrolledCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const data = await statsService.getUserEnrolledCourses(userId);
      res.json({ success: true, data });
    } catch (error: any) {
      next(error);
    }
  }

  async getEvaluation(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const data = await statsService.getUserEvaluation(userId);
      res.json({ success: true, data });
    } catch (error: any) {
      next(error);
    }
  }

  async getActivity30Days(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const data = await statsService.getActivity30Days(userId);
      res.json({ success: true, data });
    } catch (error: any) {
      next(error);
    }
  }
}

export default new StatsController();
