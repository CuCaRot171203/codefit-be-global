/**
 * Lecture Repository
 *
 * Xử lý các thao tác database cho Lecture - lấy dữ liệu khóa học,
 * minitest, hackathon mà lecture được phân công.
 */
/**
 * LectureRepository - Quản lý database operations cho Lecture
 * Cung cấp các phương thức truy vấn dữ liệu khóa học được phân công cho giảng viên
 * @class LectureRepository
 */
declare class LectureRepository {
    /**
     * Lấy danh sách khóa học của một giảng viên (creator)
     * @param lectureId - ID của giảng viên (user có role = 'lecture')
     * @returns Promise chứa danh sách khóa học với thông tin thống kê
     */
    findCoursesByLectureId(lectureId: string): Promise<{
        assignedAt: Date;
        totalStudents: number;
        totalLessons: number;
        phases: any[];
        enrollments: {
            id: string;
            progress: number;
            userId: string;
        }[];
        image: string | null;
        id: string;
        description: string;
        createdAt: Date;
        includes: string | null;
        title: string;
        price: number;
        originalPrice: number | null;
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
     * Lấy chi tiết một khóa học của giảng viên kèm theo phases và lessons
     * @param courseId - ID của khóa học
     * @param lectureId - ID của giảng viên (để verify quyền sở hữu)
     * @returns Promise chứa khóa học với cấu trúc chi tiết
     */
    findCourseDetailWithPhases(courseId: string, lectureId: string): Promise<{
        totalStudents: number;
        totalLessons: number;
        enrollments: {
            id: string;
            createdAt: Date;
            user: {
                id: string;
                email: string;
                username: string;
                fullName: string | null;
            };
            progress: number;
            userId: string;
        }[];
        phases: ({
            lessons: {
                id: string;
                title: string;
                orderIndex: number;
                type: string;
            }[];
            minitests: {
                id: string;
                title: string;
            }[];
        } & {
            id: string;
            courseId: string;
            title: string;
            orderIndex: number;
        })[];
        image: string | null;
        id: string;
        description: string;
        createdAt: Date;
        includes: string | null;
        title: string;
        price: number;
        originalPrice: number | null;
        duration: string | null;
        level: string;
        creatorId: string | null;
        subscriptionType: import(".prisma/client").$Enums.SubscriptionType;
        subscriptionPrice: number | null;
        autoEnrollOnApproval: boolean;
        unlockLessonsCount: number;
        unlockByPhase: boolean;
        features: string | null;
    } | null>;
    /**
     * Lấy danh sách minitests trong các khóa học của giảng viên
     * @param lectureId - ID của giảng viên
     * @returns Promise chứa danh sách minitests với thông tin khóa học
     */
    findMinitestsByLectureId(lectureId: string): Promise<{
        id: string;
        title: string;
        courseName: string;
        totalAttempts: number;
        avgScore: number;
        createdAt: any;
    }[]>;
    /**
     * Lấy danh sách hackathons trong các khóa học của giảng viên
     * @param lectureId - ID của giảng viên
     * @returns Promise chứa danh sách hackathons với thông tin thống kê
     */
    findHackathonsByLectureId(lectureId: string): Promise<{
        id: string;
        title: string;
        description: string;
        startTime: Date;
        endTime: Date;
        status: "ended" | "upcoming" | "ongoing";
        totalTeams: number;
        avgScore: number;
    }[]>;
    /**
     * Lấy thống kê dashboard cho giảng viên
     * @param lectureId - ID của giảng viên
     * @returns Promise chứa các số liệu thống kê tổng quan
     */
    getDashboardStats(lectureId: string): Promise<{
        totalCourses: number;
        totalStudents: number;
        totalLessons: number;
        totalMinitests: number;
    }>;
}
declare const _default: LectureRepository;
export default _default;
//# sourceMappingURL=lecture.repository.d.ts.map