/**
 * @fileoverview Lecture Submissions Controller
 * Handles lecture actions on lesson submissions (approve, reject, bulk email)
 */
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../base/base.controller';
declare class LectureSubmissionController extends BaseController {
    /**
     * Get all lesson submissions for lessons that this lecture owns
     */
    getSubmissions: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Approve a single submission score
     */
    approveSubmission: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Reject a single submission
     */
    rejectSubmission: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Bulk approve submissions and send emails
     */
    bulkApprove: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: LectureSubmissionController;
export default _default;
//# sourceMappingURL=lectureSubmission.controller.d.ts.map