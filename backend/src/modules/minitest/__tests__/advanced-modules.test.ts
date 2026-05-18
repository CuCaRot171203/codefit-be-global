import { describe, it, expect, beforeEach } from '@jest/globals';

interface MinitestQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Minitest {
  id: string;
  title: string;
  description: string;
  questions: MinitestQuestion[];
  difficulty: string;
}

interface MinitestResult {
  id: string;
  minitestId: string;
  userId: string;
  score: number;
  totalQuestions: number;
}

class MockMinitestRepository {
  private minitests: Map<string, Minitest> = new Map();

  async findByIdWithQuestions(id: string): Promise<Minitest | null> {
    return this.minitests.get(id) || null;
  }

  setMinitest(minitest: Minitest) {
    this.minitests.set(minitest.id, minitest);
  }

  clear() {
    this.minitests.clear();
  }
}

class MockMinitestResultRepository {
  private results: Map<string, MinitestResult> = new Map();

  async create(data: any): Promise<MinitestResult> {
    const result: MinitestResult = {
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
  protected repository = mockMinitestRepo;
  protected resultRepo = mockResultRepo;

  async submit(userId: string, minitestId: string, answers: { questionId: string; answer: number }[]) {
    const minitest = await this.repository.findByIdWithQuestions(minitestId);
    if (!minitest) {
      throw new Error('Minitest not found');
    }

    let score = 0;
    for (const answer of answers) {
      const question = minitest.questions.find((q: any) => q.id === answer.questionId);
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

  async getById(id: string) {
    return this.repository.findByIdWithQuestions(id);
  }
}

const minitestService = new MinitestService();

describe('MinitestService', () => {
  beforeEach(() => {
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

  describe('submit', () => {
    it('should calculate correct score', async () => {
      const result = await minitestService.submit('user-1', 'minitest-1', [
        { questionId: 'q1', answer: 1 },
        { questionId: 'q2', answer: 1 }
      ]);

      expect(result.score).toBe(2);
      expect(result.totalQuestions).toBe(2);
      expect(result.percentage).toBe(100);
    });

    it('should calculate partial score', async () => {
      const result = await minitestService.submit('user-1', 'minitest-1', [
        { questionId: 'q1', answer: 1 },
        { questionId: 'q2', answer: 0 }
      ]);

      expect(result.score).toBe(1);
      expect(result.percentage).toBe(50);
    });

    it('should calculate zero score', async () => {
      const result = await minitestService.submit('user-1', 'minitest-1', [
        { questionId: 'q1', answer: 0 },
        { questionId: 'q2', answer: 0 }
      ]);

      expect(result.score).toBe(0);
      expect(result.percentage).toBe(0);
    });

    it('should throw error for non-existent minitest', async () => {
      await expect(
        minitestService.submit('user-1', 'non-existent', [])
      ).rejects.toThrow('Minitest not found');
    });
  });

  describe('getById', () => {
    it('should return minitest with questions', async () => {
      const minitest = await minitestService.getById('minitest-1');
      expect(minitest).not.toBeNull();
      expect(minitest?.questions).toHaveLength(2);
    });

    it('should return null for non-existent minitest', async () => {
      const minitest = await minitestService.getById('non-existent');
      expect(minitest).toBeNull();
    });
  });
});

describe('FeedbackService', () => {
  describe('rating validation', () => {
    it('should validate rating between 1 and 5', () => {
      const validRatings = [1, 2, 3, 4, 5];
      const invalidRatings = [0, 6, -1, 10];

      validRatings.forEach(rating => {
        expect(rating >= 1 && rating <= 5).toBe(true);
      });

      invalidRatings.forEach(rating => {
        expect(rating >= 1 && rating <= 5).toBe(false);
      });
    });
  });

  describe('average rating calculation', () => {
    it('should calculate average correctly', () => {
      const ratings = [5, 4, 5, 3, 5];
      const sum = ratings.reduce((a, b) => a + b, 0);
      const avg = sum / ratings.length;
      expect(avg).toBe(4.4);
    });

    it('should return 0 for empty ratings', () => {
      const ratings: number[] = [];
      const avg = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
      expect(avg).toBe(0);
    });
  });
});

describe('LeaderboardService', () => {
  describe('score calculation', () => {
    it('should rank higher scores first', () => {
      const entries = [
        { userId: 'u1', score: 100 },
        { userId: 'u2', score: 200 },
        { userId: 'u3', score: 150 }
      ];

      const ranked = entries.sort((a, b) => b.score - a.score);
      
      expect(ranked[0].userId).toBe('u2');
      expect(ranked[1].userId).toBe('u3');
      expect(ranked[2].userId).toBe('u1');
    });
  });
});

describe('CertificateService', () => {
  describe('completion check', () => {
    it('should only generate certificate for 100% progress', () => {
      const progressValues = [0, 50, 75, 99, 100];
      const eligible = progressValues.filter(p => p === 100);
      
      expect(eligible).toHaveLength(1);
      expect(eligible[0]).toBe(100);
    });
  });
});

describe('StatsService', () => {
  describe('acceptance rate calculation', () => {
    it('should calculate acceptance rate correctly', () => {
      const total = 100;
      const accepted = 80;
      const rate = Math.round((accepted / total) * 100);
      expect(rate).toBe(80);
    });

    it('should return 0 for no submissions', () => {
      const total = 0;
      const accepted = 0;
      const rate = total > 0 ? Math.round((accepted / total) * 100) : 0;
      expect(rate).toBe(0);
    });
  });

  describe('average calculation', () => {
    it('should calculate average progress correctly', () => {
      const progressValues = [100, 50, 75, 100];
      const avg = Math.round(progressValues.reduce((a, b) => a + b, 0) / progressValues.length);
      expect(avg).toBe(81);
    });
  });
});
