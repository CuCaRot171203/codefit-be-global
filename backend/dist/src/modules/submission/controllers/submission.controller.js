"use strict";
/**
 * @fileoverview HTTP request handlers for submission endpoints
 * Processes incoming requests, validates input, and returns responses.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_controller_1 = require("../../../base/base.controller");
const submission_service_1 = __importDefault(require("../services/submission.service"));
/**
 * Controller class for handling submission-related HTTP requests
 * Extends BaseController to inherit common response methods.
 */
class SubmissionController extends base_controller_1.BaseController {
    /**
     * Constructor - initializes the controller with the submission service
     */
    constructor() {
        super(submission_service_1.default);
    }
    /**
     * Handles POST /submissions - Creates a new code submission
     *
     * @param req - Express request object containing user info and submission data
     * @param res - Express response object for sending responses
     * @param next - Express next function for error handling
     */
    createSubmission = async (req, res, next) => {
        try {
            // Bước 1: Extract user ID from authenticated request
            const userId = req.user?.userId;
            if (!userId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            // Bước 2: Extract and validate required fields from request body
            const { problemId, code, language } = req.body;
            if (!problemId || !code || !language) {
                this.error(res, 'problemId, code, and language are required', 400);
                return;
            }
            // Bước 3: Call service to create submission
            const submission = await this.service.createSubmission(userId, { problemId, code, language });
            // Bước 4: Return success response with created submission
            this.success(res, submission, 'Submission created successfully', 201);
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Handles GET /submissions/:id - Retrieves a specific submission by ID
     *
     * @param req - Express request object containing submission ID in params
     * @param res - Express response object for sending responses
     * @param next - Express next function for error handling
     */
    getSubmissionById = async (req, res, next) => {
        try {
            // Bước 1: Extract submission ID from request parameters
            const { id } = req.params;
            // Bước 2: Call service to retrieve submission
            const submission = await this.service.getSubmissionById(id);
            // Bước 3: Return 404 if submission not found
            if (!submission) {
                this.error(res, 'Submission not found', 404);
                return;
            }
            // Bước 4: Return success response with submission data
            this.success(res, submission, 'Submission retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Handles GET /submissions - Retrieves all submissions for the authenticated user
     *
     * @param req - Express request object containing user info
     * @param res - Express response object for sending responses
     * @param next - Express next function for error handling
     */
    getSubmissionsByUserId = async (req, res, next) => {
        try {
            // Bước 1: Extract user ID from authenticated request
            const userId = req.user?.userId;
            if (!userId) {
                this.error(res, 'Unauthorized', 401);
                return;
            }
            // Bước 2: Call service to retrieve user's submissions
            const submissions = await this.service.getSubmissionsByUserId(userId);
            // Bước 3: Return success response with submissions array
            this.success(res, submissions, 'Submissions retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    };
}
/** Singleton instance of SubmissionController */
exports.default = new SubmissionController();
//# sourceMappingURL=submission.controller.js.map