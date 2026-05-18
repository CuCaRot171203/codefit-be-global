/**
 * Service layer cho module LessonReview
 */

import { BaseService } from '../../../base/base.service';
import lessonReviewRepository from '../repositories/lessonReview.repository';
import notificationService from '../../notification/services/notification.service';
import emailService from '../../email/email.service';
import prisma from '../../../prisma';

class LessonReviewService extends BaseService<typeof lessonReviewRepository> {
  constructor() {
    super(lessonReviewRepository);
  }

  async getPendingReviews(): Promise<any[]> {
    return this.repository.findPendingReviews();
  }

  async getReviewDetails(lessonId: string): Promise<any> {
    const review = await this.repository.findWithDetails(lessonId);
    if (!review) {
      // Return lesson details even without review
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
          phase: {
            include: {
              course: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
          lessonContent: true,
          lessonRequest: {
            include: {
              lecture: {
                select: {
                  id: true,
                  username: true,
                  fullName: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (!lesson) {
        throw new Error('Lesson not found');
      }

      return {
        id: lesson.id,
        lessonId: lesson.id,
        adminId: '',
        status: lesson.status,
        feedback: null,
        reviewedAt: lesson.createdAt,
        createdAt: lesson.createdAt,
        updatedAt: lesson.updatedAt,
        lesson: {
          id: lesson.id,
          title: lesson.title,
          type: lesson.type,
          status: lesson.status,
          phase: lesson.phase,
        },
        lessonContent: lesson.lessonContent ? {
          content: lesson.lessonContent.content,
          testCases: lesson.lessonContent.testCases,
          hints: lesson.lessonContent.hints,
          starterCode: lesson.lessonContent.starterCode,
        } : null,
      };
    }
    return review;
  }

  async approve(lessonId: string, adminId: string, feedback?: string): Promise<any> {
    // Get lesson info
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new Error('Lesson not found');
    }

    // Get lessonRequest with lecture info
    const lessonRequest = await prisma.lessonRequest.findFirst({
      where: { lessonId },
      include: {
        lecture: {
          select: { id: true, email: true, fullName: true },
        },
      },
    });

    console.log('[LESSON REVIEW] Approve - lessonRequest:', lessonRequest);

    if (!lessonRequest) {
      throw new Error('Lesson request not found');
    }

    // Update lesson status to APPROVED
    await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        status: 'APPROVED',
      },
    });

    // Create review record
    const review = await this.repository.createReview(lessonId, adminId, feedback);

    // Notify lecture via email
    if (lessonRequest.lecture) {
      await emailService.sendLessonApprovedNotification(
        lessonRequest.lecture.email,
        lessonRequest.lecture.fullName || 'Giảng viên',
        lesson.title
      );

      await notificationService.createNotification({
        userId: lessonRequest.lecture.id,
        type: 'lesson_approved',
        title: 'Bài học được duyệt thành công!',
        message: `Bài học "${lesson.title}" đã được admin duyệt. Bạn có thể xuất bản hoặc tiếp tục chỉnh sửa.`,
        metadata: {
          lessonId: lessonId,
          lessonTitle: lesson.title,
          status: 'APPROVED',
          feedback: feedback || null,
          actionUrl: `/lecture/lessons/${lessonId}/edit`,
        },
      });
    }

    return review;
  }

  async reject(lessonId: string, adminId: string, feedback: string): Promise<any> {
    if (!feedback) {
      throw new Error('Feedback is required when rejecting');
    }

    // Get lesson info
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new Error('Lesson not found');
    }

    // Get lessonRequest with lecture info
    const lessonRequest = await prisma.lessonRequest.findFirst({
      where: { lessonId },
      include: {
        lecture: {
          select: { id: true, email: true, fullName: true },
        },
      },
    });

    // Update lesson status to REJECTED
    await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        status: 'REJECTED',
      },
    });

    // Update lesson request status
    if (lessonRequest && lessonRequest.id) {
      await prisma.lessonRequest.update({
        where: { id: lessonRequest.id },
        data: { status: 'IN_PROGRESS' },
      });
    }

    // Create review record
    const review = await this.repository.createReview(lessonId, adminId, feedback);

    // Notify lecture via email
    if (lessonRequest?.lecture) {
      await emailService.sendLessonRejectedNotification(
        lessonRequest.lecture.email,
        lessonRequest.lecture.fullName || 'Giảng viên',
        lesson.title,
        feedback
      );

      await notificationService.createNotification({
        userId: lessonRequest.lecture.id,
        type: 'lesson_rejected',
        title: 'Bài học bị từ chối duyệt',
        message: `Bài học "${lesson.title}" đã bị từ chối. Lý do: ${feedback}`,
        metadata: {
          lessonId: lessonId,
          lessonTitle: lesson.title,
          status: 'REJECTED',
          feedback: feedback,
          actionUrl: `/lecture/lessons/${lessonId}/edit`,
        },
      });
    }

    return review;
  }

  async publish(lessonId: string, adminId: string): Promise<any> {
    // Get lesson info with phase and course
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        phase: {
          include: {
            course: {
              include: {
                enrollments: {
                  select: { userId: true },
                },
              },
            },
          },
        },
      },
    });

    // Get lessonRequest with lecture info
    const lessonRequest = await prisma.lessonRequest.findFirst({
      where: { lessonId },
      include: {
        lecture: {
          select: { id: true, email: true, fullName: true },
        },
      },
    });

    if (!lesson) {
      throw new Error('Lesson not found');
    }

    if (lesson.status !== 'APPROVED') {
      throw new Error('Lesson must be approved before publishing');
    }

    // Update lesson status to PUBLISHED
    await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        status: 'PUBLISHED',
        isPublished: true,
        publishedAt: new Date(),
      },
    });

    // Notify lecture via email and notification when published
    if (lessonRequest?.lecture) {
      await emailService.sendLessonApprovedNotification(
        lessonRequest.lecture.email,
        lessonRequest.lecture.fullName || 'Giảng viên',
        lesson.title
      );

      await notificationService.createNotification({
        userId: lessonRequest.lecture.id,
        type: 'lesson_published',
        title: 'Bài học đã được xuất bản!',
        message: `Bài học "${lesson.title}" đã được xuất bản thành công và sẵn sàng cho học viên.`,
        metadata: {
          lessonId: lessonId,
          lessonTitle: lesson.title,
          status: 'PUBLISHED',
          courseId: lesson.phase.courseId,
          courseTitle: lesson.phase.course.title,
          actionUrl: `/lecture/lessons/${lessonId}/edit`,
        },
      });
    }

    // Notify all enrolled users
    const enrolledUserIds = lesson.phase.course.enrollments.map((e) => e.userId);
    for (const userId of enrolledUserIds) {
      await notificationService.createNotification({
        userId,
        type: 'new_lesson_available',
        title: 'Bài học mới',
        message: `Khóa học "${lesson.phase.course.title}" vừa có bài học mới: "${lesson.title}"`,
      });

      // Send email to user
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        const lessonUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/user/khoa-hoc/${lessonId}`;
        await emailService.sendNewLessonNotification(
          user.email,
          user.fullName || user.username,
          lesson.phase.course.title,
          lesson.title,
          lessonUrl
        );
      }
    }

    // Update lesson request to SUBMITTED
    if (lessonRequest && lessonRequest.id) {
      await prisma.lessonRequest.update({
        where: { id: lessonRequest.id },
        data: { status: 'SUBMITTED' },
      });
    }

    // Auto enroll users who are not enrolled yet (if course.autoEnrollOnApproval is true)
    if (lesson.phase.course.autoEnrollOnApproval) {
      await this.autoEnrollUsers(lesson.phase.course.id, lesson.phase.course.title, lesson.id, lesson.title);
    }

    return lesson;
  }

  /**
   * Auto enroll users who are not enrolled in the course
   */
  private async autoEnrollUsers(courseId: string, courseTitle: string, lessonId: string, lessonTitle: string): Promise<void> {
    // Get all users with 'user' role who are not enrolled
    const usersToEnroll = await prisma.user.findMany({
      where: {
        role: {
          name: 'user',
        },
        enrollments: {
          none: {
            courseId,
          },
        },
        subscriptions: {
          none: {
            courseId,
          },
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
      },
    });

    if (usersToEnroll.length === 0) {
      console.log(`[LessonReview] No users to auto-enroll for course: ${courseTitle}`);
      return;
    }

    // Create subscriptions for all users
    await prisma.courseSubscription.createMany({
      data: usersToEnroll.map((user) => ({
        userId: user.id,
        courseId,
        status: 'ACTIVE',
      })),
      skipDuplicates: true,
    });

    console.log(`[LessonReview] Auto-enrolled ${usersToEnroll.length} users for course: ${courseTitle}`);

    // Send notifications and emails to newly enrolled users
    const lessonUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/user/khoa-hoc/${courseId}`;

    for (const user of usersToEnroll) {
      // Create notification
      await notificationService.createNotification({
        userId: user.id,
        type: 'new_lesson_available',
        title: 'Bạn đã được thêm vào khóa học',
        message: `Bạn đã được thêm vào khóa học "${courseTitle}" với bài học mới: "${lessonTitle}"`,
      });

      // Send email
      await emailService.sendNewLessonNotification(
        user.email,
        user.fullName || user.username,
        courseTitle,
        lessonTitle,
        lessonUrl
      );
    }
  }

  async batchApprove(lessonIds: string[], adminId: string): Promise<any> {
    const results = [];
    for (const lessonId of lessonIds) {
      try {
        const result = await this.approve(lessonId, adminId);
        results.push({ lessonId, success: true, result });
      } catch (error: any) {
        results.push({ lessonId, success: false, error: error.message });
      }
    }
    return results;
  }

  async batchPublish(lessonIds: string[], adminId: string): Promise<any> {
    const results = [];
    for (const lessonId of lessonIds) {
      try {
        const result = await this.publish(lessonId, adminId);
        results.push({ lessonId, success: true, result });
      } catch (error: any) {
        results.push({ lessonId, success: false, error: error.message });
      }
    }
    return results;
  }

  async getAllReviews(): Promise<any[]> {
    return this.repository.findAll();
  }
}

export default new LessonReviewService();
