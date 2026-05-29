"use strict";
/**
 * Service layer cho module LessonRequest
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_service_1 = require("../../../base/base.service");
const lessonRequest_repository_1 = __importDefault(require("../repositories/lessonRequest.repository"));
const notification_service_1 = __importDefault(require("../../notification/services/notification.service"));
class LessonRequestService extends base_service_1.BaseService {
    constructor() {
        super(lessonRequest_repository_1.default);
    }
    async create(dto) {
        const lesson = await this.repository.findLessonById(dto.lessonId);
        if (!lesson) {
            throw new Error('Lesson not found');
        }
        const lecture = await this.repository.findLectureById(dto.lectureId);
        if (!lecture) {
            throw new Error('Lecture user not found');
        }
        if (lecture.role?.name !== 'lecture') {
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
        await notification_service_1.default.createNotification({
            userId: dto.lectureId,
            type: 'lesson_request',
            title: 'Yêu cầu tạo bài học mới',
            message: `Bạn được giao yêu cầu tạo bài học: ${lesson.title}. Vui lòng kiểm tra và bắt đầu làm việc.`,
        });
        return lessonRequest;
    }
    async getAll() {
        return this.repository.findAllWithDetails();
    }
    async getByLectureId(lectureId) {
        return this.repository.findByLectureId(lectureId);
    }
    async getPendingForLecture(lectureId) {
        return this.repository.findPendingByLectureId(lectureId);
    }
    async getById(id) {
        const request = await this.repository.findByIdWithDetails(id);
        if (!request) {
            throw new Error('Lesson request not found');
        }
        return request;
    }
    async update(id, dto) {
        const request = await this.repository.findById(id);
        if (!request) {
            throw new Error('Lesson request not found');
        }
        const updateData = {};
        if (dto.status)
            updateData.status = dto.status;
        if (dto.dueDate !== undefined)
            updateData.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
        if (dto.notes !== undefined)
            updateData.notes = dto.notes;
        return this.repository.update(id, updateData);
    }
    async delete(id) {
        const request = await this.repository.findById(id);
        if (!request) {
            throw new Error('Lesson request not found');
        }
        return this.repository.delete(id);
    }
    async submitForReview(id, lectureId) {
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
        await this.repository.updateLessonStatus(request.lessonId, 'PENDING_REVIEW');
        const admins = await this.repository.findAdmins();
        for (const admin of admins) {
            await notification_service_1.default.createNotification({
                userId: admin.id,
                type: 'lesson_submitted',
                title: 'Bài học được nộp để duyệt',
                message: `Lecture đã nộp bài học để duyệt. Vui lòng kiểm tra và duyệt.`,
            });
        }
        return updated;
    }
    async startWorking(id, lectureId) {
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
        await this.repository.upsertLessonContent(request.lessonId);
        await this.repository.upsertScoringConfig(request.lessonId);
        return updated;
    }
    async cancel(id) {
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
exports.default = new LessonRequestService();
//# sourceMappingURL=lessonRequest.service.js.map