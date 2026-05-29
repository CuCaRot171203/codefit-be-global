/**
 * Lecture Service
 *
 * Chứa business logic cho các thao tác với Lecture module.
 * Xử lý lấy dữ liệu dashboard, khóa học, minitest, hackathon cho giảng viên.
 */
import { BaseService } from '../../../base/base.service';
import lectureRepository from '../repositories/lecture.repository';
/**
 * LectureService - Business logic layer cho Lecture
 * @class LectureService
 * @extends BaseService
 */
declare class LectureService extends BaseService<typeof lectureRepository> {
    constructor();
    /**
     * Lấy dashboard stats cho giảng viên
     * @param lectureId - ID của giảng viên
     * @returns Promise chứa các số liệu thống kê tổng quan
     */
    getDashboardStats(lectureId: string): Promise<{
        totalCourses: number;
        totalStudents: number;
        totalLessons: number;
        totalMinitests: number;
    }>;
    /**
     * Lấy danh sách khóa học của giảng viên
     * @param lectureId - ID của giảng viên
     * @returns Promise chứa danh sách khóa học với thông tin thống kê
     */
    getMyCourses(lectureId: string): Promise<{
        assignedAt: Date;
        totalStudents: number;
        totalLessons: number;
        phases: any[];
        enrollments: {
            id: string;
            progress: number;
            userId: string;
        }[];
        id: string;
        createdAt: Date;
        includes: string | null;
        description: string;
        title: string;
        price: number;
        originalPrice: number | null;
        image: string | null;
        duration: string | null;
        level: string;
        creatorId: string | null;
        subscriptionType: import(".prisma/client").$Enums.SubscriptionType;
        subscriptionPrice: number | null;
        autoEnrollOnApproval: boolean;
        unlockLessonsCount: number;
        unlockByPhase: boolean;
        features: string | null;
    }[]>;
    /**
     * Lấy chi tiết một khóa học của giảng viên
     * @param courseId - ID của khóa học
     * @param lectureId - ID của giảng viên (để verify quyền)
     * @returns Promise chứa khóa học với cấu trúc chi tiết
     */
    getCourseDetail(courseId: string, lectureId: string): Promise<{
        totalStudents: number;
        totalLessons: number;
        enrollments: {
            user: {
                id: string;
                email: string;
                username: string;
                fullName: string | null;
            };
            id: string;
            createdAt: Date;
            progress: number;
            userId: string;
        }[];
        phases: ({
            lessons: {
                id: string;
                title: string;
                type: string;
                orderIndex: number;
            }[];
            minitests: {
                id: string;
                title: string;
            }[];
        } & {
            id: string;
            title: string;
            courseId: string;
            orderIndex: number;
        })[];
        id: string;
        createdAt: Date;
        includes: string | null;
        description: string;
        title: string;
        price: number;
        originalPrice: number | null;
        image: string | null;
        duration: string | null;
        level: string;
        creatorId: string | null;
        subscriptionType: import(".prisma/client").$Enums.SubscriptionType;
        subscriptionPrice: number | null;
        autoEnrollOnApproval: boolean;
        unlockLessonsCount: number;
        unlockByPhase: boolean;
        features: string | null;
    }>;
    /**
     * Lấy danh sách minitests trong các khóa học của giảng viên
     * @param lectureId - ID của giảng viên
     * @returns Promise chứa danh sách minitests với thông tin khóa học
     */
    getMyMinitests(lectureId: string): Promise<{
        id: string;
        title: string;
        courseName: string;
        totalAttempts: number;
        avgScore: number;
    }[]>;
    /**
     * Lấy danh sách hackathons trong các khóa học của giảng viên
     * @param lectureId - ID của giảng viên
     * @returns Promise chứa danh sách hackathons với thông tin thống kê
     */
    getMyHackathons(lectureId: string): Promise<{
        id: string;
        title: string;
        description: string;
        startTime: Date;
        endTime: Date;
        status: "ended" | "upcoming" | "ongoing";
        totalTeams: number;
        avgScore: number;
    }[]>;
}
declare const _default: LectureService;
export default _default;
//# sourceMappingURL=lecture.service.d.ts.map