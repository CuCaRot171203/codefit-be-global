/**
 * @fileoverview Service cho Minitest module
 * @module minitest/services
 */

import prisma from '../../../prisma';

class MinitestService {

  // ============ Minitest CRUD ============
  async getAllMinitests() {
    return prisma.minitest.findMany({
      include: {
        phase: {
          include: {
            course: {
              select: { id: true, title: true }
            }
          }
        },
        questions: {
          include: {
            problem: true
          }
        },
        _count: {
          select: {
            submissions: true
          }
        }
      },
      orderBy: { orderIndex: 'asc' }
    });
  }

  // Alias for controller compatibility
  getById = (id: string) => this.getMinitestById(id);

  async getMinitestById(id: string) {
    return prisma.minitest.findUnique({
      where: { id },
      include: {
        phase: {
          include: {
            course: {
              select: { id: true, title: true }
            },
            lessons: {
              orderBy: { orderIndex: 'asc' }
            }
          }
        },
        questions: {
          include: {
            problem: {
              include: {
                testcases: true
              }
            }
          }
        },
        submissions: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }

  /**
   * Lấy thông tin course với tất cả các phases để tìm phase tiếp theo
   */
  async getCourseWithPhases(courseId: string) {
    return prisma.course.findUnique({
      where: { id: courseId },
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
    });
  }

  async getMinitestsByPhase(phaseId: string) {
    return prisma.minitest.findMany({
      where: { phaseId },
      include: {
        questions: {
          include: {
            problem: true
          }
        },
        _count: {
          select: {
            submissions: true
          }
        }
      },
      orderBy: { orderIndex: 'asc' }
    });
  }

  async createMinitest(data: {
    phaseId: string;
    title: string;
    orderIndex?: number;
    questionIds?: string[];
  }) {
    // Get max orderIndex if not provided
    let orderIndex = data.orderIndex;
    if (orderIndex === undefined) {
      const maxOrder = await prisma.minitest.aggregate({
        where: { phaseId: data.phaseId },
        _max: { orderIndex: true }
      });
      orderIndex = (maxOrder._max.orderIndex ?? -1) + 1;
    }

    // Create minitest
    const minitest = await prisma.minitest.create({
      data: {
        phaseId: data.phaseId,
        title: data.title,
        orderIndex
      },
      include: {
        phase: true
      }
    });

    // Add questions if provided
    if (data.questionIds && data.questionIds.length > 0) {
      await prisma.minitestQuestion.createMany({
        data: data.questionIds.map((problemId, index) => ({
          minitestId: minitest.id,
          problemId,
          orderIndex: index
        }))
      });
    }

    return this.getMinitestById(minitest.id);
  }

  async updateMinitest(id: string, data: {
    title?: string;
    orderIndex?: number;
    questionIds?: string[];
  }) {
    // Update basic info
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.orderIndex !== undefined) updateData.orderIndex = data.orderIndex;

    if (Object.keys(updateData).length > 0) {
      await prisma.minitest.update({
        where: { id },
        data: updateData
      });
    }

    // Update questions if provided
    if (data.questionIds !== undefined) {
      // Delete existing questions
      await prisma.minitestQuestion.deleteMany({
        where: { minitestId: id }
      });

      // Add new questions
      if (data.questionIds.length > 0) {
        await prisma.minitestQuestion.createMany({
          data: data.questionIds.map((problemId, index) => ({
            minitestId: id,
            problemId,
            orderIndex: index
          }))
        });
      }
    }

    return this.getMinitestById(id);
  }

  async deleteMinitest(id: string) {
    return prisma.minitest.delete({
      where: { id }
    });
  }

  // ============ Questions ============
  async addQuestion(minitestId: string, problemId: string) {
    return prisma.minitestQuestion.create({
      data: {
        minitestId,
        problemId
      },
      include: {
        problem: true
      }
    });
  }

  async removeQuestion(minitestId: string, problemId: string) {
    return prisma.minitestQuestion.deleteMany({
      where: {
        minitestId,
        problemId
      }
    });
  }

  // ============ Submissions ============
  async getSubmissions(minitestId: string) {
    return prisma.minitestSubmission.findMany({
      where: { minitestId },
      include: {
        user: {
          select: { id: true, email: true, fullName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getUserSubmissions(userId: string, minitestId?: string) {
    return prisma.minitestSubmission.findMany({
      where: {
        userId,
        ...(minitestId && { minitestId })
      },
      include: {
        minitest: {
          include: {
            phase: {
              include: {
                course: {
                  select: { id: true, title: true }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Lấy kết quả submission mới nhất của user cho một minitest cụ thể
   */
  async getResult(userId: string, minitestId: string) {
    const submission = await prisma.minitestSubmission.findFirst({
      where: {
        userId,
        minitestId
      },
      include: {
        minitest: {
          include: {
            phase: {
              include: {
                course: {
                  select: { id: true, title: true }
                }
              }
            },
            questions: {
              include: {
                problem: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!submission) {
      return null;
    }

    // Parse result JSON if exists
    let parsedResult = null;
    if (submission.result) {
      try {
        parsedResult = JSON.parse(submission.result);
      } catch {
        parsedResult = null;
      }
    }

    // Calculate summary stats
    const minitest = submission.minitest;
    const totalQuestions = minitest.questions.length;

    // Get all submissions for this user and minitest to calculate total score
    const allSubmissions = await prisma.minitestSubmission.findMany({
      where: {
        userId,
        minitestId
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate ranking
    const ranking = await prisma.minitestSubmission.count({
      where: {
        minitestId,
        score: { gt: submission.score }
      }
    }) + 1;

    const totalParticipants = await prisma.minitestSubmission.count({
      where: { minitestId }
    });

    // Calculate correct/incorrect based on result
    const correctAnswers = parsedResult?.passedTests || 0;
    const incorrectAnswers = (parsedResult?.totalTests || 0) - correctAnswers;

    // Get time spent from submissions
    const firstSubmission = allSubmissions[allSubmissions.length - 1];
    const lastSubmission = submission;
    const timeSpentMs = lastSubmission.createdAt.getTime() - firstSubmission.createdAt.getTime();
    const timeSpentMinutes = Math.round(timeSpentMs / 60000);
    const timeSpent = timeSpentMinutes > 0 ? `${timeSpentMinutes} phút` : 'Ít hơn 1 phút';

    // Get phase with lessons to find next lesson/phase
    let nextLessonId = null;
    let nextPhaseId = null;
    let nextPhaseTitle = null;

    if (minitest.phase && minitest.phase.course) {
      // Get all phases of the course in order
      const coursePhases = await prisma.phase.findMany({
        where: { courseId: minitest.phase.course.id },
        orderBy: { orderIndex: 'asc' },
        include: {
          lessons: {
            orderBy: { orderIndex: 'asc' }
          }
        }
      });

      // Find current phase index
      const currentPhaseIndex = coursePhases.findIndex(p => p.id === minitest.phase.id);

      if (currentPhaseIndex !== -1) {
        // Check if there's a next phase
        if (currentPhaseIndex + 1 < coursePhases.length) {
          const nextPhase = coursePhases[currentPhaseIndex + 1];
          nextPhaseId = nextPhase.id;
          nextPhaseTitle = nextPhase.title;
          // Get first lesson of next phase
          if (nextPhase.lessons.length > 0) {
            nextLessonId = nextPhase.lessons[0].id;
          }
        }
      }
    }

    return {
      score: submission.score,
      totalScore: totalQuestions * 100,
      timeSpent,
      ranking,
      totalParticipants,
      correctAnswers,
      incorrectAnswers,
      accuracy: parsedResult?.totalTests > 0
        ? Math.round((parsedResult.passedTests / parsedResult.totalTests) * 100)
        : 0,
      strengths: parsedResult?.allPassed ? ['Hoàn thành tốt bài kiểm tra'] : [],
      improvements: !parsedResult?.allPassed ? ['Cần ôn tập thêm các bài tương tự'] : [],
      topics: minitest.questions.map(q => ({
        name: q.problem.title,
        score: parsedResult?.problemId === q.problemId
          ? Math.round((parsedResult.passedTests / (parsedResult.totalTests || 1)) * 100)
          : 0
      })),
      suggestedCourse: 'Tiếp tục học để cải thiện!',
      submissionId: submission.id,
      submittedAt: submission.createdAt,
      allPassed: parsedResult?.allPassed || false,
      nextLessonId,
      nextPhaseId,
      nextPhaseTitle
    };
  }

  /**
   * Lấy tất cả kết quả của user
   */
  async getUserResults(userId: string) {
    const submissions = await prisma.minitestSubmission.findMany({
      where: { userId },
      include: {
        minitest: {
          include: {
            phase: {
              include: {
                course: {
                  select: { id: true, title: true }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return submissions.map(sub => {
      let parsedResult = null;
      if (sub.result) {
        try {
          parsedResult = JSON.parse(sub.result);
        } catch {
          parsedResult = null;
        }
      }

      return {
        id: sub.id,
        minitestId: sub.minitestId,
        minitestTitle: sub.minitest.title,
        courseTitle: sub.minitest.phase?.course?.title,
        score: sub.score,
        totalScore: sub.minitest.questions.length * 100,
        passedTests: parsedResult?.passedTests || 0,
        totalTests: parsedResult?.totalTests || 0,
        allPassed: parsedResult?.allPassed || false,
        submittedAt: sub.createdAt
      };
    });
  }

  async submit(userId: string, minitestId: string, data: {
    problemId: string;
    code: string;
    language: string;
    hintsUsed?: number;
    timeUsed?: number | null;
  }) {
    // Get the problem with test cases
    const problem = await prisma.problem.findUnique({
      where: { id: data.problemId },
      include: { testcases: true }
    });

    if (!problem) {
      throw new Error('Problem not found');
    }

    // Get minitest to verify problem belongs to it
    const minitest = await prisma.minitest.findUnique({
      where: { id: minitestId },
      include: {
        questions: {
          where: { problemId: data.problemId }
        }
      }
    });

    if (!minitest || minitest.questions.length === 0) {
      throw new Error('Problem not found in this minitest');
    }

    // Run code against test cases (simulate execution)
    const results = this.runCodeAgainstTestCases(data.code, data.language, problem.testcases);
    
    const passedTests = results.filter(r => r.passed).length;
    const totalTests = results.length;
    const allPassed = passedTests === totalTests && totalTests > 0;

    // Calculate score (100 points per problem, deducted per failed test)
    const baseScore = 100;
    const scorePerTest = totalTests > 0 ? baseScore / totalTests : 0;
    const score = Math.round(passedTests * scorePerTest);

    // Save submission
    const submission = await prisma.minitestSubmission.create({
      data: {
        userId,
        minitestId,
        score,
        result: JSON.stringify({
          problemId: data.problemId,
          passedTests,
          totalTests,
          allPassed,
          testResults: results,
        })
      },
      include: {
        minitest: true
      }
    });

    return {
      submissionId: submission.id,
      score,
      passedTests,
      totalTests,
      allPassed,
      results: results.map(r => ({
        testId: r.testId,
        passed: r.passed,
        actualOutput: r.actualOutput,
        input: r.isPublic !== false ? r.input : '[Hidden]',
        expectedOutput: r.isPublic !== false ? r.expectedOutput : '[Hidden]',
        isPublic: r.isPublic !== false,
        error: r.error,
      }))
    };
  }

  /**
   * Run code against test cases (simulation)
   */
  private runCodeAgainstTestCases(
    code: string,
    language: string,
    testCases: { id: string; input: string; expectedOutput: string; isPublic?: boolean }[]
  ) {
    const results = [];

    for (const testCase of testCases) {
      // TODO: Integrate with Judge0 or actual code executor
      // Currently simulates execution
      const simulatedOutput = this.simulateExecution(code, language, testCase.input);
      const passed = simulatedOutput.trim() === testCase.expectedOutput.trim();

      results.push({
        testId: testCase.id || `test-${results.length}`,
        passed,
        actualOutput: simulatedOutput,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        isPublic: testCase.isPublic !== false,
        error: simulatedOutput.startsWith('ERROR:') ? simulatedOutput : undefined,
      });
    }

    return results;
  }

  /**
   * Simulate code execution (JavaScript only)
   */
  private simulateExecution(code: string, language: string, input: string): string {
    if (language !== 'javascript') {
      // Non-JS languages - return input as placeholder
      return input;
    }

    try {
      const cleanCode = code
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/.*$/gm, '');

      const functionPatterns = [
        /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g,
        /const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s*)?\(/g,
        /let\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s*)?\(/g,
        /var\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s*)?\(/g,
      ];

      const functionNames: string[] = [];
      for (const pattern of functionPatterns) {
        const regex = new RegExp(pattern.source, pattern.flags);
        let match;
        while ((match = regex.exec(cleanCode)) !== null) {
          functionNames.push(match[1]);
        }
      }

      const functionCallMatch = input.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(([\s\S]*)\)$/);

      let calledFuncName: string;
      let argsStr: string;

      if (functionCallMatch) {
        [, calledFuncName, argsStr] = functionCallMatch;
      } else {
        calledFuncName = functionNames[0];
        if (!calledFuncName) {
          const anyFuncMatch = cleanCode.match(/(?:function|const\s+|let\s+|var\s+)\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*[=(]/);
          if (anyFuncMatch) {
            calledFuncName = anyFuncMatch[1];
          } else {
            return `ERROR: No function detected in code. Available functions: ${functionNames.join(', ') || 'none'}`;
          }
        }
        argsStr = input;
      }

      const hasFunction = functionNames.includes(calledFuncName);
      if (!hasFunction) {
        return `ERROR: Function '${calledFuncName}' not found. Available functions: ${functionNames.join(', ') || 'none'}`;
      }

      const args = this.parseArguments(argsStr);
      const serializedArgs = args.map(a => {
        if (typeof a === 'string') return JSON.stringify(a);
        else if (typeof a === 'number' || typeof a === 'boolean' || a === null) return String(a);
        else if (typeof a === 'undefined') return 'undefined';
        else return JSON.stringify(a);
      }).join(', ');

      const wrappedCode = `${code}\nreturn ${calledFuncName}(${serializedArgs});`;
      const fn = new Function(wrappedCode);
      return this.formatResult(fn());
    } catch (error: any) {
      return `ERROR: ${error.message}`;
    }
  }

  private parseArguments(argsStr: string): any[] {
    const args: any[] = [];
    let current = '';
    let depth = 0;
    let inString = false;
    let stringChar = '';
    let inArray = false;
    let arrayDepth = 0;
    let inObject = false;
    let objectDepth = 0;

    for (let i = 0; i < argsStr.length; i++) {
      const char = argsStr[i];

      if ((char === '"' || char === "'" || char === '`') && (i === 0 || argsStr[i - 1] !== '\\')) {
        if (!inString) { inString = true; stringChar = char; }
        else if (char === stringChar) { inString = false; stringChar = ''; }
      }

      if (!inString) {
        if (char === '[') { if (inArray) arrayDepth++; inArray = true; }
        if (char === ']') { if (arrayDepth > 0) arrayDepth--; else inArray = false; }
        if (char === '{') { if (inObject) objectDepth++; inObject = true; }
        if (char === '}') { if (objectDepth > 0) objectDepth--; else inObject = false; }
        if (char === '(') depth++;
        if (char === ')') depth--;
      }

      if (char === ',' && depth === 0 && !inString && !inArray && !inObject) {
        args.push(this.parseValue(current.trim()));
        current = '';
      } else {
        current += char;
      }
    }

    if (current.trim()) {
      args.push(this.parseValue(current.trim()));
    }

    return args;
  }

  private parseValue(value: string): any {
    if (!value) return undefined;
    try { return JSON.parse(value); } catch { }
    if (value === 'undefined') return undefined;
    if (value === 'null') return null;
    if (value === 'true') return true;
    if (value === 'false') return false;
    const num = Number(value);
    if (!isNaN(num)) return num;
    return value;
  }

  private formatResult(result: any): string {
    if (result === undefined) return 'undefined';
    if (result === null) return 'null';
    if (typeof result === 'object') return JSON.stringify(result);
    return String(result);
  }

  // ============ Problems (for admin to create questions) ============
  async getAllProblems() {
    return prisma.problem.findMany({
      include: {
        _count: {
          select: {
            testcases: true
          }
        }
      },
      orderBy: { title: 'asc' }
    });
  }

  async createProblem(data: {
    title: string;
    description: string;
    difficulty?: string;
    timeLimit?: number;
    memoryLimit?: number;
    testcases?: Array<{
      input: string;
      expectedOutput: string;
      isPublic?: boolean;
    }>;
  }) {
    const { testcases, ...problemData } = data;

    const problem = await prisma.problem.create({
      data: {
        ...problemData,
        difficulty: problemData.difficulty || 'EASY',
        timeLimit: problemData.timeLimit || 1000,
        memoryLimit: problemData.memoryLimit || 256
      }
    });

    // Add testcases if provided
    if (testcases && testcases.length > 0) {
      await prisma.testcase.createMany({
        data: testcases.map((tc, index) => ({
          problemId: problem.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          isPublic: tc.isPublic ?? (index < 2) // First 2 are public by default
        }))
      });
    }

    return prisma.problem.findUnique({
      where: { id: problem.id },
      include: {
        testcases: true
      }
    });
  }

  async updateProblem(id: string, data: {
    title?: string;
    description?: string;
    difficulty?: string;
    timeLimit?: number;
    memoryLimit?: number;
  }) {
    return prisma.problem.update({
      where: { id },
      data,
      include: {
        testcases: true
      }
    });
  }

  async addTestcase(problemId: string, data: {
    input: string;
    expectedOutput: string;
    isPublic?: boolean;
  }) {
    return prisma.testcase.create({
      data: {
        problemId,
        ...data
      }
    });
  }

  async deleteTestcase(id: string) {
    return prisma.testcase.delete({
      where: { id }
    });
  }
}

export default new MinitestService();
