"use strict";
/**
 * Leaderboard Routes
 *
 * Định nghĩa các API routes cho Leaderboard module.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leaderboard_controller_1 = __importDefault(require("../controllers/leaderboard.controller"));
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const router = (0, express_1.Router)();
/** GET /api/leaderboard - Lấy bảng xếp hạng toàn cục */
router.get('/', (req, res, next) => leaderboard_controller_1.default.getGlobal(req, res, next));
/** GET /api/leaderboard/course/:courseId - Lấy bảng xếp hạng theo khóa học */
router.get('/course/:courseId', (req, res, next) => leaderboard_controller_1.default.getCourseLeaderboard(req, res, next));
/** GET /api/leaderboard/my-rank - Lấy thứ hạng của người dùng hiện tại (yêu cầu auth) */
router.get('/my-rank', auth_middleware_1.verifyToken, (req, res, next) => leaderboard_controller_1.default.getMyRank(req, res, next));
exports.default = router;
//# sourceMappingURL=leaderboard.routes.js.map