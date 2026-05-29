/**
 * Base Service - Cung cấp base class cho các service
 * Sử dụng composition pattern để inject repository vào service
 */
export declare class BaseService<T = any> {
    protected repository: T;
    /**
     * Khởi tạo BaseService
     * @param repository - Repository instance được inject (optional)
     */
    constructor(repository?: T);
}
export default BaseService;
//# sourceMappingURL=base.service.d.ts.map