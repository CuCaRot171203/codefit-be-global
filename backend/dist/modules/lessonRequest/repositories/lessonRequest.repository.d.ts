/**
 * Repository layer cho module LessonRequest
 */
import { BaseRepository } from '../../../base/base.repository';
import { LessonRequest, LessonRequestWithDetails } from '../types';
declare class LessonRequestRepository extends BaseRepository<LessonRequest> {
    protected model: import(".prisma/client").Prisma.LessonRequestDelegate<import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAllWithDetails(): Promise<LessonRequestWithDetails[]>;
    findByLectureId(lectureId: string): Promise<LessonRequestWithDetails[]>;
    findByIdWithDetails(id: string): Promise<LessonRequestWithDetails | null>;
    updateStatus(id: string, status: string): Promise<LessonRequest>;
    findPendingByLectureId(lectureId: string): Promise<LessonRequestWithDetails[]>;
}
declare const _default: LessonRequestRepository;
export default _default;
//# sourceMappingURL=lessonRequest.repository.d.ts.map