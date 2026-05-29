-- Add missing Course columns: features and includes
ALTER TABLE `course` ADD COLUMN `features` LONGTEXT NULL;
ALTER TABLE `course` ADD COLUMN `includes` LONGTEXT NULL;

-- Add missing Problem columns
ALTER TABLE `problem` ADD COLUMN `codeTemplate` LONGTEXT NULL;
ALTER TABLE `problem` ADD COLUMN `inputFormat` LONGTEXT NULL;
ALTER TABLE `problem` ADD COLUMN `outputFormat` LONGTEXT NULL;
ALTER TABLE `problem` ADD COLUMN `hackathonId` VARCHAR(191) NULL;
ALTER TABLE `problem` ADD COLUMN `minitestId` VARCHAR(191) NULL;

-- Add missing Hackathon columns
ALTER TABLE `hackathon` ADD COLUMN `courseId` VARCHAR(191) NULL;
ALTER TABLE `hackathon` ADD COLUMN `lessonId` VARCHAR(191) NULL;
ALTER TABLE `hackathon` ADD COLUMN `durationMinutes` INT NOT NULL DEFAULT 120;
ALTER TABLE `hackathon` ADD COLUMN `maxParticipants` INT NOT NULL DEFAULT 100;
ALTER TABLE `hackathon` ADD COLUMN `imageUrl` VARCHAR(191) NULL;
ALTER TABLE `hackathon` ADD COLUMN `lessonIds` LONGTEXT NULL;

-- Add missing UserStats columns
ALTER TABLE `userstats` ADD COLUMN `weeklyScore` DOUBLE NOT NULL DEFAULT 0;
ALTER TABLE `userstats` ADD COLUMN `lastWeekScore` DOUBLE NOT NULL DEFAULT 0;
ALTER TABLE `userstats` ADD COLUMN `lastUpdated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- Add missing Feedback columns (userId, message, createdAt already exist)
-- Note: feedback table uses different column names, check below

-- Create Conversation table (missing entirely)
CREATE TABLE `conversation` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL DEFAULT 'Cuộc trò chuyện mới',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `conversationmessage` (
    `id` VARCHAR(191) NOT NULL,
    `conversationId` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `suggestions` LONGTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Add missing minitest column
ALTER TABLE `minitest` ADD COLUMN `orderIndex` INT NOT NULL DEFAULT 0;

-- Add missing minitestquestion column
ALTER TABLE `minitestquestion` ADD COLUMN `orderIndex` INT NOT NULL DEFAULT 0;

-- Add missing minitestsubmission columns
ALTER TABLE `minitestsubmission` ADD COLUMN `result` LONGTEXT NULL;

-- Add missing project columns
ALTER TABLE `project` ADD COLUMN `imageUrl` LONGTEXT NULL;
ALTER TABLE `project` ADD COLUMN `fileUrl` LONGTEXT NULL;

-- Add missing projectSubmission column
ALTER TABLE `projectsubmission` ADD COLUMN `reviewNote` TEXT NULL;

-- Add missing certificate columns
ALTER TABLE `certificate` ADD COLUMN `courseTitle` VARCHAR(191) NOT NULL DEFAULT 'Khóa học';
ALTER TABLE `certificate` ADD COLUMN `userName` VARCHAR(191) NOT NULL DEFAULT 'Học viên';
ALTER TABLE `certificate` ADD COLUMN `certificateUrl` VARCHAR(191) NULL;

-- Add missing hackathon foreign keys
ALTER TABLE `hackathon` ADD CONSTRAINT `hackathon_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `hackathon` ADD CONSTRAINT `hackathon_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `lesson`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Add missing problem foreign keys
ALTER TABLE `problem` ADD CONSTRAINT `problem_hackathonId_fkey` FOREIGN KEY (`hackathonId`) REFERENCES `hackathon`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `problem` ADD CONSTRAINT `problem_minitestId_fkey` FOREIGN KEY (`minitestId`) REFERENCES `minitest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Add missing conversation foreign keys
ALTER TABLE `conversation` ADD CONSTRAINT `conversation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `conversationmessage` ADD CONSTRAINT `conversationmessage_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `conversation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Add indexes
CREATE INDEX `conversation_userId_idx` ON `conversation`(`userId`);
CREATE INDEX `conversationmessage_conversationId_idx` ON `conversationmessage`(`conversationId`);
CREATE INDEX `problem_hackathonId_idx` ON `problem`(`hackathonId`);
CREATE INDEX `problem_minitestId_idx` ON `problem`(`minitestId`);
CREATE INDEX `hackathon_courseId_idx` ON `hackathon`(`courseId`);
CREATE INDEX `hackathon_lessonId_idx` ON `hackathon`(`lessonId`);

