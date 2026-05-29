"use strict";
/**
 * Course Access Service - Enhanced với CFE- format codes
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma"));
const notification_service_1 = __importDefault(require("../notification/services/notification.service"));
const email_service_1 = __importDefault(require("../email/email.service"));
const CODE_PREFIX = 'CFE-';
const CODE_LENGTH = 20; // Length of random part after CFE-
class CourseAccessService {
    /**
     * Generate code với format CFE-XXXXXXXXXXXXXXXXXXXX
     */
    generateCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let randomPart = '';
        for (let i = 0; i < CODE_LENGTH; i++) {
            randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return `${CODE_PREFIX}${randomPart}`;
    }
    /**
     * Tạo access code cho khóa học (1 mã)
     */
    async createAccessCode(courseId, createdBy) {
        const course = await prisma_1.default.course.findUnique({ where: { id: courseId } });
        if (!course) {
            throw new Error('Course not found');
        }
        // Generate unique code
        let code = this.generateCode();
        let attempts = 0;
        while (attempts < 10) {
            const existing = await prisma_1.default.activateCode.findUnique({ where: { code } });
            if (!existing)
                break;
            code = this.generateCode();
            attempts++;
        }
        const accessCode = await prisma_1.default.activateCode.create({
            data: {
                code,
                courseId,
                createdBy,
                type: 'ADMIN_CREATED',
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            },
            include: {
                course: { select: { id: true, title: true } },
            },
        });
        return accessCode;
    }
    /**
     * Tạo nhiều access codes (bulk)
     */
    async createBulkAccessCodes(courseId, createdBy, count) {
        const course = await prisma_1.default.course.findUnique({ where: { id: courseId } });
        if (!course) {
            throw new Error('Course not found');
        }
        const codes = [];
        for (let i = 0; i < count; i++) {
            let code = this.generateCode();
            let attempts = 0;
            while (attempts < 10) {
                const existing = await prisma_1.default.activateCode.findUnique({ where: { code } });
                if (!existing)
                    break;
                code = this.generateCode();
                attempts++;
            }
            const accessCode = await prisma_1.default.activateCode.create({
                data: {
                    code,
                    courseId,
                    createdBy,
                    type: 'BULK_GENERATED',
                    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                },
                include: {
                    course: { select: { id: true, title: true } },
                },
            });
            codes.push(accessCode);
        }
        return codes;
    }
    /**
     * Gán khóa học cho user cụ thể (bằng email)
     */
    async grantAccessToUser(courseId, email, grantedBy) {
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            throw new Error('User not found');
        }
        const course = await prisma_1.default.course.findUnique({
            where: { id: courseId },
            include: { creator: true }
        });
        if (!course) {
            throw new Error('Course not found');
        }
        // Create enrollment
        const enrollment = await prisma_1.default.enrollment.upsert({
            where: {
                userId_courseId: { userId: user.id, courseId },
            },
            update: {},
            create: {
                userId: user.id,
                courseId,
            },
        });
        // Create subscription
        await prisma_1.default.courseSubscription.upsert({
            where: {
                userId_courseId: { userId: user.id, courseId },
            },
            update: {},
            create: {
                userId: user.id,
                courseId,
                status: 'ACTIVE',
            },
        });
        // Send notification
        await notification_service_1.default.createNotification({
            userId: user.id,
            type: 'course_access_granted',
            title: 'Bạn được cấp quyền truy cập khóa học',
            message: `Bạn đã được cấp quyền truy cập khóa học "${course.title}". Bạn có thể bắt đầu học ngay!`,
            metadata: JSON.stringify({ courseId, type: 'course_assigned' }),
        });
        // Send email với link khóa học
        const courseUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/user/courses/${courseId}`;
        await email_service_1.default.sendCourseAccessGrantedNotification(user.email, user.fullName || user.username, course.title, courseUrl);
        return enrollment;
    }
    /**
     * Gán khóa học cho nhiều users (bulk assignment)
     */
    async assignToUsers(courseId, userIds, adminId) {
        const course = await prisma_1.default.course.findUnique({ where: { id: courseId } });
        if (!course) {
            throw new Error('Course not found');
        }
        const results = [];
        for (const userId of userIds) {
            const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
            if (!user)
                continue;
            // Create enrollment with progressive unlock
            const enrollment = await prisma_1.default.enrollment.upsert({
                where: {
                    userId_courseId: { userId, courseId },
                },
                update: {},
                create: {
                    userId,
                    courseId,
                    // Progressive unlock: mở khóa unlockLessonsCount bài đầu tiên
                    currentUnlocks: course.unlockLessonsCount || 3,
                    completedLessons: 0,
                },
            });
            // Create subscription
            await prisma_1.default.courseSubscription.upsert({
                where: {
                    userId_courseId: { userId, courseId },
                },
                update: {},
                create: {
                    userId,
                    courseId,
                    status: 'ACTIVE',
                },
            });
            // Send notification
            await notification_service_1.default.createNotification({
                userId,
                type: 'course_assigned',
                title: 'Bạn được cấp quyền truy cập khóa học',
                message: `Bạn đã được cấp quyền truy cập khóa học "${course.title}". Bạn có thể bắt đầu học ngay!`,
                metadata: JSON.stringify({ courseId, type: 'course_assigned' }),
            });
            // Send email với link khóa học
            const courseUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/user/courses/${courseId}`;
            await email_service_1.default.sendCourseAccessGrantedNotification(user.email, user.fullName || user.username, course.title, courseUrl);
            results.push({ userId, userEmail: user.email, userName: user.fullName || user.username, enrollment });
        }
        return {
            courseId,
            courseTitle: course.title,
            assignedCount: results.length,
            results,
        };
    }
    /**
     * Lấy danh sách users chưa enroll vào khóa học
     */
    async getUsersNotEnrolled(courseId, search) {
        // Get enrolled user IDs
        const enrollments = await prisma_1.default.enrollment.findMany({
            where: { courseId },
            select: { userId: true },
        });
        const enrolledUserIds = enrollments.map(e => e.userId);
        // Get users not enrolled
        const whereClause = {
            isActive: true,
            id: { notIn: enrolledUserIds.length > 0 ? enrolledUserIds : [''] },
        };
        if (search) {
            whereClause.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { username: { contains: search, mode: 'insensitive' } },
                { fullName: { contains: search, mode: 'insensitive' } },
            ];
        }
        const users = await prisma_1.default.user.findMany({
            where: whereClause,
            select: {
                id: true,
                email: true,
                username: true,
                fullName: true,
                avatar: true,
                school: true,
            },
            take: 50,
            orderBy: { createdAt: 'desc' },
        });
        return users;
    }
    /**
     * Kích hoạt khóa học bằng code
     */
    async activateByCode(code, userId) {
        // Normalize code
        const normalizedCode = code.toUpperCase().trim();
        const accessCode = await prisma_1.default.activateCode.findUnique({
            where: { code: normalizedCode },
            include: { course: true },
        });
        if (!accessCode) {
            throw new Error('Mã kích hoạt không hợp lệ');
        }
        if (accessCode.isUsed) {
            throw new Error('Mã kích hoạt đã được sử dụng');
        }
        if (accessCode.expiresAt && accessCode.expiresAt < new Date()) {
            throw new Error('Mã kích hoạt đã hết hạn');
        }
        // Check if user already enrolled
        const existingEnrollment = await prisma_1.default.enrollment.findUnique({
            where: { userId_courseId: { userId, courseId: accessCode.courseId } },
        });
        if (existingEnrollment) {
            throw new Error('Bạn đã đăng ký khóa học này rồi');
        }
        // Mark code as used
        await prisma_1.default.activateCode.update({
            where: { id: accessCode.id },
            data: {
                isUsed: true,
                usedBy: userId,
                usedAt: new Date(),
            },
        });
        // Create enrollment with progressive unlock
        const enrollment = await prisma_1.default.enrollment.upsert({
            where: {
                userId_courseId: { userId, courseId: accessCode.courseId },
            },
            update: {},
            create: {
                userId,
                courseId: accessCode.courseId,
                // Progressive unlock: mở khóa unlockLessonsCount bài đầu tiên
                currentUnlocks: accessCode.course.unlockLessonsCount || 3,
                completedLessons: 0,
            },
        });
        // Create subscription
        await prisma_1.default.courseSubscription.upsert({
            where: {
                userId_courseId: { userId, courseId: accessCode.courseId },
            },
            update: {},
            create: {
                userId,
                courseId: accessCode.courseId,
                status: 'ACTIVE',
            },
        });
        // Send notification
        await notification_service_1.default.createNotification({
            userId,
            type: 'course_access_with_code',
            title: 'Kích hoạt khóa học thành công',
            message: `Bạn đã kích hoạt thành công khóa học "${accessCode.course.title}". Chúc bạn học tốt!`,
            metadata: JSON.stringify({ courseId: accessCode.courseId, type: 'course_activated' }),
        });
        return {
            enrollment,
            course: accessCode.course,
            unlockConfig: {
                unlockedLessons: accessCode.course.unlockLessonsCount || 3,
                message: `Bạn đã mở khóa ${accessCode.course.unlockLessonsCount || 3} bài học đầu tiên. Hoàn thành để mở thêm!`,
            },
        };
    }
    /**
     * Kích hoạt khóa học bằng code (không cần user đăng nhập - qua email link)
     */
    async activateByCodeLink(code) {
        const normalizedCode = code.toUpperCase().trim();
        const accessCode = await prisma_1.default.activateCode.findUnique({
            where: { code: normalizedCode },
            include: { course: true },
        });
        if (!accessCode) {
            throw new Error('Mã kích hoạt không hợp lệ');
        }
        if (accessCode.isUsed) {
            throw new Error('Mã kích hoạt đã được sử dụng');
        }
        if (accessCode.expiresAt && accessCode.expiresAt < new Date()) {
            throw new Error('Mã kích hoạt đã hết hạn');
        }
        return {
            valid: true,
            code: accessCode.code,
            courseId: accessCode.courseId,
            courseTitle: accessCode.course.title,
        };
    }
    /**
     * Lấy danh sách codes của khóa học
     */
    async getCodesByCourse(courseId) {
        return prisma_1.default.activateCode.findMany({
            where: { courseId },
            include: {
                user: { select: { id: true, username: true, email: true, fullName: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    /**
     * Xóa access code
     */
    async deleteCode(codeId) {
        await prisma_1.default.activateCode.delete({ where: { id: codeId } });
    }
    /**
     * Lấy danh sách enrollments của khóa học với thông tin user và progress
     */
    async getEnrollments(courseId) {
        const course = await prisma_1.default.course.findUnique({
            where: { id: courseId },
            include: {
                phases: {
                    include: {
                        lessons: {
                            where: { isPublished: true },
                            select: { id: true }
                        }
                    }
                }
            }
        });
        if (!course) {
            throw new Error('Course not found');
        }
        const totalLessons = course.phases.reduce((acc, p) => acc + p.lessons.length, 0);
        const enrollments = await prisma_1.default.enrollment.findMany({
            where: { courseId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        username: true,
                        fullName: true,
                        avatar: true,
                    }
                },
                coach: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
        });
        // Get completed lessons count for each enrollment
        const enrollmentsWithProgress = await Promise.all(enrollments.map(async (enrollment) => {
            const completedCount = await prisma_1.default.lessonProgress.count({
                where: {
                    userId: enrollment.userId,
                    isCompleted: true,
                    lesson: {
                        phase: {
                            courseId
                        }
                    }
                }
            });
            return {
                ...enrollment,
                totalLessons,
                completedLessons: completedCount,
                unlockedLessons: enrollment.currentUnlocks,
            };
        }));
        return enrollmentsWithProgress;
    }
    /**
     * Cập nhật số bài đã mở khóa cho user
     */
    async updateUserUnlocks(courseId, userId, currentUnlocks) {
        const course = await prisma_1.default.course.findUnique({
            where: { id: courseId },
            include: {
                phases: {
                    include: {
                        lessons: {
                            where: { isPublished: true },
                            select: { id: true }
                        }
                    }
                }
            }
        });
        if (!course) {
            throw new Error('Course not found');
        }
        const totalLessons = course.phases.reduce((acc, p) => acc + p.lessons.length, 0);
        // Validate currentUnlocks
        if (currentUnlocks > totalLessons) {
            throw new Error(`Cannot unlock more than ${totalLessons} lessons`);
        }
        const enrollment = await prisma_1.default.enrollment.findUnique({
            where: {
                userId_courseId: { userId, courseId }
            }
        });
        if (!enrollment) {
            throw new Error('User is not enrolled in this course');
        }
        // Update enrollment
        const updatedEnrollment = await prisma_1.default.enrollment.update({
            where: {
                userId_courseId: { userId, courseId }
            },
            data: {
                currentUnlocks
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    }
                }
            }
        });
        // Send notification to user
        await notification_service_1.default.createNotification({
            userId,
            type: 'lessons_unlocked',
            title: 'Bài học đã được mở khóa',
            message: `Admin đã mở khóa thêm bài học cho bạn. Bây giờ bạn có thể truy cập ${currentUnlocks} bài học!`,
            metadata: JSON.stringify({ courseId, currentUnlocks }),
        });
        return {
            enrollment: updatedEnrollment,
            totalLessons,
            previousUnlocks: enrollment.currentUnlocks,
            newUnlocks: currentUnlocks,
        };
    }
    /**
     * Mở khóa toàn bộ bài học cho user
     */
    async unlockAllLessonsForUser(courseId, userId) {
        const course = await prisma_1.default.course.findUnique({
            where: { id: courseId },
            include: {
                phases: {
                    include: {
                        lessons: {
                            where: { isPublished: true },
                            select: { id: true }
                        }
                    }
                }
            }
        });
        if (!course) {
            throw new Error('Course not found');
        }
        const totalLessons = course.phases.reduce((acc, p) => acc + p.lessons.length, 0);
        const enrollment = await prisma_1.default.enrollment.findUnique({
            where: {
                userId_courseId: { userId, courseId }
            }
        });
        if (!enrollment) {
            throw new Error('User is not enrolled in this course');
        }
        // Update enrollment with max unlocks
        const updatedEnrollment = await prisma_1.default.enrollment.update({
            where: {
                userId_courseId: { userId, courseId }
            },
            data: {
                currentUnlocks: totalLessons
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    }
                }
            }
        });
        // Send notification
        await notification_service_1.default.createNotification({
            userId,
            type: 'all_lessons_unlocked',
            title: 'Toàn bộ bài học đã được mở khóa!',
            message: `Admin đã mở khóa toàn bộ bài học trong khóa học "${course.title}". Bạn có thể học tất cả ngay bây giờ!`,
            metadata: JSON.stringify({ courseId, currentUnlocks: totalLessons }),
        });
        return {
            enrollment: updatedEnrollment,
            totalLessons,
            previousUnlocks: enrollment.currentUnlocks,
            newUnlocks: totalLessons,
        };
    }
}
exports.default = new CourseAccessService();
//# sourceMappingURL=courseAccess.service.js.map