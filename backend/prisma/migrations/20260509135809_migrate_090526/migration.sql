-- AlterTable
ALTER TABLE `course` ADD COLUMN `unlockByPhase` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `unlockLessonsCount` INTEGER NOT NULL DEFAULT 3;

-- AlterTable
ALTER TABLE `enrollment` ADD COLUMN `completedLessons` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `currentUnlocks` INTEGER NOT NULL DEFAULT 0;
