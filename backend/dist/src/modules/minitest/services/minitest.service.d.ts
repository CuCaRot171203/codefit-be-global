/**
 * @fileoverview Service cho Minitest module
 * @module minitest/services
 */
declare class MinitestService {
    getAllMinitests(): Promise<({
        _count: {
            submissions: number;
        };
        phase: {
            course: {
                id: string;
                title: string;
            };
        } & {
            id: string;
            title: string;
            courseId: string;
            orderIndex: number;
        };
        questions: ({
            problem: {
                id: string;
                description: string;
                title: string;
                difficulty: string;
                timeLimit: number;
                memoryLimit: number;
                codeTemplate: string | null;
                inputFormat: string | null;
                outputFormat: string | null;
                hackathonId: string | null;
                minitestId: string | null;
            };
        } & {
            id: string;
            problemId: string;
            minitestId: string;
            orderIndex: number;
        })[];
    } & {
        id: string;
        title: string;
        phaseId: string;
        orderIndex: number;
    })[]>;
    getById: (id: string) => Promise<({
        submissions: {
            result: string | null;
            id: string;
            createdAt: Date;
            userId: string;
            minitestId: string;
            score: number;
        }[];
        phase: {
            course: {
                id: string;
                title: string;
            };
            lessons: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.LessonStatus;
                title: string;
                type: string;
                content: string;
                phaseId: string;
                orderIndex: number;
                isPublished: boolean;
                publishedAt: Date | null;
            }[];
        } & {
            id: string;
            title: string;
            courseId: string;
            orderIndex: number;
        };
        questions: ({
            problem: {
                testcases: {
                    id: string;
                    problemId: string;
                    input: string;
                    expectedOutput: string;
                    isPublic: boolean;
                }[];
            } & {
                id: string;
                description: string;
                title: string;
                difficulty: string;
                timeLimit: number;
                memoryLimit: number;
                codeTemplate: string | null;
                inputFormat: string | null;
                outputFormat: string | null;
                hackathonId: string | null;
                minitestId: string | null;
            };
        } & {
            id: string;
            problemId: string;
            minitestId: string;
            orderIndex: number;
        })[];
    } & {
        id: string;
        title: string;
        phaseId: string;
        orderIndex: number;
    }) | null>;
    getMinitestById(id: string): Promise<({
        submissions: {
            result: string | null;
            id: string;
            createdAt: Date;
            userId: string;
            minitestId: string;
            score: number;
        }[];
        phase: {
            course: {
                id: string;
                title: string;
            };
            lessons: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.LessonStatus;
                title: string;
                type: string;
                content: string;
                phaseId: string;
                orderIndex: number;
                isPublished: boolean;
                publishedAt: Date | null;
            }[];
        } & {
            id: string;
            title: string;
            courseId: string;
            orderIndex: number;
        };
        questions: ({
            problem: {
                testcases: {
                    id: string;
                    problemId: string;
                    input: string;
                    expectedOutput: string;
                    isPublic: boolean;
                }[];
            } & {
                id: string;
                description: string;
                title: string;
                difficulty: string;
                timeLimit: number;
                memoryLimit: number;
                codeTemplate: string | null;
                inputFormat: string | null;
                outputFormat: string | null;
                hackathonId: string | null;
                minitestId: string | null;
            };
        } & {
            id: string;
            problemId: string;
            minitestId: string;
            orderIndex: number;
        })[];
    } & {
        id: string;
        title: string;
        phaseId: string;
        orderIndex: number;
    }) | null>;
    /**
     * Lấy thông tin course với tất cả các phases để tìm phase tiếp theo
     */
    getCourseWithPhases(courseId: string): Promise<({
        phases: ({
            lessons: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.LessonStatus;
                title: string;
                type: string;
                content: string;
                phaseId: string;
                orderIndex: number;
                isPublished: boolean;
                publishedAt: Date | null;
            }[];
        } & {
            id: string;
            title: string;
            courseId: string;
            orderIndex: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        includes: string | null;
        description: string;
        title: string;
        price: number;
        originalPrice: number | null;
        image: string | null;
        duration: string | null;
        level: string;
        creatorId: string | null;
        subscriptionType: import(".prisma/client").$Enums.SubscriptionType;
        subscriptionPrice: number | null;
        autoEnrollOnApproval: boolean;
        unlockLessonsCount: number;
        unlockByPhase: boolean;
        features: string | null;
    }) | null>;
    getMinitestsByPhase(phaseId: string): Promise<({
        _count: {
            submissions: number;
        };
        questions: ({
            problem: {
                id: string;
                description: string;
                title: string;
                difficulty: string;
                timeLimit: number;
                memoryLimit: number;
                codeTemplate: string | null;
                inputFormat: string | null;
                outputFormat: string | null;
                hackathonId: string | null;
                minitestId: string | null;
            };
        } & {
            id: string;
            problemId: string;
            minitestId: string;
            orderIndex: number;
        })[];
    } & {
        id: string;
        title: string;
        phaseId: string;
        orderIndex: number;
    })[]>;
    createMinitest(data: {
        phaseId: string;
        title: string;
        orderIndex?: number;
        questionIds?: string[];
    }): Promise<({
        submissions: {
            result: string | null;
            id: string;
            createdAt: Date;
            userId: string;
            minitestId: string;
            score: number;
        }[];
        phase: {
            course: {
                id: string;
                title: string;
            };
            lessons: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.LessonStatus;
                title: string;
                type: string;
                content: string;
                phaseId: string;
                orderIndex: number;
                isPublished: boolean;
                publishedAt: Date | null;
            }[];
        } & {
            id: string;
            title: string;
            courseId: string;
            orderIndex: number;
        };
        questions: ({
            problem: {
                testcases: {
                    id: string;
                    problemId: string;
                    input: string;
                    expectedOutput: string;
                    isPublic: boolean;
                }[];
            } & {
                id: string;
                description: string;
                title: string;
                difficulty: string;
                timeLimit: number;
                memoryLimit: number;
                codeTemplate: string | null;
                inputFormat: string | null;
                outputFormat: string | null;
                hackathonId: string | null;
                minitestId: string | null;
            };
        } & {
            id: string;
            problemId: string;
            minitestId: string;
            orderIndex: number;
        })[];
    } & {
        id: string;
        title: string;
        phaseId: string;
        orderIndex: number;
    }) | null>;
    updateMinitest(id: string, data: {
        title?: string;
        orderIndex?: number;
        questionIds?: string[];
    }): Promise<({
        submissions: {
            result: string | null;
            id: string;
            createdAt: Date;
            userId: string;
            minitestId: string;
            score: number;
        }[];
        phase: {
            course: {
                id: string;
                title: string;
            };
            lessons: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.LessonStatus;
                title: string;
                type: string;
                content: string;
                phaseId: string;
                orderIndex: number;
                isPublished: boolean;
                publishedAt: Date | null;
            }[];
        } & {
            id: string;
            title: string;
            courseId: string;
            orderIndex: number;
        };
        questions: ({
            problem: {
                testcases: {
                    id: string;
                    problemId: string;
                    input: string;
                    expectedOutput: string;
                    isPublic: boolean;
                }[];
            } & {
                id: string;
                description: string;
                title: string;
                difficulty: string;
                timeLimit: number;
                memoryLimit: number;
                codeTemplate: string | null;
                inputFormat: string | null;
                outputFormat: string | null;
                hackathonId: string | null;
                minitestId: string | null;
            };
        } & {
            id: string;
            problemId: string;
            minitestId: string;
            orderIndex: number;
        })[];
    } & {
        id: string;
        title: string;
        phaseId: string;
        orderIndex: number;
    }) | null>;
    deleteMinitest(id: string): Promise<{
        id: string;
        title: string;
        phaseId: string;
        orderIndex: number;
    }>;
    addQuestion(minitestId: string, problemId: string): Promise<{
        problem: {
            id: string;
            description: string;
            title: string;
            difficulty: string;
            timeLimit: number;
            memoryLimit: number;
            codeTemplate: string | null;
            inputFormat: string | null;
            outputFormat: string | null;
            hackathonId: string | null;
            minitestId: string | null;
        };
    } & {
        id: string;
        problemId: string;
        minitestId: string;
        orderIndex: number;
    }>;
    removeQuestion(minitestId: string, problemId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getSubmissions(minitestId: string): Promise<({
        user: {
            id: string;
            email: string;
            fullName: string | null;
        };
    } & {
        result: string | null;
        id: string;
        createdAt: Date;
        userId: string;
        minitestId: string;
        score: number;
    })[]>;
    getUserSubmissions(userId: string, minitestId?: string): Promise<({
        minitest: {
            phase: {
                course: {
                    id: string;
                    title: string;
                };
            } & {
                id: string;
                title: string;
                courseId: string;
                orderIndex: number;
            };
        } & {
            id: string;
            title: string;
            phaseId: string;
            orderIndex: number;
        };
    } & {
        result: string | null;
        id: string;
        createdAt: Date;
        userId: string;
        minitestId: string;
        score: number;
    })[]>;
    /**
     * Lấy kết quả submission mới nhất của user cho một minitest cụ thể
     */
    getResult(userId: string, minitestId: string): Promise<{
        score: number;
        totalScore: number;
        timeSpent: string;
        ranking: number;
        totalParticipants: number;
        correctAnswers: any;
        incorrectAnswers: number;
        accuracy: number;
        strengths: string[];
        improvements: string[];
        topics: {
            name: string;
            score: number;
        }[];
        suggestedCourse: string;
        submissionId: string;
        submittedAt: Date;
        allPassed: any;
        nextLessonId: string | null;
        nextPhaseId: string | null;
        nextPhaseTitle: string | null;
    } | null>;
    /**
     * Lấy tất cả kết quả của user
     */
    getUserResults(userId: string): Promise<{
        id: string;
        minitestId: string;
        minitestTitle: string;
        courseTitle: string;
        score: number;
        totalScore: number;
        passedTests: any;
        totalTests: any;
        allPassed: any;
        submittedAt: Date;
    }[]>;
    submit(userId: string, minitestId: string, data: {
        problemId: string;
        code: string;
        language: string;
        hintsUsed?: number;
        timeUsed?: number | null;
    }): Promise<{
        submissionId: string;
        score: number;
        passedTests: number;
        totalTests: number;
        allPassed: boolean;
        results: {
            testId: string;
            passed: boolean;
            actualOutput: string;
            input: string;
            expectedOutput: string;
            isPublic: boolean;
            error: string | undefined;
        }[];
    }>;
    /**
     * Run code against test cases (simulation)
     */
    private runCodeAgainstTestCases;
    /**
     * Simulate code execution (JavaScript only)
     */
    private simulateExecution;
    private parseArguments;
    private parseValue;
    private formatResult;
    getAllProblems(): Promise<({
        _count: {
            testcases: number;
        };
    } & {
        id: string;
        description: string;
        title: string;
        difficulty: string;
        timeLimit: number;
        memoryLimit: number;
        codeTemplate: string | null;
        inputFormat: string | null;
        outputFormat: string | null;
        hackathonId: string | null;
        minitestId: string | null;
    })[]>;
    createProblem(data: {
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
    }): Promise<({
        testcases: {
            id: string;
            problemId: string;
            input: string;
            expectedOutput: string;
            isPublic: boolean;
        }[];
    } & {
        id: string;
        description: string;
        title: string;
        difficulty: string;
        timeLimit: number;
        memoryLimit: number;
        codeTemplate: string | null;
        inputFormat: string | null;
        outputFormat: string | null;
        hackathonId: string | null;
        minitestId: string | null;
    }) | null>;
    updateProblem(id: string, data: {
        title?: string;
        description?: string;
        difficulty?: string;
        timeLimit?: number;
        memoryLimit?: number;
    }): Promise<{
        testcases: {
            id: string;
            problemId: string;
            input: string;
            expectedOutput: string;
            isPublic: boolean;
        }[];
    } & {
        id: string;
        description: string;
        title: string;
        difficulty: string;
        timeLimit: number;
        memoryLimit: number;
        codeTemplate: string | null;
        inputFormat: string | null;
        outputFormat: string | null;
        hackathonId: string | null;
        minitestId: string | null;
    }>;
    addTestcase(problemId: string, data: {
        input: string;
        expectedOutput: string;
        isPublic?: boolean;
    }): Promise<{
        id: string;
        problemId: string;
        input: string;
        expectedOutput: string;
        isPublic: boolean;
    }>;
    deleteTestcase(id: string): Promise<{
        id: string;
        problemId: string;
        input: string;
        expectedOutput: string;
        isPublic: boolean;
    }>;
}
declare const _default: MinitestService;
export default _default;
//# sourceMappingURL=minitest.service.d.ts.map