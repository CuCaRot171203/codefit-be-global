/**
 * @fileoverview Lecture Submissions Controller
 * Handles lecture actions on lesson submissions (approve, reject, bulk email)
 */

import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../base/base.controller';
import prisma from '../../../prisma';
import emailService from '../../email/email.service';
import notificationService from '../../notification/services/notification.service';

class LectureSubmissionController extends BaseController {
  /**
   * Get all lesson submissions for lessons that this lecture owns
   */
  getSubmissions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lectureId = req.user?.userId;
      if (!lectureId) {
        this.error(res, 'Unauthorized', 401);
        return;
      }

      const { lessonId, courseId, status, page = '1', limit = '20' } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Get lessons that belong to this lecture's courses
      const lectureCourseIds = await prisma.lectureCourse.findMany({
        where: { lectureId },
        select: { courseId: true },
      });

      const courseIds = lectureCourseIds.map((lc) => lc.courseId);

      // Build where clause
      const whereClause: any = {};
      
      if (lessonId) {
        whereClause.lessonId = lessonId;
      }
      
      if (courseId) {
        whereClause.lesson = {
          phase: {
            courseId: courseId as string,
          },
        };
      } else if (courseIds.length > 0) {
        whereClause.lesson = {
          phase: {
            courseId: { in: courseIds },
          },
        };
      } else {
        // No courses assigned, return empty
        this.success(res, { submissions: [], total: 0, page: pageNum, limit: limitNum });
        return;
      }

      if (status) {
        whereClause.status = status;
      }

