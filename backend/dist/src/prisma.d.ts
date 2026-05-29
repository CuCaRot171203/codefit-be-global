import { PrismaClient } from '@prisma/client';
/**
 * Prisma Client Instance
 * Singleton instance của PrismaClient để tái sử dụng connection
 */
declare const prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
export default prisma;
//# sourceMappingURL=prisma.d.ts.map