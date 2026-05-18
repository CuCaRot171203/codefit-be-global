/**
 * @fileoverview User Type Definitions
 * @description Định nghĩa các interface và type liên quan đến User, Course, Phase, Lesson, Enrollment trong hệ thống.
 */

/**
 * @interface UserProfile
 * @description Thông tin hồ sơ người dùng (không bao gồm password)
 */
export interface UserProfile {
  id: string;
  email: string;
  username: string;
  role: string;
  avatar: string | null;
  bio: string | null;
  fullName: string | null;
  school: string | null;
  learningLevel: string | null;
  referralCode: string | null;
  isOnboarded: boolean;
  createdAt: Date;
}

/**
 * @interface UpdateProfileDto
 * @description DTO để cập nhật thông tin hồ sơ người dùng
 */
export interface UpdateProfileDto {
  username?: string;
  avatar?: string;
  bio?: string;
  fullName?: string;
  school?: string;
  learningLevel?: string;
  referralCode?: string;
}

/**
 * @interface ChangePasswordDto
 * @description DTO để thay đổi mật khẩu người dùng
 */
export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

/**
 * @interface Course
 * @description Thông tin khóa học trong hệ thống
 */
export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  level: string;
  creatorId: string | null;
  createdAt: Date;
}

/**
 * @interface CreateCourseDto
 * @description DTO để tạo mới khóa học
 */
export interface CreateCourseDto {
  title: string;
  description: string;
  price: number;
  level: string;
}

/**
 * @interface UpdateCourseDto
 * @description DTO để cập nhật thông tin khóa học
 */
export interface UpdateCourseDto {
  title?: string;
  description?: string;
  price?: number;
  level?: string;
}

/**
 * @interface Phase
 * @description Thông tin giai đoạn (phase) trong khóa học
 */
export interface Phase {
  id: string;
  courseId: string;
  title: string;
  orderIndex: number;
}

/**
 * @interface CreatePhaseDto
 * @description DTO để tạo mới giai đoạn
 */
export interface CreatePhaseDto {
  courseId: string;
  title: string;
  orderIndex: number;
}

/**
 * @interface UpdatePhaseDto
 * @description DTO để cập nhật giai đoạn
 */
export interface UpdatePhaseDto {
  title?: string;
  orderIndex?: number;
}

/**
 * @interface Lesson
 * @description Thông tin bài học trong giai đoạn
 */
export interface Lesson {
  id: string;
  phaseId: string;
  title: string;
  content: string;
  type: 'video' | 'code';
  orderIndex: number;
}

/**
 * @interface CreateLessonDto
 * @description DTO để tạo mới bài học
 */
export interface CreateLessonDto {
  phaseId: string;
  title: string;
  content: string;
  type: 'video' | 'code';
  orderIndex: number;
}

/**
 * @interface UpdateLessonDto
 * @description DTO để cập nhật bài học
 */
export interface UpdateLessonDto {
  title?: string;
  content?: string;
  type?: 'video' | 'code';
  orderIndex?: number;
}

/**
 * @interface Enrollment
 * @description Thông tin đăng ký khóa học của người dùng
 */
export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  coachId: string | null;
  createdAt: Date;
}

/**
 * @interface CreateEnrollmentDto
 * @description DTO để tạo mới đăng ký khóa học
 */
export interface CreateEnrollmentDto {
  courseId: string;
  coachId?: string;
}

/**
 * @interface EnrollmentWithDetails
 * @description Thông tin đăng ký kèm chi tiết khóa học
 */
export interface EnrollmentWithDetails extends Enrollment {
  course: Course;
}
