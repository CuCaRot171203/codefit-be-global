/**
 * Lecture Service
 * 
 * Chứa business logic cho các thao tác với Lecture module.
 * Xử lý lấy dữ liệu dashboard, khóa học, minitest, hackathon cho giảng viên.
 */

import { BaseService } from '../../../base/base.service';
import lectureRepository from '../repositories/lecture.repository';
import { LectureDashboardDto } from '../types';

/**
 * LectureService - Business logic layer cho Lecture
 * @class LectureService
 * @extends BaseService
 */
class LectureService extends BaseService<typeof lectureRepository> {

  constructor() {
    super(lectureRepository);
  }

  /**
   * Lấy dashboard stats cho giảng viên
   * @param lectureId - ID của giảng viên
   * @returns Promise chứa các số liệu thống kê tổng quan
   */
  async getDashboardStats(lectureId: string) {
    const stats = await lectureRepository.getDashboardStats(lectureId);
    return stats;
  }

  /**
   * Lấy danh sách khóa học của giảng viên
   * @param lectureId - ID của giảng viên
   * @returns Promise chứa danh sách khóa học với thông tin thống kê
   */
  async getMyCourses(lectureId: string) {
    const courses = await lectureRepository.findCoursesByLectureId(lectureId);
    return courses;
  }

  /**
   * Lấy chi tiết một khóa học của giảng viên
   * @param courseId - ID của khóa học
   * @param lectureId - ID của giảng viên (để verify quyền)
   * @returns Promise chứa khóa học với cấu trúc chi tiết
   */
  async getCourseDetail(courseId: string, lectureId: string) {
    const course = await lectureRepository.findCourseDetailWithPhases(courseId, lectureId);
    if (!course) {
      throw new Error('Course not found or you do not have permission to view this course');
    }
    return course;
  }

  /**
   * Lấy danh sách minitests trong các khóa học của giảng viên
   * @param lectureId - ID của giảng viên
   * @returns Promise chứa danh sách minitests với thông tin khóa học
   */
  async getMyMinitests(lectureId: string) {
    const minitests = await lectureRepository.findMinitestsByLectureId(lectureId);
    return minitests;
  }

  /**
   * Lấy danh sách hackathons trong các khóa học của giảng viên
   * @param lectureId - ID của giảng viên
   * @returns Promise chứa danh sách hackathons với thông tin thống kê
   */
  async getMyHackathons(lectureId: string) {
    const hackathons = await lectureRepository.findHackathonsByLectureId(lectureId);
    return hackathons;
  }
}

export default new LectureService();
