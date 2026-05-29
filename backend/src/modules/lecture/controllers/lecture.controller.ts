/**
 * Lecture Controller
 * 
 * Xử lý các HTTP requests liên quan đến Lecture/Dashboard giảng viên.
 * Quản lý việc lấy dashboard, khóa học, minitests, hackathons.
 */

import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../base/base.controller';
import lectureService from '../services/lecture.service';
import phaseService from '../../phase/services/phase.service';
import lessonService from '../../lesson/services/lesson.service';
import lessonContentService from '../../lessonContent/services/lessonContent.service';
import notificationService from '../../notification/services/notification.service';
import prisma from '../../../prisma';

/**
 * LectureController - HTTP layer cho Lecture operations
 * @class LectureController
 * @extends BaseController
 */
class LectureController extends BaseController {
  constructor() {
    super(lectureService);
  }

  /**
   * Lấy dashboard stats cho giảng viên
   * GET /api/lecture/dashboard
   * Yêu cầu: User đã xác thực với role = 'lecture'
   */
  getDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lectureId = req.user?.userId;
      if (!lectureId) {
        this.error(res, 'Unauthorized', 401);
        return;
      }

      const stats = await lectureService.getDashboardStats(lectureId);
      this.success(res, stats, 'Dashboard stats retrieved successfully');
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Lấy danh sách khóa học của giảng viên
   * GET /api/lecture/courses
   * Yêu cầu: User đã xác thực với role = 'lecture'
   */
  getMyCourses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lectureId = req.user?.userId;
      if (!lectureId) {
        this.error(res, 'Unauthorized', 401);
        return;
      }

      const courses = await lectureService.getMyCourses(lectureId);
      this.success(res, courses, 'Courses retrieved successfully');
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Lấy chi tiết một khóa học của giảng viên
   * GET /api/lecture/courses/:courseId
   * Yêu cầu: User đã xác thực với role = 'lecture'
   */
  getCourseDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lectureId = req.user?.userId;
      if (!lectureId) {
        this.error(res, 'Unauthorized', 401);
        return;
      }

