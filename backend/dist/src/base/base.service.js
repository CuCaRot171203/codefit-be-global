"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
/**
 * Base Service - Cung cấp base class cho các service
 * Sử dụng composition pattern để inject repository vào service
 */
class BaseService {
    repository;
    /**
     * Khởi tạo BaseService
     * @param repository - Repository instance được inject (optional)
     */
    constructor(repository) {
        this.repository = repository;
    }
}
exports.BaseService = BaseService;
exports.default = BaseService;
//# sourceMappingURL=base.service.js.map