/**
 * @file Mô tả các interface và DTOs cho module Course.
 * Chứa các type definitions cho Course entity, Create/Update DTOs và các loại mở rộng.
 * @module course/types
 */

/**
 * Interface đại diện cho entity Course trong database.
 * Sử dụng để type cho các đối tượng course được trả về từ Prisma.
 */
export interface Course {
  /** Định danh duy nhất của khóa học (UUID) */
  id: string;
  /** Tiêu đề của khóa học */
  title: string;
  /** Mô tả chi tiết về nội dung khóa học */
  description: string;
  /** Giá của khóa học (0 = miễn phí) */
  price: number;
  /** Cấp độ khóa học: beginner, intermediate, advanced */
  level: string;
  /** ID của người tạo khóa học (nullable nếu bị xóa) */
  creatorId: string | null;
  /** Thời điểm khóa học được tạo */
  createdAt: Date;
}

/**
 * DTO để tạo mới một khóa học.
 * Sử dụng khi client gửi request POST /courses.
 */
export interface CreateCourseDto {
  /** Tiêu đề khóa học (bắt buộc) */
  title: string;
  /** Mô tả chi tiết khóa học (bắt buộc) */
  description: string;
  /** Giá khóa học (mặc định: 0) */
  price: number;
  /** Cấp độ khóa học (mặc định: beginner) */
  level: string;
}

/**
 * DTO để cập nhật thông tin khóa học.
 * Tất cả các trường đều optional - chỉ trường nào được cung cấp mới được cập nhật.
 */
export interface UpdateCourseDto {
  /** Tiêu đề mới cho khóa học */
  title?: string;
  /** Mô tả mới cho khóa học */
  description?: string;
  /** Giá mới cho khóa học */
  price?: number;
  /** Cấp độ mới cho khóa học */
  level?: string;
  /** Số bài mở khóa mỗi lượt */
  unlockLessonsCount?: number;
  /** Mở khóa theo phase */
  unlockByPhase?: boolean;
  /** Loại subscription */
  subscriptionType?: string;
  /** Giá subscription */
  subscriptionPrice?: number;
  /** Tự động enroll khi duyệt */
  autoEnrollOnApproval?: boolean;
  /** URL ảnh khóa học */
  image?: string;
  /** Thời lượng khóa học */
  duration?: string;
  /** JSON array của { title, description, bgColor, textColor } */
  features?: string;
  /** JSON array của { icon, text } */
  includes?: string;
}

/**
 * Interface mở rộng từ Course, thêm danh sách các phases (giai đoạn) của khóa học.
 * Sử dụng khi cần trả về khóa học kèm theo cấu trúc phân chia giai đoạn.
 */
export interface CourseWithPhases extends Course {
  /** Danh sách các giai đoạn (phases) của khóa học */
  phases: any[];
}
