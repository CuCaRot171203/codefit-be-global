/**
 * Minitest Type Definitions
 *
 * Định nghĩa các interface và type cho Minitest entity và các DTOs liên quan.
 */
/**
 * Entity Minitest - Đại diện cho một bài kiểm tra nhỏ
 * @interface Minitest
 */
export interface Minitest {
    /** ID duy nhất của bài test */
    id: string;
    /** Tiêu đề bài test */
    title: string;
    /** Mô tả nội dung bài test */
    description: string;
    /** ID của khóa học liên kết (null nếu là bài test độc lập) */
    courseId: string | null;
    /** Độ khó của bài test */
    difficulty: 'easy' | 'medium' | 'hard';
    /** Danh sách câu hỏi trong bài test */
    questions: MinitestQuestion[];
    /** Thời gian làm bài (tính bằng giây) */
    timeLimit: number;
    /** Thời điểm tạo bài test */
    createdAt: Date;
}
/**
 * Entity MinitestQuestion - Đại diện cho một câu hỏi trong bài test
 * @interface MinitestQuestion
 */
export interface MinitestQuestion {
    /** ID duy nhất của câu hỏi */
    id: string;
    /** ID của bài test cha */
    minitestId: string;
    /** Nội dung câu hỏi */
    question: string;
    /** Danh sách các lựa chọn */
    options: string[];
    /** Chỉ số của đáp án đúng (0-based) */
    correctAnswer: number;
    /** Thứ tự hiển thị câu hỏi */
    orderIndex: number;
}
/**
 * Entity MinitestResult - Lưu kết quả làm bài của người dùng
 * @interface MinitestResult
 */
export interface MinitestResult {
    /** ID duy nhất của kết quả */
    id: string;
    /** ID của bài test */
    minitestId: string;
    /** ID của người dùng */
    userId: string;
    /** Số câu trả lời đúng */
    score: number;
    /** Tổng số câu hỏi */
    totalQuestions: number;
    /** Thời điểm nộp bài */
    completedAt: Date;
}
/**
 * DTO để tạo mới một bài minitest
 * @interface CreateMinitestDto
 */
export interface CreateMinitestDto {
    /** Tiêu đề bài test */
    title: string;
    /** Mô tả bài test */
    description: string;
    /** ID khóa học liên kết (tùy chọn) */
    courseId?: string;
    /** Độ khó của bài test */
    difficulty: 'easy' | 'medium' | 'hard';
    /** Danh sách câu hỏi */
    questions: {
        /** Nội dung câu hỏi */
        question: string;
        /** Các lựa chọn */
        options: string[];
        /** Chỉ số đáp án đúng (0-based) */
        correctAnswer: number;
    }[];
    /** Thời gian làm bài (tùy chọn, mặc định 300 giây) */
    timeLimit?: number;
}
/**
 * DTO để nộp bài minitest
 * @interface SubmitMinitestDto
 */
export interface SubmitMinitestDto {
    /** Danh sách các câu trả lời */
    answers: {
        /** ID của câu hỏi */
        questionId: string;
        /** Chỉ số câu trả lời được chọn (0-based) */
        answer: number;
    }[];
}
//# sourceMappingURL=minitest.types.d.ts.map