      const { courseId } = req.params;
      const course = await lectureService.getCourseDetail(Array.isArray(courseId) ? courseId[0] : courseId, lectureId);
      this.success(res, course, 'Course detail retrieved successfully');
    } catch (error: any) {
      const status = error.message.includes('not found') ? 404 : 500;
      this.error(res, error.message, status);
    }
  };

  /**
   * Lấy danh sách minitests trong các khóa học của giảng viên
   * GET /api/lecture/minitests
   * Yêu cầu: User đã xác thực với role = 'lecture'
   */
  getMyMinitests = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lectureId = req.user?.userId;
      if (!lectureId) {
        this.error(res, 'Unauthorized', 401);
        return;
      }

      const minitests = await lectureService.getMyMinitests(lectureId);
      this.success(res, minitests, 'Minitests retrieved successfully');
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Lấy danh sách hackathons trong các khóa học của giảng viên
   * GET /api/lecture/hackathons
   * Yêu cầu: User đã xác thực với role = 'lecture'
   */
  getMyHackathons = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lectureId = req.user?.userId;
      if (!lectureId) {
        this.error(res, 'Unauthorized', 401);
        return;
      }

      const hackathons = await lectureService.getMyHackathons(lectureId);
      this.success(res, hackathons, 'Hackathons retrieved successfully');
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Tạo chương mới cho khóa học
   * POST /api/lecture/phases
   */
  createPhase = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lectureId = req.user?.userId;
      if (!lectureId) {
        this.error(res, 'Unauthorized', 401);
        return;
      }

      const { courseId, title } = req.body;

      // Verify lecture is assigned to this course
      const lectureCourse = await prisma.lectureCourse.findFirst({
        where: { courseId, lectureId },
      });

      if (!lectureCourse) {
        this.error(res, 'Bạn không có quyền tạo chương cho khóa học này', 403);
        return;
      }

      const phase = await phaseService.createPhase({ courseId, title });
      this.success(res, phase, 'Chương đã được tạo', 201);
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Tạo bài học mới trong chương
   * POST /api/lecture/lessons
   */
  createLesson = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lectureId = req.user?.userId;
      if (!lectureId) {
        this.error(res, 'Unauthorized', 401);
        return;
      }

      const { phaseId, title, type } = req.body;

      // Get phase and verify lecture has access to course
      const phase = await prisma.phase.findUnique({
        where: { id: phaseId },
        include: { course: true },
      });

      if (!phase) {
        this.error(res, 'Chương không tồn tại', 404);
        return;
      }

      // Verify lecture is assigned to this course
      const lectureCourse = await prisma.lectureCourse.findFirst({
        where: { courseId: phase.courseId, lectureId },
      });

      if (!lectureCourse) {
        this.error(res, 'Bạn không có quyền tạo bài học cho khóa học này', 403);
        return;
      }

      // Create lesson with DRAFT status
      const lesson = await lessonService.createLesson({
        phaseId,
        title,
        type,
        status: 'DRAFT',
      });

      // Create lesson request record (status IN_PROGRESS means lecture is working on it)
      const lessonRequest = await prisma.lessonRequest.create({
        data: {
          lectureId,
          lessonId: lesson.id,
          status: 'IN_PROGRESS',
        },
      });

      this.success(res, { ...lesson, lessonRequestId: lessonRequest.id }, 'Bài học đã được tạo', 201);
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Lấy nội dung bài học để chỉnh sửa
   * GET /api/lecture/lesson-content/:lessonId
   */
  getLessonContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lectureId = req.user?.userId;
      if (!lectureId) {
        this.error(res, 'Unauthorized', 401);
        return;
      }

      const { lessonId } = req.params;

      // Get lesson and verify lecture has access
      const lesson = await prisma.lesson.findUnique({
        where: { id: Array.isArray(lessonId) ? lessonId[0] : lessonId },
        include: {
          phase: {
            include: { course: true },
          },
          lessonContent: true,
          lessonRequest: true,
        },
      });

      if (!lesson) {
        this.error(res, 'Bài học không tồn tại', 404);
        return;
      }

      // Verify lecture is assigned to this course (skip for admin)
      const isAdmin = req.user?.roleName === 'admin';
      const lectureCourse = isAdmin ? { id: 'admin-bypass' } : await prisma.lectureCourse.findFirst({
        where: { courseId: lesson.phase.courseId, lectureId },
      });

      if (!lectureCourse) {
        this.error(res, 'Bạn không có quyền chỉnh sửa bài học này', 403);
        return;
      }

      this.success(res, lesson, 'Lesson content retrieved');
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Cập nhật nội dung bài học
   * PUT /api/lecture/lesson-content/:lessonId/content
   */
  updateLessonContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lectureId = req.user?.userId;
      if (!lectureId) {
        this.error(res, 'Unauthorized', 401);
        return;
      }

      const { lessonId } = req.params;
      const { content, testCases, hints, starterCode, timeLimit, memoryLimit } = req.body;

      // Verify lecture has access
      const lesson = await prisma.lesson.findUnique({
        where: { id: Array.isArray(lessonId) ? lessonId[0] : lessonId },
        include: {
          phase: { include: { course: true } },
          lessonRequest: true,
        },
      });

      if (!lesson) {
        this.error(res, 'Bài học không tồn tại', 404);
        return;
      }

      // Check if lesson request is in editable state (IN_PROGRESS or not exists)
      const lessonRequestData = Array.isArray(lesson.lessonRequest) ? lesson.lessonRequest[0] : lesson.lessonRequest;
      if (lessonRequestData && lessonRequestData.status !== 'IN_PROGRESS') {
        this.error(res, 'Bài học không thể chỉnh sửa ở trạng thái này', 400);
        return;
      }

      // Verify lecture is assigned to this course (skip for admin)
      const isAdmin = req.user?.roleName === 'admin';
      const lectureCourse = isAdmin ? { id: 'admin-bypass' } : await prisma.lectureCourse.findFirst({
        where: { courseId: (lesson as any).phase?.courseId, lectureId },
      });

      if (!lectureCourse) {
        this.error(res, 'Bạn không có quyền chỉnh sửa bài học này', 403);
        return;
      }

      // Update or create lesson content
      const result = await lessonContentService.updateLessonContent(Array.isArray(lessonId) ? lessonId[0] : lessonId, {
        content,
        testCases: typeof testCases === 'string' ? testCases : JSON.stringify(testCases),
        hints: typeof hints === 'string' ? hints : JSON.stringify(hints),
        starterCode,
        timeLimit,
        memoryLimit,
      });

      this.success(res, result, 'Nội dung đã được lưu');
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Cập nhật cấu hình chấm điểm
   * PUT /api/lecture/lesson-content/:lessonId/scoring
   */
  updateLessonScoring = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lectureId = req.user?.userId;
      if (!lectureId) {
        this.error(res, 'Unauthorized', 401);
        return;
      }

      const { lessonId } = req.params;
      const { baseScore, penaltyPerHint, timeBonusEnabled, timeBonusThreshold, timeBonusValue } = req.body;

      // Verify lecture has access
      const lesson = await prisma.lesson.findUnique({
        where: { id: Array.isArray(lessonId) ? lessonId[0] : lessonId },
        include: { phase: { include: { course: true } } },
      });

      if (!lesson) {
        this.error(res, 'Bài học không tồn tại', 404);
        return;
      }

      // Verify lecture is assigned to this course (skip for admin)
      const isAdminScoring = req.user?.roleName === 'admin';
      const lectureCourseScoring = isAdminScoring ? { id: 'admin-bypass' } : await prisma.lectureCourse.findFirst({
        where: { courseId: (lesson as any).phase?.courseId, lectureId },
      });

      if (!lectureCourseScoring) {
        this.error(res, 'Bạn không có quyền chỉnh sửa bài học này', 403);
        return;
      }

      const result = await lessonContentService.updateScoring(Array.isArray(lessonId) ? lessonId[0] : lessonId, {
        baseScore,
        penaltyPerHint,
        timeBonusEnabled,
        timeBonusThreshold,
        timeBonusValue,
      });

      this.success(res, result, 'Cấu hình chấm điểm đã được lưu');
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Nộp bài học để admin duyệt
   * PUT /api/lecture/lessons/:lessonId/submit
   */
  submitLesson = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lectureId = req.user?.userId;
      if (!lectureId) {
        this.error(res, 'Unauthorized', 401);
        return;
      }

      const { lessonId } = req.params;

      // Verify lecture has access
      const lesson = await prisma.lesson.findUnique({
        where: { id: Array.isArray(lessonId) ? lessonId[0] : lessonId },
        include: {
          phase: { include: { course: true } },
          lessonRequest: true,
          lessonContent: true,
        },
      });

      if (!lesson) {
        this.error(res, 'Bài học không tồn tại', 404);
        return;
      }

      // Verify lecture is assigned to this course
      const lectureCourse = await prisma.lectureCourse.findFirst({
        where: { courseId: (lesson as any).phase?.courseId, lectureId },
      });

      if (!lectureCourse) {
        this.error(res, 'Bạn không có quyền nộp bài học này', 403);
        return;
      }

      const lessonIdStr = Array.isArray(lessonId) ? lessonId[0] : lessonId;

      // Update lesson status
      await prisma.lesson.update({
        where: { id: lessonIdStr },
        data: { status: 'PENDING_REVIEW' },
      });

      // Update or create lesson request status
      const lessonRequestData = Array.isArray(lesson.lessonRequest) ? lesson.lessonRequest[0] : lesson.lessonRequest;
      if (lessonRequestData && lessonRequestData.id) {
        await prisma.lessonRequest.update({
          where: { id: lessonRequestData.id },
          data: { status: 'PENDING' },
        });
      } else {
        // Create lesson request if not exists
        await prisma.lessonRequest.create({
          data: {
            lectureId,
            lessonId: lessonIdStr,
            status: 'PENDING',
          },
        });
      }

      // Send notification to admins
      const admins = await prisma.user.findMany({
        where: { role: { name: 'admin' } },
      });

      for (const admin of admins) {
        await notificationService.createNotification({
          userId: admin.id,
          type: 'lesson_submitted',
          title: 'Bài học được nộp để duyệt',
          message: `Giảng viên đã nộp bài học "${lesson.title}" để duyệt. Vui lòng kiểm tra và duyệt.`,
        });
      }

      this.success(res, null, 'Bài học đã được nộp để duyệt');
    } catch (error: any) {
      next(error);
    }
  };
}

export default new LectureController();
