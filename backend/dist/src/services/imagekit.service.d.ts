import ImageKit from 'imagekit';
/**
 * ImageKit Client Configuration
 * Khởi tạo ImageKit client với credentials từ environment
 */
declare const imagekit: ImageKit;
/**
 * Interface định nghĩa kết quả upload
 */
export interface UploadResult {
    fileId: string;
    fileType: string;
    url: string;
    thumbnailUrl: string | null;
    name: string;
}
/**
 * Upload một file ảnh lên ImageKit
 * @param file - File buffer từ multer
 * @param fileName - Tên file gốc
 * @param folder - Thư mục lưu trữ trên ImageKit (default: '/codefit')
 * @returns Promise<UploadResult> - Thông tin file đã upload
 */
export declare const uploadImage: (file: Buffer, fileName: string, folder?: string) => Promise<UploadResult>;
/**
 * Xóa một file từ ImageKit
 * @param fileId - ID của file cần xóa
 */
export declare const deleteImage: (fileId: string) => Promise<void>;
/**
 * Export ImageKit client instance
 */
export default imagekit;
//# sourceMappingURL=imagekit.service.d.ts.map