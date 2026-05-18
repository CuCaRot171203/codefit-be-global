/**
 * Testcase Routes
 *
 * Định nghĩa các API routes cho Testcase module.
 */
import { Router } from 'express';
import testcaseController from '../controllers/testcase.controller';
const router = Router();
/** POST /api/testcases - Tạo mới một testcase */
router.post('/', (req, res, next) => testcaseController.create(req, res, next));
/** GET /api/testcases/problem/:problemId - Lấy tất cả testcase của bài toán */
router.get('/problem/:problemId', (req, res, next) => testcaseController.getByProblemId(req, res, next));
/** GET /api/testcases/problem/:problemId/public - Lấy testcase công khai của bài toán */
router.get('/problem/:problemId/public', (req, res, next) => testcaseController.getPublicByProblemId(req, res, next));
/** GET /api/testcases/:id - Lấy một testcase theo ID */
router.get('/:id', (req, res, next) => testcaseController.getById(req, res, next));
/** PUT /api/testcases/:id - Cập nhật một testcase */
router.put('/:id', (req, res, next) => testcaseController.update(req, res, next));
/** DELETE /api/testcases/:id - Xóa một testcase */
router.delete('/:id', (req, res, next) => testcaseController.delete(req, res, next));
export default router;
//# sourceMappingURL=testcase.routes.js.map