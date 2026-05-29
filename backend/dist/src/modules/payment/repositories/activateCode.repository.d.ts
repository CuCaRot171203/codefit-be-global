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
        code: string;
        courseId: string;
        type: import(".prisma/client").$Enums.CodeType;
        createdBy: string | null;
        usedAt: Date | null;
        isUsed: boolean;
        expiresAt: Date | null;
        usedBy: string | null;
    }>;
    /**
     * Tìm activate code theo code string
     */
    findByCode(code: string): Promise<({
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
        code: string;
        courseId: string;
        type: import(".prisma/client").$Enums.CodeType;
        createdBy: string | null;
        usedAt: Date | null;
        isUsed: boolean;
        expiresAt: Date | null;
        usedBy: string | null;
    }) | null>;
    /**
     * Tìm activate codes theo course ID
     */
    findByCourseId(courseId: string): Promise<{
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
    }[]>;
    /**
     * Tìm activate codes của một user đã sử dụng
     */
    findByUserId(userId: string): Promise<({
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
        code: string;
        courseId: string;
        type: import(".prisma/client").$Enums.CodeType;
        createdBy: string | null;
        usedAt: Date | null;
        isUsed: boolean;
        expiresAt: Date | null;
        usedBy: string | null;
    })[]>;
    /**
     * Đánh dấu activate code đã sử dụng
     */
    markAsUsed(code: string, userId: string): Promise<{
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
    /**
     * Xóa activate code
     */
    delete(id: string): Promise<{
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
}
declare const _default: ActivateCodeRepository;
export default _default;
//# sourceMappingURL=activateCode.repository.d.ts.map