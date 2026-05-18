/**
 * Problem Routes
 * @description Defines API endpoints for Problem-related operations.
 */
import { Router } from 'express';
import problemController from '../controllers/problem.controller';
const router = Router();
/**
 * POST /api/problems
 * @description Create a new problem
 * @access Public
 */
router.post('/', (req, res, next) => problemController.create(req, res, next));
/**
 * GET /api/problems
 * @description Get all problems
 * @access Public
 */
router.get('/', (req, res, next) => problemController.getAll(req, res, next));
/**
 * GET /api/problems/:id
 * @description Get a specific problem by ID with all testcases
 * @access Public
 */
router.get('/:id', (req, res, next) => problemController.getById(req, res, next));
/**
 * GET /api/problems/:problemId/testcases/public
 * @description Get all public test cases for a problem
 * @access Public
 */
router.get('/:problemId/testcases/public', (req, res, next) => problemController.getPublicTestcases(req, res, next));
/**
 * PUT /api/problems/:id
 * @description Update an existing problem
 * @access Public
 */
router.put('/:id', (req, res, next) => problemController.update(req, res, next));
/**
 * DELETE /api/problems/:id
 * @description Delete a problem by ID
 * @access Public
 */
router.delete('/:id', (req, res, next) => problemController.delete(req, res, next));
export default router;
//# sourceMappingURL=problem.routes.js.map