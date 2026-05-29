/**
 * @fileoverview Repository cho Admin module
 * @module admin/repositories
 */

import prisma from '../../../prisma';

class AdminRepository {
  // ============ Users ============
  async getAllUsers(role?: string) {
    const where: any = {};
    
    if (role) {
      // Find role by exact name match (case-insensitive via lowercase comparison)
      const roleRecord = await prisma.role.findFirst({
        where: { name: role },
      });
      
      if (roleRecord) {
        where.roleId = roleRecord.id;
      }
    }
    
    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        role: {
          select: { id: true, name: true },
        },
        avatar: true,
        school: true,
        isOnboarded: true,
        isActive: true,
        createdAt: true,
        lectureCourses: {
          select: {
            id: true,
            courseId: true,
          },
        },
      },
    });

    // Transform data to include _count.courses (from lectureCourses)
    return users.map(user => ({
      ...user,
      _count: {
        enrollments: 0,
        submissions: 0,
        courses: user.lectureCourses?.length || 0,
      },
    }));
  }

  async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        enrollments: { include: { course: true } },
        certificates: true,
        userStats: true,
        lectureCourses: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                description: true,
                _count: { select: { enrollments: true } }
              }
            }
          }
        }
      },
    });
  }

  async updateUser(id: string, data: any) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: string) {
    return prisma.user.delete({ where: { id } });
  }

  async countUsersByRole() {
    return prisma.user.groupBy({
      by: ['roleId'],
      _count: true,
    });
  }

  // ============ Courses ============
  async getAllCourses() {
    return prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        creator: { select: { id: true, fullName: true, email: true } },
        _count: {
          select: {
            enrollments: true,
            phases: true,
          },
        },
        phases: {
          orderBy: { orderIndex: 'asc' },
          include: {
            lessons: {
              orderBy: { orderIndex: 'asc' },
              select: {
                id: true,
                title: true,
                orderIndex: true,
              },
            },
          },
        },
      },
    });
  }

  async getCourseById(id: string) {
    return prisma.course.findUnique({
      where: { id },
      include: {
        creator: true,
        phases: {
          include: {
            lessons: {
              include: {
                lessonContent: true,
              },
            },
            minitests: {
              include: {
                questions: {
                  include: {
                    problem: true
                  }
                }
              }
            },
          },
          orderBy: { orderIndex: 'asc' },
        },
        hackathons: {
          include: {
            problems: {
              include: { testcases: true }
            },
            _count: {
              select: { participants: true, submissions: true }
            }
          }
        },
        projects: {
          include: {
            submissions: {
              include: {
                user: { select: { id: true, fullName: true, email: true } }
              }
            }
          }
        },
        enrollments: true,
      },
    });
  }

  async createCourse(data: any) {
    return prisma.course.create({ data });
  }

  async updateCourse(id: string, data: any) {
    return prisma.course.update({
      where: { id },
      data,
    });
  }

  async deleteCourse(id: string) {
    return prisma.course.delete({ where: { id } });
  }

  async countCourses() {
    return prisma.course.count();
  }

  // ============ Payments ============
  async getAllPayments() {
    return prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, email: true, fullName: true } },
        course: { select: { id: true, title: true } },
      },
    });
  }

  async updatePaymentStatus(paymentId: string, status: string) {
    return prisma.payment.update({
      where: { id: paymentId },
      data: {
        paymentStatus: status as any,
        completedAt: status === 'completed' ? new Date() : undefined,
      },
      include: {
        user: { select: { id: true, email: true, fullName: true } },
        course: { select: { id: true, title: true } },
      },
    });
  }

  async findPaymentById(paymentId: string) {
    return prisma.payment.findUnique({
      where: { id: paymentId },
    });
  }

  async getPaymentStats() {
    const totalAmount = await prisma.payment.aggregate({
      where: { paymentStatus: 'completed' },
      _sum: { amount: true },
    });

    const pendingCount = await prisma.payment.count({
      where: { paymentStatus: 'pending' },
    });

    const completedCount = await prisma.payment.count({
      where: { paymentStatus: 'completed' },
    });

    const byMethod = await prisma.payment.groupBy({
      by: ['paymentMethod', 'paymentStatus'],
      _count: true,
      _sum: { amount: true },
    });

    const recentPayments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { fullName: true, email: true } },
        course: { select: { title: true } },
      },
    });

    return {
      totalAmount: totalAmount._sum.amount || 0,
      pendingCount,
      completedCount,
      byMethod,
      recentPayments,
    };
  }

  async getRevenueByMonth() {
    const payments = await prisma.payment.findMany({
      where: { paymentStatus: 'completed' },
      select: {
        amount: true,
        completedAt: true,
      },
    });

    // Group by month
    const monthlyRevenue: Record<string, number> = {};
    payments.forEach((p) => {
      if (p.completedAt) {
        const month = `${p.completedAt.getFullYear()}-${String(p.completedAt.getMonth() + 1).padStart(2, '0')}`;
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + p.amount;
      }
    });

    return monthlyRevenue;
  }

  // ============ Activate Codes ============
  async getAllActivateCodes() {
    return prisma.activateCode.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        course: { select: { id: true, title: true } },
      },
    });
  }

  async createActivateCode(data: any) {
    return prisma.activateCode.create({ data });
  }

  async deleteActivateCode(id: string) {
    return prisma.activateCode.delete({ where: { id } });
  }

  // ============ Dashboard Stats ============
  async getDashboardStats() {
    const [
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalLessons,
      totalMinitests,
      totalHackathons,
      paymentStats,
      usersByRole,
      recentUsers,
      activeHackathons,
      topSubmissions,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.enrollment.count(),
      prisma.lesson.count(),
      prisma.minitest.count(),
      prisma.hackathon.count(),
      this.getPaymentStats(),
      prisma.user.groupBy({
        by: ['roleId'],
        _count: true,
      }),
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          fullName: true,
          avatar: true,
          role: { select: { name: true } },
          createdAt: true,
        },
      }),
      prisma.hackathon.findMany({
        take: 5,
        orderBy: { startTime: 'desc' },
        select: {
          id: true,
          title: true,
          startTime: true,
          endTime: true,
          _count: { select: { participants: true, submissions: true } },
        },
      }),
      prisma.hackathonSubmission.findMany({
        take: 10,
        orderBy: { score: 'desc' },
        select: {
          id: true,
          score: true,
          submittedAt: true,
          user: { select: { id: true, fullName: true, avatar: true } },
          hackathon: { select: { id: true, title: true } },
        },
      }),
    ]);

    // Get role names for usersByRole
    const roles = await prisma.role.findMany();
    const roleMap = roles.reduce((acc, role) => {
      acc[role.id] = role.name;
      return acc;
    }, {} as Record<string, string>);

    const userStats = usersByRole.map(ur => ({
      role: roleMap[ur.roleId] || 'Unknown',
      count: ur._count,
    }));

    // Calculate lecture count
    const lectureCount = usersByRole
      .filter(ur => roleMap[ur.roleId]?.toLowerCase() === 'lecture')
      .reduce((sum, ur) => sum + ur._count, 0);

    return {
      // Basic counts
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalLessons,
      totalMinitests,
      totalHackathons,
      lectureCount,
      
      // Payment stats
      ...paymentStats,
      
      // User stats by role
      userStats,
      
      // Recent users
      recentUsers: recentUsers.map(u => ({
        ...u,
        roleName: u.role?.name || 'Unknown',
      })),
      
      // Active hackathons
      activeHackathons: activeHackathons.map(h => ({
        ...h,
        participantCount: h._count.participants,
        submissionCount: h._count.submissions,
      })),
      
      // Top submissions (leaderboard)
      topSubmissions: topSubmissions.map(s => ({
        id: s.id,
        score: s.score,
        submittedAt: s.submittedAt,
        user: s.user,
        hackathon: s.hackathon,
      })),
    };
  }

  // ============ Enrollments ============
  async getAllEnrollments() {
    return prisma.enrollment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, email: true, fullName: true } },
        course: { select: { id: true, title: true } },
        coach: { select: { id: true, fullName: true } },
      },
    });
  }

  // ============ Phases (Chương học) ============
  async getAllPhases() {
    return prisma.phase.findMany({
      orderBy: { orderIndex: 'asc' },
      include: {
        course: { select: { id: true, title: true } },
        lessons: {
          orderBy: { orderIndex: 'asc' },
        },
        minitests: {
          include: {
            questions: {
              include: {
                problem: true
              }
            }
          }
        },
        _count: {
          select: {
            lessons: true,
            minitests: true,
          },
        },
      },
    });
  }

  async getPhasesByCourse(courseId: string) {
    return prisma.phase.findMany({
      where: { courseId },
      orderBy: { orderIndex: 'asc' },
      include: {
        lessons: {
          orderBy: { orderIndex: 'asc' },
        },
        minitests: {
          include: {
            questions: true
          }
        },
        _count: {
          select: {
            lessons: true,
            minitests: true,
          },
        },
      },
    });
  }

  async createPhase(data: any) {
    // Get max orderIndex for this course
    const maxOrder = await prisma.phase.aggregate({
      where: { courseId: data.courseId },
      _max: { orderIndex: true },
    });
    const orderIndex = (maxOrder._max.orderIndex ?? -1) + 1;
    
    return prisma.phase.create({
      data: {
        ...data,
        orderIndex: data.orderIndex ?? orderIndex,
      },
      include: {
        course: { select: { id: true, title: true } },
        lessons: true,
      },
    });
  }

  async updatePhase(id: string, data: any) {
    return prisma.phase.update({
      where: { id },
      data,
      include: {
        course: { select: { id: true, title: true } },
        lessons: { orderBy: { orderIndex: 'asc' } },
      },
    });
  }

  async deletePhase(id: string) {
    return prisma.phase.delete({ where: { id } });
  }

  // ============ Lessons (Bài học) ============
  async getAllLessons() {
    return prisma.lesson.findMany({
      orderBy: { orderIndex: 'asc' },
      include: {
        phase: {
          include: {
            course: { select: { id: true, title: true } },
          },
        },
      },
    });
  }

  async getLessonById(id: string) {
    return prisma.lesson.findUnique({
      where: { id },
      include: {
        phase: {
          include: {
            course: { select: { id: true, title: true } },
          },
        },
        _count: {
          select: {
            lessonProgress: true,
          },
        },
      },
    });
  }

  async getLessonsByPhase(phaseId: string) {
    return prisma.lesson.findMany({
      where: { phaseId },
      orderBy: { orderIndex: 'asc' },
    });
  }

  async createLesson(data: any) {
    // Get max orderIndex for this phase
    const maxOrder = await prisma.lesson.aggregate({
      where: { phaseId: data.phaseId },
      _max: { orderIndex: true },
    });
    const orderIndex = (maxOrder._max.orderIndex ?? -1) + 1;
    
    return prisma.lesson.create({
      data: {
        ...data,
        orderIndex: data.orderIndex ?? orderIndex,
      },
      include: {
        phase: {
          include: {
            course: { select: { id: true, title: true } },
          },
        },
      },
    });
  }

  async updateLesson(id: string, data: any) {
    return prisma.lesson.update({
      where: { id },
      data,
      include: {
        phase: {
          include: {
            course: { select: { id: true, title: true } },
          },
        },
      },
    });
  }

  async deleteLesson(id: string) {
    // Bước 1: Lấy thông tin lesson trước khi xóa (để biết phase và course)
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        phase: {
          select: {
            id: true,
            courseId: true
          }
        }
      }
    });

    if (!lesson) {
      throw new Error('Lesson not found');
    }

    const phaseId = lesson.phase.id;
    const courseId = lesson.phase.courseId;

    // Bước 2: Lấy thông tin course để kiểm tra miễn phí
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { subscriptionType: true, price: true }
    });

    const isFreeCourse = course?.subscriptionType === 'FREE' || course?.price === 0;

    // Bước 3: Xóa lesson
    await prisma.lesson.delete({ where: { id } });

    // Bước 4: Đếm số bài còn lại trong phase
    const remainingLessons = await prisma.lesson.count({
      where: { phaseId }
    });

    // Bước 5: Cập nhật enrollments
    // - Khóa miễn phí: giữ currentUnlocks ở giá trị cao (999999) để unlock tất cả bài
    // - Khóa trả phí: giới hạn currentUnlocks không vượt quá số bài còn lại
    const maxUnlocks = isFreeCourse ? 999999 : remainingLessons;

    await prisma.enrollment.updateMany({
      where: {
        courseId,
        currentUnlocks: { gt: maxUnlocks }
      },
      data: {
        currentUnlocks: maxUnlocks
      }
    });
  }

  // ============ Testcases (cho bài học code) ============
  async getTestcasesByLesson(lessonId: string) {
    // Testcases được lưu trong bảng Testcase với problemId
    // Với bài học code, chúng ta cần tạo relation với bài học
    // Hiện tại schema có Testcase liên kết với Problem
    // Cần mở rộng schema hoặc dùng cách khác
    
    // Tạm thời trả về mảng rỗng - cần cập nhật schema sau
    // Hoặc có thể dùng relation gián tiếp qua problem của minitest
    return [];
  }

  async createTestcase(data: any) {
    // Tương tự, cần cập nhật schema để hỗ trợ testcases cho lesson
    // Tạm thời throw error
    throw new Error('Testcase for lessons requires schema update. Please update the Prisma schema.');
  }

  async updateTestcase(id: string, data: any) {
    return prisma.testcase.update({
      where: { id },
      data,
    });
  }

  async deleteTestcase(id: string) {
    return prisma.testcase.delete({ where: { id } });
  }

  // ============ Minitests (Admin) ============
  async getAllMinitests() {
    return prisma.minitest.findMany({
      include: {
        phase: {
          include: {
            course: { select: { id: true, title: true } }
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
      orderBy: { id: 'desc' }
    });
  }

  async getMinitestById(id: string) {
    return prisma.minitest.findUnique({
      where: { id },
      include: {
        phase: {
          include: {
            course: { select: { id: true, title: true } }
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
        }
      }
    });
  }

  async createMinitest(data: { phaseId: string; title: string; questionIds?: string[] }) {
    // Get max orderIndex
    const maxOrder = await prisma.minitest.aggregate({
      where: { phaseId: data.phaseId },
      _max: { orderIndex: true }
    });
    const orderIndex = (maxOrder._max.orderIndex ?? -1) + 1;

    const minitest = await prisma.minitest.create({
      data: {
        phaseId: data.phaseId,
        title: data.title,
        orderIndex
      }
    });

    if (data.questionIds && data.questionIds.length > 0) {
      await prisma.minitestQuestion.createMany({
        data: data.questionIds.map((problemId, index) => ({
          minitestId: minitest.id,
          problemId
        }))
      });
    }

    return this.getMinitestById(minitest.id);
  }

  async updateMinitest(id: string, data: { title?: string; questionIds?: string[] }) {
    const updateData: any = {};
    if (data.title) updateData.title = data.title;

    if (Object.keys(updateData).length > 0) {
      await prisma.minitest.update({
        where: { id },
        data: updateData
      });
    }

    if (data.questionIds !== undefined) {
      await prisma.minitestQuestion.deleteMany({ where: { minitestId: id } });
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
    return prisma.minitest.delete({ where: { id } });
  }

  // ============ Problems (Admin) ============
  async getAllProblems() {
    return prisma.problem.findMany({
      include: {
        testcases: true,
        _count: {
          select: {
            testcases: true
          }
        }
      },
      orderBy: { title: 'asc' }
    });
  }

  async getProblemsByCourseId(courseId: string) {
    return prisma.problem.findMany({
      where: {
        minitestQuestions: {
          some: {
            minitest: {
              phase: { courseId }
            }
          }
        }
      },
      include: {
        testcases: true,
        _count: { select: { testcases: true } },
        minitestQuestions: {
          include: {
            minitest: {
              include: {
                phase: { select: { id: true, title: true, courseId: true } }
              }
            }
          }
        }
      },
      orderBy: { title: 'asc' }
    });
  }

  async createProblem(data: { title: string; description: string; difficulty?: string; testcases?: any[]; hackathonId?: string }) {
    const { testcases, hackathonId, ...problemData } = data;

    const problem = await prisma.problem.create({
      data: {
        ...problemData,
        difficulty: problemData.difficulty || 'EASY',
        hackathonId: hackathonId || null
      }
    });

    if (testcases && testcases.length > 0) {
      await prisma.testcase.createMany({
        data: testcases.map((tc, index) => ({
          problemId: problem.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          isPublic: tc.isPublic ?? (index < 2)
        }))
      });
    }

    return prisma.problem.findUnique({
      where: { id: problem.id },
      include: { testcases: true }
    });
  }

  async updateProblem(id: string, data: any) {
    return prisma.problem.update({
      where: { id },
      data,
      include: { testcases: true }
    });
  }

  async addProblemToHackathon(problemId: string, hackathonId: string) {
    return prisma.problem.update({
      where: { id: problemId },
      data: { hackathonId },
      include: { testcases: true }
    });
  }

  async removeProblemFromHackathon(problemId: string) {
    return prisma.problem.update({
      where: { id: problemId },
      data: { hackathonId: null },
      include: { testcases: true }
    });
  }

  async deleteProblem(id: string) {
    return prisma.problem.delete({ where: { id } });
  }

  // ============ Lecture Course Assignment ============
  async getLectureCourses(lectureId: string) {
    return prisma.lectureCourse.findMany({
      where: { lectureId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            level: true,
            _count: { select: { enrollments: true } }
          }
        }
      },
      orderBy: { assignedAt: 'desc' }
    });
  }

  async assignCourseToLecture(lectureId: string, courseId: string, assignedBy?: string) {
    return prisma.lectureCourse.create({
      data: {
        lectureId,
        courseId,
        assignedBy
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true
          }
        }
      }
    });
  }

  async unassignCourseFromLecture(lectureId: string, courseId: string) {
    return prisma.lectureCourse.delete({
      where: {
        lectureId_courseId: {
          lectureId,
          courseId
        }
      }
    });
  }

  async isLectureAssignedToCourse(lectureId: string, courseId: string) {
    const result = await prisma.lectureCourse.findUnique({
      where: {
        lectureId_courseId: {
          lectureId,
          courseId
        }
      }
    });
    return !!result;
  }

  async getLecturesByCourse(courseId: string) {
    const lectureCourses = await prisma.lectureCourse.findMany({
      where: { courseId },
      include: {
        lecture: {
          select: {
            id: true,
            email: true,
            username: true,
            fullName: true,
            avatar: true,
          }
        }
      },
      orderBy: { assignedAt: 'desc' }
    });
    return lectureCourses.map((lc) => lc.lecture);
  }

  // ============ Instructor Detail (Assignment Overview) ============
  async getInstructorDetail(lectureId: string) {
    try {
      // Get user info
      const user = await prisma.user.findUnique({
        where: { id: lectureId },
        include: {
          role: true,
        },
      });

      if (!user) {
        throw new Error('Instructor not found');
      }

      // Get assigned courses with full details
      const lectureCourses = await prisma.lectureCourse.findMany({
        where: { lectureId },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              description: true,
              level: true,
              _count: {
                select: {
                  enrollments: true,
                  phases: true,
                }
              }
            }
          },
        },
        orderBy: { assignedAt: 'desc' },
      });

      // Get lesson requests for this lecture
      const lessonRequests = await prisma.lessonRequest.findMany({
        where: { lectureId },
        include: {
          lesson: {
            include: {
              phase: {
                include: {
                  course: {
                    select: {
                      id: true,
                      title: true,
                    }
                  }
                }
              }
            }
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Calculate progress stats
      const totalLessons = lessonRequests.length;
      const completedLessons = lessonRequests.filter((lr: any) => lr.status === 'SUBMITTED' || lr.status === 'APPROVED').length;
      const inProgressLessons = lessonRequests.filter((lr: any) => lr.status === 'IN_PROGRESS').length;
      const pendingLessons = lessonRequests.filter((lr: any) => lr.status === 'PENDING').length;

      // Get minitest submissions for this lecture
      const minitestSubmissions = await prisma.minitestSubmission.findMany({
        where: { userId: lectureId },
        include: {
          minitest: {
            include: {
              phase: {
                include: {
                  course: {
                    select: {
                      id: true,
                      title: true,
                    }
                  }
                }
              }
            }
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Get hackathon participations
      const hackathonParticipations = await prisma.hackathonParticipant.findMany({
        where: { userId: lectureId },
        include: {
          hackathon: true,
        },
        orderBy: { joinedAt: 'desc' },
      });

      // Get hackathon submissions
      const hackathonSubmissions = await prisma.hackathonSubmission.findMany({
        where: { userId: lectureId },
        include: {
          hackathon: {
            select: {
              id: true,
              title: true,
              startTime: true,
              endTime: true,
            }
          },
          problem: {
            select: {
              id: true,
              title: true,
            }
          }
        },
        orderBy: { submittedAt: 'desc' },
      });

      // Calculate overall progress
      const courseProgress = lectureCourses.map((lc: any) => {
        const courseLessonRequests = lessonRequests.filter(
          (lr: any) => lr.lesson?.phase?.course?.id === lc.course.id
        );
        const completed = courseLessonRequests.filter(
          (lr: any) => lr.status === 'SUBMITTED' || lr.status === 'APPROVED'
        ).length;
        const total = courseLessonRequests.length;

        return {
          courseId: lc.course.id,
          courseTitle: lc.course.title,
          assignedAt: lc.assignedAt,
          totalLessons: total,
          completedLessons: completed,
          progress: total > 0 ? Math.round((completed / total) * 100) : 0,
        };
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.fullName,
          avatar: user.avatar,
          role: user.role,
          createdAt: user.createdAt,
        },
        courses: lectureCourses.map((lc: any) => ({
          id: lc.id,
          courseId: lc.course.id,
          courseTitle: lc.course.title,
          courseLevel: lc.course.level,
          enrolledStudents: lc.course._count.enrollments,
          phasesCount: lc.course._count.phases,
          assignedAt: lc.assignedAt,
        })),
        lessonRequests: lessonRequests.map((lr: any) => ({
          id: lr.id,
          status: lr.status,
          dueDate: lr.dueDate,
          notes: lr.notes,
          createdAt: lr.createdAt,
          updatedAt: lr.updatedAt,
          lesson: {
            id: lr.lesson.id,
            title: lr.lesson.title,
            type: lr.lesson.type,
            status: lr.lesson.status,
            courseId: lr.lesson.phase?.course?.id,
            courseTitle: lr.lesson.phase?.course?.title,
          }
        })),
        minitests: minitestSubmissions.map((ms: any) => ({
          id: ms.id,
          score: ms.score,
          submittedAt: ms.createdAt,
          minitest: {
            id: ms.minitest.id,
            title: ms.minitest.title,
            courseId: ms.minitest.phase?.course?.id,
            courseTitle: ms.minitest.phase?.course?.title,
          }
        })),
        hackathons: hackathonParticipations.map((hp: any) => ({
          id: hp.id,
          joinedAt: hp.joinedAt,
          hackathon: {
            id: hp.hackathon.id,
            title: hp.hackathon.title,
            startTime: hp.hackathon.startTime,
            endTime: hp.hackathon.endTime,
          }
        })),
        hackathonSubmissions: hackathonSubmissions.map((hs: any) => ({
          id: hs.id,
          score: hs.score,
          submittedAt: hs.submittedAt,
          hackathon: {
            id: hs.hackathon.id,
            title: hs.hackathon.title,
          },
          problem: {
            id: hs.problem.id,
            title: hs.problem.title,
          }
        })),
        stats: {
          totalCourses: lectureCourses.length,
          totalLessons: totalLessons,
          completedLessons,
          inProgressLessons,
          pendingLessons,
          lessonCompletionRate: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
          totalMinitests: minitestSubmissions.length,
          avgMinitestScore: minitestSubmissions.length > 0
            ? Math.round(minitestSubmissions.reduce((acc: number, ms: any) => acc + ms.score, 0) / minitestSubmissions.length)
            : 0,
          totalHackathons: hackathonParticipations.length,
          totalHackathonSubmissions: hackathonSubmissions.length,
        },
        courseProgress,
      };
    } catch (error) {
      console.error('Error in getInstructorDetail:', error);
      throw error;
    }
  }

  // ============ Hackathons / Final Tests (Admin) ============
  async getAllHackathons() {
    return prisma.hackathon.findMany({
      include: {
        course: {
          select: { id: true, title: true }
        },
        problems: {
          include: {
            testcases: true
          }
        },
        _count: {
          select: { participants: true, submissions: true }
        }
      },
      orderBy: { startTime: 'desc' }
    });
  }

  async getHackathonById(id: string) {
    const hackathon = await prisma.hackathon.findUnique({
      where: { id },
      include: {
        course: true,
        problems: {
          include: {
            testcases: true
          }
        },
        participants: {
          include: { user: { select: { id: true, fullName: true, email: true } } }
        },
        submissions: {
          include: { user: { select: { id: true, fullName: true, email: true } } }
        }
      }
    });

    if (!hackathon) return null;

    // Calculate statistics
    const totalSubmissions = hackathon.submissions.length;
    const uniqueSubmitters = new Set(hackathon.submissions.map(s => s.userId)).size;
    const avgScore = totalSubmissions > 0
      ? hackathon.submissions.reduce((sum, s) => sum + (s.score || 0), 0) / totalSubmissions
      : 0;

    // Submissions by status
    const submissionsByStatus = {
      pending: hackathon.submissions.filter(s => (s as any).status === 'PENDING').length,
      graded: hackathon.submissions.filter(s => (s as any).status === 'GRADED').length,
      rejected: hackathon.submissions.filter(s => (s as any).status === 'REJECTED').length,
    };

    // Submissions over time (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const submissionsByDay: Record<string, number> = {};
    hackathon.submissions
      .filter(s => new Date(s.submittedAt) >= sevenDaysAgo)
      .forEach(s => {
        const day = new Date(s.submittedAt).toISOString().split('T')[0];
        submissionsByDay[day] = (submissionsByDay[day] || 0) + 1;
      });

    // Problem statistics
    const problemStats = hackathon.problems.map(p => ({
      id: p.id,
      title: p.title,
      difficulty: p.difficulty,
      submissionCount: hackathon.submissions.filter(s => s.problemId === p.id).length,
      avgScore: (() => {
        const problemSubmissions = hackathon.submissions.filter(s => s.problemId === p.id);
        return problemSubmissions.length > 0
          ? problemSubmissions.reduce((sum, s) => sum + (s.score || 0), 0) / problemSubmissions.length
          : 0;
      })(),
    }));

    return {
      ...hackathon,
      statistics: {
        totalSubmissions,
        uniqueSubmitters,
        avgScore: Math.round(avgScore * 100) / 100,
        submissionsByStatus,
        submissionsByDay,
        problemStats,
        participantCount: hackathon.participants.length,
        submissionCount: totalSubmissions,
      }
    };
  }

  async createHackathon(data: {
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
  }) {
    const { lessonIds, problems, ...hackathonData } = data;
    
    return prisma.hackathon.create({
      data: {
        ...hackathonData,
        courseId: data.courseId,
        lessonId: data.lessonId,
        title: data.title,
        description: data.description || '',
        startTime: data.startTime || new Date(),
        endTime: data.endTime || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        durationMinutes: data.durationMinutes || 120,
        maxParticipants: data.maxParticipants || 100,
        imageUrl: data.imageUrl || null,
        // lessonIds will be added after Prisma regenerate
        // Create problems if provided
        ...(problems && problems.length > 0 ? {
          problems: {
            create: problems.map(problem => ({
              title: problem.title,
              description: problem.description,
              difficulty: problem.difficulty || 'MEDIUM',
              codeTemplate: problem.codeTemplate || null,
              inputFormat: problem.inputFormat || null,
              outputFormat: problem.outputFormat || null,
              testcases: problem.testcases && problem.testcases.length > 0 ? {
                create: problem.testcases.map((tc, index) => ({
                  input: tc.input,
                  expectedOutput: tc.expectedOutput,
                  isPublic: tc.isPublic ?? (index < 2)
                }))
              } : undefined
            }))
          }
        } : {})
      },
      include: {
        course: { select: { id: true, title: true } },
        problems: {
          include: {
            testcases: true
          }
        }
      }
    });
  }

  async updateHackathon(id: string, data: any) {
    return prisma.hackathon.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime ? new Date(data.startTime) : undefined,
        endTime: data.endTime ? new Date(data.endTime) : undefined,
        durationMinutes: data.durationMinutes,
        maxParticipants: data.maxParticipants,
        imageUrl: data.imageUrl,
      },
      include: {
        course: { select: { id: true, title: true } }
      }
    });
  }

  async deleteHackathon(id: string) {
    return prisma.hackathon.delete({ where: { id } });
  }

  // ============ Projects / Final Projects (Admin) ============
  async getAllProjects() {
    return prisma.project.findMany({
      include: {
        course: {
          select: { id: true, title: true }
        },
        _count: {
          select: { submissions: true }
        }
      },
      orderBy: { id: 'desc' }
    });
  }

  async getProjectById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        course: true,
        submissions: {
          include: {
            user: { select: { id: true, fullName: true, email: true } }
          },
          orderBy: { submittedAt: 'desc' }
        }
      }
    });
  }

  async createProject(data: { courseId: string; title: string; description?: string }) {
    return prisma.project.create({
      data: {
        courseId: data.courseId,
        title: data.title,
        description: data.description || '',
      },
      include: {
        course: { select: { id: true, title: true } }
      }
    });
  }

  async updateProject(id: string, data: any) {
    return prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        fileUrl: data.fileUrl,
      },
      include: {
        course: { select: { id: true, title: true } },
        submissions: {
          include: {
            user: { select: { id: true, fullName: true, email: true } }
          }
        }
      }
    });
  }

  async deleteProject(id: string) {
    return prisma.project.delete({ where: { id } });
  }

  async approveProjectSubmission(submissionId: string) {
    return prisma.projectSubmission.update({
      where: { id: submissionId },
      data: { status: 'approved' },
      include: {
        user: { select: { id: true, fullName: true, email: true } }
      }
    });
  }

  async rejectProjectSubmission(submissionId: string, reason?: string) {
    return prisma.projectSubmission.update({
      where: { id: submissionId },
      data: {
        status: 'rejected',
        reviewNote: reason
      },
      include: {
        user: { select: { id: true, fullName: true, email: true } }
      }
    });
  }

  // ============ Lesson Requests (Admin duyệt) ============
  async getLessonRequestById(id: string) {
    return prisma.lessonRequest.findUnique({
      where: { id },
      include: {
        lecture: { select: { id: true, fullName: true, email: true } },
        lesson: {
          include: {
            phase: {
              include: {
                course: { select: { id: true, title: true } }
              }
            }
          }
        },
      },
    });
  }

  async getAllLessonRequests() {
    return prisma.lessonRequest.findMany({
      include: {
        lecture: { select: { id: true, fullName: true, email: true } },
        lesson: {
          include: {
            phase: {
              include: {
                course: { select: { id: true, title: true } }
              }
            }
          }
        },
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async deleteLessonRequest(id: string) {
    return prisma.lessonRequest.delete({ where: { id } });
  }

  async approveLessonRequest(id: string) {
    return prisma.lessonRequest.update({
      where: { id },
      data: {
        status: 'APPROVED' as any,
      },
      include: {
        lesson: true,
        lecture: { select: { id: true, fullName: true, email: true } },
      }
    });
  }

  async rejectLessonRequest(id: string, reason?: string) {
    return prisma.lessonRequest.update({
      where: { id },
      data: {
        status: 'REJECTED' as any,
      },
      include: {
        lesson: true,
        lecture: { select: { id: true, fullName: true, email: true } },
      }
    });
  }

  // ============ Minitest Submissions Stats (Admin) ============
  async getMinitestStats() {
    // Get all minitests with their submission counts
    const minitests = await prisma.minitest.findMany({
      include: {
        phase: {
          include: {
            course: { select: { id: true, title: true } }
          }
        },
        questions: {
          select: { id: true }
        },
        submissions: {
          select: {
            id: true,
            score: true,
            userId: true,
            createdAt: true
          }
        }
      }
    });

    // Calculate stats for each minitest
    // Assume passing score is 50% of total possible score
    const stats = minitests.map(minitest => {
      const totalSubmissions = minitest.submissions.length;
      const uniqueUsers = new Set(minitest.submissions.map(s => s.userId)).size;
      // Pass if score >= 50 (assuming 100 total points)
      const passedSubmissions = minitest.submissions.filter(s => s.score >= 50).length;
      const completionRate = totalSubmissions > 0 ? Math.round((passedSubmissions / totalSubmissions) * 100) : 0;
      
      // Get average score from submissions with scores
      const submissionsWithScores = minitest.submissions.filter(s => s.score !== null && s.score !== undefined);
      const avgScore = submissionsWithScores.length > 0
        ? Math.round(submissionsWithScores.reduce((sum, s) => sum + (s.score || 0), 0) / submissionsWithScores.length)
        : 0;

      return {
        id: minitest.id,
        title: minitest.title,
        phase: minitest.phase,
        questionCount: minitest.questions.length,
        totalSubmissions,
        uniqueUsers,
        passedSubmissions,
        completionRate,
        avgScore,
        recentSubmissions: minitest.submissions.slice(0, 5).map(s => ({
          id: s.id,
          score: s.score,
          status: s.score >= 50 ? 'PASSED' : 'FAILED',
          submittedAt: s.createdAt
        }))
      };
    });

    return stats;
  }

  async getMinitestSubmissions(minitestId: string) {
    const submissions = await prisma.minitestSubmission.findMany({
      where: { minitestId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            email: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Map to include status and submittedAt for frontend compatibility
    return submissions.map(s => ({
      ...s,
      status: s.score >= 50 ? 'PASSED' : 'FAILED',
      submittedAt: s.createdAt
    }));
  }
}

export default new AdminRepository();
