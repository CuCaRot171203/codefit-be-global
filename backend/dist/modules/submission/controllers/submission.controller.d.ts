/**
 * @fileoverview HTTP request handlers for submission endpoints
 * Processes incoming requests, validates input, and returns responses.
 */
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../base/base.controller';
/**
 * Controller class for handling submission-related HTTP requests
 * Extends BaseController to inherit common response methods.
 */
declare class SubmissionController extends BaseController {
    /**
     * Constructor - initializes the controller with the submission service
     */
    constructor();
    /**
     * Handles POST /submissions - Creates a new code submission
     *
     * @param req - Express request object containing user info and submission data
     * @param res - Express response object for sending responses
     * @param next - Express next function for error handling
     */
    createSubmission: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Handles GET /submissions/:id - Retrieves a specific submission by ID
     *
     * @param req - Express request object containing submission ID in params
     * @param res - Express response object for sending responses
     * @param next - Express next function for error handling
     */
    getSubmissionById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Handles GET /submissions - Retrieves all submissions for the authenticated user
     *
     * @param req - Express request object containing user info
     * @param res - Express response object for sending responses
     * @param next - Express next function for error handling
     */
    getSubmissionsByUserId: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
/** Singleton instance of SubmissionController */
declare const _default: SubmissionController;
export default _default;
//# sourceMappingURL=submission.controller.d.ts.map