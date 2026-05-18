import { describe, it, expect, beforeEach } from '@jest/globals';

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  memoryLimit: number;
  createdAt: Date;
}

interface Testcase {
  id: string;
  problemId: string;
  input: string;
  expectedOutput: string;
  isPublic: boolean;
}

class MockProblemRepository {
  private problems: Map<string, Problem> = new Map();

  async create(data: any): Promise<Problem> {
    const problem: Problem = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description,
      difficulty: data.difficulty || 'easy',
      timeLimit: data.timeLimit || 1000,
      memoryLimit: data.memoryLimit || 256,
      createdAt: new Date()
    };
    this.problems.set(problem.id, problem);
    return problem;
  }

  async findById(id: string): Promise<Problem | null> {
    return this.problems.get(id) || null;
  }

  async update(id: string, data: any): Promise<Problem> {
    const problem = this.problems.get(id);
    if (!problem) throw new Error('Problem not found');
    const updated = { ...problem, ...data };
    this.problems.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.problems.delete(id);
  }

  clear() {
    this.problems.clear();
  }
}

class MockTestcaseRepository {
  private testcases: Map<string, Testcase> = new Map();

  async create(data: any): Promise<Testcase> {
    const testcase: Testcase = {
      id: crypto.randomUUID(),
      problemId: data.problemId,
      input: data.input,
      expectedOutput: data.expectedOutput,
      isPublic: data.isPublic ?? false
    };
    this.testcases.set(testcase.id, testcase);
    return testcase;
  }

  async findById(id: string): Promise<Testcase | null> {
    return this.testcases.get(id) || null;
  }

  async findByProblemId(problemId: string): Promise<Testcase[]> {
    return Array.from(this.testcases.values()).filter(tc => tc.problemId === problemId);
  }

  async findPublicByProblemId(problemId: string): Promise<Testcase[]> {
    return Array.from(this.testcases.values()).filter(tc => tc.problemId === problemId && tc.isPublic);
  }

  async update(id: string, data: any): Promise<Testcase> {
    const testcase = this.testcases.get(id);
    if (!testcase) throw new Error('Testcase not found');
    const updated = { ...testcase, ...data };
    this.testcases.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.testcases.delete(id);
  }

  clear() {
    this.testcases.clear();
  }
}

const mockProblemRepo = new MockProblemRepository();
const mockTestcaseRepo = new MockTestcaseRepository();

class ProblemService {
  protected repository = mockProblemRepo;

  async create(dto: any) {
    if (!dto.title || !dto.description) {
      throw new Error('Title and description are required');
    }
    return this.repository.create(dto);
  }

  async getById(id: string) {
    return this.repository.findById(id);
  }

  async update(id: string, dto: any) {
    const problem = await this.repository.findById(id);
    if (!problem) {
      throw new Error('Problem not found');
    }
    return this.repository.update(id, dto);
  }

  async delete(id: string) {
    const problem = await this.repository.findById(id);
    if (!problem) {
      throw new Error('Problem not found');
    }
    await this.repository.delete(id);
    return { message: 'Problem deleted successfully' };
  }
}

class TestcaseService {
  protected repository = mockTestcaseRepo;

  async create(dto: any) {
    if (!dto.problemId || !dto.input || !dto.expectedOutput) {
      throw new Error('problemId, input, and expectedOutput are required');
    }
    return this.repository.create(dto);
  }

  async getByProblemId(problemId: string) {
    return this.repository.findByProblemId(problemId);
  }

  async getPublicByProblemId(problemId: string) {
    return this.repository.findPublicByProblemId(problemId);
  }

  async update(id: string, dto: any) {
    const testcase = await this.repository.findById(id);
    if (!testcase) {
      throw new Error('Testcase not found');
    }
    return this.repository.update(id, dto);
  }

  async delete(id: string) {
    const testcase = await this.repository.findById(id);
    if (!testcase) {
      throw new Error('Testcase not found');
    }
    await this.repository.delete(id);
    return { message: 'Testcase deleted successfully' };
  }
}

const problemService = new ProblemService();
const testcaseService = new TestcaseService();

