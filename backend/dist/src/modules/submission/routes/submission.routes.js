"use strict";
/**
 * @fileoverview Route definitions for submission API endpoints
 * Configures Express router with submission-related HTTP routes.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const submission_controller_1 = __importDefault(require("../controllers/submission.controller"));
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const router = (0, express_1.Router)();
/**
 * POST /submissions
 * Creates a new code submission
 * Requires authentication via JWT token
 */
router.post('/', auth_middleware_1.verifyToken, (req, res, next) => submission_controller_1.default.createSubmission(req, res, next));
/**
 * GET /submissions/my
 * Retrieves all submissions for the authenticated user
 * Requires authentication via JWT token
 */
router.get('/my', auth_middleware_1.verifyToken, (req, res, next) => submission_controller_1.default.getSubmissionsByUserId(req, res, next));
/**
 * GET /submissions
 * Retrieves all submissions for the authenticated user
 * Requires authentication via JWT token
 */
router.get('/', auth_middleware_1.verifyToken, (req, res, next) => submission_controller_1.default.getSubmissionsByUserId(req, res, next));
/**
 * GET /submissions/:id
 * Retrieves a specific submission by ID
 * Requires authentication via JWT token
 */
router.get('/:id', auth_middleware_1.verifyToken, (req, res, next) => submission_controller_1.default.getSubmissionById(req, res, next));
exports.default = router;
//# sourceMappingURL=submission.routes.js.map