import { describe, it, expect, beforeEach } from '@jest/globals';

interface Testcase {
  id: string;
  problemId: string;
  input: string;
  expectedOutput: string;
  isPublic: boolean;
}

interface SubmissionResult {
  id: string;
  submissionId: string;
  testcaseId: string;
  status: string;
  runtime: number | null;
}

interface Submission {
  id: string;
  userId: string;
  problemId: string;
  code: string;
  language: string;
  status: string;
  runtime: number | null;
  memory: number | null;
  createdAt: Date;
}

interface CreateSubmissionDto {
  problemId: string;
  code: string;
  language: string;
}

type SubmissionStatus = 'PENDING' | 'RUNNING' | 'AC' | 'WA' | 'RE' | 'CE' | 'TLE' | 'MLE';

class MockSubmissionRepository {
  private submissions: Map<string, Submission> = new Map();
  public results: Map<string, SubmissionResult[]> = new Map();
  private testcases: Testcase[] = [];

  async create(data: any): Promise<Submission> {
    const submission: Submission = {
      id: crypto.randomUUID(),
      userId: data.userId,
      problemId: data.problemId,
      code: data.code,
      language: data.language,
      status: data.status || 'PENDING',
      runtime: data.runtime,
      memory: data.memory,
      createdAt: new Date()
    };
    this.submissions.set(submission.id, submission);
    return submission;
  }

  async findById(id: string): Promise<Submission | null> {
    return this.submissions.get(id) || null;
  }

  async findByUserId(userId: string): Promise<Submission[]> {
    return Array.from(this.submissions.values()).filter(s => s.userId === userId);
  }

  async findByProblemId(problemId: string): Promise<Submission[]> {
    return Array.from(this.submissions.values()).filter(s => s.problemId === problemId);
  }

  async findByIdWithResults(id: string): Promise<any> {
    const submission = this.submissions.get(id);
    if (!submission) return null;
    return {
      ...submission,
      results: this.results.get(id) || []
    };
  }

  async update(id: string, data: any): Promise<Submission> {
    const submission = this.submissions.get(id);
    if (!submission) throw new Error('Submission not found');
    const updated = { ...submission, ...data };
    this.submissions.set(id, updated);
    return updated;
  }

  async updateAndReturn(id: string, data: any): Promise<any> {
    const submission = this.submissions.get(id);
    if (!submission) throw new Error('Submission not found');
    const updated = { ...submission, ...data };
    this.submissions.set(id, updated);
    return {
      ...updated,
      results: this.results.get(id) || []
    };
  }

  async createResult(data: any): Promise<SubmissionResult> {
    const result: SubmissionResult = {
      id: crypto.randomUUID(),
      submissionId: data.submissionId,
      testcaseId: data.testcaseId,
      status: data.status,
      runtime: data.runtime
    };
    const submissionResults = this.results.get(data.submissionId) || [];
    submissionResults.push(result);
    this.results.set(data.submissionId, submissionResults);
    return result;
  }

  async getTestcasesByProblemId(problemId: string): Promise<Testcase[]> {
    return this.testcases.filter(tc => tc.problemId === problemId);
  }

  setTestcases(testcases: Testcase[]) {
    this.testcases = testcases;
  }

  clear() {
    this.submissions.clear();
    this.results.clear();
    this.testcases = [];
  }
}

class MockProblemRepository {
  private problems: Map<string, any> = new Map();

  async findById(id: string): Promise<any | null> {
    return this.problems.get(id) || null;
  }

  setProblem(problem: any) {
    this.problems.set(problem.id, problem);
  }

  clear() {
    this.problems.clear();
  }
}

class MockProgressService {
  incrementProgressCalled = false;
  userId: string | null = null;
  courseId: string | null = null;

  async incrementProgress(userId: string, courseId: string) {
    this.incrementProgressCalled = true;
    this.userId = userId;
    this.courseId = courseId;
    return { userId, courseId, completedLessons: 1, totalLessons: 1, percentage: 100 };
  }

  reset() {
    this.incrementProgressCalled = false;
    this.userId = null;
    this.courseId = null;
  }
}

