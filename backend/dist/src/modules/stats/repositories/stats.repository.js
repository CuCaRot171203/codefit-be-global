"use strict";
/**
 * Stats Repository
 *
 * Xử lý các thao tác database để tính toán thống kê.
 * Sử dụng Prisma aggregate và groupBy để truy vấn hiệu quả.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const ioredis_1 = __importDefault(require("ioredis"));
const prisma = new client_1.PrismaClient();
const redis = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379');
/**
 * StatsRepository - Quản lý database operations cho thống kê
 * @class StatsRepository
 */
class StatsRepository {
    /**
     * Lấy thống kê chi tiết của một người dùng
     * @param userId - ID của người dùng
     * @returns Promise<object> - Thông tin thống kê người dùng
     */
    async getUserStats(userId) {
        // Bước 1: Truy vấn song song các dữ liệu cần thiết
        const [submissions, enrollments, certificates] = await Promise.all([
            // Đếm submissions theo status
            prisma.submission.groupBy({
                by: ['status'],
                where: { userId },
                _count: { id: true }
            }),
            // Lấy tiến độ của các khóa học đã đăng ký
            prisma.enrollment.findMany({
                where: { userId },
                select: { progress: true }
            }),
            // Đếm số chứng chỉ
            prisma.certificate.count({ where: { userId } })
        ]);
        // Bước 2: Tính tổng số bài nộp
        const totalSubmissions = submissions.reduce((sum, s) => sum + s._count.id, 0);
        // Bước 3: Tìm số bài nộp thành công (status = 'AC')
        const acceptedSubmissions = submissions.find(s => s.status === 'AC')?._count.id || 0;
        // Bước 4: Đếm số khóa học đã hoàn thành (progress = 100)
        const completedCourses = enrollments.filter(e => e.progress === 100).length;
        // Bước 5: Tính tỷ lệ chấp nhận và trả về kết quả
        return {
            userId,
            totalSubmissions,
            acceptedSubmissions,
            acceptanceRate: totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0,
            totalProblemsSolved: acceptedSubmissions,
            totalCoursesEnrolled: enrollments.length,
            totalCoursesCompleted: completedCourses,
            totalCertificates: certificates
        };
    }
    /**
     * Lấy thống kê của một khóa học
     * @param courseId - ID của khóa học
     * @returns Promise<object> - Thông tin thống kê khóa học
     */
    async getCourseStats(courseId) {
        // Bước 1: Lấy danh sách enrollments với tiến độ
        const enrollments = await prisma.enrollment.findMany({
            where: { courseId },
            select: { progress: true }
        });
        // Bước 2: Tính tiến độ trung bình
        const avgProgress = enrollments.length > 0
            ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
            : 0;
        // Bước 3: Lấy thống kê feedback của khóa học (Feedback schema đơn giản, không có targetId/targetType/rating)
        const feedbackCount = await prisma.feedback.count();
        // Bước 4: Trả về kết quả với các số liệu thống kê
        return {
            courseId,
            totalEnrollments: enrollments.length,
            averageProgress: avgProgress,
            averageRating: 0,
            totalFeedback: feedbackCount
        };
    }
    /**
     * Lấy thống kê tổng quan của nền tảng
     * @returns Promise<object> - Thông tin thống kê nền tảng
     */
    async getPlatformStats() {
        // Bước 1: Đếm song song các thực thể chính
        const [users, courses, submissions, enrollments] = await Promise.all([
            prisma.user.count(),
            prisma.course.count(),
            prisma.submission.count(),
            prisma.enrollment.count()
        ]);
        // Bước 2: Trả về kết quả thống kê nền tảng
        return {
            totalUsers: users,
            totalCourses: courses,
            totalSubmissions: submissions,
            totalEnrollments: enrollments
        };
    }
    /**
     * Lấy so sánh progress theo tuần cho một người dùng
     * @param userId - ID của người dùng
     * @returns Promise<object> - Thông tin so sánh tuần
     */
    async getWeeklyComparison(userId) {
        const now = new Date();
        // Tuần này: từ đầu tuần hiện tại đến hiện tại
        const thisWeekStart = new Date(now);
        thisWeekStart.setDate(now.getDate() - now.getDay());
        thisWeekStart.setHours(0, 0, 0, 0);
        // Tuần trước: 7 ngày trước đầu tuần này
        const lastWeekStart = new Date(thisWeekStart);
        lastWeekStart.setDate(lastWeekStart.getDate() - 7);
        const lastWeekEnd = new Date(thisWeekStart);
        lastWeekEnd.setDate(lastWeekEnd.getDate() - 1);
        lastWeekEnd.setHours(23, 59, 59, 999);
        // Đếm submissions cho mỗi tuần
        const [thisWeekSubs, lastWeekSubs, userStats] = await Promise.all([
            prisma.submission.count({
                where: {
                    userId,
                    createdAt: { gte: thisWeekStart }
                }
            }),
            prisma.submission.count({
                where: {
                    userId,
                    createdAt: {
                        gte: lastWeekStart,
                        lte: lastWeekEnd
                    }
                }
            }),
            prisma.userStats.findUnique({
                where: { userId }
            })
        ]);
        // Đếm enrollments progress tăng trong tuần
        const [thisWeekEnrollments] = await Promise.all([
            prisma.enrollment.findMany({
                where: { userId },
                select: {
                    progress: true,
                }
            })
        ]);
        // Tính percentage
        let percentage = 0;
        if (lastWeekSubs > 0) {
            percentage = Math.round(((thisWeekSubs - lastWeekSubs) / lastWeekSubs) * 100);
        }
        else if (thisWeekSubs > 0) {
            percentage = 100; // First week with activity
        }
        // Cập nhật UserStats với weekly scores
        if (userStats) {
            await prisma.userStats.update({
                where: { userId },
                data: {
                    weeklyScore: thisWeekSubs,
                    lastWeekScore: lastWeekSubs,
                    lastUpdated: now
                }
            });
        }
        return {
            thisWeekSubmissions: thisWeekSubs,
            lastWeekSubmissions: lastWeekSubs,
            percentage,
            comparison: thisWeekSubs > lastWeekSubs ? 'better' : (thisWeekSubs < lastWeekSubs ? 'worse' : 'same'),
            message: thisWeekSubs > lastWeekSubs
                ? `Bạn đã làm tốt hơn ${Math.abs(percentage)}% so với tuần trước`
                : (thisWeekSubs < lastWeekSubs ? `Bạn đang ít hơn ${Math.abs(percentage)}% so với tuần trước` : 'Tiến độ tương đương tuần trước')
        };
    }
    // ============ User Dashboard: Score Breakdown ============
    async getUserScoreBreakdown(userId) {
        // Lấy tất cả lesson submissions của user
        const lessonSubmissions = await prisma.lessonSubmission.findMany({
            where: { userId },
            include: {
                lesson: {
                    include: {
                        phase: {
                            include: {
                                course: { select: { id: true, title: true } }
                            }
                        }
                    }
                }
            }
        });
        // Group by course -> phase -> lesson
        const courseMap = new Map();
        let totalScore = 0;
        for (const sub of lessonSubmissions) {
            const course = sub.lesson?.phase?.course;
            if (!course)
                continue;
            const courseId = course.id;
            if (!courseMap.has(courseId)) {
                courseMap.set(courseId, {
                    courseId,
                    courseTitle: course.title,
                    score: 0,
                    phases: []
                });
            }
            const courseData = courseMap.get(courseId);
            const phaseId = sub.lesson?.phase?.id;
            const phaseTitle = sub.lesson?.phase?.title;
            const lessonId = sub.lesson?.id;
            const lessonTitle = sub.lesson?.title;
            // Find or create phase
            let phase = courseData.phases.find((p) => p.phaseId === phaseId);
            if (!phase) {
                phase = { phaseId, phaseTitle, lessons: [] };
                courseData.phases.push(phase);
            }
            // Find or create lesson
            let lesson = phase.lessons.find((l) => l.lessonId === lessonId);
            if (!lesson) {
                lesson = {
                    lessonId,
                    lessonTitle,
                    score: sub.score || 0,
                    passedTests: sub.passedTests || 0,
                    totalTests: sub.totalTests || 0,
                    status: sub.status
                };
                phase.lessons.push(lesson);
                courseData.score += lesson.score;
                totalScore += lesson.score;
            }
        }
        return {
            totalScore,
            courses: Array.from(courseMap.values())
        };
    }
    // ============ User Dashboard: Login Days & Streak ============
    async getUserLoginDays(userId) {
        const now = new Date();
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);
        // Lấy sessions trong 30 ngày
        const sessions = await prisma.userSession.findMany({
            where: {
                userId,
                expiredAt: { gte: thirtyDaysAgo }
            },
            select: { expiredAt: true },
            orderBy: { expiredAt: 'desc' }
        });
        // Đếm unique days — dùng expiredAt vì đó là thời điểm session hết hạn
        const uniqueDays = new Set();
        for (const s of sessions) {
            const day = s.expiredAt.toISOString().split('T')[0];
            uniqueDays.add(day);
        }
        // Tính current streak
        const sortedDays = Array.from(uniqueDays).sort().reverse();
        let currentStreak = 0;
        const today = now.toISOString().split('T')[0];
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        // Streak chỉ tính nếu có login hôm nay hoặc hôm qua
        const hasRecentLogin = sortedDays[0] === today || sortedDays[0] === yesterdayStr;
        if (hasRecentLogin) {
            let expectedDate = sortedDays[0] === today ? now : yesterday;
            for (const day of sortedDays) {
                const dayDate = new Date(day);
                const diff = Math.floor((expectedDate.getTime() - dayDate.getTime()) / (1000 * 60 * 60 * 24));
                if (diff <= 1) {
                    currentStreak++;
                    expectedDate = dayDate;
                }
                else {
                    break;
                }
            }
        }
        // Tính active days trong 7 ngày qua
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        const activeDaysThisWeek = Array.from(uniqueDays).filter(day => new Date(day) >= sevenDaysAgo).length;
        return {
            currentStreak,
            activeDaysThisWeek,
            totalActiveDays: uniqueDays.size
        };
    }
    // ============ User Dashboard: Weekly Activity ============
    async getUserWeeklyActivity(userId) {
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0 = Sunday
        // Tính ngày bắt đầu tuần (Monday)
        const monday = new Date(now);
        monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        monday.setHours(0, 0, 0, 0);
        const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
        const result = [];
        // Đếm submissions cho mỗi ngày trong tuần
        for (let i = 0; i < 7; i++) {
            const dayStart = new Date(monday);
            dayStart.setDate(monday.getDate() + i);
            const dayEnd = new Date(dayStart);
            dayEnd.setDate(dayStart.getDate() + 1);
            const isFuture = dayStart > now;
            const submissionCount = isFuture ? 0 : await prisma.submission.count({
                where: {
                    userId,
                    createdAt: { gte: dayStart, lt: dayEnd }
                }
            });
            const lessonProgressCount = isFuture ? 0 : await prisma.lessonProgress.count({
                where: {
                    userId,
                    completedAt: { gte: dayStart, lt: dayEnd }
                }
            });
            const lessonSubmissionCount = isFuture ? 0 : await prisma.lessonSubmission.count({
                where: {
                    userId,
                    createdAt: { gte: dayStart, lt: dayEnd }
                }
            });
            result.push({
                day: days[i],
                label: days[i],
                submissions: submissionCount + lessonProgressCount + lessonSubmissionCount,
                isToday: i === (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
            });
        }
        const totalThisWeek = result.reduce((sum, d) => sum + d.submissions, 0);
        return {
            days: result,
            totalThisWeek
        };
    }
    // ============ User Dashboard: Global Rank ============
    async getUserGlobalRank(userId) {
        // Tính total score của user từ lesson submissions
        const userSubmissions = await prisma.lessonSubmission.findMany({
            where: { userId },
            select: { score: true }
        });
        const userScore = userSubmissions.reduce((sum, s) => sum + (s.score || 0), 0);
        // Đếm số user có score cao hơn
        const allScores = await prisma.lessonSubmission.groupBy({
            by: ['userId'],
            _sum: { score: true }
        });
        const ranked = allScores
            .map(s => ({ userId: s.userId, score: s._sum.score || 0 }))
            .sort((a, b) => b.score - a.score);
        const rank = ranked.findIndex(e => e.userId === userId) + 1;
        const totalUsers = ranked.length;
        return {
            rank: rank > 0 ? rank : null,
            score: userScore,
            totalUsers
        };
    }
    // ============ Global Leaderboard ============
    async getGlobalLeaderboard() {
        // Lấy tất cả user scores từ lesson submissions
        const allScores = await prisma.lessonSubmission.groupBy({
            by: ['userId'],
            _sum: { score: true }
        });
        // Lấy thông tin user
        const userIds = allScores.map(s => s.userId);
        const users = await prisma.user.findMany({
            where: { id: { in: userIds } },
            select: {
                id: true,
                fullName: true,
                username: true,
                avatar: true,
                email: true
            }
        });
        const userMap = new Map(users.map(u => [u.id, u]));
        // Tạo leaderboard với rank
        const leaderboard = allScores
            .map(s => ({
            userId: s.userId,
            fullName: userMap.get(s.userId)?.fullName || 'Unknown',
            username: userMap.get(s.userId)?.username || 'unknown',
            avatar: userMap.get(s.userId)?.avatar || undefined,
            totalScore: s._sum.score || 0
        }))
            .sort((a, b) => b.totalScore - a.totalScore)
            .slice(0, 50) // Top 50
            .map((entry, index) => ({
            ...entry,
            rank: index + 1
        }));
        return leaderboard;
    }
    // ============ User Dashboard: Enrolled Courses ============
    async getUserEnrolledCoursesWithProgress(userId) {
        const enrollments = await prisma.enrollment.findMany({
            where: { userId },
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        image: true,
                        level: true,
                        duration: true,
                    }
                },
                user: {
                    select: { fullName: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        if (enrollments.length === 0)
            return [];
        const courseIds = enrollments.map(e => e.courseId);
        // Lấy progress summary từ Progress table
        const progressData = await prisma.progress.findMany({
            where: { userId, courseId: { in: courseIds } },
            select: { courseId: true, completedLessons: true, totalLessons: true, percentage: true }
        });
        const progressMap = new Map(progressData.map(p => [p.courseId, p]));
        // Đếm completed lessons từ LessonProgress cho từng course
        const lessonProgressCounts = await prisma.lessonProgress.groupBy({
            by: ['courseId'],
            where: {
                userId,
                isCompleted: true,
                courseId: { in: courseIds }
            },
            _count: { lessonId: true }
        });
        const completedLessonMap = new Map(lessonProgressCounts.map(c => [c.courseId, c._count.lessonId]));
        // Lấy tổng số lessons của từng course
        const phasesData = await prisma.phase.findMany({
            where: { courseId: { in: courseIds } },
            include: {
                _count: { select: { lessons: true } }
            }
        });
        const totalLessonMap = new Map();
        for (const phase of phasesData) {
            const current = totalLessonMap.get(phase.courseId) || 0;
            totalLessonMap.set(phase.courseId, current + phase._count.lessons);
        }
        return enrollments.map(e => {
            const prog = progressMap.get(e.courseId);
            const completedFromLesson = completedLessonMap.get(e.courseId) || 0;
            const totalFromCourse = totalLessonMap.get(e.courseId) || 0;
            // Ưu tiên: Progress table > LessonProgress count > Enrollment.progress
            let progress = 0;
            let completedLessons = 0;
            let totalLessons = 0;
            if (prog && prog.percentage > 0) {
                progress = prog.percentage;
                completedLessons = prog.completedLessons;
                totalLessons = prog.totalLessons;
            }
            else if (totalFromCourse > 0) {
                completedLessons = completedFromLesson;
                totalLessons = totalFromCourse;
                progress = Math.round((completedLessons / totalLessons) * 100);
            }
            else {
                completedLessons = completedFromLesson;
                totalLessons = prog?.totalLessons || 0;
                progress = Math.round(e.progress || 0);
            }
            return {
                enrollmentId: e.id,
                courseId: e.course.id,
                courseTitle: e.course.title,
                courseDescription: e.course.description,
                courseImage: e.course.image,
                level: e.course.level,
                duration: e.course.duration,
                progress,
                completedLessons,
                totalLessons,
                enrolledAt: e.createdAt
            };
        });
    }
    // ============ User Dashboard: 5-Criteria Evaluation ============
    async getUserEvaluation(userId) {
        const now = new Date();
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        // --- 1. Algorithm Speed (weight 0.20) ---
        const lessonSubs = await prisma.lessonSubmission.findMany({
            where: { userId },
            include: { lesson: true }
        });
        const problemSubs = await prisma.submission.findMany({
            where: { userId },
            include: { problem: true }
        });
        const hasLessonSubs = lessonSubs.length > 0;
        const hasProblemSubs = problemSubs.length > 0;
        const hasAnySubmission = hasLessonSubs || hasProblemSubs;
        // Active days
        const activeDays = await prisma.userSession.findMany({
            where: {
                userId,
                expiredAt: { gte: sevenDaysAgo }
            },
            select: { expiredAt: true }
        });
        const uniqueDays = new Set(activeDays.map(s => s.expiredAt.toISOString().split('T')[0]));
        const hasActiveDays = uniqueDays.size > 0;
        // Enrollment / progress
        const enrollments = await prisma.enrollment.findMany({ where: { userId } });
        const progress = await prisma.progress.findMany({ where: { userId } });
        const hasEnrollments = enrollments.length > 0;
        // Build hasActivity: true only when user has made submissions or enrolled
        const hasActivity = hasAnySubmission || hasEnrollments;
        // --- Return 0 scores for new users with no activity yet ---
        if (!hasActivity) {
            return {
                hasActivity: false,
                algorithmSpeed: { score: 0, label: 'Tốc độ hiểu thuật toán' },
                logicThinking: { score: 0, label: 'Khả năng tư duy logic' },
                bugFixing: { score: 0, label: 'Khả năng fix bug' },
                learningFrequency: { score: 0, label: 'Tần suất học', level: 'low' },
                taskCompletion: { score: 0, label: 'Mức độ hoàn thành' },
                finalScore: 0
            };
        }
        let speedScore = 0;
        let speedDataPoints = 0;
        // Lesson submissions: timeUsed vs expected 1hr (3600s)
        for (const sub of lessonSubs) {
            if (sub.timeUsed && sub.timeUsed > 0) {
                const ratio = Math.min(sub.timeUsed / 3600, 1);
                const score = (1 - ratio) * 50;
                speedScore += score;
                speedDataPoints++;
            }
        }
        // Problem submissions: runtime vs timeLimit
        for (const sub of problemSubs) {
            if (sub.runtime && sub.problem?.timeLimit && sub.problem.timeLimit > 0) {
                const ratio = Math.min(sub.runtime / sub.problem.timeLimit, 1);
                const score = (1 - ratio) * 50;
                speedScore += score;
                speedDataPoints++;
            }
        }
        const algorithmSpeed = speedDataPoints > 0 ? Math.round(speedScore / speedDataPoints) : 0;
        // --- 2. Logic Thinking (weight 0.25) ---
        const lessonPassRate = hasLessonSubs
            ? lessonSubs.reduce((sum, s) => sum + ((s.passedTests || 0) / Math.max(s.totalTests || 1, 1)), 0) / lessonSubs.length
            : 0;
        // Problem submission first-attempt AC rate
        const problemFirstAC = await Promise.all(problemSubs.map(async (sub) => {
            const firstForProblem = await prisma.submission.findFirst({
                where: { userId, problemId: sub.problemId },
                orderBy: { createdAt: 'asc' }
            });
            return firstForProblem?.status === 'AC' ? 1 : 0;
        }));
        const acFirstRate = problemFirstAC.length > 0
            ? problemFirstAC.reduce((a, b) => a + b, 0) / problemFirstAC.length
            : 0;
        // WA error rate
        const waCount = await prisma.submissionResult.count({
            where: {
                submission: { userId },
                status: 'WA'
            }
        });
        const totalResults = await prisma.submissionResult.count({
            where: { submission: { userId } }
        });
        const waRate = totalResults > 0 ? waCount / totalResults : 0;
        const logicThinking = Math.round(lessonPassRate * 40 +
            acFirstRate * 30 +
            Math.max(0, 1 - waRate) * 30);
        // --- 3. Bug Fixing (weight 0.15) ---
        // Group problem submissions to find multi-attempt patterns
        const problemIds = [...new Set(problemSubs.map(s => s.problemId))];
        let fixedCount = 0;
        let totalMultiAttempt = 0;
        let totalErrorDecrease = 0;
        for (const pid of problemIds) {
            const attempts = await prisma.submission.findMany({
                where: { userId, problemId: pid },
                orderBy: { createdAt: 'asc' }
            });
            if (attempts.length > 1) {
                totalMultiAttempt++;
                const lastAC = attempts.findLast(a => a.status === 'AC');
                if (lastAC) {
                    fixedCount++;
                    const firstWA = attempts.find(a => a.status === 'WA' || a.status === 'RE');
                    if (firstWA) {
                        const firstErrors = attempts.filter(a => a.createdAt <= firstWA.createdAt).length;
                        const errorsAfterFix = attempts.indexOf(lastAC) - attempts.indexOf(firstWA);
                        if (firstErrors > 0) {
                            totalErrorDecrease += Math.max(0, errorsAfterFix) / firstErrors;
                        }
                    }
                }
            }
        }
        const fixedRate = totalMultiAttempt > 0 ? fixedCount / totalMultiAttempt : 0;
        const errorDecrease = totalMultiAttempt > 0 ? totalErrorDecrease / totalMultiAttempt : 0;
        const bugFixing = Math.round(fixedRate * 40 +
            Math.min(errorDecrease, 1) * 30 +
            fixedRate * 30);
        // --- 4. Learning Frequency (weight 0.20) ---
        const activeDaysPerWeek = uniqueDays.size;
        const frequencyScore = Math.round((activeDaysPerWeek / 7) * 100);
        let frequencyLevel = 'low';
        if (activeDaysPerWeek >= 5)
            frequencyLevel = 'high';
        else if (activeDaysPerWeek >= 3)
            frequencyLevel = 'medium';
        const learningFrequency = frequencyScore;
        // --- 5. Task Completion (weight 0.20) ---
        const totalLessons = progress.reduce((sum, p) => sum + (p.totalLessons || 0), 0);
        const completedLessons = progress.reduce((sum, p) => sum + (p.completedLessons || 0), 0);
        const lessonCompletion = totalLessons > 0 ? completedLessons / totalLessons : 0;
        const projectSubs = await prisma.projectSubmission.findMany({
            where: { userId, status: 'approved' }
        });
        const hasProject = projectSubs.length > 0;
        const taskCompletion = Math.round(lessonCompletion * 70 + (hasProject ? 30 : 0));
        // --- Final Score ---
        const finalScore = Math.round(algorithmSpeed * 0.20 +
            logicThinking * 0.25 +
            bugFixing * 0.15 +
            learningFrequency * 0.20 +
            taskCompletion * 0.20);
        return {
            hasActivity: true,
            algorithmSpeed: { score: algorithmSpeed, label: 'Tốc độ hiểu thuật toán' },
            logicThinking: { score: logicThinking, label: 'Khả năng tư duy logic' },
            bugFixing: { score: bugFixing, label: 'Khả năng fix bug' },
            learningFrequency: { score: learningFrequency, label: 'Tần suất học', level: frequencyLevel },
            taskCompletion: { score: taskCompletion, label: 'Mức độ hoàn thành' },
            finalScore
        };
    }
}
exports.default = new StatsRepository();
//# sourceMappingURL=stats.repository.js.map