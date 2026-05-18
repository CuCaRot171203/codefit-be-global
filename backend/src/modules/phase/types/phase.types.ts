/**
 * Phase Type Definitions
 * 
 * Định nghĩa các interface và type cho Phase entity.
 * Phase đại diện cho một giai đoạn trong khóa học.
 */

/**
 * Entity Phase - Đại diện cho một giai đoạn trong khóa học
 * @interface Phase
 */
export interface Phase {
  /** ID duy nhất của phase */
  id: string;
  /** ID của khóa học mà phase thuộc về */
  courseId: string;
  /** Tiêu đề của phase */
  title: string;
  /** Thứ tự hiển thị của phase trong khóa học */
  orderIndex: number;
}

/**
 * DTO để tạo mới một phase
 * @interface CreatePhaseDto
 */
export interface CreatePhaseDto {
  /** ID của khóa học cha */
  courseId: string;
  /** Tiêu đề của phase */
  title: string;
  /** Thứ tự hiển thị (mặc định: 0) */
  orderIndex: number;
}

/**
 * DTO để cập nhật một phase
 * @interface UpdatePhaseDto
 */
export interface UpdatePhaseDto {
  /** Tiêu đề mới của phase (tùy chọn) */
  title?: string;
  /** Thứ tự mới của phase (tùy chọn) */
  orderIndex?: number;
}
