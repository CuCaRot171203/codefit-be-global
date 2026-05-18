/**
 * Controller layer cho module LessonReview
 */
import { BaseController } from '../../../base/base.controller';
import lessonReviewService from '../services/lessonReview.service';
class LessonReviewController extends BaseController {
    constructor() {
        super(lessonReviewService);
    }
    // Get all pending reviews
    getPendingReviews = async (req, res, next) => {
        try {
            const reviews = await this.service.getPendingReviews();
            return this.success(res, reviews, 'Fetched pending reviews');
        }
        catch (error) {
            return this.error(res, error.message, 400);
        }
    };
    // Get review details for a lesson
    getReviewDetails = async (req, res, next) => {
        try {
            const { lessonId } = req.params;
            const review = await this.service.getReviewDetails(lessonId);
            return this.success(res, review, 'Fetched review details');
        }
        catch (error) {
            return this.error(res, error.message, 404);
        }
    };
    // Approve a lesson
    approve = async (req, res, next) => {
        try {
            const { lessonId } = req.params;
            const { feedback } = req.body;
            const adminId = req.user?.userId;
            if (!adminId) {
                return this.error(res, 'User not authenticated', 401);
            }
            const result = await this.service.approve(lessonId, adminId, feedback);
            return this.success(res, result, 'Lesson approved successfully');
        }
        catch (error) {
            return this.error(res, error.message, 400);
        }
    };
    // Reject a lesson
    reject = async (req, res, next) => {
        try {
            const { lessonId } = req.params;
            const { feedback } = req.body;
            const adminId = req.user?.userId;
            if (!adminId) {
                return this.error(res, 'User not authenticated', 401);
            }
            if (!feedback) {
                return this.error(res, 'Feedback is required when rejecting', 400);
            }
            const result = await this.service.reject(lessonId, adminId, feedback);
            return this.success(res, result, 'Lesson rejected');
        }
        catch (error) {
            return this.error(res, error.message, 400);
        }
    };
    // Publish a lesson
    publish = async (req, res, next) => {
        try {
            const { lessonId } = req.params;
            const adminId = req.user?.userId;
            if (!adminId) {
                return this.error(res, 'User not authenticated', 401);
            }
            const result = await this.service.publish(lessonId, adminId);
            return this.success(res, result, 'Lesson published successfully');
        }
        catch (error) {
            return this.error(res, error.message, 400);
        }
    };
    // Batch approve lessons
    batchApprove = async (req, res, next) => {
        try {
            const { lessonIds } = req.body;
            const adminId = req.user?.userId;
            if (!adminId) {
                return this.error(res, 'User not authenticated', 401);
            }
            if (!Array.isArray(lessonIds) || lessonIds.length === 0) {
                return this.error(res, 'lessonIds array is required', 400);
            }
            const results = await this.service.batchApprove(lessonIds, adminId);
            return this.success(res, results, 'Batch approval completed');
        }
        catch (error) {
            return this.error(res, error.message, 400);
        }
    };
    // Batch publish lessons
    batchPublish = async (req, res, next) => {
        try {
            const { lessonIds } = req.body;
            const adminId = req.user?.userId;
            if (!adminId) {
                return this.error(res, 'User not authenticated', 401);
            }
            if (!Array.isArray(lessonIds) || lessonIds.length === 0) {
                return this.error(res, 'lessonIds array is required', 400);
            }
            const results = await this.service.batchPublish(lessonIds, adminId);
            return this.success(res, results, 'Batch publish completed');
        }
        catch (error) {
            return this.error(res, error.message, 400);
        }
    };
    // Get all reviews
    getAllReviews = async (req, res, next) => {
        try {
            const reviews = await this.service.getAllReviews();
            return this.success(res, reviews, 'Fetched all reviews');
        }
        catch (error) {
            return this.error(res, error.message, 400);
        }
    };
}
export default new LessonReviewController();
//# sourceMappingURL=lessonReview.controller.js.map