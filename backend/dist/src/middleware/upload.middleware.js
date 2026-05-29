"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultipleImages = exports.uploadSingleImage = exports.uploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
/**
 * Các MIME types được phép upload
 * Chấp nhận file ảnh và file nén
 */
const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'application/zip',
    'application/x-zip-compressed',
    'application/x-rar-compressed',
    'application/vnd.rar',
    'application/x-7z-compressed',
    'application/x-rar',
];
/**
 * Kích thước file tối đa: 10MB
 */
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
/**
 * Cấu hình storage - Lưu file vào memory
 * Sau đó chuyển Buffer lên ImageKit
 */
const storage = multer_1.default.memoryStorage();
/**
 * Filter để kiểm tra MIME type của file
 * @param req - Express Request
 * @param file - File object từ multer
 * @param cb - Callback function
 */
const fileFilter = (req, file, cb) => {
    // Bước 1: Kiểm tra MIME type có trong danh sách cho phép
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        // Bước 2: Cho phép upload nếu MIME type hợp lệ
        cb(null, true);
    }
    else {
        // Bước 3: Reject nếu MIME type không hợp lệ
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WebP, SVG, ZIP, RAR, and 7Z are allowed.'));
    }
};
/**
 * Multer middleware configuration
 * Cấu hình storage, filter và limits
 */
exports.uploadMiddleware = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE,
    },
});
/**
 * Middleware upload single image
 * Field name: 'image'
 */
exports.uploadSingleImage = exports.uploadMiddleware.single('image');
/**
 * Middleware upload multiple images
 * Field name: 'images', max 10 files
 */
exports.uploadMultipleImages = exports.uploadMiddleware.array('images', 10);
//# sourceMappingURL=upload.middleware.js.map