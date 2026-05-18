/**
 * Controller layer cho module LessonReview
 */
import { Request, Response } from 'express';
import { BaseController } from '../../../base/base.controller';
declare class LessonReviewController extends BaseController {
    constructor();
    getPendingReviews: (req: Request, res: Response, next: Function) => Promise<Response<any, Record<string, any>>>;
    getReviewDetails: (req: Request, res: Response, next: Function) => Promise<Response<any, Record<string, any>>>;
    approve: (req: Request, res: Response, next: Function) => Promise<Response<any, Record<string, any>>>;
    reject: (req: Request, res: Response, next: Function) => Promise<Response<any, Record<string, any>>>;
    publish: (req: Request, res: Response, next: Function) => Promise<Response<any, Record<string, any>>>;
    batchApprove: (req: Request, res: Response, next: Function) => Promise<Response<any, Record<string, any>>>;
    batchPublish: (req: Request, res: Response, next: Function) => Promise<Response<any, Record<string, any>>>;
    getAllReviews: (req: Request, res: Response, next: Function) => Promise<Response<any, Record<string, any>>>;
}
declare const _default: LessonReviewController;
export default _default;
//# sourceMappingURL=lessonReview.controller.d.ts.map