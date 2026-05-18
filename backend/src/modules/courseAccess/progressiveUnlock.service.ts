/**
 * Progressive Unlock Service
 * Xử lý logic mở khóa bài học theo tiến độ
 */

import prisma from '../../prisma';

interface UnlockConfig {
  unlockLessonsCount: number;  // Số bài mở mỗi lượt
  unlockByPhase: boolean;       // true = unlock theo phase
}

interface LessonWithIndex {
  id: string;
  phaseIndex: number;
  lessonIndex: number;
  isPublished: boolean;
}

/**
 * Tính số bài học được mở khóa dựa trên progress
 */
export function calculateUnlockedLessons(
  courseConfig: UnlockConfig,
  enrollment: { completedLessons: number; currentUnlocks: number },
  totalLessons: number
): number {
  // Nếu unlockLessonsCount = 0, không giới hạn - tất cả đều mở
  if (courseConfig.unlockLessonsCount === 0) {
    return totalLessons;
  }

  // Tính số bài đã mở = số lượt unlock * số bài mỗi lượt
  const unlockedCount = enrollment.currentUnlocks;

  return Math.min(unlockedCount, totalLessons);
}

/**
 * Kiểm tra xem một bài học có được mở khóa không
 */
export function isLessonUnlocked(
  lesson: LessonWithIndex,
  courseConfig: UnlockConfig,
  enrollment: { completedLessons: number; currentUnlocks: number },
  totalLessons: number
): boolean {
  // Tất cả bài đã publish đều mở nếu unlockLessonsCount = 0
  if (courseConfig.unlockLessonsCount === 0) {
    return lesson.isPublished;
  }

  // Tính số bài đã mở
  const unlockedCount = calculateUnlockedLessons(courseConfig, enrollment, totalLessons);

  // Nếu unlock theo phase
  if (courseConfig.unlockByPhase) {
    // Kiểm tra tất cả bài trong phase trước đó đã hoàn thành chưa
    // Mở phase hiện tại khi phase trước hoàn thành
    return lesson.phaseIndex < Math.floor(enrollment.completedLessons / courseConfig.unlockLessonsCount) + 1;
  }

  // Unlock theo số bài
  // linearIndex là thứ tự tuyến tính của bài học
  const linearIndex = lesson.phaseIndex * 1000 + lesson.lessonIndex; // phase * 1000 + lesson
  
  return linearIndex < unlockedCount && lesson.isPublished;
}

/**
 * Lấy danh sách bài học đã mở khóa cho user
 */
export async function getUnlockedLessons(userId: string, courseId: string): Promise<{
  unlockedLessonIds: string[];
  completedLessonIds: string[];
  canUnlockMinitest: boolean;
  minitestsAvailable: boolean;
}> {
  // Get course config
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      unlockLessonsCount: true,
      unlockByPhase: true,
      phases: {
        orderBy: { orderIndex: 'asc' },
        include: {
          lessons: {
            where: { isPublished: true },
            orderBy: { orderIndex: 'asc' },
            select: { id: true }
          },
          minitests: {
            where: { phase: { courseId } },
            select: { id: true }
          }
        }
      }
    }
  });

  if (!course) {
    throw new Error('Course not found');
  }

  // Get enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId, courseId }
    },
    select: {
      completedLessons: true,
      currentUnlocks: true
    }
  });

  if (!enrollment) {
    throw new Error('Not enrolled');
  }

  // Build flat list of lessons with indices
  const allLessons: { id: string; linearIndex: number }[] = [];
  course.phases.forEach((phase, phaseIndex) => {
    phase.lessons.forEach((lesson, lessonIndex) => {
      allLessons.push({
        id: lesson.id,
        linearIndex: phaseIndex * 1000 + lessonIndex
      });
    });
  });

  const totalLessons = allLessons.length;
  
  // Calculate unlocked count
  let unlockedCount = 0;
  if (course.unlockLessonsCount === 0) {
    unlockedCount = totalLessons;
  } else {
    unlockedCount = enrollment.currentUnlocks;
  }

  // Get completed lessons
  const completedProgress = await prisma.lessonProgress.findMany({
    where: {
      userId,
      isCompleted: true,
      lesson: {
        phase: {
          courseId
        }
      }
    },
    select: { lessonId: true }
  });
  const completedLessonIds = completedProgress.map(p => p.lessonId);

  const unlockedLessonIds = allLessons
    .filter(l => l.linearIndex < unlockedCount)
    .map(l => l.id);

  // Check if can unlock minitest (all lessons completed)
  const canUnlockMinitest = completedLessonIds.length >= totalLessons && totalLessons > 0;
  const minitestsAvailable = course.phases.some(p => p.minitests.length > 0);

  return {
    unlockedLessonIds,
    completedLessonIds,
    canUnlockMinitest,
    minitestsAvailable
  };
}

