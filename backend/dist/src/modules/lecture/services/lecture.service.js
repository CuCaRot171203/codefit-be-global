"use strict";
/**
 * Lecture Service
 *
 * Chứa business logic cho các thao tác với Lecture module.
 * Xử lý lấy dữ liệu dashboard, khóa học, minitest, hackathon cho giảng viên.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_service_1 = require("../../../base/base.service");
const lecture_repository_1 = __importDefault(require("../repositories/lecture.repository"));
/**
 * LectureService - Business logic layer cho Lecture
 * @class LectureService
 * @extends BaseService
 */
class LectureService extends base_service_1.BaseService {
    constructor() {
        super(lecture_repository_1.default);
    }
    /**
     * Lấy dashboard stats cho giảng viên
     * @param lectureId - ID của giảng viên
     * @returns Promise chứa các số liệu thống kê tổng quan
     */
    async getDashboardStats(lectureId) {
        const stats = await lecture_repository_1.default.getDashboardStats(lectureId);
        return stats;
    }
    /**
     * Lấy danh sách khóa học của giảng viên
     * @param lectureId - ID của giảng viên
     * @returns Promise chứa danh sách khóa học với thông tin thống kê
     */
    async getMyCourses(lectureId) {
        const courses = await lecture_repository_1.default.findCoursesByLectureId(lectureId);
        return courses;
    }
    /**
     * Lấy chi tiết một khóa học của giảng viên
     * @param courseId - ID của khóa học
     * @param lectureId - ID của giảng viên (để verify quyền)
     * @returns Promise chứa khóa học với cấu trúc chi tiết
     */
    async getCourseDetail(courseId, lectureId) {
        const course = await lecture_repository_1.default.findCourseDetailWithPhases(courseId, lectureId);
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
    async getMyMinitests(lectureId) {
        const minitests = await lecture_repository_1.default.findMinitestsByLectureId(lectureId);
        return minitests;
    }
    /**
     * Lấy danh sách hackathons trong các khóa học của giảng viên
     * @param lectureId - ID của giảng viên
     * @returns Promise chứa danh sách hackathons với thông tin thống kê
     */
    async getMyHackathons(lectureId) {
        const hackathons = await lecture_repository_1.default.findHackathonsByLectureId(lectureId);
        return hackathons;
    }
}
exports.default = new LectureService();
//# sourceMappingURL=lecture.service.js.map