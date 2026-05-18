/**
 * Controller layer cho module Scoring
 */
import { Request, Response } from 'express';
import { BaseController } from '../../../base/base.controller';
declare class ScoringController extends BaseController {
    constructor();
    run: (req: Request, res: Response, next: Function) => Promise<Response<any, Record<string, any>>>;
    submit: (req: Request, res: Response, next: Function) => Promise<Response<any, Record<string, any>>>;
    getMySubmissions: (req: Request, res: Response, next: Function) => Promise<Response<any, Record<string, any>>>;
    getSubmissionDetails: (req: Request, res: Response, next: Function) => Promise<Response<any, Record<string, any>>>;
}
declare const _default: ScoringController;
export default _default;
//# sourceMappingURL=scoring.controller.d.ts.map