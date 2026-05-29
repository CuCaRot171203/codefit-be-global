/**
 * Project Repository
 * 
 * Xử lý các thao tác database cho Project entity.
 * Quản lý việc tạo, đọc và truy vấn các dự án.
 */

import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../../../base/base.repository';
import { Project } from '../types';

const prisma = new PrismaClient();

/**
 * ProjectRepository - Quản lý database operations cho Project
 * @class ProjectRepository
 * @extends BaseRepository<Project>
 */
class ProjectRepository extends BaseRepository<Project> {
  /** Prisma model được sử dụng cho các thao tác database */
  protected model = prisma.project;

  /**
   * Tìm một dự án theo ID với course và submissions
   */
  async findById(id: string): Promise<any | null> {
    return this.model.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        submissions: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
          orderBy: { submittedAt: 'desc' },
        },
      },
    });
  }

  /**
   * Tìm các dự án theo userId
   * @param userId - ID của người dùng
   * @returns Promise<Project[]> - Danh sách dự án của người dùng
   */
  async findByUserId(userId: string): Promise<any[]> {
    const projectSubmissions = await prisma.projectSubmission.findMany({
      where: { userId },
      include: { project: true },
    });
    return projectSubmissions.map(ps => ps.project);
  }

  /**
   * Tìm các dự án theo courseId
   * @param courseId - ID của khóa học
   * @returns Promise<Project[]> - Danh sách dự án của khóa học
   */
  async findByCourseId(courseId: string): Promise<any[]> {
    return this.model.findMany({
      where: { courseId },
    });
  }

  /**
   * Tìm các dự án theo userId và courseId
   * @param userId - ID của người dùng
   * @param courseId - ID của khóa học
   * @returns Promise<Project[]> - Danh sách dự án của người dùng trong khóa học
   */
  async findByUserAndCourse(userId: string, courseId: string): Promise<any[]> {
    const projectSubmissions = await prisma.projectSubmission.findMany({
      where: { userId },
      include: { project: true },
    });
    return projectSubmissions
      .filter(ps => ps.project?.courseId === courseId)
      .map(ps => ps.project)
      .filter(Boolean);
  }

  async createSubmission(data: {
    userId: string;
    projectId: string;
    fileUrl: string;
    fileName?: string;
  }) {
    return prisma.projectSubmission.create({
      data: {
        userId: data.userId,
        projectId: data.projectId,
        fileUrl: data.fileUrl,
        status: 'pending',
      },
      include: {
        project: {
          include: {
            course: { select: { id: true, title: true } },
          },
        },
      },
    });
  }
}

export default new ProjectRepository();
