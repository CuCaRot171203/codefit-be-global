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
        role: {
            id: string;
            name: string;
        };
        id: string;
        createdAt: Date;
        email: string;
        username: string;
        avatar: string | null;
        fullName: string | null;
        school: string | null;
        isOnboarded: boolean;
        isActive: boolean;
        lectureCourses: {
            id: string;
            courseId: string;
        }[];
    }[]>;
    getUserById(id: string): Promise<({
        role: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        enrollments: ({
            course: {
                image: string | null;
                id: string;
                description: string;
                createdAt: Date;
                includes: string | null;
                title: string;
                price: number;
                originalPrice: number | null;
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
            courseId: string;
            userId: string;
            coachId: string | null;
            paymentId: string | null;
            completedLessons: number;
            currentUnlocks: number;
        })[];
        certificates: {
            id: string;
            courseId: string;
            userId: string;
            issuedAt: Date;
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
                description: string;
                _count: {
                    enrollments: number;
                };
                title: string;
            };
        } & {
            id: string;
            lectureId: string;
            courseId: string;
            assignedAt: Date;
            assignedBy: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
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
    }) | null>;
    updateUser(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
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
    }>;
    deleteUser(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
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
    }>;
    countUsersByRole(): Promise<(import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.UserGroupByOutputType, import(".prisma/client").Prisma.UserScalarFieldEnum | import(".prisma/client").Prisma.UserScalarFieldEnum[]> & {
        _count: true | {
            id?: number | undefined;
            email?: number | undefined;
            username?: number | undefined;
            password?: number | undefined;
            roleId?: number | undefined;
            avatar?: number | undefined;
            bio?: number | undefined;
            fullName?: number | undefined;
            phone?: number | undefined;
            school?: number | undefined;
            learningLevel?: number | undefined;
            referralCode?: number | undefined;
            isOnboarded?: number | undefined;
            isActive?: number | undefined;
            createdAt?: number | undefined;
            updatedAt?: number | undefined;
            _all?: number | undefined;
        } | undefined;
        _min: {
            id?: string | null | undefined;
            email?: string | null | undefined;
            username?: string | null | undefined;
            password?: string | null | undefined;
            roleId?: string | null | undefined;
            avatar?: string | null | undefined;
            bio?: string | null | undefined;
            fullName?: string | null | undefined;
            phone?: string | null | undefined;
            school?: string | null | undefined;
            learningLevel?: string | null | undefined;
            referralCode?: string | null | undefined;
            isOnboarded?: boolean | null | undefined;
            isActive?: boolean | null | undefined;
            createdAt?: Date | null | undefined;
            updatedAt?: Date | null | undefined;
        } | undefined;
        _max: {
            id?: string | null | undefined;
            email?: string | null | undefined;
            username?: string | null | undefined;
            password?: string | null | undefined;
            roleId?: string | null | undefined;
            avatar?: string | null | undefined;
            bio?: string | null | undefined;
            fullName?: string | null | undefined;
            phone?: string | null | undefined;
            school?: string | null | undefined;
            learningLevel?: string | null | undefined;
            referralCode?: string | null | undefined;
            isOnboarded?: boolean | null | undefined;
            isActive?: boolean | null | undefined;
            createdAt?: Date | null | undefined;
            updatedAt?: Date | null | undefined;
        } | undefined;
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
            courseId: string;
            title: string;
            orderIndex: number;
        })[];
    } & {
        image: string | null;
        id: string;
        description: string;
        createdAt: Date;
        includes: string | null;
        title: string;
        price: number;
        originalPrice: number | null;
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
            courseId: string;
            userId: string;
            coachId: string | null;
            paymentId: string | null;
            completedLessons: number;
            currentUnlocks: number;
        }[];
        creator: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
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
        } | null;
        phases: ({
            lessons: ({
                lessonContent: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    content: string | null;
                    lessonId: string;
                    timeLimit: number | null;
                    memoryLimit: number | null;
                    testCases: string | null;
                    hints: string | null;
                    starterCode: string | null;
                } | null;
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                orderIndex: number;
                phaseId: string;
                content: string;
                type: string;
                status: import(".prisma/client").$Enums.LessonStatus;
                isPublished: boolean;
                publishedAt: Date | null;
            })[];
            minitests: ({
                questions: ({
                    problem: {
                        id: string;
                        description: string;
                        title: string;
                        hackathonId: string | null;
                        minitestId: string | null;
                        difficulty: string;
                        timeLimit: number;
                        memoryLimit: number;
                        codeTemplate: string | null;
                        inputFormat: string | null;
                        outputFormat: string | null;
                    };
                } & {
                    id: string;
                    problemId: string;
                    minitestId: string;
                })[];
            } & {
                id: string;
                title: string;
                orderIndex: number;
                phaseId: string;
            })[];
        } & {
            id: string;
            courseId: string;
            title: string;
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
                status: string;
                userId: string;
                submittedAt: Date;
                fileUrl: string;
                projectId: string;
                reviewNote: string | null;
            })[];
        } & {
            id: string;
            description: string;
            courseId: string;
            title: string;
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
                hackathonId: string | null;
                minitestId: string | null;
                difficulty: string;
                timeLimit: number;
                memoryLimit: number;
                codeTemplate: string | null;
                inputFormat: string | null;
                outputFormat: string | null;
            })[];
        } & {
            id: string;
            description: string;
            courseId: string | null;
            title: string;
            lessonId: string | null;
            startTime: Date;
            endTime: Date;
            durationMinutes: number;
            maxParticipants: number;
            imageUrl: string | null;
            lessonIds: string | null;
        })[];
    } & {
        image: string | null;
        id: string;
        description: string;
        createdAt: Date;
        includes: string | null;
        title: string;
        price: number;
        originalPrice: number | null;
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
        image: string | null;
        id: string;
        description: string;
        createdAt: Date;
        includes: string | null;
        title: string;
        price: number;
        originalPrice: number | null;
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
        image: string | null;
        id: string;
        description: string;
        createdAt: Date;
        includes: string | null;
        title: string;
        price: number;
        originalPrice: number | null;
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
        image: string | null;
        id: string;
        description: string;
        createdAt: Date;
        includes: string | null;
        title: string;
        price: number;
        originalPrice: number | null;
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
        courseId: string;
        userId: string;
        amount: number;
        paymentMethod: string;
        paymentStatus: string;
        payosOrderId: string | null;
        payosTransactionId: string | null;
        qrCodeUrl: string | null;
        completedAt: Date | null;
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
        courseId: string;
        userId: string;
        amount: number;
        paymentMethod: string;
        paymentStatus: string;
        payosOrderId: string | null;
        payosTransactionId: string | null;
        qrCodeUrl: string | null;
        completedAt: Date | null;
    }>;
    findPaymentById(paymentId: string): Promise<{
        id: string;
        createdAt: Date;
        courseId: string;
        userId: string;
        amount: number;
        paymentMethod: string;
        paymentStatus: string;
        payosOrderId: string | null;
        payosTransactionId: string | null;
        qrCodeUrl: string | null;
        completedAt: Date | null;
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
            courseId: string;
            userId: string;
            amount: number;
            paymentMethod: string;
            paymentStatus: string;
            payosOrderId: string | null;
            payosTransactionId: string | null;
            qrCodeUrl: string | null;
            completedAt: Date | null;
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
        courseId: string;
        type: import(".prisma/client").$Enums.CodeType;
        code: string;
        createdBy: string | null;
        usedBy: string | null;
        usedAt: Date | null;
        isUsed: boolean;
        expiresAt: Date | null;
    })[]>;
    createActivateCode(data: any): Promise<{
        id: string;
        createdAt: Date;
        courseId: string;
        type: import(".prisma/client").$Enums.CodeType;
        code: string;
        createdBy: string | null;
        usedBy: string | null;
        usedAt: Date | null;
        isUsed: boolean;
        expiresAt: Date | null;
    }>;
    deleteActivateCode(id: string): Promise<{
        id: string;
        createdAt: Date;
        courseId: string;
        type: import(".prisma/client").$Enums.CodeType;
        code: string;
        createdBy: string | null;
        usedBy: string | null;
        usedAt: Date | null;
        isUsed: boolean;
        expiresAt: Date | null;
    }>;
    getDashboardStats(): Promise<{
        userStats: {
            role: string;
            count: number;
        }[];
        recentUsers: {
            roleName: string;
            role: {
                name: string;
            };
            id: string;
            createdAt: Date;
            email: string;
            avatar: string | null;
            fullName: string | null;
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
            courseId: string;
            userId: string;
            amount: number;
            paymentMethod: string;
            paymentStatus: string;
            payosOrderId: string | null;
            payosTransactionId: string | null;
            qrCodeUrl: string | null;
            completedAt: Date | null;
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
        courseId: string;
        userId: string;
        coachId: string | null;
        paymentId: string | null;
        completedLessons: number;
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
            title: string;
            orderIndex: number;
            phaseId: string;
            content: string;
            type: string;
            status: import(".prisma/client").$Enums.LessonStatus;
            isPublished: boolean;
            publishedAt: Date | null;
        }[];
        minitests: ({
            questions: ({
                problem: {
                    id: string;
                    description: string;
                    title: string;
                    hackathonId: string | null;
                    minitestId: string | null;
                    difficulty: string;
                    timeLimit: number;
                    memoryLimit: number;
                    codeTemplate: string | null;
                    inputFormat: string | null;
                    outputFormat: string | null;
                };
            } & {
                id: string;
                problemId: string;
                minitestId: string;
            })[];
        } & {
            id: string;
            title: string;
            orderIndex: number;
            phaseId: string;
        })[];
    } & {
        id: string;
        courseId: string;
        title: string;
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
            title: string;
            orderIndex: number;
            phaseId: string;
            content: string;
            type: string;
            status: import(".prisma/client").$Enums.LessonStatus;
            isPublished: boolean;
            publishedAt: Date | null;
        }[];
        minitests: ({
            questions: {
                id: string;
                problemId: string;
                minitestId: string;
            }[];
        } & {
            id: string;
            title: string;
            orderIndex: number;
            phaseId: string;
        })[];
    } & {
        id: string;
        courseId: string;
        title: string;
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
            title: string;
            orderIndex: number;
            phaseId: string;
            content: string;
            type: string;
            status: import(".prisma/client").$Enums.LessonStatus;
            isPublished: boolean;
            publishedAt: Date | null;
        }[];
    } & {
        id: string;
        courseId: string;
        title: string;
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
            title: string;
            orderIndex: number;
            phaseId: string;
            content: string;
            type: string;
            status: import(".prisma/client").$Enums.LessonStatus;
            isPublished: boolean;
            publishedAt: Date | null;
        }[];
    } & {
        id: string;
        courseId: string;
        title: string;
        orderIndex: number;
    }>;
    deletePhase(id: string): Promise<{
        id: string;
        courseId: string;
        title: string;
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
            courseId: string;
            title: string;
            orderIndex: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        orderIndex: number;
        phaseId: string;
        content: string;
        type: string;
        status: import(".prisma/client").$Enums.LessonStatus;
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
            courseId: string;
            title: string;
            orderIndex: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        orderIndex: number;
        phaseId: string;
        content: string;
        type: string;
        status: import(".prisma/client").$Enums.LessonStatus;
        isPublished: boolean;
        publishedAt: Date | null;
    }) | null>;
    getLessonsByPhase(phaseId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        orderIndex: number;
        phaseId: string;
        content: string;
        type: string;
        status: import(".prisma/client").$Enums.LessonStatus;
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
            courseId: string;
            title: string;
            orderIndex: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        orderIndex: number;
        phaseId: string;
        content: string;
        type: string;
        status: import(".prisma/client").$Enums.LessonStatus;
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
            courseId: string;
            title: string;
            orderIndex: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        orderIndex: number;
        phaseId: string;
        content: string;
        type: string;
        status: import(".prisma/client").$Enums.LessonStatus;
        isPublished: boolean;
        publishedAt: Date | null;
    }>;
    deleteLesson(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        orderIndex: number;
        phaseId: string;
        content: string;
        type: string;
        status: import(".prisma/client").$Enums.LessonStatus;
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
            courseId: string;
            title: string;
            orderIndex: number;
        };
        questions: ({
            problem: {
                id: string;
                description: string;
                title: string;
                hackathonId: string | null;
                minitestId: string | null;
                difficulty: string;
                timeLimit: number;
                memoryLimit: number;
                codeTemplate: string | null;
                inputFormat: string | null;
                outputFormat: string | null;
            };
        } & {
            id: string;
            problemId: string;
            minitestId: string;
        })[];
    } & {
        id: string;
        title: string;
        orderIndex: number;
        phaseId: string;
    })[]>;
    getMinitestById(id: string): Promise<({
        phase: {
            course: {
                id: string;
                title: string;
            };
        } & {
            id: string;
            courseId: string;
            title: string;
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
                hackathonId: string | null;
                minitestId: string | null;
                difficulty: string;
                timeLimit: number;
                memoryLimit: number;
                codeTemplate: string | null;
                inputFormat: string | null;
                outputFormat: string | null;
            };
        } & {
            id: string;
            problemId: string;
            minitestId: string;
        })[];
    } & {
        id: string;
        title: string;
        orderIndex: number;
        phaseId: string;
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
            courseId: string;
            title: string;
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
                hackathonId: string | null;
                minitestId: string | null;
                difficulty: string;
                timeLimit: number;
                memoryLimit: number;
                codeTemplate: string | null;
                inputFormat: string | null;
                outputFormat: string | null;
            };
        } & {
            id: string;
            problemId: string;
            minitestId: string;
        })[];
    } & {
        id: string;
        title: string;
        orderIndex: number;
        phaseId: string;
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
            courseId: string;
            title: string;
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
                hackathonId: string | null;
                minitestId: string | null;
                difficulty: string;
                timeLimit: number;
                memoryLimit: number;
                codeTemplate: string | null;
                inputFormat: string | null;
                outputFormat: string | null;
            };
        } & {
            id: string;
            problemId: string;
            minitestId: string;
        })[];
    } & {
        id: string;
        title: string;
        orderIndex: number;
        phaseId: string;
    }) | null>;
    deleteMinitest(id: string): Promise<{
        id: string;
        title: string;
        orderIndex: number;
        phaseId: string;
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
        hackathonId: string | null;
        minitestId: string | null;
        difficulty: string;
        timeLimit: number;
        memoryLimit: number;
        codeTemplate: string | null;
        inputFormat: string | null;
        outputFormat: string | null;
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
                    courseId: string;
                    title: string;
                };
            } & {
                id: string;
                title: string;
                orderIndex: number;
                phaseId: string;
            };
        } & {
            id: string;
            problemId: string;
            minitestId: string;
        })[];
    } & {
        id: string;
        description: string;
        title: string;
        hackathonId: string | null;
        minitestId: string | null;
        difficulty: string;
        timeLimit: number;
        memoryLimit: number;
        codeTemplate: string | null;
        inputFormat: string | null;
        outputFormat: string | null;
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
        hackathonId: string | null;
        minitestId: string | null;
        difficulty: string;
        timeLimit: number;
        memoryLimit: number;
        codeTemplate: string | null;
        inputFormat: string | null;
        outputFormat: string | null;
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
        hackathonId: string | null;
        minitestId: string | null;
        difficulty: string;
        timeLimit: number;
        memoryLimit: number;
        codeTemplate: string | null;
        inputFormat: string | null;
        outputFormat: string | null;
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
        hackathonId: string | null;
        minitestId: string | null;
        difficulty: string;
        timeLimit: number;
        memoryLimit: number;
        codeTemplate: string | null;
        inputFormat: string | null;
        outputFormat: string | null;
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
        hackathonId: string | null;
        minitestId: string | null;
        difficulty: string;
        timeLimit: number;
        memoryLimit: number;
        codeTemplate: string | null;
        inputFormat: string | null;
        outputFormat: string | null;
    }>;
    deleteProblem(id: string): Promise<{
        id: string;
        description: string;
        title: string;
        hackathonId: string | null;
        minitestId: string | null;
        difficulty: string;
        timeLimit: number;
        memoryLimit: number;
        codeTemplate: string | null;
        inputFormat: string | null;
        outputFormat: string | null;
    }>;
    getLectureCourses(lectureId: string): Promise<({
        course: {
            id: string;
            description: string;
            _count: {
                enrollments: number;
            };
            title: string;
            level: string;
        };
    } & {
        id: string;
        lectureId: string;
        courseId: string;
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
        lectureId: string;
        courseId: string;
        assignedAt: Date;
        assignedBy: string | null;
    }>;
    unassignCourseFromLecture(lectureId: string, courseId: string): Promise<{
        id: string;
        lectureId: string;
        courseId: string;
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
                id: string;
                name: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
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
            hackathonId: string | null;
            minitestId: string | null;
            difficulty: string;
            timeLimit: number;
            memoryLimit: number;
            codeTemplate: string | null;
            inputFormat: string | null;
            outputFormat: string | null;
        })[];
    } & {
        id: string;
        description: string;
        courseId: string | null;
        title: string;
        lessonId: string | null;
        startTime: Date;
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
            hackathonId: string;
            problemId: string;
            score: number;
            submittedAt: Date;
        })[];
        course: {
            image: string | null;
            id: string;
            description: string;
            createdAt: Date;
            includes: string | null;
            title: string;
            price: number;
            originalPrice: number | null;
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
            hackathonId: string | null;
            minitestId: string | null;
            difficulty: string;
            timeLimit: number;
            memoryLimit: number;
            codeTemplate: string | null;
            inputFormat: string | null;
            outputFormat: string | null;
        })[];
        id: string;
        description: string;
        courseId: string | null;
        title: string;
        lessonId: string | null;
        startTime: Date;
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
            hackathonId: string | null;
            minitestId: string | null;
            difficulty: string;
            timeLimit: number;
            memoryLimit: number;
            codeTemplate: string | null;
            inputFormat: string | null;
            outputFormat: string | null;
        })[];
    } & {
        id: string;
        description: string;
        courseId: string | null;
        title: string;
        lessonId: string | null;
        startTime: Date;
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
        courseId: string | null;
        title: string;
        lessonId: string | null;
        startTime: Date;
        endTime: Date;
        durationMinutes: number;
        maxParticipants: number;
        imageUrl: string | null;
        lessonIds: string | null;
    }>;
    deleteHackathon(id: string): Promise<{
        id: string;
        description: string;
        courseId: string | null;
        title: string;
        lessonId: string | null;
        startTime: Date;
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
        courseId: string;
        title: string;
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
            status: string;
            userId: string;
            submittedAt: Date;
            fileUrl: string;
            projectId: string;
            reviewNote: string | null;
        })[];
        course: {
            image: string | null;
            id: string;
            description: string;
            createdAt: Date;
            includes: string | null;
            title: string;
            price: number;
            originalPrice: number | null;
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
        courseId: string;
        title: string;
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
        courseId: string;
        title: string;
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
            status: string;
            userId: string;
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
        courseId: string;
        title: string;
        imageUrl: string | null;
        fileUrl: string | null;
    }>;
    deleteProject(id: string): Promise<{
        id: string;
        description: string;
        courseId: string;
        title: string;
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
        status: string;
        userId: string;
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
        status: string;
        userId: string;
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
                courseId: string;
                title: string;
                orderIndex: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            orderIndex: number;
            phaseId: string;
            content: string;
            type: string;
            status: import(".prisma/client").$Enums.LessonStatus;
            isPublished: boolean;
            publishedAt: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        lectureId: string;
        status: import(".prisma/client").$Enums.LessonRequestStatus;
        lessonId: string;
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
                courseId: string;
                title: string;
                orderIndex: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            orderIndex: number;
            phaseId: string;
            content: string;
            type: string;
            status: import(".prisma/client").$Enums.LessonStatus;
            isPublished: boolean;
            publishedAt: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        lectureId: string;
        status: import(".prisma/client").$Enums.LessonRequestStatus;
        lessonId: string;
        dueDate: Date | null;
        notes: string | null;
    })[]>;
    deleteLessonRequest(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        lectureId: string;
        status: import(".prisma/client").$Enums.LessonRequestStatus;
        lessonId: string;
        dueDate: Date | null;
        notes: string | null;
    }>;
    approveLessonRequest(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        lectureId: string;
        status: import(".prisma/client").$Enums.LessonRequestStatus;
        lessonId: string;
        dueDate: Date | null;
        notes: string | null;
    }>;
    rejectLessonRequest(id: string, reason?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        lectureId: string;
        status: import(".prisma/client").$Enums.LessonRequestStatus;
        lessonId: string;
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
            courseId: string;
            title: string;
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
        score: number;
        minitestId: string;
    }[]>;
}
declare const _default: AdminRepository;
export default _default;
//# sourceMappingURL=admin.repository.d.ts.map