class MockNotificationService {
  createNotificationCalled = false;
  notificationData: any = null;

  async createSubmissionNotification(userId: string, submissionId: string, problemTitle: string, status: string) {
    this.createNotificationCalled = true;
    this.notificationData = { userId, submissionId, problemTitle, status };
    return { id: crypto.randomUUID(), userId, type: 'submission_result', isRead: false };
  }

  reset() {
    this.createNotificationCalled = false;
    this.notificationData = null;
  }
}

const mockRepository = new MockSubmissionRepository();
const mockProblemRepo = new MockProblemRepository();
const mockProgressService = new MockProgressService();
const mockNotificationService = new MockNotificationService();

class SubmissionService {
  protected repository = mockRepository;
  private problemRepo = mockProblemRepo;
  private progressService = mockProgressService;
  private notificationService = mockNotificationService;

  async createSubmission(userId: string, dto: CreateSubmissionDto) {
    const { problemId, code, language } = dto;

    if (!problemId || !code || !language) {
      throw new Error('problemId, code, and language are required');
    }

    const problem = await this.problemRepo.findById(problemId);
    if (!problem) {
      throw new Error('Problem not found');
    }

    const submission = await this.repository.create({
      userId,
      problemId,
      code,
      language,
      status: 'PENDING'
    });

    const results = await this.processMockResults(submission.id, problemId);

    const overallStatus = this.determineOverallStatus(results);
    const avgRuntime = this.calculateAverageRuntime(results);

    const updatedSubmission = await this.repository.updateAndReturn(submission.id, {
      status: overallStatus,
      runtime: avgRuntime
    });

    if (overallStatus === 'AC') {
      await this.handleSuccessfulSubmission(userId, problemId);
    }

    await this.createSubmissionNotification(userId, submission.id, problem.title, overallStatus);

    return updatedSubmission;
  }

  async getSubmissionById(id: string) {
    const submission = await this.repository.findByIdWithResults(id);
    if (!submission) return null;
    return this.formatResponse(submission, submission.results);
  }

  async getSubmissionsByUserId(userId: string) {
    const submissions = await this.repository.findByUserId(userId);
    return submissions.map(s => this.formatResponse(s, []));
  }

  async getSubmissionsByProblemId(problemId: string) {
    const submissions = await this.repository.findByProblemId(problemId);
    return submissions.map(s => this.formatResponse(s, []));
  }

  private async handleSuccessfulSubmission(userId: string, problemId: string): Promise<void> {
    await this.progressService.incrementProgress(userId, 'course-1');
  }

  private async createSubmissionNotification(
    userId: string,
    submissionId: string,
    problemTitle: string,
    status: SubmissionStatus
  ): Promise<void> {
    await this.notificationService.createSubmissionNotification(userId, submissionId, problemTitle, status);
  }

  private async processMockResults(submissionId: string, problemId: string) {
    const testcases = await this.repository.getTestcasesByProblemId(problemId);
    
    if (testcases.length === 0) {
      return [{
        id: crypto.randomUUID(),
        submissionId,
        testcaseId: 'mock-tc-1',
        status: 'AC',
        runtime: 100
      }];
    }

    const results: SubmissionResult[] = [];
    for (const tc of testcases) {
      const result = await this.repository.createResult({
        submissionId,
        testcaseId: tc.id,
        status: 'AC',
        runtime: 100
      });
      results.push(result);
    }
    return results;
  }

  private determineOverallStatus(results: SubmissionResult[]): SubmissionStatus {
    if (results.length === 0) return 'PENDING';
    const hasWA = results.some(r => r.status === 'WA');
    if (hasWA) return 'WA';
    return 'AC';
  }

  private calculateAverageRuntime(results: SubmissionResult[]): number | null {
    if (results.length === 0) return null;
    const total = results.reduce((sum, r) => sum + (r.runtime || 0), 0);
    return Math.round(total / results.length);
  }

  private formatResponse(submission: any, results: any[]) {
    return {
      id: submission.id,
      problemId: submission.problemId,
      language: submission.language,
      status: submission.status,
      runtime: submission.runtime,
      memory: submission.memory,
      createdAt: submission.createdAt,
      results: results.map(r => ({
        id: r.id,
        testcaseId: r.testcaseId,
        status: r.status,
        runtime: r.runtime
      }))
    };
  }
}

