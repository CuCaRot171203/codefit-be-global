"use strict";
/**
 * LessonProgress Repository
 *
 * Xử lý các thao tác database cho tiến độ bài học.
 * Quản lý việc đánh dấu hoàn thành/chưa hoàn thành bài học của người dùng.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const base_repository_1 = require("../../../base/base.repository");
const ioredis_1 = __importDefault(require("ioredis"));
const prisma = new client_1.PrismaClient();
const redis = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379');
/**
 * LessonProgressRepository - Quản lý database operations cho tiến độ bài học
 * @class LessonProgressRepository
 * @extends BaseRepository<LessonProgress>
 */
class LessonProgressRepository extends base_repository_1.BaseRepository {
    /** Prisma model được sử dụng cho các thao tác database */
    model = prisma.lessonProgress;
    /**
     * Tìm tiến độ bài học của người dùng theo lessonId
     * @param userId - ID của người dùng
     * @param lessonId - ID của bài học
     * @returns Promise<LessonProgress | null> - Tiến độ tìm được hoặc null
     */
    async findByUserAndLesson(userId, lessonId) {
        // Bước 1: Truy vấn với unique constraint userId_lessonId
        return this.model.findUnique({
            where: {
                userId_lessonId: {
                    userId,
                    lessonId
                }
            }
        });
    }
    /**
     * Tìm tất cả tiến độ bài học của người dùng trong một khóa học
     * @param userId - ID của người dùng
     * @param courseId - ID của khóa học
     * @returns Promise<LessonProgress[]> - Danh sách tiến độ bài học
     */
    async findByUserAndCourse(userId, courseId) {
        // Bước 1: Truy vấn với điều kiện userId và courseId
        return this.model.findMany({
            where: { userId, courseId }
        });
    }
    /**
     * Đánh dấu bài học là hoàn thành
     * @param userId - ID của người dùng
     * @param lessonId - ID của bài học
     * @param courseId - ID của khóa học
     * @returns Promise<LessonProgress> - Bản ghi tiến độ đã cập nhật/tạo mới
     */
    async markComplete(userId, lessonId, courseId) {
        // Bước 1: Kiểm tra xem đã có bản ghi tiến độ chưa
        const existing = await this.findByUserAndLesson(userId, lessonId);
        // Bước 2: Nếu đã có, cập nhật trạng thái hoàn thành
        if (existing) {
            await this.model.update({
                where: { id: existing.id },
                data: {
                    isCompleted: true,
                    completedAt: new Date()
                }
            });
        }
        else {
            // Bước 3: Nếu chưa có, tạo bản ghi mới với trạng thái hoàn thành
            await this.model.create({
                data: {
                    userId,
                    lessonId,
                    courseId,
                    isCompleted: true,
                    completedAt: new Date()
                }
            });
        }
        // Bước 4: Cập nhật enrollment - đếm số bài đã hoàn thành và unlock thêm nếu cần
        const completedCount = await this.model.count({
            where: {
                userId,
                isCompleted: true,
                courseId
            }
        });
        const enrollment = await prisma.enrollment.findUnique({
            where: { userId_courseId: { userId, courseId } },
            include: { course: true }
        });
        if (enrollment) {
            const unlockLessonsCount = enrollment.course.unlockLessonsCount;
            const totalLessons = await prisma.lesson.count({
                where: { phase: { courseId } }
            });
            let newUnlocks = enrollment.currentUnlocks;
            if (unlockLessonsCount === 0) {
                newUnlocks = totalLessons;
            }
            else {
                const completedBatches = Math.floor(completedCount / unlockLessonsCount);
                newUnlocks = Math.min((completedBatches + 1) * unlockLessonsCount, totalLessons);
            }
            // Chỉ update nếu có thay đổi
            if (newUnlocks > enrollment.currentUnlocks) {
                await prisma.enrollment.update({
                    where: { userId_courseId: { userId, courseId } },
                    data: {
                        completedLessons: completedCount,
                        currentUnlocks: newUnlocks
                    }
                });
            }
            else if (completedCount !== enrollment.completedLessons) {
                // Cập nhật số bài đã hoàn thành nếu chưa unlock thêm
                await prisma.enrollment.update({
                    where: { userId_courseId: { userId, courseId } },
                    data: { completedLessons: completedCount }
                });
            }
        }
        // Invalidate stats cache so progress is reflected immediately
        try {
            await redis.del(`stats:courses:${userId}`);
        }
        catch (err) {
            console.error('Redis cache invalidation error:', err);
        }
        // Trả về bản ghi đã cập nhật
        return this.model.findUnique({
            where: { userId_lessonId: { userId, lessonId } }
        });
    }
    /**
     * Đánh dấu bài học là chưa hoàn thành
     * @param userId - ID của người dùng
     * @param lessonId - ID của bài học
     * @returns Promise<LessonProgress> - Bản ghi tiến độ đã cập nhật
     * @throws Error - Nếu không tìm thấy tiến độ bài học
     */
    async markIncomplete(userId, lessonId) {
        // Bước 1: Tìm bản ghi tiến độ hiện tại
        const existing = await this.findByUserAndLesson(userId, lessonId);
        // Bước 2: Kiểm tra nếu không tìm thấy thì throw error
        if (!existing) {
            throw new Error('Lesson progress not found');
        }
        // Bước 3: Cập nhật trạng thái thành chưa hoàn thành và xóa completedAt
        return this.model.update({
            where: { id: existing.id },
            data: {
                isCompleted: false,
                completedAt: null
            }
        });
    }
}
exports.default = new LessonProgressRepository();
//# sourceMappingURL=lessonProgress.repository.js.map