"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.uploadImage = void 0;
const imagekit_1 = __importDefault(require("imagekit"));
/**
 * ImageKit Client Configuration
 * Khởi tạo ImageKit client với credentials từ environment
 */
const imagekit = new imagekit_1.default({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});
/**
 * Upload một file ảnh lên ImageKit
 * @param file - File buffer từ multer
 * @param fileName - Tên file gốc
 * @param folder - Thư mục lưu trữ trên ImageKit (default: '/codefit')
 * @returns Promise<UploadResult> - Thông tin file đã upload
 */
const uploadImage = async (file, fileName, folder = '/codefit') => {
    try {
        // Bước 1: Gọi ImageKit upload API
        const result = await imagekit.upload({
            file,
            fileName,
            folder,
        });
        // Bước 2: Transform kết quả và trả về
        return {
            fileId: result.fileId,
            fileType: result.fileType,
            url: result.url,
            thumbnailUrl: result.thumbnailUrl || null,
            name: result.name,
        };
    }
    catch (error) {
        // Log error và throw exception
        console.error('ImageKit upload error:', error);
        throw new Error('Failed to upload image');
    }
};
exports.uploadImage = uploadImage;
/**
 * Xóa một file từ ImageKit
 * @param fileId - ID của file cần xóa
 */
const deleteImage = async (fileId) => {
    try {
        // Bước 1: Gọi ImageKit delete API
        await imagekit.deleteFile(fileId);
    }
    catch (error) {
        // Log error và throw exception
        console.error('ImageKit delete error:', error);
        throw new Error('Failed to delete image');
    }
};
exports.deleteImage = deleteImage;
/**
 * Export ImageKit client instance
 */
exports.default = imagekit;
//# sourceMappingURL=imagekit.service.js.map