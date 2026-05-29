"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
class MockProgressRepository {
    progress = new Map();
    getKey(userId, courseId) {
        return `${userId}_${courseId}`;
    }
    async findByUserAndCourse(userId, courseId) {
        return this.progress.get(this.getKey(userId, courseId)) || null;
    }
    async updateProgress(userId, courseId, completedLessons, totalLessons) {
        const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
        const progress = {
            id: crypto.randomUUID(),
            userId,
            courseId,
            completedLessons,
            totalLessons,
            percentage,
            updatedAt: new Date()
        };
        this.progress.set(this.getKey(userId, courseId), progress);
        return progress;
    }
    clear() {
        this.progress.clear();
    }
}
class MockLessonProgressRepository {
    progress = new Map();
    getKey(userId, lessonId) {
        return `${userId}_${lessonId}`;
    }
    async findByUserAndLesson(userId, lessonId) {
        return this.progress.get(this.getKey(userId, lessonId)) || null;
    }
    async findByUserAndCourse(userId, courseId) {
        return Array.from(this.progress.values()).filter(p => p.userId === userId && p.courseId === courseId);
    }
    async markComplete(userId, lessonId, courseId) {
        const existing = await this.findByUserAndLesson(userId, lessonId);
        if (existing) {
            const updated = { ...existing, completed: true, completedAt: new Date() };
            this.progress.set(this.getKey(userId, lessonId), updated);
            return updated;
        }
        const progress = {
            id: crypto.randomUUID(),
            userId,
            lessonId,
            courseId,
            completed: true,
            completedAt: new Date()
        };
        this.progress.set(this.getKey(userId, lessonId), progress);
        return progress;
    }
    clear() {
        this.progress.clear();
    }
}
class MockNotificationRepository {
    notifications = new Map();
    async create(data) {
        const notification = {
            id: crypto.randomUUID(),
            userId: data.userId,
            type: data.type,
            title: data.title,
            message: data.message,
            isRead: false,
            createdAt: new Date()
        };
        this.notifications.set(notification.id, notification);
        return notification;
    }
    async findById(id) {
        return this.notifications.get(id) || null;
    }
    async findByUserId(userId) {
        return Array.from(this.notifications.values())
            .filter(n => n.userId === userId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    async findUnreadByUserId(userId) {
        return Array.from(this.notifications.values())
            .filter(n => n.userId === userId && !n.isRead);
    }
    async markAsRead(id) {
        const notification = this.notifications.get(id);
        if (!notification)
            throw new Error('Notification not found');
        const updated = { ...notification, isRead: true };
        this.notifications.set(id, updated);
        return updated;
    }
    async markAllAsRead(userId) {
        let count = 0;
        this.notifications.forEach(n => {
            if (n.userId === userId && !n.isRead) {
                n.isRead = true;
                count++;
            }
        });
        return count;
    }
    async countUnread(userId) {
        return Array.from(this.notifications.values())
            .filter(n => n.userId === userId && !n.isRead)
            .length;
    }
    async delete(id) {
        this.notifications.delete(id);
    }
    clear() {
        this.notifications.clear();
    }
}
const mockProgressRepo = new MockProgressRepository();
const mockLessonProgressRepo = new MockLessonProgressRepository();
const mockNotificationRepo = new MockNotificationRepository();
(0, globals_1.describe)('ProgressService', () => {
    (0, globals_1.beforeEach)(() => {
        mockProgressRepo.clear();
    });
    (0, globals_1.describe)('updateProgress', () => {
        (0, globals_1.it)('should update progress with correct percentage', async () => {
            const progress = await mockProgressRepo.updateProgress('user-1', 'course-1', 5, 10);
            (0, globals_1.expect)(progress.percentage).toBe(50);
            (0, globals_1.expect)(progress.completedLessons).toBe(5);
            (0, globals_1.expect)(progress.totalLessons).toBe(10);
        });
        (0, globals_1.it)('should calculate 0% for no lessons completed', async () => {
            const progress = await mockProgressRepo.updateProgress('user-1', 'course-1', 0, 10);
            (0, globals_1.expect)(progress.percentage).toBe(0);
        });
        (0, globals_1.it)('should calculate 100% for all lessons completed', async () => {
            const progress = await mockProgressRepo.updateProgress('user-1', 'course-1', 10, 10);
            (0, globals_1.expect)(progress.percentage).toBe(100);
        });
    });
    (0, globals_1.describe)('getProgress', () => {
        (0, globals_1.it)('should return null for non-existent progress', async () => {
            const progress = await mockProgressRepo.findByUserAndCourse('user-1', 'course-1');
            (0, globals_1.expect)(progress).toBeNull();
        });
        (0, globals_1.it)('should return progress when exists', async () => {
            await mockProgressRepo.updateProgress('user-1', 'course-1', 5, 10);
            const progress = await mockProgressRepo.findByUserAndCourse('user-1', 'course-1');
            (0, globals_1.expect)(progress).not.toBeNull();
            (0, globals_1.expect)(progress?.percentage).toBe(50);
        });
    });
});
(0, globals_1.describe)('LessonProgressService', () => {
    (0, globals_1.beforeEach)(() => {
        mockLessonProgressRepo.clear();
    });
    (0, globals_1.describe)('markComplete', () => {
        (0, globals_1.it)('should mark lesson as complete', async () => {
            const progress = await mockLessonProgressRepo.markComplete('user-1', 'lesson-1', 'course-1');
            (0, globals_1.expect)(progress.completed).toBe(true);
            (0, globals_1.expect)(progress.completedAt).not.toBeNull();
        });
        (0, globals_1.it)('should update existing progress', async () => {
            await mockLessonProgressRepo.markComplete('user-1', 'lesson-1', 'course-1');
            const progress = await mockLessonProgressRepo.markComplete('user-1', 'lesson-1', 'course-1');
            (0, globals_1.expect)(progress.completed).toBe(true);
        });
    });
    (0, globals_1.describe)('findByUserAndCourse', () => {
        (0, globals_1.it)('should return all lesson progress for a course', async () => {
            await mockLessonProgressRepo.markComplete('user-1', 'lesson-1', 'course-1');
            await mockLessonProgressRepo.markComplete('user-1', 'lesson-2', 'course-1');
            const progress = await mockLessonProgressRepo.findByUserAndCourse('user-1', 'course-1');
            (0, globals_1.expect)(progress).toHaveLength(2);
        });
    });
});
(0, globals_1.describe)('NotificationService', () => {
    (0, globals_1.beforeEach)(() => {
        mockNotificationRepo.clear();
    });
    (0, globals_1.describe)('create', () => {
        (0, globals_1.it)('should create a notification', async () => {
            const notification = await mockNotificationRepo.create({
                userId: 'user-1',
                type: 'submission_result',
                title: 'Test Passed',
                message: 'Your solution is correct'
            });
            (0, globals_1.expect)(notification).toBeDefined();
            (0, globals_1.expect)(notification.isRead).toBe(false);
        });
    });
    (0, globals_1.describe)('markAsRead', () => {
        (0, globals_1.it)('should mark notification as read', async () => {
            const notification = await mockNotificationRepo.create({
                userId: 'user-1',
                type: 'submission_result',
                title: 'Test Passed',
                message: 'Your solution is correct'
            });
            const updated = await mockNotificationRepo.markAsRead(notification.id);
            (0, globals_1.expect)(updated.isRead).toBe(true);
        });
    });
    (0, globals_1.describe)('getUnreadNotifications', () => {
        (0, globals_1.it)('should return only unread notifications', async () => {
            await mockNotificationRepo.create({
                userId: 'user-1',
                type: 'submission_result',
                title: 'Test 1',
                message: 'Message 1'
            });
            const notification2 = await mockNotificationRepo.create({
                userId: 'user-1',
                type: 'submission_result',
                title: 'Test 2',
                message: 'Message 2'
            });
            await mockNotificationRepo.markAsRead(notification2.id);
            const unread = await mockNotificationRepo.findUnreadByUserId('user-1');
            (0, globals_1.expect)(unread).toHaveLength(1);
        });
    });
    (0, globals_1.describe)('markAllAsRead', () => {
        (0, globals_1.it)('should mark all notifications as read', async () => {
            await mockNotificationRepo.create({
                userId: 'user-1',
                type: 'submission_result',
                title: 'Test 1',
                message: 'Message 1'
            });
            await mockNotificationRepo.create({
                userId: 'user-1',
                type: 'submission_result',
                title: 'Test 2',
                message: 'Message 2'
            });
            const count = await mockNotificationRepo.markAllAsRead('user-1');
            (0, globals_1.expect)(count).toBe(2);
            const unread = await mockNotificationRepo.findUnreadByUserId('user-1');
            (0, globals_1.expect)(unread).toHaveLength(0);
        });
    });
    (0, globals_1.describe)('countUnread', () => {
        (0, globals_1.it)('should return correct unread count', async () => {
            await mockNotificationRepo.create({
                userId: 'user-1',
                type: 'submission_result',
                title: 'Test 1',
                message: 'Message 1'
            });
            await mockNotificationRepo.create({
                userId: 'user-1',
                type: 'submission_result',
                title: 'Test 2',
                message: 'Message 2'
            });
            const count = await mockNotificationRepo.countUnread('user-1');
            (0, globals_1.expect)(count).toBe(2);
        });
    });
});
//# sourceMappingURL=progress.service.test.js.map