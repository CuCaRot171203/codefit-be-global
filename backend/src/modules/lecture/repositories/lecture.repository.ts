/**
 * Lecture Repository
 * 
 * Xử lý các thao tác database cho Lecture - lấy dữ liệu khóa học,
 * minitest, hackathon mà lecture được phân công.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * LectureRepository - Quản lý database operations cho Lecture
 * Cung cấp các phương thức truy vấn dữ liệu khóa học được phân công cho giảng viên
 * @class LectureRepository
 */
class LectureRepository {

  /**
   * Lấy danh sách khóa học của một giảng viên (creator)
   * @param lectureId - ID của giảng viên (user có role = 'lecture')
   * @returns Promise chứa danh sách khóa học với thông tin thống kê
   */
  async findCoursesByLectureId(lectureId: string) {
    // Lấy tất cả khóa học được assign cho giảng viên qua lectureCourse
    const lectureCourses = await prisma.lectureCourse.findMany({
      where: { lectureId },
      include: {
        course: {
          include: {
            enrollments: {
              select: {
                id: true,
                userId: true,
                progress: true,
              },
            },
            phases: {
              orderBy: { orderIndex: 'asc' },
              include: {
                lessons: {
                  select: {
                    id: true,
                  },
                },
                minitests: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { assignedAt: 'desc' },
    });

    // Transform data để thêm thông tin thống kê
    return lectureCourses.map(lc => ({
      ...lc.course,
      assignedAt: lc.assignedAt,
      totalStudents: lc.course.enrollments.length,
      totalLessons: lc.course.phases.reduce((sum: number, phase: any) => sum + phase.lessons.length, 0),
      phases: lc.course.phases.map((phase: any) => ({
        ...phase,
        totalLessons: phase.lessons.length,
        totalMinitests: phase.minitests.length,
      })),
    }));
  }

  /**
   * Lấy chi tiết một khóa học của giảng viên kèm theo phases và lessons
   * @param courseId - ID của khóa học
   * @param lectureId - ID của giảng viên (để verify quyền sở hữu)
   * @returns Promise chứa khóa học với cấu trúc chi tiết
   */
  async findCourseDetailWithPhases(courseId: string, lectureId: string) {
    // Check if lecture is assigned to this course via lectureCourse table
    const lectureCourse = await prisma.lectureCourse.findFirst({
      where: {
        courseId: courseId,
        lectureId: lectureId,
      },
    });

    if (!lectureCourse) return null;

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        enrollments: {
          select: {
            id: true,
            userId: true,
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                fullName: true,
              },
            },
            progress: true,
            createdAt: true,
          },
        },
        phases: {
          orderBy: { orderIndex: 'asc' },
          include: {
            lessons: {
              orderBy: { orderIndex: 'asc' },
              select: {
                id: true,
                title: true,
                type: true,
                orderIndex: true,
              },
            },
            minitests: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    if (!course) return null;

    return {
      ...course,
      totalStudents: course.enrollments.length,
      totalLessons: course.phases.reduce((sum: number, phase: any) => sum + phase.lessons.length, 0),
    };
  }

  /**
   * Lấy danh sách minitests trong các khóa học của giảng viên
   * @param lectureId - ID của giảng viên
   * @returns Promise chứa danh sách minitests với thông tin khóa học
   */
  async findMinitestsByLectureId(lectureId: string) {
    // Lấy tất cả khóa học của giảng viên
    const courses = await prisma.course.findMany({
      where: { creatorId: lectureId },
      select: { id: true, title: true },
    });

    const courseIds = courses.map(c => c.id);
    const courseMap = new Map(courses.map(c => [c.id, c.title]));

    if (courseIds.length === 0) return [];

    // Lấy tất cả phases thuộc các khóa học này
    const phases = await prisma.phase.findMany({
      where: { courseId: { in: courseIds } },
      select: { id: true, courseId: true },
    });

    const phaseIds = phases.map(p => p.id);
    const phaseCourseMap = new Map(phases.map(p => [p.id, p.courseId]));

    if (phaseIds.length === 0) return [];

    // Lấy tất cả minitests thuộc các phases này
    const minitests = await prisma.minitest.findMany({
      where: { phaseId: { in: phaseIds } },
      orderBy: { orderIndex: 'asc' },
    });

    // Lấy submissions cho các minitests
    const minitestIds = minitests.map(m => m.id);
    const submissions = await prisma.minitestSubmission.findMany({
      where: { minitestId: { in: minitestIds } },
      select: {
        minitestId: true,
        score: true,
      },
    }) as any[];

    // Group submissions by minitestId
    const submissionsByMinitest = new Map<string, { score: number }[]>();
    submissions.forEach(sub => {
      const existing = submissionsByMinitest.get(sub.minitestId) || [];
      existing.push(sub);
      submissionsByMinitest.set(sub.minitestId, existing);
    });

    return minitests.map(minitest => {
      const phaseId = minitest.phaseId;
      const courseId = phaseCourseMap.get(phaseId) || '';
      const courseName = courseMap.get(courseId) || 'Unknown';
      const minitestSubmissions = submissionsByMinitest.get(minitest.id) || [];
      const totalAttempts = minitestSubmissions.length;
      const avgScore = totalAttempts > 0
        ? Math.round(minitestSubmissions.reduce((sum: number, s: { score: number }) => sum + s.score, 0) / totalAttempts)
        : 0;

      return {
        id: minitest.id,
        title: minitest.title,
        courseName,
        totalAttempts,
        avgScore,
      };
    });
  }

  /**
   * Lấy danh sách hackathons trong các khóa học của giảng viên
   * @param lectureId - ID của giảng viên
   * @returns Promise chứa danh sách hackathons với thông tin thống kê
   */
  async findHackathonsByLectureId(lectureId: string) {
    // Lấy tất cả hackathons
    const hackathons = await prisma.hackathon.findMany({
      orderBy: { startTime: 'desc' },
      take: 20,
      include: {
        participants: {
          select: {
            id: true,
          },
        },
        submissions: {
          select: {
            id: true,
            score: true,
          },
        },
      },
    });

    return hackathons.map(hackathon => {
      const isUpcoming = new Date(hackathon.startTime) > new Date();
      const isOngoing = new Date(hackathon.startTime) <= new Date() && new Date(hackathon.endTime) >= new Date();

      let status: 'upcoming' | 'ongoing' | 'ended' = 'ended';
      if (isUpcoming) status = 'upcoming';
      else if (isOngoing) status = 'ongoing';

      const avgScore = hackathon.submissions.length > 0
        ? Math.round(hackathon.submissions.reduce((sum: number, s: { score: number }) => sum + s.score, 0) / hackathon.submissions.length)
        : 0;

      return {
        id: hackathon.id,
        title: hackathon.title,
        description: hackathon.description,
        startTime: hackathon.startTime,
        endTime: hackathon.endTime,
        status,
        totalTeams: hackathon.participants.length,
        avgScore,
      };
    });
  }

  /**
   * Lấy thống kê dashboard cho giảng viên
   * @param lectureId - ID của giảng viên
   * @returns Promise chứa các số liệu thống kê tổng quan
   */
  async getDashboardStats(lectureId: string) {
    // Đếm số khóa học
    const totalCourses = await prisma.course.count({
      where: { creatorId: lectureId },
    });

    // Đếm số học viên (distinct users trong enrollments)
    const enrollments = await prisma.enrollment.findMany({
      where: {
        course: { creatorId: lectureId },
      },
      select: { userId: true },
      distinct: ['userId'],
    });
    const totalStudents = enrollments.length;

    // Đếm số bài học
    const totalLessons = await prisma.lesson.count({
      where: {
        phase: {
          course: {
            creatorId: lectureId,
          },
        },
      },
    });

    // Đếm số minitests
    const totalMinitests = await prisma.minitest.count({
      where: {
        phase: {
          course: {
            creatorId: lectureId,
          },
        },
      },
    });

    return {
      totalCourses,
      totalStudents,
      totalLessons,
      totalMinitests,
    };
  }
}

export default new LectureRepository();