/**
 * Cập nhật progress và mở khóa thêm bài khi hoàn thành bài
 */
export async function completeLessonAndUnlock(
  userId: string,
  courseId: string,
  lessonId: string
): Promise<{
  newUnlockedCount: number;
  canTakeMinitest: boolean;
  newlyUnlockedLessons: string[];
}> {
  // Get course and enrollment
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      unlockLessonsCount: true,
      unlockByPhase: true,
      phases: {
        orderBy: { orderIndex: 'asc' },
        include: {
          lessons: {
            where: { isPublished: true },
            orderBy: { orderIndex: 'asc' },
            select: { id: true }
          }
        }
      }
    }
  });

  if (!course) {
    throw new Error('Course not found');
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId, courseId }
    }
  });

  if (!enrollment) {
    throw new Error('Not enrolled');
  }

  // Calculate total lessons
  const totalLessons = course.phases.reduce((acc, p) => acc + p.lessons.length, 0);

  // Mark lesson as completed
  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: { userId, lessonId }
    },
    update: {
      isCompleted: true,
      completedAt: new Date()
    },
    create: {
      userId,
      lessonId,
      isCompleted: true,
      completedAt: new Date()
    }
  });

  // Update completed lessons count
  const completedCount = await prisma.lessonProgress.count({
    where: {
      userId,
      isCompleted: true,
      lesson: {
        phase: {
          courseId
        }
      }
    }
  });

  // Check if should unlock more lessons
  let newUnlockedCount = enrollment.currentUnlocks;
  const unlockLessonsCount = course.unlockLessonsCount;
  const minUnlock = unlockLessonsCount === 0 ? totalLessons : unlockLessonsCount;

  // Unlock next batch if completed enough
  // Unlock when: completed >= current_unlocks (first batch ready) OR completed >= previous_batches + 1
  if (unlockLessonsCount === 0) {
    newUnlockedCount = totalLessons;
  } else {
    const completedBatches = Math.floor(completedCount / unlockLessonsCount);
    const newUnlocks = Math.min((completedBatches + 1) * unlockLessonsCount, totalLessons);
    
    if (newUnlocks > newUnlockedCount) {
      newUnlockedCount = newUnlocks;
    }
  }

  // Update enrollment
  await prisma.enrollment.update({
    where: {
      userId_courseId: { userId, courseId }
    },
    data: {
      completedLessons: completedCount,
      currentUnlocks: newUnlockedCount
    }
  });

  // Calculate newly unlocked lessons
  const previouslyUnlocked = enrollment.currentUnlocks;
  const newlyUnlockedLessons: string[] = [];
  
  let currentIndex = 0;
  for (const phase of course.phases) {
    for (const lesson of phase.lessons) {
      if (currentIndex >= previouslyUnlocked && currentIndex < newUnlockedCount) {
        newlyUnlockedLessons.push(lesson.id);
      }
      currentIndex++;
    }
  }

  // Check if can take minitest
  const canTakeMinitest = completedCount >= totalLessons && totalLessons > 0;

  return {
    newUnlockedCount,
    canTakeMinitest,
    newlyUnlockedLessons
  };
}
