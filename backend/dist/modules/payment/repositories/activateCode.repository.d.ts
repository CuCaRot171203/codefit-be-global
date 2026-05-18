/**
 * @fileoverview Repository layer cho ActivateCode module
 * Xử lý các thao tác database liên quan đến ActivateCode
 * @module activateCode/repositories
 */
import { Prisma } from '@prisma/client';
declare class ActivateCodeRepository {
    /**
     * Tạo activate code mới
     */
    create(data: Prisma.ActivateCodeCreateInput): Promise<{
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
    /**
     * Tìm activate code theo code string
     */
    findByCode(code: string): Promise<({
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
        courseId: string;
        type: import(".prisma/client").$Enums.CodeType;
        code: string;
        createdBy: string | null;
        usedBy: string | null;
        usedAt: Date | null;
        isUsed: boolean;
        expiresAt: Date | null;
    }) | null>;
    /**
     * Tìm activate codes theo course ID
     */
    findByCourseId(courseId: string): Promise<{
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
    }[]>;
    /**
     * Tìm activate codes của một user đã sử dụng
     */
    findByUserId(userId: string): Promise<({
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
        courseId: string;
        type: import(".prisma/client").$Enums.CodeType;
        code: string;
        createdBy: string | null;
        usedBy: string | null;
        usedAt: Date | null;
        isUsed: boolean;
        expiresAt: Date | null;
    })[]>;
    /**
     * Đánh dấu activate code đã sử dụng
     */
    markAsUsed(code: string, userId: string): Promise<{
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
    /**
     * Xóa activate code
     */
    delete(id: string): Promise<{
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
}
declare const _default: ActivateCodeRepository;
export default _default;
//# sourceMappingURL=activateCode.repository.d.ts.map