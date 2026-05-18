-- Migration: Fix currentUnlocks for existing enrollments
-- Root cause: Enrollment created before migration have currentUnlocks = 0
-- Fix: Set currentUnlocks = unlockLessonsCount from their course (or 3 as default)

-- Update enrollments with currentUnlocks = 0 to use course's unlockLessonsCount
UPDATE `enrollment` e
INNER JOIN `course` c ON e.`courseId` = c.`id`
SET e.`currentUnlocks` = COALESCE(c.`unlockLessonsCount`, 3)
WHERE e.`currentUnlocks` = 0;

-- Also fix any enrollments where currentUnlocks < unlockLessonsCount (edge case)
UPDATE `enrollment` e
INNER JOIN `course` c ON e.`courseId` = c.`id`
SET e.`currentUnlocks` = COALESCE(c.`unlockLessonsCount`, 3)
WHERE e.`currentUnlocks` < COALESCE(c.`unlockLessonsCount`, 3);
