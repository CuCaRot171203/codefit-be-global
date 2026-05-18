/**
 * Controller layer cho module LessonRequest
 */

import { Request, Response } from 'express';
import { BaseController } from '../../../base/base.controller';
import lessonRequestService from '../services/lessonRequest.service';

class LessonRequestController extends BaseController {
  constructor() {
    super(lessonRequestService);
  }

  // ========== Admin Endpoints ==========

  create = async (req: Request, res: Response, next: Function) => {
    try {
      const { lessonId, lectureId, dueDate, notes } = req.body;
      
      if (!lessonId || !lectureId) {
        return this.error(res, 'lessonId and lectureId are required', 400);
      }

      const lessonRequest = await this.service.create({ lessonId, lectureId, dueDate, notes });
      return this.success(res, lessonRequest, 'Lesson request created successfully', 201);
    } catch (error: any) {
      return this.error(res, error.message, 400);
    }
  };

  getAll = async (req: Request, res: Response, next: Function) => {
    try {
      const requests = await this.service.getAll();
      return this.success(res, requests, 'Fetched all lesson requests');
    } catch (error: any) {
      return this.error(res, error.message, 400);
    }
  };

  getById = async (req: Request, res: Response, next: Function) => {
    try {
      const { id } = req.params;
      const request = await this.service.getById(id);
      return this.success(res, request, 'Fetched lesson request');
    } catch (error: any) {
      return this.error(res, error.message, 404);
    }
  };

  update = async (req: Request, res: Response, next: Function) => {
    try {
      const { id } = req.params;
      const { status, dueDate, notes } = req.body;
      
      const updated = await this.service.update(id, { status, dueDate, notes });
      return this.success(res, updated, 'Lesson request updated successfully');
    } catch (error: any) {
      return this.error(res, error.message, 400);
    }
  };

  delete = async (req: Request, res: Response, next: Function) => {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      return this.success(res, null, 'Lesson request deleted successfully');
    } catch (error: any) {
      return this.error(res, error.message, 400);
    }
  };

  // ========== Lecture Endpoints ==========

  getMyRequests = async (req: Request, res: Response, next: Function) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return this.error(res, 'User not authenticated', 401);
      }
      
      const requests = await this.service.getByLectureId(userId);
      return this.success(res, requests, 'Fetched your lesson requests');
    } catch (error: any) {
      return this.error(res, error.message, 400);
    }
  };

  getPendingForMe = async (req: Request, res: Response, next: Function) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return this.error(res, 'User not authenticated', 401);
      }
      
      const requests = await this.service.getPendingForLecture(userId);
      return this.success(res, requests, 'Fetched pending lesson requests');
    } catch (error: any) {
      return this.error(res, error.message, 400);
    }
  };

  startWorking = async (req: Request, res: Response, next: Function) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        return this.error(res, 'User not authenticated', 401);
      }
      
      const result = await this.service.startWorking(id, userId);
      return this.success(res, result, 'Started working on lesson');
    } catch (error: any) {
      return this.error(res, error.message, 400);
    }
  };

  submitForReview = async (req: Request, res: Response, next: Function) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        return this.error(res, 'User not authenticated', 401);
      }
      
      const result = await this.service.submitForReview(id, userId);
      return this.success(res, result, 'Lesson submitted for review');
    } catch (error: any) {
      return this.error(res, error.message, 400);
    }
  };

  cancel = async (req: Request, res: Response, next: Function) => {
    try {
      const { id } = req.params;
      const result = await this.service.cancel(id);
      return this.success(res, result, 'Lesson request cancelled');
    } catch (error: any) {
      return this.error(res, error.message, 400);
    }
  };
}

export default new LessonRequestController();
