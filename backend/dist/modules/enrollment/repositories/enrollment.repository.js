/**
 * @fileoverview Repository layer cho module Enrollment
 * Xử lý các thao tác database với bảng enrollment
 * @module enrollment/repositories
 */
import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../../../base/base.repository';
const prisma = new PrismaClient();
/**
 * Repository class xử lý các thao tác CRUD với enrollment trong database
 * Kế thừa từ BaseRepository và mở rộng với các method đặc thù cho enrollment
 */
class EnrollmentRepository extends BaseRepository {
    model = prisma.enrollment;
    /**
     * Lấy danh sách tất cả enrollment của một user
     * Bao gồm thông tin chi tiết của course và các lessons
     * @param userId - ID của người dùng
     * @returns Promise<Enrollment[]> - Danh sách enrollment kèm course details
     */
    async findByUserId(userId) {
        const enrollments = await this.model.findMany({
            where: { userId },
            include: {
                coach: {
                    select: {
                        id: true,
                        fullName: true,
                        username: true,
                        avatar: true,
                        email: true,
                        bio: true,
                        role: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                            }
                        }
                    }
                },
                course: {
                    include: {
                        phases: {
                            orderBy: { orderIndex: 'asc' },
                            include: {
                                lessons: {
                                    orderBy: { orderIndex: 'asc' }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        // Calculate progress for each enrollment based on lessonProgress
        const enrollmentsWithProgress = await Promise.all(enrollments.map(async (enrollment) => {
            // Count total lessons in the course
            const totalLessons = enrollment.course.phases.reduce((sum, phase) => sum + phase.lessons.length, 0);
            // Count completed lessons for this user in this course
            const completedCount = await prisma.lessonProgress.count({
                where: {
                    userId,
                    courseId: enrollment.courseId,
                    isCompleted: true
                }
            });
            // Calculate progress percentage
            const progress = totalLessons > 0
                ? Math.round((completedCount / totalLessons) * 100)
                : Math.round(enrollment.progress || 0);
            return {
                ...enrollment,
                progress,
                coachId: enrollment.coachId,
                coach: enrollment.coach,
            };
        }));
        return enrollmentsWithProgress;
    }
    /**
     * Tìm một enrollment cụ thể theo userId và courseId
     * Sử dụng unique constraint composite key
     * @param userId - ID của người dùng
     * @param courseId - ID của khóa học
     * @returns Promise<Enrollment | null> - Enrollment nếu tìm thấy, null nếu không
     */
    async findByUserIdAndCourseId(userId, courseId) {
        return this.model.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            },
            select: {
                id: true,
                userId: true,
                courseId: true,
                progress: true,
                coachId: true,
                completedLessons: true,
                currentUnlocks: true,
                createdAt: true,
                course: {
                    select: {
                        id: true,
                        title: true,
                        unlockLessonsCount: true,
                        unlockByPhase: true,
                    }
                }
            }
        });
    }
    /**
     * Cập nhật tiến độ học tập của một enrollment
     * @param id - ID của enrollment cần cập nhật
     * @param progress - Tiến độ mới (0-100)
     * @returns Promise<Enrollment> - Enrollment sau khi cập nhật
     */
    async updateProgress(id, progress) {
        return this.model.update({
            where: { id },
            data: { progress }
        });
    }
}
export default new EnrollmentRepository();
//# sourceMappingURL=enrollment.repository.js.map