/**
 * Problem Controller
 * @description Handles HTTP request/response handling for Problem-related endpoints.
 */
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../base/base.controller';
/**
 * ProblemController class
 * @extends BaseController
 * @description Handles incoming HTTP requests and delegates to the ProblemService for business logic.
 */
declare class ProblemController extends BaseController {
    /**
     * Constructor
     * @description Initializes the controller with the problem service.
     */
    constructor();
    /**
     * Get all problems
     * @description Handles GET request to retrieve all problems.
     * @param req - Express request object
     * @param res - Express response object for sending response
     * @param next - Express next function for error handling
     */
    getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Create a new problem
     * @description Handles POST request to create a new programming problem.
     * @param req - Express request object containing problem data in body
     * @param res - Express response object for sending response
     * @param next - Express next function for error handling
     */
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get a problem by ID
     * @description Handles GET request to retrieve a specific problem by its ID.
     * @param req - Express request object containing problem ID in params
     * @param res - Express response object for sending response
     * @param next - Express next function for error handling
     */
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get all public test cases for a problem
     * @description Handles GET request to retrieve only public test cases of a problem.
     * @param req - Express request object containing problemId in params
     * @param res - Express response object for sending response
     * @param next - Express next function for error handling
     */
    getPublicTestcases: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Update an existing problem
     * @description Handles PUT request to update problem details.
     * @param req - Express request object containing ID in params and update data in body
     * @param res - Express response object for sending response
     * @param next - Express next function for error handling
     */
    update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Delete a problem
     * @description Handles DELETE request to remove a problem from the system.
     * @param req - Express request object containing ID in params
     * @param res - Express response object for sending response
     * @param next - Express next function for error handling
     */
    delete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: ProblemController;
export default _default;
//# sourceMappingURL=problem.controller.d.ts.map