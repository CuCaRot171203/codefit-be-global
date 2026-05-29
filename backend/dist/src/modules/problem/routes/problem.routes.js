"use strict";
/**
 * Problem Routes
 * @description Defines API endpoints for Problem-related operations.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const problem_controller_1 = __importDefault(require("../controllers/problem.controller"));
const router = (0, express_1.Router)();
/**
 * POST /api/problems
 * @description Create a new problem
 * @access Public
 */
router.post('/', (req, res, next) => problem_controller_1.default.create(req, res, next));
/**
 * GET /api/problems
 * @description Get all problems
 * @access Public
 */
router.get('/', (req, res, next) => problem_controller_1.default.getAll(req, res, next));
/**
 * GET /api/problems/:id
 * @description Get a specific problem by ID with all testcases
 * @access Public
 */
router.get('/:id', (req, res, next) => problem_controller_1.default.getById(req, res, next));
/**
 * GET /api/problems/:problemId/testcases/public
 * @description Get all public test cases for a problem
 * @access Public
 */
router.get('/:problemId/testcases/public', (req, res, next) => problem_controller_1.default.getPublicTestcases(req, res, next));
/**
 * PUT /api/problems/:id
 * @description Update an existing problem
 * @access Public
 */
router.put('/:id', (req, res, next) => problem_controller_1.default.update(req, res, next));
/**
 * DELETE /api/problems/:id
 * @description Delete a problem by ID
 * @access Public
 */
router.delete('/:id', (req, res, next) => problem_controller_1.default.delete(req, res, next));
exports.default = router;
//# sourceMappingURL=problem.routes.js.map