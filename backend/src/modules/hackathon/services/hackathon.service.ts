/**
 * Service xử lý business logic liên quan đến Hackathon
 * @module HackathonService
 */

import { BaseService } from '../../../base/base.service';
import hackathonRepository from '../repositories/hackathon.repository';
import hackathonParticipantRepository from '../repositories/hackathonParticipant.repository';
import hackathonSubmissionRepository from '../repositories/hackathonSubmission.repository';
import notificationService from '../../notification/services/notification.service';
import emailService from '../../email/email.service';
import scoringService from '../../scoring/services/scoring.service';
import problemRepository from '../../problem/repositories/problem.repository';
import { CreateHackathonDto, SubmitProjectDto } from '../types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Service class xử lý các nghiệp vụ liên quan đến hackathon
 * Kế thừa từ BaseService để sử dụng các phương thức CRUD cơ bản
 * @class HackathonService
 */
class HackathonService extends BaseService<typeof hackathonRepository> {

  constructor() {
    super(hackathonRepository);
  }

  /**
   * Tạo mới một hackathon
   * @param createdBy - ID của người tạo hackathon
   * @param dto - Dữ liệu tạo hackathon (title, description, startDate, endDate)
   * @returns Promise<any> Hackathon đã được tạo
   * @throws Error nếu thiếu các trường bắt buộc
   */
  async create(createdBy: string, dto: CreateHackathonDto): Promise<any> {
    // Bước 1: Validate các trường bắt buộc
    if (!dto.title || !dto.startDate || !dto.endDate) {
      throw new Error('Title, startDate, and endDate are required');
    }

    // Bước 2: Tạo bản ghi hackathon mới với status mặc định là 'upcoming'
    // Bước 3: Gọi repository để lưu vào database
    return this.repository.create({
      title: dto.title,
      description: dto.description,
      startDate: dto.startDate,
      endDate: dto.endDate,
      status: 'upcoming',
      createdBy
    } as any);
  }

  /**
   * Lấy thông tin hackathon theo ID
   * @param id - ID của hackathon cần lấy
   * @returns Promise<any | null> Hackathon hoặc null nếu không tìm thấy
   */
  async getById(id: string): Promise<any | null> {
    return this.repository.findById(id);
  }

  /**
   * Lấy danh sách hackathon đang diễn ra
   * @returns Promise<any[]> Danh sách hackathon active
   */
  async getActive(): Promise<any[]> {
    return this.repository.findActive();
  }

  /**
   * Lấy danh sách hackathon sắp diễn ra
   * @returns Promise<any[]> Danh sách hackathon upcoming
   */
  async getUpcoming(): Promise<any[]> {
    return this.repository.findUpcoming();
  }

  /**
   * Lấy danh sách hackathon đã kết thúc
   * @returns Promise<any[]> Danh sách hackathon đã kết thúc
   */
  async getEnded(): Promise<any[]> {
    return this.repository.findEnded();
  }

  /**
   * Lấy danh sách hackathon đã đăng ký của một user
   * @param userId - ID của người dùng
   * @returns Promise<any[]> Danh sách hackathon đã đăng ký
   */
  async getRegistered(userId: string): Promise<any[]> {
    return this.repository.findRegisteredByUser(userId);
  }

  /**
   * Lấy bảng xếp hạng của một hackathon
   * @param hackathonId - ID của hackathon
   * @param currentUserId - ID của user hiện tại (để highlight)
   * @returns Promise<any> Bảng xếp hạng
   */
  async getLeaderboard(hackathonId: string, currentUserId?: string): Promise<any> {
    return this.repository.getLeaderboardData(hackathonId, currentUserId);
  }

  /**
   * Lấy danh sách tất cả hackathon
   * @returns Promise<any[]> Danh sách tất cả hackathon
   */
  async getAll(): Promise<any[]> {
    return this.repository.findMany();
  }

