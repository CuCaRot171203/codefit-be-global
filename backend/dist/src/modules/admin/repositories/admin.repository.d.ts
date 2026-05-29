/**
 * @fileoverview Repository cho Admin module
 * @module admin/repositories
 */
declare class AdminRepository {
    getAllUsers(role?: string): Promise<{
        _count: {
            enrollments: number;
            submissions: number;
            courses: number;
        };
        id: string;
        email: string;
        username: string;
        avatar: string | null;
        fullName: string | null;
        school: string | null;
        isOnboarded: boolean;
        isActive: boolean;
        createdAt: Date;
        role: {
            name: string;
            id: string;
        };
        lectureCourses: {
            id: string;
            courseId: string;
        }[];
    }[]>;
    getUserById(id: string): Promise<({
        role: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        };
        enrollments: ({
            course: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            progress: number;
            userId: string;
            courseId: string;
            completedLessons: number;
            coachId: string | null;
            paymentId: string | null;
            currentUnlocks: number;
        })[];
        certificates: {
            id: string;
            userId: string;
            courseId: string;
            courseTitle: string;
            userName: string;
            issuedAt: Date;
            certificateUrl: string | null;
        }[];
        userStats: {
            id: string;
            userId: string;
            score: number;
            frequency: number;
            rank: number | null;
            weeklyScore: number;
            lastWeekScore: number;
            lastUpdated: Date;
        }[];
        lectureCourses: ({
            course: {
                id: string;
                _count: {
                    enrollments: number;
                };
                description: string;
                title: string;
            };
        } & {
            id: string;
            courseId: string;
            lectureId: string;
            assignedAt: Date;
            assignedBy: string | null;
        })[];
    } & {
        id: string;
        email: string;
        username: string;
        password: string;
        roleId: string;
        avatar: string | null;
        bio: string | null;
        fullName: string | null;
        phone: string | null;
        school: string | null;
        learningLevel: string | null;
        referralCode: string | null;
        isOnboarded: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    updateUser(id: string, data: any): Promise<{
        id: string;
        email: string;
        username: string;
        password: string;
        roleId: string;
        avatar: string | null;
        bio: string | null;
        fullName: string | null;
        phone: string | null;
        school: string | null;
        learningLevel: string | null;
        referralCode: string | null;
        isOnboarded: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteUser(id: string): Promise<{
        id: string;
        email: string;
        username: string;
        password: string;
        roleId: string;
        avatar: string | null;
        bio: string | null;
        fullName: string | null;
        phone: string | null;
        school: string | null;
        learningLevel: string | null;
        referralCode: string | null;
        isOnboarded: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    countUsersByRole(): Promise<(import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.UserGroupByOutputType, "roleId"[]> & {
        _count: number;
    })[]>;
    getAllCourses(): Promise<({
        _count: {
            enrollments: number;
            phases: number;
        };
        creator: {
            id: string;
            email: string;
            fullName: string | null;
        } | null;
        phases: ({
            lessons: {
                id: string;
                title: string;
                orderIndex: number;
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
    })[]>;
    getCourseById(id: string): Promise<({
        enrollments: {
            id: string;
            createdAt: Date;
            progress: number;
            userId: string;
            courseId: string;
            completedLessons: number;
            coachId: string | null;
            paymentId: string | null;
            currentUnlocks: number;
        }[];
        creator: {
            id: string;
            email: string;
            username: string;
            password: string;
            roleId: string;
            avatar: string | null;
            bio: string | null;
            fullName: string | null;
            phone: string | null;
            school: string | null;
            learningLevel: string | null;
            referralCode: string | null;
            isOnboarded: boolean;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        phases: ({
            lessons: ({
                lessonContent: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    timeLimit: number | null;
                    memoryLimit: number | null;
                    content: string | null;
                    lessonId: string;
                    testCases: string | null;
                    hints: string | null;
                    starterCode: string | null;
                } | null;
            } & {
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
            })[];
            minitests: ({
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
            })[];
        } & {
            id: string;
            title: string;
            courseId: string;
            orderIndex: number;
        })[];
        projects: ({
            submissions: ({
                user: {
                    id: string;
                    email: string;
                    fullName: string | null;
                };
            } & {
                id: string;
                userId: string;
                status: string;
                submittedAt: Date;
                fileUrl: string;
                projectId: string;
                reviewNote: string | null;
            })[];
        } & {
            id: string;
            description: string;
            title: string;
            courseId: string;
            imageUrl: string | null;
            fileUrl: string | null;
        })[];
        hackathons: ({
            _count: {
                submissions: number;
                participants: number;
            };
            problems: ({
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
            })[];
        } & {
            id: string;
            description: string;
            title: string;
            courseId: string | null;
            startTime: Date;
            lessonId: string | null;
            endTime: Date;
            durationMinutes: number;
            maxParticipants: number;
            imageUrl: string | null;
            lessonIds: string | null;
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
    createCourse(data: any): Promise<{
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
    }>;
    updateCourse(id: string, data: any): Promise<{
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
    }>;
    deleteCourse(id: string): Promise<{
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
    }>;
    countCourses(): Promise<number>;
    getAllPayments(): Promise<({
        user: {
            id: string;
            email: string;
            fullName: string | null;
        };
        course: {
            id: string;
            title: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        courseId: string;
        completedAt: Date | null;
        amount: number;
        paymentMethod: string;
        paymentStatus: string;
        payosOrderId: string | null;
        payosTransactionId: string | null;
        qrCodeUrl: string | null;
    })[]>;
    updatePaymentStatus(paymentId: string, status: string): Promise<{
        user: {
            id: string;
            email: string;
            fullName: string | null;
        };
        course: {
            id: string;
            title: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        courseId: string;
        completedAt: Date | null;
        amount: number;
        paymentMethod: string;
        paymentStatus: string;
        payosOrderId: string | null;
        payosTransactionId: string | null;
        qrCodeUrl: string | null;
    }>;
    findPaymentById(paymentId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        courseId: string;
        completedAt: Date | null;
        amount: number;
        paymentMethod: string;
        paymentStatus: string;
        payosOrderId: string | null;
        payosTransactionId: string | null;
        qrCodeUrl: string | null;
    } | null>;
    getPaymentStats(): Promise<{
        totalAmount: number;
        pendingCount: number;
        completedCount: number;
        byMethod: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.PaymentGroupByOutputType, ("paymentMethod" | "paymentStatus")[]> & {
            _count: number;
            _sum: {
                amount: number | null;
            };
        })[];
        recentPayments: ({
            user: {
                email: string;
                fullName: string | null;
            };
            course: {
                title: string;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            courseId: string;
            completedAt: Date | null;
            amount: number;
            paymentMethod: string;
            paymentStatus: string;
            payosOrderId: string | null;
            payosTransactionId: string | null;
            qrCodeUrl: string | null;
        })[];
    }>;
    getRevenueByMonth(): Promise<Record<string, number>>;
    getAllActivateCodes(): Promise<({
        course: {
            id: string;
            title: string;
        };
    } & {
        id: string;
        createdAt: Date;
        code: string;
        courseId: string;
        type: import(".prisma/client").$Enums.CodeType;
        createdBy: string | null;
        usedAt: Date | null;
        isUsed: boolean;
        expiresAt: Date | null;
        usedBy: string | null;
    })[]>;
    createActivateCode(data: any): Promise<{
        id: string;
        createdAt: Date;
        code: string;
        courseId: string;
        type: import(".prisma/client").$Enums.CodeType;
        createdBy: string | null;
        usedAt: Date | null;
        isUsed: boolean;
        expiresAt: Date | null;
        usedBy: string | null;
    }>;
    deleteActivateCode(id: string): Promise<{
        id: string;
        createdAt: Date;
        code: string;
        courseId: string;
        type: import(".prisma/client").$Enums.CodeType;
        createdBy: string | null;
        usedAt: Date | null;
        isUsed: boolean;
        expiresAt: Date | null;
        usedBy: string | null;
    }>;
    getDashboardStats(): Promise<{
        userStats: {
            role: string;
            count: number;
        }[];
        recentUsers: {
            roleName: string;
            id: string;
            email: string;
            avatar: string | null;
            fullName: string | null;
            createdAt: Date;
            role: {
                name: string;
            };
        }[];
        activeHackathons: {
            participantCount: number;
            submissionCount: number;
            id: string;
            _count: {
                submissions: number;
                participants: number;
            };
            title: string;
            startTime: Date;
            endTime: Date;
        }[];
        topSubmissions: {
            id: string;
            score: number;
            submittedAt: Date;
            user: {
                id: string;
                avatar: string | null;
                fullName: string | null;
            };
            hackathon: {
                id: string;
                title: string;
            };
        }[];
        totalAmount: number;
        pendingCount: number;
        completedCount: number;
        byMethod: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.PaymentGroupByOutputType, ("paymentMethod" | "paymentStatus")[]> & {
            _count: number;
            _sum: {
                amount: number | null;
            };
        })[];
        recentPayments: ({
            user: {
                email: string;
                fullName: string | null;
            };
            course: {
                title: string;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            courseId: string;
            completedAt: Date | null;
            amount: number;
            paymentMethod: string;
            paymentStatus: string;
            payosOrderId: string | null;
            payosTransactionId: string | null;
            qrCodeUrl: string | null;
        })[];
        totalUsers: number;
        totalCourses: number;
        totalEnrollments: number;
        totalLessons: number;
        totalMinitests: number;
        totalHackathons: number;
        lectureCount: number;
    }>;
    getAllEnrollments(): Promise<({
        user: {
            id: string;
            email: string;
            fullName: string | null;
        };
        course: {
            id: string;
            title: string;
        };
        coach: {
            id: string;
            fullName: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        progress: number;
        userId: string;
        courseId: string;
        completedLessons: number;
        coachId: string | null;
        paymentId: string | null;
        currentUnlocks: number;
    })[]>;
    getAllPhases(): Promise<({
        _count: {
            lessons: number;
            minitests: number;
        };
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
        minitests: ({
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
        })[];
    } & {
        id: string;
        title: string;
        courseId: string;
        orderIndex: number;
    })[]>;
    getPhasesByCourse(courseId: string): Promise<({
        _count: {
            lessons: number;
            minitests: number;
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
        minitests: ({
            questions: {
                id: string;
                problemId: string;
                minitestId: string;
                orderIndex: number;
            }[];
        } & {
            id: string;
            title: string;
            phaseId: string;
            orderIndex: number;
        })[];
    } & {
        id: string;
        title: string;
        courseId: string;
        orderIndex: number;
    })[]>;
    createPhase(data: any): Promise<{
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
    }>;
    updatePhase(id: string, data: any): Promise<{
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
    }>;
    deletePhase(id: string): Promise<{
        id: string;
        title: string;
        courseId: string;
        orderIndex: number;
    }>;
    getAllLessons(): Promise<({
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
    })[]>;
    getLessonById(id: string): Promise<({
        _count: {
            lessonProgress: number;
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
    } & {
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
    }) | null>;
    getLessonsByPhase(phaseId: string): Promise<{
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
    }[]>;
    createLesson(data: any): Promise<{
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
    }>;
    updateLesson(id: string, data: any): Promise<{
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
    }>;
    deleteLesson(id: string): Promise<{
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
    }>;
    getTestcasesByLesson(lessonId: string): Promise<never[]>;
    createTestcase(data: any): Promise<void>;
    updateTestcase(id: string, data: any): Promise<{
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
    getMinitestById(id: string): Promise<({
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
    createMinitest(data: {
        phaseId: string;
        title: string;
        questionIds?: string[];
    }): Promise<({
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
        questionIds?: string[];
    }): Promise<({
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
    getAllProblems(): Promise<({
        _count: {
            testcases: number;
        };
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
    })[]>;
    getProblemsByCourseId(courseId: string): Promise<({
        _count: {
            testcases: number;
        };
        testcases: {
            id: string;
            problemId: string;
            input: string;
            expectedOutput: string;
            isPublic: boolean;
        }[];
        minitestQuestions: ({
            minitest: {
                phase: {
                    id: string;
                    title: string;
                    courseId: string;
                };
            } & {
                id: string;
                title: string;
                phaseId: string;
                orderIndex: number;
            };
        } & {
            id: string;
            problemId: string;
            minitestId: string;
            orderIndex: number;
        })[];
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
        testcases?: any[];
        hackathonId?: string;
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
    updateProblem(id: string, data: any): Promise<{
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
    addProblemToHackathon(problemId: string, hackathonId: string): Promise<{
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
    removeProblemFromHackathon(problemId: string): Promise<{
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
    deleteProblem(id: string): Promise<{
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
    getLectureCourses(lectureId: string): Promise<({
        course: {
            id: string;
            _count: {
                enrollments: number;
            };
            description: string;
            title: string;
            level: string;
        };
    } & {
        id: string;
        courseId: string;
        lectureId: string;
        assignedAt: Date;
        assignedBy: string | null;
    })[]>;
    assignCourseToLecture(lectureId: string, courseId: string, assignedBy?: string): Promise<{
        course: {
            id: string;
            description: string;
            title: string;
        };
    } & {
        id: string;
        courseId: string;
        lectureId: string;
        assignedAt: Date;
        assignedBy: string | null;
    }>;
    unassignCourseFromLecture(lectureId: string, courseId: string): Promise<{
        id: string;
        courseId: string;
        lectureId: string;
        assignedAt: Date;
        assignedBy: string | null;
    }>;
    isLectureAssignedToCourse(lectureId: string, courseId: string): Promise<boolean>;
    getLecturesByCourse(courseId: string): Promise<{
        id: string;
        email: string;
        username: string;
        avatar: string | null;
        fullName: string | null;
    }[]>;
    getInstructorDetail(lectureId: string): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            fullName: string | null;
            avatar: string | null;
            role: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
            };
            createdAt: Date;
        };
        courses: {
            id: any;
            courseId: any;
            courseTitle: any;
            courseLevel: any;
            enrolledStudents: any;
            phasesCount: any;
            assignedAt: any;
        }[];
        lessonRequests: {
            id: any;
            status: any;
            dueDate: any;
            notes: any;
            createdAt: any;
            updatedAt: any;
            lesson: {
                id: any;
                title: any;
                type: any;
                status: any;
                courseId: any;
                courseTitle: any;
            };
        }[];
        minitests: {
            id: any;
            score: any;
            submittedAt: any;
            minitest: {
                id: any;
                title: any;
                courseId: any;
                courseTitle: any;
            };
        }[];
        hackathons: {
            id: any;
            joinedAt: any;
            hackathon: {
                id: any;
                title: any;
                startTime: any;
                endTime: any;
            };
        }[];
        hackathonSubmissions: {
            id: any;
            score: any;
            submittedAt: any;
            hackathon: {
                id: any;
                title: any;
            };
            problem: {
                id: any;
                title: any;
            };
        }[];
        stats: {
            totalCourses: number;
            totalLessons: number;
            completedLessons: number;
            inProgressLessons: number;
            pendingLessons: number;
            lessonCompletionRate: number;
            totalMinitests: number;
            avgMinitestScore: number;
            totalHackathons: number;
            totalHackathonSubmissions: number;
        };
        courseProgress: {
            courseId: any;
            courseTitle: any;
            assignedAt: any;
            totalLessons: number;
            completedLessons: number;
            progress: number;
        }[];
    }>;
    getAllHackathons(): Promise<({
        _count: {
            submissions: number;
            participants: number;
        };
        course: {
            id: string;
            title: string;
        } | null;
        problems: ({
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
        })[];
    } & {
        id: string;
        description: string;
        title: string;
        courseId: string | null;
        startTime: Date;
        lessonId: string | null;
        endTime: Date;
        durationMinutes: number;
        maxParticipants: number;
        imageUrl: string | null;
        lessonIds: string | null;
    })[]>;
    getHackathonById(id: string): Promise<{
        statistics: {
            totalSubmissions: number;
            uniqueSubmitters: number;
            avgScore: number;
            submissionsByStatus: {
                pending: number;
                graded: number;
                rejected: number;
            };
            submissionsByDay: Record<string, number>;
            problemStats: {
                id: string;
                title: string;
                difficulty: string;
                submissionCount: number;
                avgScore: number;
            }[];
            participantCount: number;
            submissionCount: number;
        };
        submissions: ({
            user: {
                id: string;
                email: string;
                fullName: string | null;
            };
        } & {
            id: string;
            userId: string;
            problemId: string;
            hackathonId: string;
            score: number;
            submittedAt: Date;
        })[];
        course: {
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
        } | null;
        participants: ({
            user: {
                id: string;
                email: string;
                fullName: string | null;
            };
        } & {
            id: string;
            userId: string;
            hackathonId: string;
            joinedAt: Date;
        })[];
        problems: ({
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
        })[];
        id: string;
        description: string;
        title: string;
        courseId: string | null;
        startTime: Date;
        lessonId: string | null;
        endTime: Date;
        durationMinutes: number;
        maxParticipants: number;
        imageUrl: string | null;
        lessonIds: string | null;
    } | null>;
    createHackathon(data: {
        courseId?: string;
        lessonId?: string;
        title: string;
        description?: string;
        startTime?: Date;
        endTime?: Date;
        durationMinutes?: number;
        maxParticipants?: number;
        imageUrl?: string;
        lessonIds?: string[];
        problems?: {
            title: string;
            description: string;
            difficulty?: string;
            codeTemplate?: string;
            inputFormat?: string;
            outputFormat?: string;
            testcases?: {
                input: string;
                expectedOutput: string;
                isPublic?: boolean;
            }[];
        }[];
    }): Promise<{
        course: {
            id: string;
            title: string;
        } | null;
        problems: ({
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
        })[];
    } & {
        id: string;
        description: string;
        title: string;
        courseId: string | null;
        startTime: Date;
        lessonId: string | null;
        endTime: Date;
        durationMinutes: number;
        maxParticipants: number;
        imageUrl: string | null;
        lessonIds: string | null;
    }>;
    updateHackathon(id: string, data: any): Promise<{
        course: {
            id: string;
            title: string;
        } | null;
    } & {
        id: string;
        description: string;
        title: string;
        courseId: string | null;
        startTime: Date;
        lessonId: string | null;
        endTime: Date;
        durationMinutes: number;
        maxParticipants: number;
        imageUrl: string | null;
        lessonIds: string | null;
    }>;
    deleteHackathon(id: string): Promise<{
        id: string;
        description: string;
        title: string;
        courseId: string | null;
        startTime: Date;
        lessonId: string | null;
        endTime: Date;
        durationMinutes: number;
        maxParticipants: number;
        imageUrl: string | null;
        lessonIds: string | null;
    }>;
    getAllProjects(): Promise<({
        _count: {
            submissions: number;
        };
        course: {
            id: string;
            title: string;
        };
    } & {
        id: string;
        description: string;
        title: string;
        courseId: string;
        imageUrl: string | null;
        fileUrl: string | null;
    })[]>;
    getProjectById(id: string): Promise<({
        submissions: ({
            user: {
                id: string;
                email: string;
                fullName: string | null;
            };
        } & {
            id: string;
            userId: string;
            status: string;
            submittedAt: Date;
            fileUrl: string;
            projectId: string;
            reviewNote: string | null;
        })[];
        course: {
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
        };
    } & {
        id: string;
        description: string;
        title: string;
        courseId: string;
        imageUrl: string | null;
        fileUrl: string | null;
    }) | null>;
    createProject(data: {
        courseId: string;
        title: string;
        description?: string;
    }): Promise<{
        course: {
            id: string;
            title: string;
        };
    } & {
        id: string;
        description: string;
        title: string;
        courseId: string;
        imageUrl: string | null;
        fileUrl: string | null;
    }>;
    updateProject(id: string, data: any): Promise<{
        submissions: ({
            user: {
                id: string;
                email: string;
                fullName: string | null;
            };
        } & {
            id: string;
            userId: string;
            status: string;
            submittedAt: Date;
            fileUrl: string;
            projectId: string;
            reviewNote: string | null;
        })[];
        course: {
            id: string;
            title: string;
        };
    } & {
        id: string;
        description: string;
        title: string;
        courseId: string;
        imageUrl: string | null;
        fileUrl: string | null;
    }>;
    deleteProject(id: string): Promise<{
        id: string;
        description: string;
        title: string;
        courseId: string;
        imageUrl: string | null;
        fileUrl: string | null;
    }>;
    approveProjectSubmission(submissionId: string): Promise<{
        user: {
            id: string;
            email: string;
            fullName: string | null;
        };
    } & {
        id: string;
        userId: string;
        status: string;
        submittedAt: Date;
        fileUrl: string;
        projectId: string;
        reviewNote: string | null;
    }>;
    rejectProjectSubmission(submissionId: string, reason?: string): Promise<{
        user: {
            id: string;
            email: string;
            fullName: string | null;
        };
    } & {
        id: string;
        userId: string;
        status: string;
        submittedAt: Date;
        fileUrl: string;
        projectId: string;
        reviewNote: string | null;
    }>;
    getLessonRequestById(id: string): Promise<({
        lecture: {
            id: string;
            email: string;
            fullName: string | null;
        };
        lesson: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.LessonRequestStatus;
        lessonId: string;
        lectureId: string;
        dueDate: Date | null;
        notes: string | null;
    }) | null>;
    getAllLessonRequests(): Promise<({
        lecture: {
            id: string;
            email: string;
            fullName: string | null;
        };
        lesson: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.LessonRequestStatus;
        lessonId: string;
        lectureId: string;
        dueDate: Date | null;
        notes: string | null;
    })[]>;
    deleteLessonRequest(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.LessonRequestStatus;
        lessonId: string;
        lectureId: string;
        dueDate: Date | null;
        notes: string | null;
    }>;
    approveLessonRequest(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.LessonRequestStatus;
        lessonId: string;
        lectureId: string;
        dueDate: Date | null;
        notes: string | null;
    }>;
    rejectLessonRequest(id: string, reason?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.LessonRequestStatus;
        lessonId: string;
        lectureId: string;
        dueDate: Date | null;
        notes: string | null;
    }>;
    getMinitestStats(): Promise<{
        id: string;
        title: string;
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
        questionCount: number;
        totalSubmissions: number;
        uniqueUsers: number;
        passedSubmissions: number;
        completionRate: number;
        avgScore: number;
        recentSubmissions: {
            id: string;
            score: number;
            status: string;
            submittedAt: Date;
        }[];
    }[]>;
    getMinitestSubmissions(minitestId: string): Promise<{
        status: string;
        submittedAt: Date;
        user: {
            id: string;
            email: string;
            username: string;
            avatar: string | null;
            fullName: string | null;
        };
        result: string | null;
        id: string;
        createdAt: Date;
        userId: string;
        minitestId: string;
        score: number;
    }[]>;
}
declare const _default: AdminRepository;
export default _default;
//# sourceMappingURL=admin.repository.d.ts.map