      const [submissions, total] = await Promise.all([
        prisma.lessonSubmission.findMany({
          where: whereClause,
          include: {
            user: {
              select: {
                id: true,
                username: true,
                fullName: true,
                email: true,
              },
            },
            lesson: {
              select: {
                id: true,
                title: true,
                type: true,
                phase: {
                  select: {
                    title: true,
                    course: {
                      select: {
                        id: true,
                        title: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limitNum,
        }),
        prisma.lessonSubmission.count({ where: whereClause }),
      ]);

      this.success(res, { submissions, total, page: pageNum, limit: limitNum });
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Approve a single submission score
   */
  approveSubmission = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lectureId = req.user?.userId;
      if (!lectureId) {
        this.error(res, 'Unauthorized', 401);
        return;
      }

      const { id } = req.params;
      const { score } = req.body;

      // Get submission with lesson info
      const submission = await prisma.lessonSubmission.findUnique({
        where: { id },
        include: {
          lesson: {
            include: {
              phase: {
                include: {
                  course: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
              email: true,
            },
          },
        },
      });

      if (!submission) {
        this.error(res, 'Submission not found', 404);
        return;
      }

      // Verify lecture owns this course
      const lectureCourse = await prisma.lectureCourse.findFirst({
        where: {
          lectureId,
          courseId: submission.lesson.phase.courseId,
        },
      });

      if (!lectureCourse) {
        this.error(res, 'You do not have permission to approve this submission', 403);
        return;
      }

      // Update submission
      const updated = await prisma.lessonSubmission.update({
        where: { id },
        data: {
          status: 'APPROVED',
          reviewedAt: new Date(),
          reviewedBy: lectureId,
          ...(score !== undefined && { score }),
        },
      });

      // Send notification to user
      await notificationService.createNotification({
        userId: submission.userId,
        type: 'submission_approved',
        title: 'Bài tập đã được duyệt',
        message: `Bài tập "${submission.lesson.title}" đã được giảng viên duyệt. Điểm: ${updated.score || 0}`,
      });

      // Send email to user
      await emailService.sendScoreNotification(
        submission.user.email,
        submission.user.fullName || submission.user.username,
        submission.lesson.title,
        submission.lesson.phase.course.title,
        updated.score || 0,
        submission.passedTests || 0,
        submission.totalTests || 0,
        `${process.env.FRONTEND_URL || 'http://localhost:5173'}/user/lessons/${submission.lessonId}`
      );

      this.success(res, updated, 'Submission approved successfully');
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Reject a single submission
   */
  rejectSubmission = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lectureId = req.user?.userId;
      if (!lectureId) {
        this.error(res, 'Unauthorized', 401);
        return;
      }

      const { id } = req.params;
      const { feedback } = req.body;

      // Get submission with lesson info
      const submission = await prisma.lessonSubmission.findUnique({
        where: { id },
        include: {
          lesson: {
            include: {
              phase: {
                include: {
                  course: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
              email: true,
            },
          },
        },
      });

      if (!submission) {
        this.error(res, 'Submission not found', 404);
        return;
      }

      // Verify lecture owns this course
      const lectureCourse = await prisma.lectureCourse.findFirst({
        where: {
          lectureId,
          courseId: submission.lesson.phase.courseId,
        },
      });

      if (!lectureCourse) {
        this.error(res, 'You do not have permission to reject this submission', 403);
        return;
      }

      // Update submission
      const updated = await prisma.lessonSubmission.update({
        where: { id },
        data: {
          status: 'REJECTED',
          reviewedAt: new Date(),
          reviewedBy: lectureId,
        },
      });

      // Send notification to user
      await notificationService.createNotification({
        userId: submission.userId,
        type: 'submission_rejected',
        title: 'Bài tập cần chỉnh sửa',
        message: `Bài tập "${submission.lesson.title}" cần được chỉnh sửa thêm.${feedback ? ` Phản hồi: ${feedback}` : ''}`,
      });

      this.success(res, updated, 'Submission rejected');
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Bulk approve submissions and send emails
   */
  bulkApprove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lectureId = req.user?.userId;
      if (!lectureId) {
        this.error(res, 'Unauthorized', 401);
        return;
      }

      const { submissionIds } = req.body;

      if (!Array.isArray(submissionIds) || submissionIds.length === 0) {
        this.error(res, 'submissionIds must be a non-empty array', 400);
        return;
      }

      // Get all submissions
      const submissions = await prisma.lessonSubmission.findMany({
        where: { id: { in: submissionIds } },
        include: {
          lesson: {
            include: {
              phase: {
                include: {
                  course: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
              email: true,
            },
          },
        },
      });

      // Verify all submissions belong to lecture's courses
      const lectureCourseIds = await prisma.lectureCourse.findMany({
        where: { lectureId },
        select: { courseId: true },
      });
      const allowedCourseIds = lectureCourseIds.map((lc) => lc.courseId);

      const unauthorized = submissions.filter(
        (s) => !allowedCourseIds.includes(s.lesson.phase.courseId)
      );

      if (unauthorized.length > 0) {
        this.error(res, 'You do not have permission to approve some submissions', 403);
        return;
      }

      // Update all submissions
      const now = new Date();
      await prisma.lessonSubmission.updateMany({
        where: { id: { in: submissionIds } },
        data: {
          status: 'APPROVED',
          reviewedAt: now,
          reviewedBy: lectureId,
        },
      });

      // Send notifications and emails to all users
      const results = [];
      for (const submission of submissions) {
        // Create notification
        await notificationService.createNotification({
          userId: submission.userId,
          type: 'submission_approved',
          title: 'Bài tập đã được duyệt',
          message: `Bài tập "${submission.lesson.title}" đã được giảng viên duyệt. Điểm: ${submission.score || 0}`,
        });

        // Send email
        await emailService.sendScoreNotification(
          submission.user.email,
          submission.user.fullName || submission.user.username,
          submission.lesson.title,
          submission.lesson.phase.course.title,
          submission.score || 0,
          submission.passedTests || 0,
          submission.totalTests || 0,
          `${process.env.FRONTEND_URL || 'http://localhost:5173'}/user/lessons/${submission.lessonId}`
        );

        results.push({
          submissionId: submission.id,
          userId: submission.userId,
          email: submission.user.email,
        });
      }

      this.success(res, {
        approved: submissionIds.length,
        results,
      }, 'Bulk approval completed and emails sent');
    } catch (error: any) {
      next(error);
    }
  };
}

export default new LectureSubmissionController();
