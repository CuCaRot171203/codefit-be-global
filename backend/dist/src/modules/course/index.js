"use strict";
/**
 * @file Entry point cho module Course.
 * Export các thành phần công khai của module để sử dụng ở các nơi khác trong ứng dụng.
 * @module course
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseRoutes = void 0;
/**
 * Re-export course routes để sử dụng trong cấu hình app/router chính.
 * Sử dụng: import { courseRoutes } from '@/modules/course';
 */
var routes_1 = require("./routes");
Object.defineProperty(exports, "courseRoutes", { enumerable: true, get: function () { return routes_1.courseRoutes; } });
//# sourceMappingURL=index.js.map