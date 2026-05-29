/**
 * Controller layer cho module LessonRequest
 */
import { Request, Response } from 'express';
import { BaseController } from '../../../base/base.controller';
declare class LessonRequestController extends BaseController {
    constructor();
    create: (req: Request, res: Response, next: Function) => Promise<Response<any, Record<string, any>>>;
    getAll: (req: Request, res: Response, next: Function) => Promise<Response<any, Record<string, any>>>;
    getById: (req: Request, res: Response, next: Function) => Promise<Response<any, Record<string, any>>>;
    update: (req: Request, res: Response, next: Function) => Promise<Response<any, Record<string, any>>>;
    delete: (req: Request, res: Response, next: Function) => Promise<Response<any, Record<string, any>>>;
    getMyRequests: (req: Request, res: Response, next: Function) => Promise<Response<any, Record<string, any>>>;
    getPendingForMe: (req: Request, res: Response, next: Function) => Promise<Response<any, Record<string, any>>>;
    startWorking: (req: Request, res: Response, next: Function) => Promise<Response<any, Record<string, any>>>;
    submitForReview: (req: Request, res: Response, next: Function) => Promise<Response<any, Record<string, any>>>;
    cancel: (req: Request, res: Response, next: Function) => Promise<Response<any, Record<string, any>>>;
}
declare const _default: LessonRequestController;
export default _default;
//# sourceMappingURL=lessonRequest.controller.d.ts.map