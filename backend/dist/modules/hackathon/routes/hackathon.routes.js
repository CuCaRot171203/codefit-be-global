/**
 * Định nghĩa các API routes cho module Hackathon
 * @module HackathonRoutes
 */
import { Router } from 'express';
import hackathonController from '../controllers/hackathon.controller';
import { verifyToken } from '../../../middleware/auth.middleware';
/** Khởi tạo Router cho hackathon routes */
const router = Router();
/**
 * POST /hackathons
 * Tạo mới một hackathon
 * Yêu cầu: Đã xác thực (verifyToken)
 */
router.post('/', verifyToken, (req, res, next) => hackathonController.create(req, res, next));
/**
 * GET /hackathons/active
 * Lấy danh sách hackathon đang diễn ra
 * Không yêu cầu xác thực
 */
router.get('/active', (req, res, next) => hackathonController.getActive(req, res, next));
/**
 * GET /hackathons/upcoming
 * Lấy danh sách hackathon sắp diễn ra
 * Không yêu cầu xác thực
 */
router.get('/upcoming', (req, res, next) => hackathonController.getUpcoming(req, res, next));
/**
 * GET /hackathons/ended
 * Lấy danh sách hackathon đã kết thúc
 * Không yêu cầu xác thực
 */
router.get('/ended', (req, res, next) => hackathonController.getEnded(req, res, next));
/**
 * GET /hackathons/registered
 * Lấy danh sách hackathon đã đăng ký của user hiện tại
 * Yêu cầu: Đã xác thực (verifyToken)
 */
router.get('/registered', verifyToken, (req, res, next) => hackathonController.getRegistered(req, res, next));
/**
 * GET /hackathons/:id
 * Lấy thông tin chi tiết của một hackathon
 * Không yêu cầu xác thực
 */
router.get('/:id', (req, res, next) => hackathonController.getById(req, res, next));
/**
 * GET /hackathons/:id/leaderboard
 * Lấy bảng xếp hạng của một hackathon
 * Không yêu cầu xác thực
 */
router.get('/:id/leaderboard', (req, res, next) => hackathonController.getLeaderboard(req, res, next));
/**
 * POST /hackathons/:id/join
 * Tham gia một hackathon
 * Yêu cầu: Đã xác thực (verifyToken)
 */
router.post('/:id/join', verifyToken, (req, res, next) => hackathonController.join(req, res, next));
/**
 * GET /hackathons/:id/participants
 * Lấy danh sách người tham gia của một hackathon
 * Không yêu cầu xác thực
 */
router.get('/:id/participants', (req, res, next) => hackathonController.getParticipants(req, res, next));
/**
 * POST /hackathons/:id/submit
 * Nộp dự án tham gia hackathon
 * Yêu cầu: Đã xác thực (verifyToken)
 */
router.post('/:id/submit', verifyToken, (req, res, next) => hackathonController.submitProject(req, res, next));
/**
 * GET /hackathons/:id/submissions
 * Lấy danh sách bài nộp của một hackathon
 * Không yêu cầu xác thực
 */
router.get('/:id/submissions', (req, res, next) => hackathonController.getSubmissions(req, res, next));
/**
 * PUT /hackathons/submissions/:submissionId/grade
 * Chấm điểm một bài nộp
 * Yêu cầu: Đã xác thực (verifyToken)
 */
router.put('/submissions/:submissionId/grade', verifyToken, (req, res, next) => hackathonController.gradeSubmission(req, res, next));
/**
 * POST /hackathons/:id/run-problem
 * Chạy code một bài trong hackathon (preview, không lưu)
 * Yêu cầu: Đã xác thực (verifyToken)
 */
router.post('/:id/run-problem', verifyToken, (req, res, next) => hackathonController.runProblem(req, res, next));
/**
 * POST /hackathons/:id/submit-problem
 * Nộp code một bài trong hackathon (chấm điểm + lưu)
 * Yêu cầu: Đã xác thực (verifyToken)
 */
router.post('/:id/submit-problem', verifyToken, (req, res, next) => hackathonController.submitProblem(req, res, next));
/**
 * GET /hackathons/:id/problems
 * Lấy danh sách bài problems của hackathon
 * Yêu cầu: Đã xác thực (verifyToken)
 */
router.get('/:id/problems', verifyToken, (req, res, next) => hackathonController.getProblems(req, res, next));
/** Export router để sử dụng trong ứng dụng */
export default router;
//# sourceMappingURL=hackathon.routes.js.map