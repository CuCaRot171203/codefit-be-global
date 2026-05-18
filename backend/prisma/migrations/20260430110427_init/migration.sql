/*
  Warnings:

  - You are about to drop the column `role` on the `user` table. All the data in the column will be lost.
  - Added the required column `roleId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `course` ADD COLUMN `duration` VARCHAR(191) NULL,
    ADD COLUMN `image` VARCHAR(191) NULL,
    ADD COLUMN `originalPrice` DOUBLE NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `enrollment` ADD COLUMN `paymentId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `role`,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `roleId` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `roles` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `roles_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `paymentMethod` VARCHAR(191) NOT NULL,
    `paymentStatus` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `payosOrderId` VARCHAR(191) NULL,
    `payosTransactionId` VARCHAR(191) NULL,
    `qrCodeUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completedAt` DATETIME(3) NULL,

    INDEX `Payment_userId_idx`(`userId`),
    INDEX `Payment_courseId_idx`(`courseId`),
    INDEX `Payment_payosOrderId_idx`(`payosOrderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ActivateCode` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NULL,
    `usedBy` VARCHAR(191) NULL,
    `usedAt` DATETIME(3) NULL,
    `isUsed` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NULL,

    UNIQUE INDEX `ActivateCode_code_key`(`code`),
    INDEX `ActivateCode_code_idx`(`code`),
    INDEX `ActivateCode_courseId_idx`(`courseId`),
    INDEX `ActivateCode_usedBy_idx`(`usedBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `User_roleId_idx` ON `User`(`roleId`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivateCode` ADD CONSTRAINT `ActivateCode_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivateCode` ADD CONSTRAINT `ActivateCode_usedBy_fkey` FOREIGN KEY (`usedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
