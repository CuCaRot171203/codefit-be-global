/**
 * Service layer cho module LessonRequest
 */
import { BaseService } from '../../../base/base.service';
import lessonRequestRepository from '../repositories/lessonRequest.repository';
declare class LessonRequestService extends BaseService<typeof lessonRequestRepository> {
    constructor();
    create(dto: {
        lessonId: string;
        lectureId: string;
        dueDate?: string;
        notes?: string;
    }): Promise<any>;
    getAll(): Promise<any[]>;
    getByLectureId(lectureId: string): Promise<any[]>;
    getPendingForLecture(lectureId: string): Promise<any[]>;
    getById(id: string): Promise<any>;
    update(id: string, dto: {
        status?: string;
        dueDate?: string;
        notes?: string;
    }): Promise<any>;
    delete(id: string): Promise<any>;
    submitForReview(id: string, lectureId: string): Promise<any>;
    startWorking(id: string, lectureId: string): Promise<any>;
    cancel(id: string): Promise<any>;
}
declare const _default: LessonRequestService;
export default _default;
//# sourceMappingURL=lessonRequest.service.d.ts.map