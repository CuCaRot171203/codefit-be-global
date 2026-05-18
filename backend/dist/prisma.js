import { PrismaClient } from '@prisma/client';
/**
 * Prisma Client Instance
 * Singleton instance của PrismaClient để tái sử dụng connection
 */
const prisma = new PrismaClient();
export default prisma;
//# sourceMappingURL=prisma.js.map