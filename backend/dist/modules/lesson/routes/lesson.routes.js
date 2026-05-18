/**
 * @fileoverview Routes configuration for Lesson module.
 * Defines all API endpoints for lesson operations.
 */
import { Router } from 'express';
import lessonController from '../controllers/lesson.controller';
const router = Router();
/**
 * POST /lessons
 * Creates a new lesson.
 * @route POST /lessons
 */
router.post('/', (req, res, next) => lessonController.create(req, res, next));
/**
 * GET /lessons/phase/:phaseId
 * Retrieves all lessons for a specific phase.
 * @route GET /lessons/phase/:phaseId
 */
router.get('/phase/:phaseId', (req, res, next) => lessonController.getByPhaseId(req, res, next));
/**
 * GET /lessons/:id
 * Retrieves a single lesson by its ID.
 * @route GET /lessons/:id
 */
router.get('/:id', (req, res, next) => lessonController.getById(req, res, next));
/**
 * PUT /lessons/:id
 * Updates an existing lesson.
 * @route PUT /lessons/:id
 */
router.put('/:id', (req, res, next) => lessonController.update(req, res, next));
/**
 * DELETE /lessons/:id
 * Deletes a lesson by its ID.
 * @route DELETE /lessons/:id
 */
router.delete('/:id', (req, res, next) => lessonController.delete(req, res, next));
export default router;
//# sourceMappingURL=lesson.routes.js.map