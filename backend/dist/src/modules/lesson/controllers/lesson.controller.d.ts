/**
 * @fileoverview Controller layer for Lesson HTTP request handling.
 * Handles incoming HTTP requests and sends responses for Lesson endpoints.
 */
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../base/base.controller';
/**
 * Controller class for Lesson HTTP operations.
 * Extends BaseController to inherit standard response methods.
 * Handles all REST API endpoints for lesson management.
 */
declare class LessonController extends BaseController {
    /**
     * Initializes the controller with the lesson service.
     * @constructor
     */
    constructor();
    /**
     * Creates a new lesson.
     * Handles POST /lessons
     * @param req - Express request object containing lesson data in body
     * @param res - Express response object
     * @param next - Express next function for error handling
     */
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Retrieves all lessons for a specific phase.
     * Handles GET /lessons/phase/:phaseId
     * @param req - Express request object containing phaseId in params
     * @param res - Express response object
     * @param next - Express next function for error handling
     */
    getByPhaseId: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Retrieves a single lesson by its ID.
     * Handles GET /lessons/:id
     * @param req - Express request object containing lesson id in params
     * @param res - Express response object
     * @param next - Express next function for error handling
     */
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Updates an existing lesson.
     * Handles PUT /lessons/:id
     * @param req - Express request object containing id in params and update data in body
     * @param res - Express response object
     * @param next - Express next function for error handling
     */
    update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Deletes a lesson by its ID.
     * Handles DELETE /lessons/:id
     * @param req - Express request object containing lesson id in params
     * @param res - Express response object
     * @param next - Express next function for error handling
     */
    delete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: LessonController;
export default _default;
//# sourceMappingURL=lesson.controller.d.ts.map