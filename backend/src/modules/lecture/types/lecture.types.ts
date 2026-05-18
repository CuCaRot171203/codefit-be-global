/**
 * Lecture Type Definitions
 * 
 * Định nghĩa các interface và type cho Lecture entity và các DTOs liên quan.
 */

/**
 * Entity Course - Đại diện cho một khóa học
 * @interface Course
 */
export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number | null;
  image: string | null;
  duration: string | null;
  level: string;
  creatorId: string | null;
  createdAt: Date;
}

/**
 * Entity Phase - Đại diện cho một giai đoạn/chương trong khóa học
 * @interface Phase
 */
export interface Phase {
  id: string;
  courseId: string;
  title: string;
  orderIndex: number;
}

/**
 * Entity Lesson - Đại diện cho một bài học trong giai đoạn
 * @interface Lesson
 */
export interface Lesson {
  id: string;
  phaseId: string;
  title: string;
  content: string;
  type: string;
  orderIndex: number;
}

/**
 * Entity Minitest - Đại diện cho bài kiểm tra nhỏ
 * @interface Minitest
 */
export interface Minitest {
  id: string;
  phaseId: string;
  title: string;
  createdAt: Date;
}

/**
 * Entity Hackathon - Đại diện cho cuộc thi hackathon
 * @interface Hackathon
 */
export interface Hackathon {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
}

/**
 * DTO cho dashboard stats của lecture
 * @interface LectureStatsDto
 */
export interface LectureStatsDto {
  totalCourses: number;
  totalStudents: number;
  totalMinitests: number;
  totalHackathons: number;
  courses: CourseWithStats[];
}

/**
 * Course với thông tin thống kê
 * @interface CourseWithStats
 */
export interface CourseWithStats extends Course {
  totalStudents: number;
  totalLessons: number;
  phases: PhaseWithLessons[];
}

/**
 * Phase với danh sách lessons
 * @interface PhaseWithLessons
 */
export interface PhaseWithLessons extends Phase {
  lessons: Lesson[];
  minitests: Minitest[];
}

/**
 * DTO cho response dashboard
 * @interface LectureDashboardDto
 */
export interface LectureDashboardDto {
  stats: {
    totalCourses: number;
    totalStudents: number;
    totalMinitests: number;
    totalHackathons: number;
  };
  recentCourses: CourseWithStats[];
}
