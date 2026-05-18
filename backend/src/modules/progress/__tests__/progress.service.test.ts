import { describe, it, expect, beforeEach } from '@jest/globals';

interface Progress {
  id: string;
  userId: string;
  courseId: string;
  completedLessons: number;
  totalLessons: number;
  percentage: number;
  updatedAt: Date;
}

interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  courseId: string;
  completed: boolean;
  completedAt: Date | null;
}

interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

class MockProgressRepository {
  private progress: Map<string, Progress> = new Map();

  private getKey(userId: string, courseId: string): string {
    return `${userId}_${courseId}`;
  }

  async findByUserAndCourse(userId: string, courseId: string): Promise<Progress | null> {
    return this.progress.get(this.getKey(userId, courseId)) || null;
  }

  async updateProgress(
    userId: string,
    courseId: string,
    completedLessons: number,
    totalLessons: number
  ): Promise<Progress> {
    const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    const progress: Progress = {
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
  private progress: Map<string, LessonProgress> = new Map();

  private getKey(userId: string, lessonId: string): string {
    return `${userId}_${lessonId}`;
  }

  async findByUserAndLesson(userId: string, lessonId: string): Promise<LessonProgress | null> {
    return this.progress.get(this.getKey(userId, lessonId)) || null;
  }

  async findByUserAndCourse(userId: string, courseId: string): Promise<LessonProgress[]> {
    return Array.from(this.progress.values()).filter(p => p.userId === userId && p.courseId === courseId);
  }

  async markComplete(userId: string, lessonId: string, courseId: string): Promise<LessonProgress> {
    const existing = await this.findByUserAndLesson(userId, lessonId);
    if (existing) {
      const updated = { ...existing, completed: true, completedAt: new Date() };
      this.progress.set(this.getKey(userId, lessonId), updated);
      return updated;
    }
    const progress: LessonProgress = {
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
  private notifications: Map<string, Notification> = new Map();

  async create(data: any): Promise<Notification> {
    const notification: Notification = {
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

  async findById(id: string): Promise<Notification | null> {
    return this.notifications.get(id) || null;
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(n => n.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findUnreadByUserId(userId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(n => n.userId === userId && !n.isRead);
  }

  async markAsRead(id: string): Promise<Notification> {
    const notification = this.notifications.get(id);
    if (!notification) throw new Error('Notification not found');
    const updated = { ...notification, isRead: true };
    this.notifications.set(id, updated);
    return updated;
  }

  async markAllAsRead(userId: string): Promise<number> {
    let count = 0;
    this.notifications.forEach(n => {
      if (n.userId === userId && !n.isRead) {
        n.isRead = true;
        count++;
      }
    });
    return count;
  }

  async countUnread(userId: string): Promise<number> {
    return Array.from(this.notifications.values())
      .filter(n => n.userId === userId && !n.isRead)
      .length;
  }

  async delete(id: string): Promise<void> {
    this.notifications.delete(id);
  }

  clear() {
    this.notifications.clear();
  }
}

const mockProgressRepo = new MockProgressRepository();
const mockLessonProgressRepo = new MockLessonProgressRepository();
const mockNotificationRepo = new MockNotificationRepository();

describe('ProgressService', () => {
  beforeEach(() => {
    mockProgressRepo.clear();
  });

  describe('updateProgress', () => {
    it('should update progress with correct percentage', async () => {
      const progress = await mockProgressRepo.updateProgress('user-1', 'course-1', 5, 10);
      expect(progress.percentage).toBe(50);
      expect(progress.completedLessons).toBe(5);
      expect(progress.totalLessons).toBe(10);
    });

    it('should calculate 0% for no lessons completed', async () => {
      const progress = await mockProgressRepo.updateProgress('user-1', 'course-1', 0, 10);
      expect(progress.percentage).toBe(0);
    });

    it('should calculate 100% for all lessons completed', async () => {
      const progress = await mockProgressRepo.updateProgress('user-1', 'course-1', 10, 10);
      expect(progress.percentage).toBe(100);
    });
  });

  describe('getProgress', () => {
    it('should return null for non-existent progress', async () => {
      const progress = await mockProgressRepo.findByUserAndCourse('user-1', 'course-1');
      expect(progress).toBeNull();
    });

    it('should return progress when exists', async () => {
      await mockProgressRepo.updateProgress('user-1', 'course-1', 5, 10);
      const progress = await mockProgressRepo.findByUserAndCourse('user-1', 'course-1');
      expect(progress).not.toBeNull();
      expect(progress?.percentage).toBe(50);
    });
  });
});

describe('LessonProgressService', () => {
  beforeEach(() => {
    mockLessonProgressRepo.clear();
  });

  describe('markComplete', () => {
    it('should mark lesson as complete', async () => {
      const progress = await mockLessonProgressRepo.markComplete('user-1', 'lesson-1', 'course-1');
      expect(progress.completed).toBe(true);
      expect(progress.completedAt).not.toBeNull();
    });

    it('should update existing progress', async () => {
      await mockLessonProgressRepo.markComplete('user-1', 'lesson-1', 'course-1');
      const progress = await mockLessonProgressRepo.markComplete('user-1', 'lesson-1', 'course-1');
      expect(progress.completed).toBe(true);
    });
  });

  describe('findByUserAndCourse', () => {
    it('should return all lesson progress for a course', async () => {
      await mockLessonProgressRepo.markComplete('user-1', 'lesson-1', 'course-1');
      await mockLessonProgressRepo.markComplete('user-1', 'lesson-2', 'course-1');
      const progress = await mockLessonProgressRepo.findByUserAndCourse('user-1', 'course-1');
      expect(progress).toHaveLength(2);
    });
  });
});

describe('NotificationService', () => {
  beforeEach(() => {
    mockNotificationRepo.clear();
  });

  describe('create', () => {
    it('should create a notification', async () => {
      const notification = await mockNotificationRepo.create({
        userId: 'user-1',
        type: 'submission_result',
        title: 'Test Passed',
        message: 'Your solution is correct'
      });
      expect(notification).toBeDefined();
      expect(notification.isRead).toBe(false);
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      const notification = await mockNotificationRepo.create({
        userId: 'user-1',
        type: 'submission_result',
        title: 'Test Passed',
        message: 'Your solution is correct'
      });
      const updated = await mockNotificationRepo.markAsRead(notification.id);
      expect(updated.isRead).toBe(true);
    });
  });

  describe('getUnreadNotifications', () => {
    it('should return only unread notifications', async () => {
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
      expect(unread).toHaveLength(1);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', async () => {
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
      expect(count).toBe(2);
      const unread = await mockNotificationRepo.findUnreadByUserId('user-1');
      expect(unread).toHaveLength(0);
    });
  });

  describe('countUnread', () => {
    it('should return correct unread count', async () => {
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
      expect(count).toBe(2);
    });
  });
});
