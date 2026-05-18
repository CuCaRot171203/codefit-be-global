/**
 * @fileoverview Controller layer for Lesson HTTP request handling.
 * Handles incoming HTTP requests and sends responses for Lesson endpoints.
 */
import { BaseController } from '../../../base/base.controller';
import lessonService from '../services/lesson.service';
/**
 * Controller class for Lesson HTTP operations.
 * Extends BaseController to inherit standard response methods.
 * Handles all REST API endpoints for lesson management.
 */
class LessonController extends BaseController {
    /**
     * Initializes the controller with the lesson service.
     * @constructor
     */
    constructor() {
        super(lessonService);
    }
    /**
     * Creates a new lesson.
     * Handles POST /lessons
     * @param req - Express request object containing lesson data in body
     * @param res - Express response object
     * @param next - Express next function for error handling
     */
    create = async (req, res, next) => {
        try {
            // Bước 1: Call service to create lesson from request body
            const lesson = await this.service.create(req.body);
            // Bước 2: Send success response with created lesson
            this.success(res, lesson, 'Lesson created successfully', 201);
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Retrieves all lessons for a specific phase.
     * Handles GET /lessons/phase/:phaseId
     * @param req - Express request object containing phaseId in params
     * @param res - Express response object
     * @param next - Express next function for error handling
     */
    getByPhaseId = async (req, res, next) => {
        try {
            // Bước 1: Extract phaseId from request parameters
            const { phaseId } = req.params;
            // Bước 2: Call service to get lessons by phaseId
            const lessons = await this.service.getByPhaseId(phaseId);
            // Bước 3: Send success response with lessons array
            this.success(res, lessons, 'Lessons retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Retrieves a single lesson by its ID.
     * Handles GET /lessons/:id
     * @param req - Express request object containing lesson id in params
     * @param res - Express response object
     * @param next - Express next function for error handling
     */
    getById = async (req, res, next) => {
        try {
            // Bước 1: Extract id from request parameters
            const { id } = req.params;
            // Bước 2: Call service to get lesson by id
            const lesson = await this.service.getById(id);
            // Bước 3: Check if lesson exists
            if (!lesson) {
                this.error(res, 'Lesson not found', 404);
                return;
            }
            // Bước 4: Send success response with lesson data
            this.success(res, lesson, 'Lesson retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Updates an existing lesson.
     * Handles PUT /lessons/:id
     * @param req - Express request object containing id in params and update data in body
     * @param res - Express response object
     * @param next - Express next function for error handling
     */
    update = async (req, res, next) => {
        try {
            // Bước 1: Extract id from request parameters
            const { id } = req.params;
            // Bước 2: Call service to update lesson with request body
            const lesson = await this.service.update(id, req.body);
            // Bước 3: Send success response with updated lesson
            this.success(res, lesson, 'Lesson updated successfully');
        }
        catch (error) {
            // Bước 4: Determine error status code based on error message
            const status = error.message.includes('not found') ? 404 : 500;
            next(error);
        }
    };
    /**
     * Deletes a lesson by its ID.
     * Handles DELETE /lessons/:id
     * @param req - Express request object containing lesson id in params
     * @param res - Express response object
     * @param next - Express next function for error handling
     */
    delete = async (req, res, next) => {
        try {
            // Bước 1: Extract id from request parameters
            const { id } = req.params;
            // Bước 2: Call service to delete lesson
            const result = await this.service.delete(id);
            // Bước 3: Send success response with result message
            this.success(res, result, 'Lesson deleted successfully');
        }
        catch (error) {
            // Bước 4: Determine error status code based on error message
            const status = error.message.includes('not found') ? 404 : 500;
            next(error);
        }
    };
}
export default new LessonController();
//# sourceMappingURL=lesson.controller.js.map