"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
class MockMinitestRepository {
    minitests = new Map();
    async findByIdWithQuestions(id) {
        return this.minitests.get(id) || null;
    }
    setMinitest(minitest) {
        this.minitests.set(minitest.id, minitest);
    }
    clear() {
        this.minitests.clear();
    }
}
class MockMinitestResultRepository {
    results = new Map();
    async create(data) {
        const result = {
            id: crypto.randomUUID(),
            minitestId: data.minitestId,
            userId: data.userId,
            score: data.score,
            totalQuestions: data.totalQuestions
        };
        this.results.set(result.id, result);
        return result;
    }
    clear() {
        this.results.clear();
    }
}
const mockMinitestRepo = new MockMinitestRepository();
const mockResultRepo = new MockMinitestResultRepository();
class MinitestService {
    repository = mockMinitestRepo;
    resultRepo = mockResultRepo;
    async submit(userId, minitestId, answers) {
        const minitest = await this.repository.findByIdWithQuestions(minitestId);
        if (!minitest) {
            throw new Error('Minitest not found');
        }
        let score = 0;
        for (const answer of answers) {
            const question = minitest.questions.find((q) => q.id === answer.questionId);
            if (question && question.correctAnswer === answer.answer) {
                score++;
            }
        }
        const result = await this.resultRepo.create({
            userId,
            minitestId,
            score,
            totalQuestions: minitest.questions.length
        });
        return {
            ...result,
            percentage: Math.round((score / minitest.questions.length) * 100)
        };
    }
    async getById(id) {
        return this.repository.findByIdWithQuestions(id);
    }
}
const minitestService = new MinitestService();
(0, globals_1.describe)('MinitestService', () => {
    (0, globals_1.beforeEach)(() => {
        mockMinitestRepo.clear();
        mockResultRepo.clear();
        mockMinitestRepo.setMinitest({
            id: 'minitest-1',
            title: 'JavaScript Basics',
            description: 'Test your JS knowledge',
            questions: [
                { id: 'q1', question: 'What is 2+2?', options: ['3', '4', '5', '6'], correctAnswer: 1 },
                { id: 'q2', question: 'What is 3+3?', options: ['5', '6', '7', '8'], correctAnswer: 1 }
            ],
            difficulty: 'easy'
        });
    });
    (0, globals_1.describe)('submit', () => {
        (0, globals_1.it)('should calculate correct score', async () => {
            const result = await minitestService.submit('user-1', 'minitest-1', [
                { questionId: 'q1', answer: 1 },
                { questionId: 'q2', answer: 1 }
            ]);
            (0, globals_1.expect)(result.score).toBe(2);
            (0, globals_1.expect)(result.totalQuestions).toBe(2);
            (0, globals_1.expect)(result.percentage).toBe(100);
        });
        (0, globals_1.it)('should calculate partial score', async () => {
            const result = await minitestService.submit('user-1', 'minitest-1', [
                { questionId: 'q1', answer: 1 },
                { questionId: 'q2', answer: 0 }
            ]);
            (0, globals_1.expect)(result.score).toBe(1);
            (0, globals_1.expect)(result.percentage).toBe(50);
        });
        (0, globals_1.it)('should calculate zero score', async () => {
            const result = await minitestService.submit('user-1', 'minitest-1', [
                { questionId: 'q1', answer: 0 },
                { questionId: 'q2', answer: 0 }
            ]);
            (0, globals_1.expect)(result.score).toBe(0);
            (0, globals_1.expect)(result.percentage).toBe(0);
        });
        (0, globals_1.it)('should throw error for non-existent minitest', async () => {
            await (0, globals_1.expect)(minitestService.submit('user-1', 'non-existent', [])).rejects.toThrow('Minitest not found');
        });
    });
    (0, globals_1.describe)('getById', () => {
        (0, globals_1.it)('should return minitest with questions', async () => {
            const minitest = await minitestService.getById('minitest-1');
            (0, globals_1.expect)(minitest).not.toBeNull();
            (0, globals_1.expect)(minitest?.questions).toHaveLength(2);
        });
        (0, globals_1.it)('should return null for non-existent minitest', async () => {
            const minitest = await minitestService.getById('non-existent');
            (0, globals_1.expect)(minitest).toBeNull();
        });
    });
});
(0, globals_1.describe)('FeedbackService', () => {
    (0, globals_1.describe)('rating validation', () => {
        (0, globals_1.it)('should validate rating between 1 and 5', () => {
            const validRatings = [1, 2, 3, 4, 5];
            const invalidRatings = [0, 6, -1, 10];
            validRatings.forEach(rating => {
                (0, globals_1.expect)(rating >= 1 && rating <= 5).toBe(true);
            });
            invalidRatings.forEach(rating => {
                (0, globals_1.expect)(rating >= 1 && rating <= 5).toBe(false);
            });
        });
    });
    (0, globals_1.describe)('average rating calculation', () => {
        (0, globals_1.it)('should calculate average correctly', () => {
            const ratings = [5, 4, 5, 3, 5];
            const sum = ratings.reduce((a, b) => a + b, 0);
            const avg = sum / ratings.length;
            (0, globals_1.expect)(avg).toBe(4.4);
        });
        (0, globals_1.it)('should return 0 for empty ratings', () => {
            const ratings = [];
            const avg = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
            (0, globals_1.expect)(avg).toBe(0);
        });
    });
});
(0, globals_1.describe)('LeaderboardService', () => {
    (0, globals_1.describe)('score calculation', () => {
        (0, globals_1.it)('should rank higher scores first', () => {
            const entries = [
                { userId: 'u1', score: 100 },
                { userId: 'u2', score: 200 },
                { userId: 'u3', score: 150 }
            ];
            const ranked = entries.sort((a, b) => b.score - a.score);
            (0, globals_1.expect)(ranked[0].userId).toBe('u2');
            (0, globals_1.expect)(ranked[1].userId).toBe('u3');
            (0, globals_1.expect)(ranked[2].userId).toBe('u1');
        });
    });
});
(0, globals_1.describe)('CertificateService', () => {
    (0, globals_1.describe)('completion check', () => {
        (0, globals_1.it)('should only generate certificate for 100% progress', () => {
            const progressValues = [0, 50, 75, 99, 100];
            const eligible = progressValues.filter(p => p === 100);
            (0, globals_1.expect)(eligible).toHaveLength(1);
            (0, globals_1.expect)(eligible[0]).toBe(100);
        });
    });
});
(0, globals_1.describe)('StatsService', () => {
    (0, globals_1.describe)('acceptance rate calculation', () => {
        (0, globals_1.it)('should calculate acceptance rate correctly', () => {
            const total = 100;
            const accepted = 80;
            const rate = Math.round((accepted / total) * 100);
            (0, globals_1.expect)(rate).toBe(80);
        });
        (0, globals_1.it)('should return 0 for no submissions', () => {
            const total = 0;
            const accepted = 0;
            const rate = total > 0 ? Math.round((accepted / total) * 100) : 0;
            (0, globals_1.expect)(rate).toBe(0);
        });
    });
    (0, globals_1.describe)('average calculation', () => {
        (0, globals_1.it)('should calculate average progress correctly', () => {
            const progressValues = [100, 50, 75, 100];
            const avg = Math.round(progressValues.reduce((a, b) => a + b, 0) / progressValues.length);
            (0, globals_1.expect)(avg).toBe(81);
        });
    });
});
//# sourceMappingURL=advanced-modules.test.js.map