describe('ProblemService', () => {
  beforeEach(() => {
    mockProblemRepo.clear();
  });

  describe('create', () => {
    it('should create a problem', async () => {
      const problem = await problemService.create({
        title: 'Two Sum',
        description: 'Find two numbers that add up to target',
        difficulty: 'easy'
      });

      expect(problem).toBeDefined();
      expect(problem.title).toBe('Two Sum');
      expect(problem.difficulty).toBe('easy');
    });

    it('should throw error when title is missing', async () => {
      await expect(problemService.create({ description: 'test' })).rejects.toThrow('Title and description are required');
    });

    it('should throw error when description is missing', async () => {
      await expect(problemService.create({ title: 'test' })).rejects.toThrow('Title and description are required');
    });
  });

  describe('getById', () => {
    it('should return problem by id', async () => {
      const created = await problemService.create({
        title: 'Two Sum',
        description: 'Find two numbers'
      });

      const problem = await problemService.getById(created.id);
      expect(problem).toBeDefined();
      expect(problem?.title).toBe('Two Sum');
    });

    it('should return null for non-existent problem', async () => {
      const problem = await problemService.getById('non-existent-id');
      expect(problem).toBeNull();
    });
  });

  describe('update', () => {
    it('should update problem', async () => {
      const created = await problemService.create({
        title: 'Two Sum',
        description: 'Find two numbers'
      });

      const updated = await problemService.update(created.id, { title: 'Three Sum' });
      expect(updated.title).toBe('Three Sum');
    });

    it('should throw error for non-existent problem', async () => {
      await expect(problemService.update('non-existent-id', { title: 'test' })).rejects.toThrow('Problem not found');
    });
  });

  describe('delete', () => {
    it('should delete problem', async () => {
      const created = await problemService.create({
        title: 'Two Sum',
        description: 'Find two numbers'
      });

      const result = await problemService.delete(created.id);
      expect(result.message).toBe('Problem deleted successfully');

      const problem = await problemService.getById(created.id);
      expect(problem).toBeNull();
    });

    it('should throw error for non-existent problem', async () => {
      await expect(problemService.delete('non-existent-id')).rejects.toThrow('Problem not found');
    });
  });
});

describe('TestcaseService', () => {
  let testProblem: Problem;

  beforeEach(async () => {
    mockTestcaseRepo.clear();
    mockProblemRepo.clear();
    testProblem = await problemService.create({
      title: 'Two Sum',
      description: 'Find two numbers'
    });
  });

  describe('create', () => {
    it('should create a testcase', async () => {
      const testcase = await testcaseService.create({
        problemId: testProblem.id,
        input: '1 2',
        expectedOutput: '3',
        isPublic: true
      });

      expect(testcase).toBeDefined();
      expect(testcase.problemId).toBe(testProblem.id);
      expect(testcase.isPublic).toBe(true);
    });

    it('should create private testcase by default', async () => {
      const testcase = await testcaseService.create({
        problemId: testProblem.id,
        input: '1 2',
        expectedOutput: '3'
      });

      expect(testcase.isPublic).toBe(false);
    });

    it('should throw error when required fields missing', async () => {
      await expect(testcaseService.create({ problemId: testProblem.id })).rejects.toThrow('problemId, input, and expectedOutput are required');
    });
  });

  describe('getByProblemId', () => {
    it('should return all testcases for a problem', async () => {
      await testcaseService.create({
        problemId: testProblem.id,
        input: '1 2',
        expectedOutput: '3'
      });
      await testcaseService.create({
        problemId: testProblem.id,
        input: '4 5',
        expectedOutput: '9'
      });

      const testcases = await testcaseService.getByProblemId(testProblem.id);
      expect(testcases).toHaveLength(2);
    });

    it('should return empty array when no testcases', async () => {
      const testcases = await testcaseService.getByProblemId(testProblem.id);
      expect(testcases).toHaveLength(0);
    });
  });

  describe('getPublicByProblemId', () => {
    it('should return only public testcases', async () => {
      await testcaseService.create({
        problemId: testProblem.id,
        input: '1 2',
        expectedOutput: '3',
        isPublic: true
      });
      await testcaseService.create({
        problemId: testProblem.id,
        input: '4 5',
        expectedOutput: '9',
        isPublic: false
      });

      const publicTestcases = await testcaseService.getPublicByProblemId(testProblem.id);
      expect(publicTestcases).toHaveLength(1);
      expect(publicTestcases[0].isPublic).toBe(true);
    });
  });

  describe('update', () => {
    it('should update testcase', async () => {
      const testcase = await testcaseService.create({
        problemId: testProblem.id,
        input: '1 2',
        expectedOutput: '3'
      });

      const updated = await testcaseService.update(testcase.id, { isPublic: true });
      expect(updated.isPublic).toBe(true);
    });

    it('should throw error for non-existent testcase', async () => {
      await expect(testcaseService.update('non-existent-id', { isPublic: true })).rejects.toThrow('Testcase not found');
    });
  });

  describe('delete', () => {
    it('should delete testcase', async () => {
      const testcase = await testcaseService.create({
        problemId: testProblem.id,
        input: '1 2',
        expectedOutput: '3'
      });

      const result = await testcaseService.delete(testcase.id);
      expect(result.message).toBe('Testcase deleted successfully');
    });

    it('should throw error for non-existent testcase', async () => {
      await expect(testcaseService.delete('non-existent-id')).rejects.toThrow('Testcase not found');
    });
  });
});
