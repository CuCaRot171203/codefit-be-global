-- AlterTable
ALTER TABLE `user` ADD COLUMN `fullName` VARCHAR(191) NULL,
    ADD COLUMN `isOnboarded` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `learningLevel` VARCHAR(191) NULL,
    ADD COLUMN `referralCode` VARCHAR(191) NULL,
    ADD COLUMN `school` VARCHAR(191) NULL;