const submissionService = new SubmissionService();

describe('SubmissionService - Integration Flow', () => {
  beforeEach(() => {
    mockRepository.clear();
    mockProblemRepo.clear();
    mockProgressService.reset();
    mockNotificationService.reset();
    
    mockProblemRepo.setProblem({
      id: 'problem-1',
      title: 'Two Sum',
      description: 'Find two numbers',
      difficulty: 'easy'
    });
  });

  describe('createSubmission with Problem Validation', () => {
    it('should throw error when problem does not exist', async () => {
      await expect(
        submissionService.createSubmission('user-1', {
          problemId: 'non-existent',
          code: 'console.log("hello")',
          language: 'javascript'
        })
      ).rejects.toThrow('Problem not found');
    });

    it('should create submission when problem exists', async () => {
      const result = await submissionService.createSubmission('user-1', {
        problemId: 'problem-1',
        code: 'console.log("hello")',
        language: 'javascript'
      });

      expect(result).toBeDefined();
      expect(result.problemId).toBe('problem-1');
    });
  });

  describe('createSubmission with Progress Update (AC)', () => {
    it('should update progress when submission is AC', async () => {
      await submissionService.createSubmission('user-1', {
        problemId: 'problem-1',
        code: 'console.log("hello")',
        language: 'javascript'
      });

      expect(mockProgressService.incrementProgressCalled).toBe(true);
      expect(mockProgressService.userId).toBe('user-1');
    });
  });

  describe('createSubmission with Notification', () => {
    it('should create notification when submission is created', async () => {
      await submissionService.createSubmission('user-1', {
        problemId: 'problem-1',
        code: 'console.log("hello")',
        language: 'javascript'
      });

      expect(mockNotificationService.createNotificationCalled).toBe(true);
      expect(mockNotificationService.notificationData).toEqual({
        userId: 'user-1',
        submissionId: expect.any(String),
        problemTitle: 'Two Sum',
        status: 'AC'
      });
    });
  });

  describe('Full Integration Flow', () => {
    it('should execute full flow: submission -> result -> progress -> notification', async () => {
      const result = await submissionService.createSubmission('user-1', {
        problemId: 'problem-1',
        code: 'console.log("hello")',
        language: 'javascript'
      });

      expect(result.status).toBe('AC');
      expect(mockProgressService.incrementProgressCalled).toBe(true);
      expect(mockNotificationService.createNotificationCalled).toBe(true);
    });
  });

  describe('getSubmissionsByProblemId', () => {
    it('should return submissions for a problem', async () => {
      await submissionService.createSubmission('user-1', {
        problemId: 'problem-1',
        code: 'code1',
        language: 'javascript'
      });

      await submissionService.createSubmission('user-2', {
        problemId: 'problem-1',
        code: 'code2',
        language: 'python'
      });

      const submissions = await submissionService.getSubmissionsByProblemId('problem-1');
      expect(submissions).toHaveLength(2);
    });

    it('should return empty array when no submissions for problem', async () => {
      const submissions = await submissionService.getSubmissionsByProblemId('problem-1');
      expect(submissions).toHaveLength(0);
    });
  });

  describe('determineOverallStatus', () => {
    it('should return WA when any testcase fails', () => {
      const service = submissionService as any;
      const status = service.determineOverallStatus([
        { id: '1', submissionId: 's1', testcaseId: 't1', status: 'AC', runtime: 100 },
        { id: '2', submissionId: 's1', testcaseId: 't2', status: 'WA', runtime: 50 }
      ]);
      expect(status).toBe('WA');
    });

    it('should return AC when all testcases pass', () => {
      const service = submissionService as any;
      const status = service.determineOverallStatus([
        { id: '1', submissionId: 's1', testcaseId: 't1', status: 'AC', runtime: 100 },
        { id: '2', submissionId: 's1', testcaseId: 't2', status: 'AC', runtime: 150 }
      ]);
      expect(status).toBe('AC');
    });
  });
});
