/**
 * Repository layer cho module LessonReview
 */
import { BaseRepository } from '../../../base/base.repository';
import { LessonReview, LessonReviewWithDetails } from '../types';
declare class LessonReviewRepository extends BaseRepository<LessonReview> {
    protected model: import(".prisma/client").Prisma.LessonReviewDelegate<import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findByLessonId(lessonId: string): Promise<LessonReview | null>;
    findWithDetails(lessonId: string): Promise<LessonReviewWithDetails | null>;
    findPendingReviews(): Promise<LessonReviewWithDetails[]>;
    createReview(lessonId: string, adminId: string, feedback?: string): Promise<LessonReview>;
    findAll(): Promise<LessonReviewWithDetails[]>;
}
declare const _default: LessonReviewRepository;
export default _default;
//# sourceMappingURL=lessonReview.repository.d.ts.map