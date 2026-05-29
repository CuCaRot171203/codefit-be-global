"use strict";
/**
 * Định nghĩa các API routes cho module Hackathon
 * @module HackathonRoutes
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hackathon_controller_1 = __importDefault(require("../controllers/hackathon.controller"));
const auth_middleware_1 = require("../../../middleware/auth.middleware");
/** Khởi tạo Router cho hackathon routes */
const router = (0, express_1.Router)();
/**
 * POST /hackathons
 * Tạo mới một hackathon
 * Yêu cầu: Đã xác thực (verifyToken)
 */
router.post('/', auth_middleware_1.verifyToken, (req, res, next) => hackathon_controller_1.default.create(req, res, next));
/**
 * GET /hackathons/active
 * Lấy danh sách hackathon đang diễn ra
 * Không yêu cầu xác thực
 */
router.get('/active', (req, res, next) => hackathon_controller_1.default.getActive(req, res, next));
/**
 * GET /hackathons/upcoming
 * Lấy danh sách hackathon sắp diễn ra
 * Không yêu cầu xác thực
 */
router.get('/upcoming', (req, res, next) => hackathon_controller_1.default.getUpcoming(req, res, next));
/**
 * GET /hackathons/ended
 * Lấy danh sách hackathon đã kết thúc
 * Không yêu cầu xác thực
 */
router.get('/ended', (req, res, next) => hackathon_controller_1.default.getEnded(req, res, next));
/**
 * GET /hackathons/registered
 * Lấy danh sách hackathon đã đăng ký của user hiện tại
 * Yêu cầu: Đã xác thực (verifyToken)
 */
router.get('/registered', auth_middleware_1.verifyToken, (req, res, next) => hackathon_controller_1.default.getRegistered(req, res, next));
/**
 * GET /hackathons/:id
 * Lấy thông tin chi tiết của một hackathon
 * Không yêu cầu xác thực
 */
router.get('/:id', (req, res, next) => hackathon_controller_1.default.getById(req, res, next));
/**
 * GET /hackathons/:id/leaderboard
 * Lấy bảng xếp hạng của một hackathon
 * Không yêu cầu xác thực
 */
router.get('/:id/leaderboard', (req, res, next) => hackathon_controller_1.default.getLeaderboard(req, res, next));
/**
 * POST /hackathons/:id/join
 * Tham gia một hackathon
 * Yêu cầu: Đã xác thực (verifyToken)
 */
router.post('/:id/join', auth_middleware_1.verifyToken, (req, res, next) => hackathon_controller_1.default.join(req, res, next));
/**
 * GET /hackathons/:id/participants
 * Lấy danh sách người tham gia của một hackathon
 * Không yêu cầu xác thực
 */
router.get('/:id/participants', (req, res, next) => hackathon_controller_1.default.getParticipants(req, res, next));
/**
 * POST /hackathons/:id/submit
 * Nộp dự án tham gia hackathon
 * Yêu cầu: Đã xác thực (verifyToken)
 */
router.post('/:id/submit', auth_middleware_1.verifyToken, (req, res, next) => hackathon_controller_1.default.submitProject(req, res, next));
/**
 * GET /hackathons/:id/submissions
 * Lấy danh sách bài nộp của một hackathon
 * Không yêu cầu xác thực
 */
router.get('/:id/submissions', (req, res, next) => hackathon_controller_1.default.getSubmissions(req, res, next));
/**
 * PUT /hackathons/submissions/:submissionId/grade
 * Chấm điểm một bài nộp
 * Yêu cầu: Đã xác thực (verifyToken)
 */
router.put('/submissions/:submissionId/grade', auth_middleware_1.verifyToken, (req, res, next) => hackathon_controller_1.default.gradeSubmission(req, res, next));
/**
 * POST /hackathons/:id/run-problem
 * Chạy code một bài trong hackathon (preview, không lưu)
 * Yêu cầu: Đã xác thực (verifyToken)
 */
router.post('/:id/run-problem', auth_middleware_1.verifyToken, (req, res, next) => hackathon_controller_1.default.runProblem(req, res, next));
/**
 * POST /hackathons/:id/submit-problem
 * Nộp code một bài trong hackathon (chấm điểm + lưu)
 * Yêu cầu: Đã xác thực (verifyToken)
 */
router.post('/:id/submit-problem', auth_middleware_1.verifyToken, (req, res, next) => hackathon_controller_1.default.submitProblem(req, res, next));
/**
 * GET /hackathons/:id/problems
 * Lấy danh sách bài problems của hackathon
 * Yêu cầu: Đã xác thực (verifyToken)
 */
router.get('/:id/problems', auth_middleware_1.verifyToken, (req, res, next) => hackathon_controller_1.default.getProblems(req, res, next));
/** Export router để sử dụng trong ứng dụng */
exports.default = router;
//# sourceMappingURL=hackathon.routes.js.map