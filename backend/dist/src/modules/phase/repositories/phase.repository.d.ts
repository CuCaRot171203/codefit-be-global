/**
 * Phase Repository
 *
 * Xử lý các thao tác database cho Phase entity.
 * Kế thừa từ BaseRepository để có các CRUD operations cơ bản.
 */
import { BaseRepository } from '../../../base/base.repository';
import { Phase } from '../types';
/**
 * PhaseRepository - Quản lý database operations cho Phase
 * @class PhaseRepository
 * @extends BaseRepository<Phase>
 */
declare class PhaseRepository extends BaseRepository<Phase> {
    /** Prisma model được sử dụng cho các thao tác database */
    protected model: import(".prisma/client").Prisma.PhaseDelegate<import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    /**
     * Tìm tất cả các phase theo courseId
     * @param courseId - ID của khóa học cần lấy các phase
     * @returns Promise<Phase[]> - Danh sách các phase của khóa học
     */
    findByCourseId(courseId: string): Promise<Phase[]>;
    /**
     * Xóa tất cả các phase theo courseId
     * @param courseId - ID của khóa học cần xóa các phase
     */
    deleteByCourseId(courseId: string): Promise<void>;
}
declare const _default: PhaseRepository;
export default _default;
//# sourceMappingURL=phase.repository.d.ts.map