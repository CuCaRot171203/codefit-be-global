/**
 * Repository layer cho module LessonRequest
 */
import { BaseRepository } from '../../../base/base.repository';
import { LessonRequest, LessonRequestWithDetails } from '../types';
declare class LessonRequestRepository extends BaseRepository<LessonRequest> {
    protected model: import(".prisma/client").Prisma.LessonRequestDelegate<import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAllWithDetails(): Promise<LessonRequestWithDetails[]>;
    findByLectureId(lectureId: string): Promise<LessonRequestWithDetails[]>;
    findByIdWithDetails(id: string): Promise<LessonRequestWithDetails | null>;
    updateStatus(id: string, status: string): Promise<LessonRequest>;
    findLessonById(id: string): Promise<{
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
    } | null>;
    findLectureById(id: string): Promise<({
        role: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        };
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
    findAdmins(): Promise<{
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
    }[]>;
    updateLessonStatus(lessonId: string, status: string): Promise<{
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
    upsertLessonContent(lessonId: string): Promise<{
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
    }>;
    upsertScoringConfig(lessonId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        lessonId: string;
        baseScore: number;
        penaltyPerHint: number;
        timeBonusEnabled: boolean;
        timeBonusThreshold: number | null;
        timeBonusValue: number | null;
    }>;
    findPendingByLectureId(lectureId: string): Promise<LessonRequestWithDetails[]>;
}
declare const _default: LessonRequestRepository;
export default _default;
//# sourceMappingURL=lessonRequest.repository.d.ts.map