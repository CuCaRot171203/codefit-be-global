/**
 * Base Service - Cung cấp base class cho các service
 * Sử dụng composition pattern để inject repository vào service
 */
export class BaseService {
    repository;
    /**
     * Khởi tạo BaseService
     * @param repository - Repository instance được inject (optional)
     */
    constructor(repository) {
        this.repository = repository;
    }
}
export default BaseService;
//# sourceMappingURL=base.service.js.map