  /**
   * Xử lý tham gia hackathon của một người dùng
   * @param hackathonId - ID của hackathon muốn tham gia
   * @param userId - ID của người dùng
   * @param teamName - Tên nhóm (tùy chọn)
   * @returns Promise<any> Bản ghi tham gia
   * @throws Error nếu hackathon không tồn tại hoặc đã tham gia
   */
  async join(hackathonId: string, userId: string, teamName?: string): Promise<any> {
    // Bước 1: Kiểm tra hackathon có tồn tại không
    const hackathon = await this.repository.findById(hackathonId);
    if (!hackathon) {
      throw new Error('Hackathon not found');
    }

    // Bước 2: Chỉ cho phép đăng ký khi hackathon đang diễn ra
    const now = new Date();
    const start = new Date(hackathon.startDate || hackathon.startTime);
    const end = new Date(hackathon.endDate || hackathon.endTime);
    if (now < start) {
      throw new Error('Hackathon has not started yet');
    }
    if (now > end) {
      throw new Error('Hackathon has already ended');
    }

    // Bước 3: Kiểm tra user đã tham gia hackathon này chưa
    const existing = await hackathonParticipantRepository.findByHackathonAndUser(hackathonId, userId);
    if (existing) {
      throw new Error('Already joined this hackathon');
    }

    // Bước 4: Kiểm tra số lượng người tham gia
    const currentParticipants = await hackathonParticipantRepository.findByHackathonId(hackathonId);
    const maxParticipants = hackathon.maxParticipants || 100;
    if (currentParticipants.length >= maxParticipants) {
      throw new Error('Hackathon is full');
    }

    // Bước 5: Tạo bản ghi tham gia mới
    const participant = await hackathonParticipantRepository.create({
      hackathonId,
      userId,
      joinedAt: new Date()
    });

    // Bước 6: Gửi notification và email xác nhận đăng ký
    try {
      await notificationService.createHackathonJoinedNotification(
        userId,
        hackathon.title,
        hackathonId
      );

      // Lấy email của user để gửi email
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, fullName: true }
      });
      if (user?.email) {
        await emailService.sendHackathonJoined(
          user.email,
          user.fullName || 'User',
          hackathon.title
        );
      }
    } catch (notifError) {
      console.error('Failed to send hackathon joined notification:', notifError);
    }

    return participant;
  }

  /**
   * Lấy danh sách người tham gia của một hackathon
   * @param hackathonId - ID của hackathon
   * @returns Promise<any[]> Danh sách người tham gia
   */
  async getParticipants(hackathonId: string): Promise<any[]> {
    return hackathonParticipantRepository.findByHackathonId(hackathonId);
  }

  /**
   * Xử lý nộp dự án tham gia hackathon
   * @param hackathonId - ID của hackathon
   * @param userId - ID của người nộp
   * @param dto - Dữ liệu bài nộp (projectTitle, description, repositoryUrl, demoUrl)
   * @returns Promise<any> Bài nộp đã được tạo
   * @throws Error nếu hackathon không tồn tại hoặc user chưa tham gia
   */
  async submitProject(hackathonId: string, userId: string, dto: SubmitProjectDto): Promise<any> {
    // Bước 1: Kiểm tra hackathon có tồn tại không
    const hackathon = await this.repository.findById(hackathonId);
    if (!hackathon) {
      throw new Error('Hackathon not found');
    }

    // Bước 2: Chỉ cho phép nộp bài khi hackathon đang diễn ra
    const now = new Date();
    const start = new Date(hackathon.startDate || hackathon.startTime);
    const end = new Date(hackathon.endDate || hackathon.endTime);
    if (now < start) {
      throw new Error('Hackathon has not started yet');
    }
    if (now > end) {
      throw new Error('Hackathon has already ended');
    }

    // Bước 3: Kiểm tra user đã tham gia hackathon chưa
    const participant = await hackathonParticipantRepository.findByHackathonAndUser(hackathonId, userId);
    if (!participant) {
      throw new Error('Must join hackathon before submitting');
    }

    // Bước 4: Tạo bài nộp mới
    return hackathonSubmissionRepository.create({
      hackathonId,
      userId,
      projectTitle: dto.projectTitle,
      description: dto.description,
      repositoryUrl: dto.repositoryUrl,
      demoUrl: dto.demoUrl || null,
      score: null,
      submittedAt: new Date()
    });
  }

  /**
   * Lấy danh sách bài nộp của một hackathon
   * @param hackathonId - ID của hackathon
   * @returns Promise<any[]> Danh sách bài nộp
   */
  async getSubmissions(hackathonId: string): Promise<any[]> {
    return hackathonSubmissionRepository.findByHackathonId(hackathonId);
  }

  /**
   * Lấy danh sách bài nộp của một người dùng
   * @param userId - ID của người dùng
   * @returns Promise<any[]> Danh sách bài nộp
   */
  async getMySubmissions(userId: string): Promise<any[]> {
    return hackathonSubmissionRepository.findByUserId(userId);
  }

  /**
   * Chấm điểm một bài nộp
   * @param submissionId - ID của bài nộp cần chấm
   * @param score - Điểm số (0-100)
   * @returns Promise<any> Bài nộp đã được cập nhật
   * @throws Error nếu điểm không nằm trong khoảng 0-100
   */
  async gradeSubmission(submissionId: string, score: number): Promise<any> {
    // Bước 1: Validate điểm số nằm trong khoảng 0-100
    if (score < 0 || score > 100) {
      throw new Error('Score must be between 0 and 100');
    }

    // Bước 2: Gọi repository để cập nhật điểm
    return hackathonSubmissionRepository.updateScore(submissionId, score);
  }

  /**
   * Lấy danh sách bài problem của hackathon
   * @param hackathonId - ID của hackathon
   * @param userId - ID của user
   * @returns Danh sách problems + submissions của user
   */
  async getProblems(hackathonId: string, userId: string): Promise<any> {
    const hackathon = await this.repository.findById(hackathonId);
    if (!hackathon) {
      throw new Error('Hackathon not found');
    }

    // Kiểm tra user đã tham gia chưa
    const participant = await hackathonParticipantRepository.findByHackathonAndUser(hackathonId, userId);
    if (!participant) {
      throw new Error('You must join the hackathon first');
    }

    // Lấy lessonIds từ hackathon (JSON array string)
    let problemIds: string[] = [];
    if (hackathon.lessonIds) {
      try {
        problemIds = JSON.parse(hackathon.lessonIds);
      } catch { problemIds = []; }
    }

    if (problemIds.length === 0) {
      return { problems: [], submissions: [] };
    }

    // Lấy thông tin problems
    const problems = await prisma.problem.findMany({
      where: { id: { in: problemIds } },
      select: { id: true, title: true, description: true, difficulty: true, timeLimit: true }
    });

    // Lấy submissions của user cho các bài này
    const submissions = await prisma.lessonSubmission.findMany({
      where: {
        userId,
        lessonId: { in: problemIds }
      },
      orderBy: { createdAt: 'desc' }
    });

    return { problems, submissions };
  }

  /**
   * Chạy code bài trong hackathon (preview, không lưu)
   * @param hackathonId - ID của hackathon
   * @param userId - ID của user
   * @param problemId - ID của bài
   * @param code - Code của user
   * @param language - Ngôn ngữ lập trình
   */
  async runProblem(hackathonId: string, userId: string, problemId: string, code: string, language: string): Promise<any> {
    const hackathon = await this.repository.findById(hackathonId);
    if (!hackathon) throw new Error('Hackathon not found');

    const now = new Date();
    const start = new Date(hackathon.startTime);
    const end = new Date(hackathon.endTime);
    if (now < start) throw new Error('Hackathon has not started yet');
    if (now > end) throw new Error('Hackathon has already ended');

    const participant = await hackathonParticipantRepository.findByHackathonAndUser(hackathonId, userId);
    if (!participant) throw new Error('You must join the hackathon first');

    // Chạy scoring service
    const results = await scoringService.runCode(problemId, code, language || 'javascript');
    return results;
  }

  /**
   * Nộp code bài trong hackathon (chấm điểm + lưu vào HackathonSubmission)
   * @param hackathonId - ID của hackathon
   * @param userId - ID của user
   * @param problemId - ID của bài
   * @param code - Code của user
   * @param language - Ngôn ngữ lập trình
   */
  async submitProblem(hackathonId: string, userId: string, problemId: string, code: string, language: string): Promise<any> {
    const hackathon = await this.repository.findById(hackathonId);
    if (!hackathon) throw new Error('Hackathon not found');

    const now = new Date();
    const start = new Date(hackathon.startTime);
    const end = new Date(hackathon.endTime);
    if (now < start) throw new Error('Hackathon has not started yet');
    if (now > end) throw new Error('Hackathon has already ended');

    const participant = await hackathonParticipantRepository.findByHackathonAndUser(hackathonId, userId);
    if (!participant) throw new Error('You must join the hackathon first');

    // Chấm điểm bằng scoring service
    const { score, passedTests, totalTests } = await scoringService.calculateScore(problemId, code, language || 'javascript');

    // Lưu vào HackathonSubmission
    const submission = await hackathonSubmissionRepository.create({
      hackathonId,
      userId,
      problemId,
      score,
      submittedAt: new Date()
    });

    // Cập nhật điểm cao nhất vào LessonSubmission
    const existingLessonSubmission = await prisma.lessonSubmission.findFirst({
      where: { lessonId: problemId, userId }
    });

    if (!existingLessonSubmission || (existingLessonSubmission.score ?? 0) < score) {
      await prisma.lessonSubmission.upsert({
        where: { id: existingLessonSubmission?.id || 'dummy' },
        create: {
          lessonId: problemId,
          userId,
          code,
          language: language || 'javascript',
          score,
          passedTests,
          totalTests,
          hintsUsed: 0,
          status: 'COMPILED',
        },
        update: { code, language: language || 'javascript', score, passedTests, totalTests }
      });
    }

    return {
      ...submission,
      passedTests,
      totalTests,
      allPassed: passedTests === totalTests && totalTests > 0
    };
  }
}

export default new HackathonService();
