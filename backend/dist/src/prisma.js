"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
/**
 * Prisma Client Instance
 * Singleton instance của PrismaClient để tái sử dụng connection
 */
const prisma = new client_1.PrismaClient();
exports.default = prisma;
//# sourceMappingURL=prisma.js.map