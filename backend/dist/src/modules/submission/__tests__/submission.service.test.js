"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
class MockSubmissionRepository {
    submissions = new Map();
    results = new Map();
    testcases = [];
    async create(data) {
        const submission = {
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
    async findById(id) {
        return this.submissions.get(id) || null;
    }
    async findByUserId(userId) {
        return Array.from(this.submissions.values()).filter(s => s.userId === userId);
    }
    async findByProblemId(problemId) {
        return Array.from(this.submissions.values()).filter(s => s.problemId === problemId);
    }
    async findByIdWithResults(id) {
        const submission = this.submissions.get(id);
        if (!submission)
            return null;
        return {
            ...submission,
            results: this.results.get(id) || []
        };
    }
    async update(id, data) {
        const submission = this.submissions.get(id);
        if (!submission)
            throw new Error('Submission not found');
        const updated = { ...submission, ...data };
        this.submissions.set(id, updated);
        return updated;
    }
    async updateAndReturn(id, data) {
        const submission = this.submissions.get(id);
        if (!submission)
            throw new Error('Submission not found');
        const updated = { ...submission, ...data };
        this.submissions.set(id, updated);
        return {
            ...updated,
            results: this.results.get(id) || []
        };
    }
    async createResult(data) {
        const result = {
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
    async getTestcasesByProblemId(problemId) {
        return this.testcases.filter(tc => tc.problemId === problemId);
    }
    setTestcases(testcases) {
        this.testcases = testcases;
    }
    clear() {
        this.submissions.clear();
        this.results.clear();
        this.testcases = [];
    }
}
class MockProblemRepository {
    problems = new Map();
    async findById(id) {
        return this.problems.get(id) || null;
    }
    setProblem(problem) {
        this.problems.set(problem.id, problem);
    }
    clear() {
        this.problems.clear();
    }
}
class MockProgressService {
    incrementProgressCalled = false;
    userId = null;
    courseId = null;
    async incrementProgress(userId, courseId) {
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
    notificationData = null;
    async createSubmissionNotification(userId, submissionId, problemTitle, status) {
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
    repository = mockRepository;
    problemRepo = mockProblemRepo;
    progressService = mockProgressService;
    notificationService = mockNotificationService;
    async createSubmission(userId, dto) {
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
    async getSubmissionById(id) {
        const submission = await this.repository.findByIdWithResults(id);
        if (!submission)
            return null;
        return this.formatResponse(submission, submission.results);
    }
    async getSubmissionsByUserId(userId) {
        const submissions = await this.repository.findByUserId(userId);
        return submissions.map(s => this.formatResponse(s, []));
    }
    async getSubmissionsByProblemId(problemId) {
        const submissions = await this.repository.findByProblemId(problemId);
        return submissions.map(s => this.formatResponse(s, []));
    }
    async handleSuccessfulSubmission(userId, problemId) {
        await this.progressService.incrementProgress(userId, 'course-1');
    }
    async createSubmissionNotification(userId, submissionId, problemTitle, status) {
        await this.notificationService.createSubmissionNotification(userId, submissionId, problemTitle, status);
    }
    async processMockResults(submissionId, problemId) {
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
        const results = [];
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
    determineOverallStatus(results) {
        if (results.length === 0)
            return 'PENDING';
        const hasWA = results.some(r => r.status === 'WA');
        if (hasWA)
            return 'WA';
        return 'AC';
    }
    calculateAverageRuntime(results) {
        if (results.length === 0)
            return null;
        const total = results.reduce((sum, r) => sum + (r.runtime || 0), 0);
        return Math.round(total / results.length);
    }
    formatResponse(submission, results) {
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
(0, globals_1.describe)('SubmissionService - Integration Flow', () => {
    (0, globals_1.beforeEach)(() => {
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
    (0, globals_1.describe)('createSubmission with Problem Validation', () => {
        (0, globals_1.it)('should throw error when problem does not exist', async () => {
            await (0, globals_1.expect)(submissionService.createSubmission('user-1', {
                problemId: 'non-existent',
                code: 'console.log("hello")',
                language: 'javascript'
            })).rejects.toThrow('Problem not found');
        });
        (0, globals_1.it)('should create submission when problem exists', async () => {
            const result = await submissionService.createSubmission('user-1', {
                problemId: 'problem-1',
                code: 'console.log("hello")',
                language: 'javascript'
            });
            (0, globals_1.expect)(result).toBeDefined();
            (0, globals_1.expect)(result.problemId).toBe('problem-1');
        });
    });
    (0, globals_1.describe)('createSubmission with Progress Update (AC)', () => {
        (0, globals_1.it)('should update progress when submission is AC', async () => {
            await submissionService.createSubmission('user-1', {
                problemId: 'problem-1',
                code: 'console.log("hello")',
                language: 'javascript'
            });
            (0, globals_1.expect)(mockProgressService.incrementProgressCalled).toBe(true);
            (0, globals_1.expect)(mockProgressService.userId).toBe('user-1');
        });
    });
    (0, globals_1.describe)('createSubmission with Notification', () => {
        (0, globals_1.it)('should create notification when submission is created', async () => {
            await submissionService.createSubmission('user-1', {
                problemId: 'problem-1',
                code: 'console.log("hello")',
                language: 'javascript'
            });
            (0, globals_1.expect)(mockNotificationService.createNotificationCalled).toBe(true);
            (0, globals_1.expect)(mockNotificationService.notificationData).toEqual({
                userId: 'user-1',
                submissionId: globals_1.expect.any(String),
                problemTitle: 'Two Sum',
                status: 'AC'
            });
        });
    });
    (0, globals_1.describe)('Full Integration Flow', () => {
        (0, globals_1.it)('should execute full flow: submission -> result -> progress -> notification', async () => {
            const result = await submissionService.createSubmission('user-1', {
                problemId: 'problem-1',
                code: 'console.log("hello")',
                language: 'javascript'
            });
            (0, globals_1.expect)(result.status).toBe('AC');
            (0, globals_1.expect)(mockProgressService.incrementProgressCalled).toBe(true);
            (0, globals_1.expect)(mockNotificationService.createNotificationCalled).toBe(true);
        });
    });
    (0, globals_1.describe)('getSubmissionsByProblemId', () => {
        (0, globals_1.it)('should return submissions for a problem', async () => {
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
            (0, globals_1.expect)(submissions).toHaveLength(2);
        });
        (0, globals_1.it)('should return empty array when no submissions for problem', async () => {
            const submissions = await submissionService.getSubmissionsByProblemId('problem-1');
            (0, globals_1.expect)(submissions).toHaveLength(0);
        });
    });
    (0, globals_1.describe)('determineOverallStatus', () => {
        (0, globals_1.it)('should return WA when any testcase fails', () => {
            const service = submissionService;
            const status = service.determineOverallStatus([
                { id: '1', submissionId: 's1', testcaseId: 't1', status: 'AC', runtime: 100 },
                { id: '2', submissionId: 's1', testcaseId: 't2', status: 'WA', runtime: 50 }
            ]);
            (0, globals_1.expect)(status).toBe('WA');
        });
        (0, globals_1.it)('should return AC when all testcases pass', () => {
            const service = submissionService;
            const status = service.determineOverallStatus([
                { id: '1', submissionId: 's1', testcaseId: 't1', status: 'AC', runtime: 100 },
                { id: '2', submissionId: 's1', testcaseId: 't2', status: 'AC', runtime: 150 }
            ]);
            (0, globals_1.expect)(status).toBe('AC');
        });
    });
});
//# sourceMappingURL=submission.service.test.js.map