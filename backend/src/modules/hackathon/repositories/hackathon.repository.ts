/**
 * Repository cho các thao tác CRUD với bảng Hackathon trong database
 * @module HackathonRepository
 */

import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../../../base/base.repository';

/** Khởi tạo PrismaClient để kết nối database */
const prisma = new PrismaClient();

/**
 * Interface định nghĩa cấu trúc dữ liệu Hackathon
 * @interface Hackathon
 */
interface Hackathon {
  id: string;
  courseId: string | null;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  status: string;
  createdBy: string;
  createdAt: Date;
}

/**
 * Repository class xử lý các thao tác với dữ liệu Hackathon
 * Kế thừa từ BaseRepository để sử dụng các phương thức CRUD cơ bản
 * @class HackathonRepository
 * @extends BaseRepository<Hackathon>
 */
class HackathonRepository extends BaseRepository<Hackathon> {
  /** Model Prisma để thao tác với bảng hackathon */
  protected model = prisma.hackathon;

  /**
   * Tìm hackathon theo ID (override để include course)
   */
  async findById(id: string): Promise<any> {
    return this.model.findUnique({
      where: { id },
      include: {
        course: true,
        problems: {
          include: {
            testcases: true
          }
        }
      }
    });
  }

  /**
   * Tìm tất cả các hackathon đang diễn ra (active)
   * Active = ngày bắt đầu <= ngày hiện tại <= ngày kết thúc
   * @returns Promise<Hackathon[]> Danh sách hackathon đang active
   */
  async findActive(): Promise<any[]> {
    const now = new Date();
    return this.model.findMany({
      where: {
        startTime: { lte: now },
        endTime: { gte: now }
      },
      orderBy: { startTime: 'desc' },
      include: {
        _count: {
          select: { participants: true, submissions: true }
        }
      }
    });
  }

  /**
   * Tìm tất cả các hackathon sắp diễn ra (upcoming)
   * Upcoming = ngày bắt đầu > ngày hiện tại
   * @returns Promise<Hackathon[]> Danh sách hackathon sắp diễn ra
   */
  async findUpcoming(): Promise<any[]> {
    // Bước 1: Lấy thời điểm hiện tại
    const now = new Date();

    // Bước 2: Query database với điều kiện startTime > now
    // Bước 3: Sắp xếp kết quả theo startTime tăng dần (sắp tới nhất trước)
    return this.model.findMany({
      where: {
        startTime: { gt: now }
      },
      orderBy: { startTime: 'asc' },
      include: {
        _count: {
          select: { participants: true, submissions: true }
        }
      }
    });
  }

  /**
   * Tìm tất cả các hackathon đã kết thúc (ended)
   * Ended = ngày kết thúc < ngày hiện tại
   * @returns Promise<Hackathon[]> Danh sách hackathon đã kết thúc
   */
  async findEnded(): Promise<any[]> {
    const now = new Date();
    return this.model.findMany({
      where: {
        endTime: { lt: now }
      },
      orderBy: { endTime: 'desc' },
      include: {
        _count: {
          select: { participants: true, submissions: true }
        }
      }
    });
  }

  /**
   * Tìm tất cả hackathon mà user đã đăng ký
   * @param userId - ID của người dùng
   * @returns Promise<any[]> Danh sách hackathon đã đăng ký
   */
  async findRegisteredByUser(userId: string): Promise<any[]> {
    const participants = await prisma.hackathonParticipant.findMany({
      where: { userId },
      include: {
        hackathon: {
          include: {
            _count: {
              select: { participants: true, submissions: true }
            }
          }
        }
      },
      orderBy: { joinedAt: 'desc' }
    });
    return participants.map(p => ({
      ...p.hackathon,
      registeredAt: p.joinedAt,
      isRegistered: true
    }));
  }

  /**
   * Lấy bảng xếp hạng của một hackathon
   * @param hackathonId - ID của hackathon
   * @param currentUserId - ID của user hiện tại (để highlight)
   * @returns Promise<any> Bảng xếp hạng với thông tin participants và submissions
   */
  async getLeaderboardData(hackathonId: string, currentUserId?: string): Promise<any> {
    // Lấy thông tin hackathon
    const hackathon = await this.model.findUnique({
      where: { id: hackathonId }
    });

    if (!hackathon) {
      throw new Error('Hackathon not found');
    }

    // Lấy tất cả submissions của hackathon này
    const submissions = await prisma.hackathonSubmission.findMany({
      where: { hackathonId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatar: true
          }
        }
      },
      orderBy: { score: 'desc' }
    });

    // Group by user và lấy điểm cao nhất
    const userMap = new Map<string, any>();
    for (const sub of submissions) {
      if (!userMap.has(sub.userId)) {
        userMap.set(sub.userId, {
          userId: sub.userId,
          fullName: sub.user.fullName,
          username: sub.user.username,
          avatar: sub.user.avatar,
          totalScore: 0,
          submissions: 0,
          isCurrentUser: sub.userId === currentUserId
        });
      }
      const entry = userMap.get(sub.userId);
      entry.totalScore += sub.score || 0;
      entry.submissions += 1;
    }

    // Tính rank
    const leaderboard = Array.from(userMap.values())
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 50)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));

    // Lấy tất cả participants
    const participants = await prisma.hackathonParticipant.findMany({
      where: { hackathonId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatar: true
          }
        }
      },
      orderBy: { joinedAt: 'desc' }
    });

    const participantCount = participants.length;

    return {
      hackathon: {
        id: hackathon.id,
        title: hackathon.title,
        description: hackathon.description,
        startTime: hackathon.startTime,
        endTime: hackathon.endTime,
        status: hackathon.endTime < new Date() ? 'ended' : (hackathon.startTime > new Date() ? 'upcoming' : 'active')
      },
      participantCount,
      totalSubmissions: submissions.length,
      leaderboard
    };
  }
}

export default new HackathonRepository();
