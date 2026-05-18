/*
  Warnings:

  - The primary key for the `submission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `language` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `problemId` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `submission` DROP PRIMARY KEY,
    ADD COLUMN `language` VARCHAR(191) NOT NULL,
    ADD COLUMN `memory` INTEGER NULL,
    ADD COLUMN `problemId` VARCHAR(191) NOT NULL,
    ADD COLUMN `runtime` INTEGER NULL,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `code` LONGTEXT NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    ADD COLUMN `avatar` VARCHAR(191) NULL,
    ADD COLUMN `bio` VARCHAR(191) NULL,
    ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'user',
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `UserSession` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expiredAt` DATETIME(3) NOT NULL,

    INDEX `UserSession_userId_idx`(`userId`),
    INDEX `UserSession_token_idx`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Course` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL DEFAULT 0,
    `level` VARCHAR(191) NOT NULL,
    `creatorId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Enrollment` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `progress` DOUBLE NOT NULL DEFAULT 0,
    `coachId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Enrollment_userId_idx`(`userId`),
    INDEX `Enrollment_courseId_idx`(`courseId`),
    INDEX `Enrollment_coachId_idx`(`coachId`),
    UNIQUE INDEX `Enrollment_userId_courseId_key`(`userId`, `courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Phase` (
    `id` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `orderIndex` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lesson` (
    `id` VARCHAR(191) NOT NULL,
    `phaseId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `orderIndex` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Problem` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NOT NULL,
    `difficulty` VARCHAR(191) NOT NULL,
    `timeLimit` INTEGER NOT NULL DEFAULT 1000,
    `memoryLimit` INTEGER NOT NULL DEFAULT 256,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Testcase` (
    `id` VARCHAR(191) NOT NULL,
    `problemId` VARCHAR(191) NOT NULL,
    `input` LONGTEXT NOT NULL,
    `expectedOutput` LONGTEXT NOT NULL,
    `isPublic` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubmissionResult` (
    `id` VARCHAR(191) NOT NULL,
    `submissionId` VARCHAR(191) NOT NULL,
    `testcaseId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `runtime` INTEGER NULL,

    INDEX `SubmissionResult_submissionId_idx`(`submissionId`),
    INDEX `SubmissionResult_testcaseId_idx`(`testcaseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Progress` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `score` DOUBLE NOT NULL DEFAULT 0,
    `completedLessons` INTEGER NOT NULL DEFAULT 0,

    INDEX `Progress_userId_idx`(`userId`),
    INDEX `Progress_courseId_idx`(`courseId`),
    UNIQUE INDEX `Progress_userId_courseId_key`(`userId`, `courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LessonProgress` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `lessonId` VARCHAR(191) NOT NULL,
    `isCompleted` BOOLEAN NOT NULL DEFAULT false,
    `completedAt` DATETIME(3) NULL,

    INDEX `LessonProgress_userId_idx`(`userId`),
    INDEX `LessonProgress_lessonId_idx`(`lessonId`),
    UNIQUE INDEX `LessonProgress_userId_lessonId_key`(`userId`, `lessonId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Minitest` (
    `id` VARCHAR(191) NOT NULL,
    `phaseId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MinitestQuestion` (
    `id` VARCHAR(191) NOT NULL,
    `minitestId` VARCHAR(191) NOT NULL,
    `problemId` VARCHAR(191) NOT NULL,

    INDEX `MinitestQuestion_minitestId_idx`(`minitestId`),
    INDEX `MinitestQuestion_problemId_idx`(`problemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MinitestSubmission` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `minitestId` VARCHAR(191) NOT NULL,
    `score` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `MinitestSubmission_userId_idx`(`userId`),
    INDEX `MinitestSubmission_minitestId_idx`(`minitestId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Hackathon` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HackathonParticipant` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `hackathonId` VARCHAR(191) NOT NULL,
    `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `HackathonParticipant_userId_idx`(`userId`),
    INDEX `HackathonParticipant_hackathonId_idx`(`hackathonId`),
    UNIQUE INDEX `HackathonParticipant_userId_hackathonId_key`(`userId`, `hackathonId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HackathonSubmission` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `hackathonId` VARCHAR(191) NOT NULL,
    `problemId` VARCHAR(191) NOT NULL,
    `score` DOUBLE NOT NULL,
    `submittedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `HackathonSubmission_userId_idx`(`userId`),
    INDEX `HackathonSubmission_hackathonId_idx`(`hackathonId`),
    INDEX `HackathonSubmission_problemId_idx`(`problemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project` (
    `id` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectSubmission` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `submittedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ProjectSubmission_userId_idx`(`userId`),
    INDEX `ProjectSubmission_projectId_idx`(`projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Certificate` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `issuedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Certificate_userId_idx`(`userId`),
    INDEX `Certificate_courseId_idx`(`courseId`),
    UNIQUE INDEX `Certificate_userId_courseId_key`(`userId`, `courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserStats` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `score` DOUBLE NOT NULL DEFAULT 0,
    `frequency` INTEGER NOT NULL DEFAULT 0,
    `rank` INTEGER NULL,

    INDEX `UserStats_userId_idx`(`userId`),
    INDEX `UserStats_rank_idx`(`rank`),
    UNIQUE INDEX `UserStats_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Feedback` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `message` LONGTEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Feedback_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Notification_userId_idx`(`userId`),
    INDEX `Notification_type_idx`(`type`),
    INDEX `Notification_isRead_idx`(`isRead`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NotificationTarget` (
    `id` VARCHAR(191) NOT NULL,
    `notificationId` VARCHAR(191) NOT NULL,
    `targetType` VARCHAR(191) NOT NULL,
    `targetId` VARCHAR(191) NOT NULL,

    INDEX `NotificationTarget_notificationId_idx`(`notificationId`),
    INDEX `NotificationTarget_targetType_targetId_idx`(`targetType`, `targetId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AIRequest` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `prompt` LONGTEXT NOT NULL,
    `response` LONGTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AIRequest_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Submission_userId_idx` ON `Submission`(`userId`);

-- CreateIndex
CREATE INDEX `Submission_problemId_idx` ON `Submission`(`problemId`);

-- CreateIndex
CREATE INDEX `Submission_status_idx` ON `Submission`(`status`);

-- CreateIndex
CREATE INDEX `Submission_createdAt_idx` ON `Submission`(`createdAt`);

-- AddForeignKey
ALTER TABLE `UserSession` ADD CONSTRAINT `UserSession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Course` ADD CONSTRAINT `Course_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_coachId_fkey` FOREIGN KEY (`coachId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Phase` ADD CONSTRAINT `Phase_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_phaseId_fkey` FOREIGN KEY (`phaseId`) REFERENCES `Phase`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Testcase` ADD CONSTRAINT `Testcase_problemId_fkey` FOREIGN KEY (`problemId`) REFERENCES `Problem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Submission` ADD CONSTRAINT `Submission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Submission` ADD CONSTRAINT `Submission_problemId_fkey` FOREIGN KEY (`problemId`) REFERENCES `Problem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubmissionResult` ADD CONSTRAINT `SubmissionResult_submissionId_fkey` FOREIGN KEY (`submissionId`) REFERENCES `Submission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubmissionResult` ADD CONSTRAINT `SubmissionResult_testcaseId_fkey` FOREIGN KEY (`testcaseId`) REFERENCES `Testcase`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Progress` ADD CONSTRAINT `Progress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Progress` ADD CONSTRAINT `Progress_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LessonProgress` ADD CONSTRAINT `LessonProgress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LessonProgress` ADD CONSTRAINT `LessonProgress_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `Lesson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Minitest` ADD CONSTRAINT `Minitest_phaseId_fkey` FOREIGN KEY (`phaseId`) REFERENCES `Phase`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MinitestQuestion` ADD CONSTRAINT `MinitestQuestion_minitestId_fkey` FOREIGN KEY (`minitestId`) REFERENCES `Minitest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MinitestQuestion` ADD CONSTRAINT `MinitestQuestion_problemId_fkey` FOREIGN KEY (`problemId`) REFERENCES `Problem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MinitestSubmission` ADD CONSTRAINT `MinitestSubmission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MinitestSubmission` ADD CONSTRAINT `MinitestSubmission_minitestId_fkey` FOREIGN KEY (`minitestId`) REFERENCES `Minitest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HackathonParticipant` ADD CONSTRAINT `HackathonParticipant_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HackathonParticipant` ADD CONSTRAINT `HackathonParticipant_hackathonId_fkey` FOREIGN KEY (`hackathonId`) REFERENCES `Hackathon`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HackathonSubmission` ADD CONSTRAINT `HackathonSubmission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HackathonSubmission` ADD CONSTRAINT `HackathonSubmission_hackathonId_fkey` FOREIGN KEY (`hackathonId`) REFERENCES `Hackathon`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HackathonSubmission` ADD CONSTRAINT `HackathonSubmission_problemId_fkey` FOREIGN KEY (`problemId`) REFERENCES `Problem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectSubmission` ADD CONSTRAINT `ProjectSubmission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectSubmission` ADD CONSTRAINT `ProjectSubmission_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Certificate` ADD CONSTRAINT `Certificate_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Certificate` ADD CONSTRAINT `Certificate_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserStats` ADD CONSTRAINT `UserStats_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Feedback` ADD CONSTRAINT `Feedback_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationTarget` ADD CONSTRAINT `NotificationTarget_notificationId_fkey` FOREIGN KEY (`notificationId`) REFERENCES `Notification`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AIRequest` ADD CONSTRAINT `AIRequest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
