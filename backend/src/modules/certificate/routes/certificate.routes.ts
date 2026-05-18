/**
 * Certificate Routes
 * 
 * Định nghĩa các API routes cho Certificate module.
 */

import { Router } from 'express';
import certificateController from '../controllers/certificate.controller';
import { verifyToken } from '../../../middleware/auth.middleware';

const router = Router();

/** GET /api/certificates/my - Lấy chứng chỉ của người dùng hiện tại (yêu cầu auth) */
router.get('/my', verifyToken, (req, res, next) => certificateController.getMyCertificates(req, res, next));

/** GET /api/certificates/course/:courseId - Lấy chứng chỉ theo khóa học (yêu cầu auth) */
router.get('/course/:courseId', verifyToken, (req, res, next) => certificateController.getCertificate(req, res, next));

/** POST /api/certificates/generate - Sinh chứng chỉ khi hoàn thành khóa học (yêu cầu auth) */
router.post('/generate', verifyToken, (req, res, next) => certificateController.generate(req, res, next));

/** GET /api/certificates/verify/:certificateId - Xác minh chứng chỉ (công khai) */
router.get('/verify/:certificateId', (req, res, next) => certificateController.verify(req, res, next));

export default router;
