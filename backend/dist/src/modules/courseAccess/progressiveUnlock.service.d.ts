/**
 * Progressive Unlock Service
 * Xử lý logic mở khóa bài học theo tiến độ
 */
interface UnlockConfig {
    unlockLessonsCount: number;
    unlockByPhase: boolean;
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
export declare function calculateUnlockedLessons(courseConfig: UnlockConfig, enrollment: {
    completedLessons: number;
    currentUnlocks: number;
}, totalLessons: number): number;
/**
 * Kiểm tra xem một bài học có được mở khóa không
 */
export declare function isLessonUnlocked(lesson: LessonWithIndex, courseConfig: UnlockConfig, enrollment: {
    completedLessons: number;
    currentUnlocks: number;
}, totalLessons: number): boolean;
/**
 * Lấy danh sách bài học đã mở khóa cho user
 */
export declare function getUnlockedLessons(userId: string, courseId: string): Promise<{
    unlockedLessonIds: string[];
    completedLessonIds: string[];
    canUnlockMinitest: boolean;
    minitestsAvailable: boolean;
}>;
/**
 * Cập nhật progress và mở khóa thêm bài khi hoàn thành bài
 */
export declare function completeLessonAndUnlock(userId: string, courseId: string, lessonId: string): Promise<{
    newUnlockedCount: number;
    canTakeMinitest: boolean;
    newlyUnlockedLessons: string[];
}>;
export {};
//# sourceMappingURL=progressiveUnlock.service.d.ts.map