/**
 * Controller layer cho module LessonContent
 */
import { Request, Response } from 'express';
import { BaseController } from '../../../base/base.controller';
declare class LessonContentController extends BaseController {
    constructor();
    getByLessonId: (req: Request, res: Response, next: Function) => Promise<Response<any, Record<string, any>>>;
    updateContent: (req: Request, res: Response, next: Function) => Promise<Response<any, Record<string, any>>>;
    getScoringConfig: (req: Request, res: Response, next: Function) => Promise<Response<any, Record<string, any>>>;
    updateScoringConfig: (req: Request, res: Response, next: Function) => Promise<Response<any, Record<string, any>>>;
}
declare const _default: LessonContentController;
export default _default;
//# sourceMappingURL=lessonContent.controller.d.ts.map