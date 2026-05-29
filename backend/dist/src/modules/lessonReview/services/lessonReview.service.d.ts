/**
 * Service layer cho module LessonReview
 */
import { BaseService } from '../../../base/base.service';
import lessonReviewRepository from '../repositories/lessonReview.repository';
declare class LessonReviewService extends BaseService<typeof lessonReviewRepository> {
    constructor();
    getPendingReviews(): Promise<any[]>;
    getReviewDetails(lessonId: string): Promise<any>;
    approve(lessonId: string, adminId: string, feedback?: string): Promise<any>;
    reject(lessonId: string, adminId: string, feedback: string): Promise<any>;
    publish(lessonId: string, adminId: string): Promise<any>;
    /**
     * Auto enroll users who are not enrolled in the course
     */
    private autoEnrollUsers;
    batchApprove(lessonIds: string[], adminId: string): Promise<any>;
    batchPublish(lessonIds: string[], adminId: string): Promise<any>;
    getAllReviews(): Promise<any[]>;
}
declare const _default: LessonReviewService;
export default _default;
//# sourceMappingURL=lessonReview.service.d.ts.map