/**
 * Controller layer cho module Scoring
 */

import { Request, Response } from 'express';
import { BaseController } from '../../../base/base.controller';
import scoringService from '../services/scoring.service';

class ScoringController extends BaseController {
  constructor() {
    super(scoringService);
  }

  // Run code against test cases (preview, no save)
  run = async (req: Request, res: Response, next: Function) => {
    try {
      const { lessonId, code, language } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return this.error(res, 'User not authenticated', 401);
      }

      if (!lessonId || !code) {
        return this.error(res, 'lessonId and code are required', 400);
      }

      const results = await scoringService.runCode(lessonId, code, language || 'javascript');
      return this.success(res, results, 'Code run completed');
    } catch (error: any) {
      return this.error(res, error.message, 400);
    }
  };

  // Submit and calculate score
  submit = async (req: Request, res: Response, next: Function) => {
    try {
      const { lessonId, code, language, hintsUsed, timeUsed } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return this.error(res, 'User not authenticated', 401);
      }

      if (!lessonId || !code) {
        return this.error(res, 'lessonId and code are required', 400);
      }

      const submission = await scoringService.saveSubmission(
        lessonId,
        userId,
        code,
        language || 'javascript',
        hintsUsed || 0,
        timeUsed || null
      );

      return this.success(res, submission, 'Submission scored successfully');
    } catch (error: any) {
      return this.error(res, error.message, 400);
    }
  };

  // Get user submissions for a lesson
  getMySubmissions = async (req: Request, res: Response, next: Function) => {
    try {
      const { lessonId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return this.error(res, 'User not authenticated', 401);
      }

      const submissions = await scoringService.getUserSubmissions(lessonId, userId);
      return this.success(res, submissions, 'Fetched submissions');
    } catch (error: any) {
      return this.error(res, error.message, 400);
    }
  };

  // Get submission details
  getSubmissionDetails = async (req: Request, res: Response, next: Function) => {
    try {
      const { submissionId } = req.params;
      const submission = await scoringService.getSubmissionById(submissionId);

      if (!submission) {
        return this.error(res, 'Submission not found', 404);
      }

      return this.success(res, submission, 'Fetched submission details');
    } catch (error: any) {
      return this.error(res, error.message, 400);
    }
  };
}

export default new ScoringController();
