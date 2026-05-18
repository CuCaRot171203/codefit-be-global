/**
 * Project Type Definitions
 * 
 * Định nghĩa các interface và type cho Project entity và các DTOs liên quan.
 */

/** Các trạng thái có thể của dự án */
export type ProjectStatus = 'draft' | 'in_progress' | 'completed' | 'reviewed';

/**
 * Entity Project - Đại diện cho một dự án cá nhân
 * @interface Project
 */
export interface Project {
  /** ID duy nhất của dự án */
  id: string;
  /** Tiêu đề dự án */
  title: string;
  /** Mô tả chi tiết dự án */
  description: string;
  /** ID của người tạo dự án */
  userId: string;
  /** ID khóa học liên kết (null nếu là dự án độc lập) */
  courseId: string | null;
  /** Trạng thái hiện tại của dự án */
  status: ProjectStatus;
  /** URL repository (GitHub, GitLab, etc.) */
  repositoryUrl: string | null;
  /** URL demo của dự án */
  demoUrl: string | null;
  /** Thời điểm tạo dự án */
  createdAt: Date;
}

/**
 * DTO để tạo mới một dự án
 * @interface CreateProjectDto
 */
export interface CreateProjectDto {
  /** Tiêu đề dự án */
  title: string;
  /** Mô tả dự án */
  description: string;
  /** ID khóa học liên kết (tùy chọn) */
  courseId?: string;
  /** URL repository (tùy chọn) */
  repositoryUrl?: string;
  /** URL demo (tùy chọn) */
  demoUrl?: string;
}

/**
 * DTO để cập nhật một dự án
 * @interface UpdateProjectDto
 */
export interface UpdateProjectDto {
  /** Tiêu đề mới (tùy chọn) */
  title?: string;
  /** Mô tả mới (tùy chọn) */
  description?: string;
  /** Trạng thái mới (tùy chọn) */
  status?: ProjectStatus;
  /** URL repository mới (tùy chọn) */
  repositoryUrl?: string;
  /** URL demo mới (tùy chọn) */
  demoUrl?: string;
}
