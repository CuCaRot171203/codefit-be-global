import { describe, it, expect, beforeEach } from '@jest/globals';

interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  coachId: string | null;
  createdAt: Date;
}

class MockEnrollmentRepository {
  private enrollments: Map<string, Enrollment> = new Map();
  private userCourseIndex: Map<string, string> = new Map();

  private getUserCourseKey(userId: string, courseId: string): string {
    return `${userId}_${courseId}`;
  }

  async create(data: any): Promise<Enrollment> {
    const enrollment: Enrollment = {
      id: crypto.randomUUID(),
      userId: data.userId,
      courseId: data.courseId,
      progress: data.progress || 0,
      coachId: data.coachId || null,
      createdAt: new Date()
    };
    this.enrollments.set(enrollment.id, enrollment);
    this.userCourseIndex.set(this.getUserCourseKey(enrollment.userId, enrollment.courseId), enrollment.id);
    return enrollment;
  }

  async findById(id: string): Promise<Enrollment | null> {
    return this.enrollments.get(id) || null;
  }

  async findByUserIdAndCourseId(userId: string, courseId: string): Promise<Enrollment | null> {
    const key = this.getUserCourseKey(userId, courseId);
    const id = this.userCourseIndex.get(key);
    if (!id) return null;
    return this.enrollments.get(id) || null;
  }

  async updateProgress(id: string, progress: number): Promise<Enrollment> {
    const enrollment = this.enrollments.get(id);
    if (!enrollment) throw new Error('Enrollment not found');
    const updated = { ...enrollment, progress };
    this.enrollments.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const enrollment = this.enrollments.get(id);
    if (enrollment) {
      this.userCourseIndex.delete(this.getUserCourseKey(enrollment.userId, enrollment.courseId));
    }
    this.enrollments.delete(id);
  }

  clear() {
    this.enrollments.clear();
    this.userCourseIndex.clear();
  }
}

const mockRepository = new MockEnrollmentRepository();

class EnrollmentService {
  protected repository = mockRepository;

  async enroll(userId: string, courseId: string): Promise<Enrollment> {
    if (!courseId) {
      throw new Error('courseId is required');
    }

    const existing = await this.repository.findByUserIdAndCourseId(userId, courseId);
    if (existing) {
      throw new Error('Already enrolled in this course');
    }

    return this.repository.create({ userId, courseId, progress: 0 });
  }

  async getEnrollment(userId: string, courseId: string): Promise<Enrollment | null> {
    return this.repository.findByUserIdAndCourseId(userId, courseId);
  }

  async updateProgress(enrollmentId: string, progress: number): Promise<Enrollment> {
    if (progress < 0 || progress > 100) {
      throw new Error('Progress must be between 0 and 100');
    }

    const enrollment = await this.repository.findById(enrollmentId);
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }

    return this.repository.updateProgress(enrollmentId, progress);
  }

  async unenroll(userId: string, courseId: string): Promise<{ message: string }> {
    const enrollment = await this.repository.findByUserIdAndCourseId(userId, courseId);
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }

    await this.repository.delete(enrollment.id);
    return { message: 'Unenrolled successfully' };
  }
}

const enrollmentService = new EnrollmentService();

describe('EnrollmentService', () => {
  beforeEach(() => {
    mockRepository.clear();
  });

  describe('enroll', () => {
    it('should enroll user in course successfully', async () => {
      const enrollment = await enrollmentService.enroll('user-1', 'course-1');
      
      expect(enrollment).toBeDefined();
      expect(enrollment.userId).toBe('user-1');
      expect(enrollment.courseId).toBe('course-1');
      expect(enrollment.progress).toBe(0);
    });

    it('should throw error when courseId is missing', async () => {
      await expect(enrollmentService.enroll('user-1', '')).rejects.toThrow('courseId is required');
    });

    it('should throw error when already enrolled', async () => {
      await enrollmentService.enroll('user-1', 'course-1');
      
      await expect(enrollmentService.enroll('user-1', 'course-1')).rejects.toThrow('Already enrolled in this course');
    });

    it('should allow same course for different users', async () => {
      await enrollmentService.enroll('user-1', 'course-1');
      const enrollment2 = await enrollmentService.enroll('user-2', 'course-1');
      
      expect(enrollment2.userId).toBe('user-2');
      expect(enrollment2.courseId).toBe('course-1');
    });
  });

  describe('getEnrollment', () => {
    it('should return enrollment when exists', async () => {
      await enrollmentService.enroll('user-1', 'course-1');
      
      const enrollment = await enrollmentService.getEnrollment('user-1', 'course-1');
      expect(enrollment).toBeDefined();
      expect(enrollment?.userId).toBe('user-1');
    });

    it('should return null when not enrolled', async () => {
      const enrollment = await enrollmentService.getEnrollment('user-1', 'course-1');
      expect(enrollment).toBeNull();
    });
  });

  describe('updateProgress', () => {
    it('should update progress successfully', async () => {
      const enrollment = await enrollmentService.enroll('user-1', 'course-1');
      
      const updated = await enrollmentService.updateProgress(enrollment.id, 50);
      expect(updated.progress).toBe(50);
    });

    it('should throw error for progress < 0', async () => {
      const enrollment = await enrollmentService.enroll('user-1', 'course-1');
      
      await expect(enrollmentService.updateProgress(enrollment.id, -10)).rejects.toThrow('Progress must be between 0 and 100');
    });

    it('should throw error for progress > 100', async () => {
      const enrollment = await enrollmentService.enroll('user-1', 'course-1');
      
      await expect(enrollmentService.updateProgress(enrollment.id, 150)).rejects.toThrow('Progress must be between 0 and 100');
    });

    it('should throw error for non-existent enrollment', async () => {
      await expect(enrollmentService.updateProgress('non-existent-id', 50)).rejects.toThrow('Enrollment not found');
    });
  });

  describe('unenroll', () => {
    it('should unenroll successfully', async () => {
      await enrollmentService.enroll('user-1', 'course-1');
      
      const result = await enrollmentService.unenroll('user-1', 'course-1');
      expect(result.message).toBe('Unenrolled successfully');
      
      const enrollment = await enrollmentService.getEnrollment('user-1', 'course-1');
      expect(enrollment).toBeNull();
    });

    it('should throw error when not enrolled', async () => {
      await expect(enrollmentService.unenroll('user-1', 'course-1')).rejects.toThrow('Enrollment not found');
    });
  });
});
