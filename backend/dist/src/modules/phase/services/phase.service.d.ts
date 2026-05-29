/**
 * Phase Service
 *
 * Chứa business logic cho các thao tác với Phase.
 * Xử lý validation và gọi repository để tương tác với database.
 */
import { BaseService } from '../../../base/base.service';
import phaseRepository from '../repositories/phase.repository';
import { CreatePhaseDto, UpdatePhaseDto } from '../types';
/**
 * PhaseService - Business logic layer cho Phase
 * @class PhaseService
 * @extends BaseService
 */
declare class PhaseService extends BaseService<typeof phaseRepository> {
    constructor();
    /**
     * Tạo mới một phase
     * @param dto - Dữ liệu tạo phase bao gồm courseId và title
     * @returns Promise<Phase> - Phase vừa được tạo
     * @throws Error - Nếu thiếu courseId hoặc title
     */
    create(dto: CreatePhaseDto): Promise<any>;
    /**
     * Tạo phase với auto orderIndex
     * @param params - courseId và title
     * @returns Promise<Phase>
     */
    createPhase(params: {
        courseId: string;
        title: string;
    }): Promise<any>;
    /**
     * Lấy tất cả các phase của một khóa học
     * @param courseId - ID của khóa học
     * @returns Promise<Phase[]> - Danh sách các phase
     */
    getByCourseId(courseId: string): Promise<any[]>;
    /**
     * Lấy một phase theo ID
     * @param id - ID của phase cần lấy
     * @returns Promise<Phase | null> - Phase tìm được hoặc null
     */
    getById(id: string): Promise<any | null>;
    /**
     * Cập nhật một phase
     * @param id - ID của phase cần cập nhật
     * @param dto - Dữ liệu cập nhật (title và/hoặc orderIndex)
     * @returns Promise<Phase> - Phase sau khi cập nhật
     * @throws Error - Nếu phase không tồn tại
     */
    update(id: string, dto: UpdatePhaseDto): Promise<any>;
    /**
     * Xóa một phase
     * @param id - ID của phase cần xóa
     * @returns Promise<{ message: string }> - Thông báo thành công
     * @throws Error - Nếu phase không tồn tại
     */
    delete(id: string): Promise<{
        message: string;
    }>;
}
declare const _default: PhaseService;
export default _default;
//# sourceMappingURL=phase.service.d.ts.map