/**
 * Service layer cho module LessonRequest
 */

import { BaseService } from '../../../base/base.service';
import lessonRequestRepository from '../repositories/lessonRequest.repository';
import notificationService from '../../notification/services/notification.service';

class LessonRequestService extends BaseService<typeof lessonRequestRepository> {
  constructor() {
    super(lessonRequestRepository);
  }

  async create(dto: {
    lessonId: string;
    lectureId: string;
    dueDate?: string;
    notes?: string;
  }): Promise<any> {
    // Check if lesson exists
    const lesson = await this.repository.model.lesson.findUnique({
      where: { id: dto.lessonId },
    });
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    // Check if lecture exists and has lecture role
    const lecture = await this.repository.model.lecture.findUnique({
      where: { id: dto.lectureId },
      include: { role: true },
    });
    if (!lecture) {
      throw new Error('Lecture user not found');
    }
    if (lecture.role.name !== 'lecture') {
      throw new Error('User is not a lecture');
    }

    // Create the lesson request
    const lessonRequest = await this.repository.create({
      lessonId: dto.lessonId,
      lectureId: dto.lectureId,
      status: 'PENDING',
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      notes: dto.notes || null,
    });

    // Send notification to lecture
    await notificationService.createNotification({
      userId: dto.lectureId,
      type: 'lesson_request',
      title: 'Yêu cầu tạo bài học mới',
      message: `Bạn được giao yêu cầu tạo bài học: ${lesson.title}. Vui lòng kiểm tra và bắt đầu làm việc.`,
    });

    return lessonRequest;
  }

  async getAll(): Promise<any[]> {
    return this.repository.findAllWithDetails();
  }

  async getByLectureId(lectureId: string): Promise<any[]> {
    return this.repository.findByLectureId(lectureId);
  }

  async getPendingForLecture(lectureId: string): Promise<any[]> {
    return this.repository.findPendingByLectureId(lectureId);
  }

  async getById(id: string): Promise<any> {
    const request = await this.repository.findByIdWithDetails(id);
    if (!request) {
      throw new Error('Lesson request not found');
    }
    return request;
  }

  async update(id: string, dto: {
    status?: string;
    dueDate?: string;
    notes?: string;
  }): Promise<any> {
    const request = await this.repository.findById(id);
    if (!request) {
      throw new Error('Lesson request not found');
    }

    const updateData: any = {};
    if (dto.status) updateData.status = dto.status;
    if (dto.dueDate !== undefined) updateData.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
    if (dto.notes !== undefined) updateData.notes = dto.notes;

    return this.repository.update(id, updateData);
  }

  async delete(id: string): Promise<any> {
    const request = await this.repository.findById(id);
    if (!request) {
      throw new Error('Lesson request not found');
    }
    return this.repository.delete(id);
  }

  async submitForReview(id: string, lectureId: string): Promise<any> {
    const request = await this.repository.findById(id);
    if (!request) {
      throw new Error('Lesson request not found');
    }
    if (request.lectureId !== lectureId) {
      throw new Error('You are not authorized to submit this request');
    }
    if (request.status !== 'IN_PROGRESS') {
      throw new Error('Lesson must be in progress before submitting');
    }

    // Update status to SUBMITTED
    const updated = await this.repository.updateStatus(id, 'SUBMITTED');

    // Update lesson status to PENDING_REVIEW
    await this.repository.model.lesson.update({
      where: { id: request.lessonId },
      data: { status: 'PENDING_REVIEW' },
    });

    // Notify admins
    const admins = await this.repository.model.user.findMany({
      where: { role: { name: 'admin' } },
    });

    for (const admin of admins) {
      await notificationService.createNotification({
        userId: admin.id,
        type: 'lesson_submitted',
        title: 'Bài học được nộp để duyệt',
        message: `Lecture đã nộp bài học để duyệt. Vui lòng kiểm tra và duyệt.`,
      });
    }

    return updated;
  }

  async startWorking(id: string, lectureId: string): Promise<any> {
    const request = await this.repository.findById(id);
    if (!request) {
      throw new Error('Lesson request not found');
    }
    if (request.lectureId !== lectureId) {
      throw new Error('You are not authorized to start this request');
    }
    if (request.status === 'IN_PROGRESS') {
      // Already started — return success without error (idempotent)
      return request;
    }
    if (request.status !== 'PENDING') {
      throw new Error('Cannot start a lesson that is not pending');
    }

    // Update status to IN_PROGRESS
    const updated = await this.repository.updateStatus(id, 'IN_PROGRESS');

    // Create lesson content if not exists
    await this.repository.model.lessonContent.upsert({
      where: { lessonId: request.lessonId },
      create: {
        lessonId: request.lessonId,
        content: '',
        testCases: '[]',
        hints: '[]',
      },
      update: {},
    });

    // Create scoring config if not exists
    await this.repository.model.scoringConfig.upsert({
      where: { lessonId: request.lessonId },
      create: {
        lessonId: request.lessonId,
        baseScore: 100,
        penaltyPerHint: 10,
      },
      update: {},
    });

    return updated;
  }

  async cancel(id: string): Promise<any> {
    const request = await this.repository.findById(id);
    if (!request) {
      throw new Error('Lesson request not found');
    }
    if (request.status === 'SUBMITTED') {
      throw new Error('Cannot cancel submitted request');
    }

    return this.repository.updateStatus(id, 'CANCELLED');
  }
}

export default new LessonRequestService();
