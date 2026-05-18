import ImageKit from 'imagekit';

/**
 * ImageKit Client Configuration
 * Khởi tạo ImageKit client với credentials từ environment
 */
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

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
export const uploadImage = async (
  file: Buffer,
  fileName: string,
  folder: string = '/codefit'
): Promise<UploadResult> => {
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
  } catch (error) {
    // Log error và throw exception
    console.error('ImageKit upload error:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Xóa một file từ ImageKit
 * @param fileId - ID của file cần xóa
 */
export const deleteImage = async (fileId: string): Promise<void> => {
  try {
    // Bước 1: Gọi ImageKit delete API
    await imagekit.deleteFile(fileId);
  } catch (error) {
    // Log error và throw exception
    console.error('ImageKit delete error:', error);
    throw new Error('Failed to delete image');
  }
};

/**
 * Export ImageKit client instance
 */
export default imagekit;
