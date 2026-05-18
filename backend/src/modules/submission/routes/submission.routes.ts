/**
 * @fileoverview Route definitions for submission API endpoints
 * Configures Express router with submission-related HTTP routes.
 */

import { Router } from 'express';
import submissionController from '../controllers/submission.controller';
import { verifyToken } from '../../../middleware/auth.middleware';

const router = Router();

/**
 * POST /submissions
 * Creates a new code submission
 * Requires authentication via JWT token
 */
router.post('/', verifyToken, (req, res, next) => submissionController.createSubmission(req, res, next));

/**
 * GET /submissions/my
 * Retrieves all submissions for the authenticated user
 * Requires authentication via JWT token
 */
router.get('/my', verifyToken, (req, res, next) => submissionController.getSubmissionsByUserId(req, res, next));

/**
 * GET /submissions
 * Retrieves all submissions for the authenticated user
 * Requires authentication via JWT token
 */
router.get('/', verifyToken, (req, res, next) => submissionController.getSubmissionsByUserId(req, res, next));

/**
 * GET /submissions/:id
 * Retrieves a specific submission by ID
 * Requires authentication via JWT token
 */
router.get('/:id', verifyToken, (req, res, next) => submissionController.getSubmissionById(req, res, next));

export default router;
