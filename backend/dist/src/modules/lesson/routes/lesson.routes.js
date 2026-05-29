"use strict";
/**
 * @fileoverview Routes configuration for Lesson module.
 * Defines all API endpoints for lesson operations.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lesson_controller_1 = __importDefault(require("../controllers/lesson.controller"));
const router = (0, express_1.Router)();
/**
 * POST /lessons
 * Creates a new lesson.
 * @route POST /lessons
 */
router.post('/', (req, res, next) => lesson_controller_1.default.create(req, res, next));
/**
 * GET /lessons/phase/:phaseId
 * Retrieves all lessons for a specific phase.
 * @route GET /lessons/phase/:phaseId
 */
router.get('/phase/:phaseId', (req, res, next) => lesson_controller_1.default.getByPhaseId(req, res, next));
/**
 * GET /lessons/:id
 * Retrieves a single lesson by its ID.
 * @route GET /lessons/:id
 */
router.get('/:id', (req, res, next) => lesson_controller_1.default.getById(req, res, next));
/**
 * PUT /lessons/:id
 * Updates an existing lesson.
 * @route PUT /lessons/:id
 */
router.put('/:id', (req, res, next) => lesson_controller_1.default.update(req, res, next));
/**
 * DELETE /lessons/:id
 * Deletes a lesson by its ID.
 * @route DELETE /lessons/:id
 */
router.delete('/:id', (req, res, next) => lesson_controller_1.default.delete(req, res, next));
exports.default = router;
//# sourceMappingURL=lesson.routes.js.map