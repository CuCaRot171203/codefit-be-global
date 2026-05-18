/*
  Warnings:

  - Added the required column `updatedAt` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `course` ADD COLUMN `autoEnrollOnApproval` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `subscriptionPrice` DOUBLE NULL,
    ADD COLUMN `subscriptionType` ENUM('FREE', 'PREMIUM', 'BOTH') NOT NULL DEFAULT 'FREE';

-- AlterTable
ALTER TABLE `lesson` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `isPublished` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `publishedAt` DATETIME(3) NULL,
    ADD COLUMN `status` ENUM('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE `LessonRequest` (
    `id` VARCHAR(191) NOT NULL,
    `lessonId` VARCHAR(191) NOT NULL,
    `lectureId` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'IN_PROGRESS', 'SUBMITTED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `dueDate` DATETIME(3) NULL,
    `notes` LONGTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `LessonRequest_lectureId_idx`(`lectureId`),
    INDEX `LessonRequest_lessonId_idx`(`lessonId`),
    INDEX `LessonRequest_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LessonContent` (
    `id` VARCHAR(191) NOT NULL,
    `lessonId` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NULL,
    `testCases` LONGTEXT NULL,
    `hints` LONGTEXT NULL,
    `timeLimit` INTEGER NULL,
    `memoryLimit` INTEGER NULL,
    `starterCode` LONGTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `LessonContent_lessonId_key`(`lessonId`),
    INDEX `LessonContent_lessonId_idx`(`lessonId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LessonReview` (
    `id` VARCHAR(191) NOT NULL,
    `lessonId` VARCHAR(191) NOT NULL,
    `adminId` VARCHAR(191) NOT NULL,
    `status` ENUM('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'PENDING_REVIEW',
    `feedback` LONGTEXT NULL,
    `reviewedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `LessonReview_lessonId_key`(`lessonId`),
    INDEX `LessonReview_adminId_idx`(`adminId`),
    INDEX `LessonReview_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ScoringConfig` (
    `id` VARCHAR(191) NOT NULL,
    `lessonId` VARCHAR(191) NOT NULL,
    `baseScore` INTEGER NOT NULL DEFAULT 100,
    `penaltyPerHint` INTEGER NOT NULL DEFAULT 10,
    `timeBonusEnabled` BOOLEAN NOT NULL DEFAULT false,
    `timeBonusThreshold` INTEGER NULL,
    `timeBonusValue` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ScoringConfig_lessonId_key`(`lessonId`),
    INDEX `ScoringConfig_lessonId_idx`(`lessonId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LessonSubmission` (
    `id` VARCHAR(191) NOT NULL,
    `lessonId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `code` LONGTEXT NOT NULL,
    `language` VARCHAR(191) NOT NULL DEFAULT 'javascript',
    `score` INTEGER NULL,
    `passedTests` INTEGER NULL,
    `totalTests` INTEGER NULL,
    `hintsUsed` INTEGER NOT NULL DEFAULT 0,
    `timeUsed` INTEGER NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `result` LONGTEXT NULL,
    `reviewedAt` DATETIME(3) NULL,
    `reviewedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `LessonSubmission_lessonId_idx`(`lessonId`),
    INDEX `LessonSubmission_userId_idx`(`userId`),
    INDEX `LessonSubmission_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LectureCourse` (
    `id` VARCHAR(191) NOT NULL,
    `lectureId` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `assignedBy` VARCHAR(191) NULL,

    INDEX `LectureCourse_lectureId_idx`(`lectureId`),
    INDEX `LectureCourse_courseId_idx`(`courseId`),
    UNIQUE INDEX `LectureCourse_lectureId_courseId_key`(`lectureId`, `courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CourseSubscription` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'SUSPENDED', 'EXPIRED') NOT NULL DEFAULT 'ACTIVE',
    `expiresAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `CourseSubscription_userId_idx`(`userId`),
    INDEX `CourseSubscription_courseId_idx`(`courseId`),
    INDEX `CourseSubscription_status_idx`(`status`),
    UNIQUE INDEX `CourseSubscription_userId_courseId_key`(`userId`, `courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LessonRequest` ADD CONSTRAINT `LessonRequest_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `Lesson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LessonRequest` ADD CONSTRAINT `LessonRequest_lectureId_fkey` FOREIGN KEY (`lectureId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LessonContent` ADD CONSTRAINT `LessonContent_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `Lesson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LessonReview` ADD CONSTRAINT `LessonReview_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `Lesson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LessonReview` ADD CONSTRAINT `LessonReview_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ScoringConfig` ADD CONSTRAINT `ScoringConfig_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `Lesson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LessonSubmission` ADD CONSTRAINT `LessonSubmission_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `Lesson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LessonSubmission` ADD CONSTRAINT `LessonSubmission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LectureCourse` ADD CONSTRAINT `LectureCourse_lectureId_fkey` FOREIGN KEY (`lectureId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LectureCourse` ADD CONSTRAINT `LectureCourse_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseSubscription` ADD CONSTRAINT `CourseSubscription_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseSubscription` ADD CONSTRAINT `CourseSubscription_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
