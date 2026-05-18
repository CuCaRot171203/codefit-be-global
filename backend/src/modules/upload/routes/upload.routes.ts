/**
 * Upload Routes
 * 
 * Định nghĩa các API routes cho việc upload file.
 * Sử dụng ImageKit để lưu trữ và quản lý hình ảnh.
 * Yêu cầu authentication cho tất cả các endpoints.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { uploadImage } from '../../../services/imagekit.service';
import { uploadMiddleware } from '../../../middleware/upload.middleware';
import { verifyToken } from '../../../middleware/auth.middleware';

const router = Router();

/**
 * Helper function để xử lý async trong route handlers
 * @param fn - Async function cần wrap
 * @returns Wrapped function với error handling tự động
 */
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Upload một file lên ImageKit (hỗ trợ image và archive)
 * POST /api/upload
 * 
 * Middleware:
 * - verifyToken: Xác thực người dùng
 * - uploadMiddleware.single('file'): Xử lý upload file đơn
 * 
 * Body:
 * - file: File cần upload (bắt buộc)
 * - folder: Thư mục lưu trữ trên ImageKit (tùy chọn, mặc định: '/codefit')
 * 
 * @param req - Request chứa file
 * @param res - Response trả về thông tin file đã upload
 */
router.post(
  '/',
  verifyToken,
  uploadMiddleware.single('file'),
  asyncHandler(async (req: Request, res: Response) => {
    // Bước 1: Kiểm tra xem có file được upload không
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No file provided',
      });
      return;
    }

    // Bước 2: Lấy thư mục lưu trữ từ body hoặc sử dụng mặc định
    const folder = req.body.folder || '/codefit';
    
    // Bước 3: Upload file lên ImageKit
    const result = await uploadImage(req.file.buffer, req.file.originalname, folder);

    // Bước 4: Trả về response thành công với thông tin file
    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: result,
    });
  })
);

/**
 * Upload một hình ảnh lên ImageKit
 * POST /api/upload/image
 * 
 * Middleware:
 * - verifyToken: Xác thực người dùng
 * - uploadMiddleware.single('image'): Xử lý upload file đơn
 * 
 * Body:
 * - image: File hình ảnh (bắt buộc)
 * - folder: Thư mục lưu trữ trên ImageKit (tùy chọn, mặc định: '/codefit')
 * 
 * @param req - Request chứa file hình ảnh
 * @param res - Response trả về thông tin file đã upload
 */
router.post(
  '/image',
  verifyToken,
  uploadMiddleware.single('image'),
  asyncHandler(async (req: Request, res: Response) => {
    // Bước 1: Kiểm tra xem có file được upload không
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No image file provided',
      });
      return;
    }

    // Bước 2: Lấy thư mục lưu trữ từ body hoặc sử dụng mặc định
    const folder = req.body.folder || '/codefit';
    
    // Bước 3: Upload hình ảnh lên ImageKit
    const result = await uploadImage(req.file.buffer, req.file.originalname, folder);

    // Bước 4: Trả về response thành công với thông tin file
    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: result,
    });
  })
);

/**
 * Upload nhiều hình ảnh lên ImageKit
 * POST /api/upload/images
 * 
 * Middleware:
 * - verifyToken: Xác thực người dùng
 * - uploadMiddleware.array('images', 10): Xử lý upload tối đa 10 file
 * 
 * Body:
 * - images: Mảng các file hình ảnh (bắt buộc)
 * - folder: Thư mục lưu trữ trên ImageKit (tùy chọn, mặc định: '/codefit')
 * 
 * @param req - Request chứa các file hình ảnh
 * @param res - Response trả về danh sách thông tin file đã upload
 */
router.post(
  '/images',
  verifyToken,
  uploadMiddleware.array('images', 10),
  asyncHandler(async (req: Request, res: Response) => {
    // Bước 1: Lấy danh sách files từ request
    const files = req.files as Express.Multer.File[];
    
    // Bước 2: Kiểm tra xem có file nào được upload không
    if (!files || files.length === 0) {
      res.status(400).json({
        success: false,
        message: 'No image files provided',
      });
      return;
    }

    // Bước 3: Lấy thư mục lưu trữ từ body hoặc sử dụng mặc định
    const folder = req.body.folder || '/codefit';
    
    // Bước 4: Tạo mảng promises để upload tất cả file song song
    const uploadPromises = files.map((file) =>
      uploadImage(file.buffer, file.originalname, folder)
    );
    
    // Bước 5: Chờ tất cả uploads hoàn thành
    const results = await Promise.all(uploadPromises);

    // Bước 6: Trả về response thành công với danh sách file
    res.status(201).json({
      success: true,
      message: 'Images uploaded successfully',
      data: results,
    });
  })
);

export default router;
