/**
 * Các kiểu dữ liệu và interface liên quan đến Hackathon
 * @module HackathonTypes
 */
/**
 * Trạng thái của một Hackathon
 * - upcoming: Sự kiện chưa bắt đầu
 * - active: Sự kiện đang diễn ra
 * - ended: Sự kiện đã kết thúc
 */
export type HackathonStatus = 'upcoming' | 'active' | 'ended';
/**
 * Interface đại diện cho một Hackathon
 * @interface Hackathon
 */
export interface Hackathon {
    /** Mã định danh duy nhất của hackathon */
    id: string;
    /** Tiêu đề của hackathon */
    title: string;
    /** Mô tả chi tiết về hackathon */
    description: string;
    /** Ngày bắt đầu hackathon */
    startDate: Date;
    /** Ngày kết thúc hackathon */
    endDate: Date;
    /** Trạng thái hiện tại của hackathon */
    status: HackathonStatus;
    /** ID của người tạo hackathon */
    createdBy: string;
    /** Thời điểm tạo hackathon */
    createdAt: Date;
}
/**
 * Interface đại diện cho một người tham gia hackathon
 * @interface HackathonParticipant
 */
export interface HackathonParticipant {
    /** Mã định danh duy nhất của bản ghi tham gia */
    id: string;
    /** ID của hackathon mà người dùng tham gia */
    hackathonId: string;
    /** ID của người dùng tham gia */
    userId: string;
    /** Tên nhóm (nếu có, null nếu tham gia cá nhân) */
    teamName: string | null;
    /** Thời điểm người dùng tham gia hackathon */
    joinedAt: Date;
}
/**
 * Interface đại diện cho một bài nộp dự án trong hackathon
 * @interface HackathonSubmission
 */
export interface HackathonSubmission {
    /** Mã định danh duy nhất của bài nộp */
    id: string;
    /** ID của hackathon mà bài nộp thuộc về */
    hackathonId: string;
    /** ID của người nộp bài */
    userId: string;
    /** Tiêu đề của dự án */
    projectTitle: string;
    /** Mô tả chi tiết về dự án */
    description: string;
    /** URL của repository chứa mã nguồn */
    repositoryUrl: string;
    /** URL demo trực tiếp của dự án (nếu có) */
    demoUrl: string | null;
    /** Điểm số của bài nộp (null nếu chưa được chấm) */
    score: number | null;
    /** Thời điểm nộp bài */
    submittedAt: Date;
}
/**
 * DTO để tạo mới một hackathon
 * @interface CreateHackathonDto
 */
export interface CreateHackathonDto {
    /** Tiêu đề của hackathon (bắt buộc) */
    title: string;
    /** Mô tả chi tiết về hackathon */
    description: string;
    /** Ngày bắt đầu hackathon (bắt buộc) */
    startDate: Date;
    /** Ngày kết thúc hackathon (bắt buộc) */
    endDate: Date;
}
/**
 * DTO để nộp dự án tham gia hackathon
 * @interface SubmitProjectDto
 */
export interface SubmitProjectDto {
    /** Tiêu đề của dự án (bắt buộc) */
    projectTitle: string;
    /** Mô tả chi tiết về dự án (bắt buộc) */
    description: string;
    /** URL của repository chứa mã nguồn (bắt buộc) */
    repositoryUrl: string;
    /** URL demo trực tiếp của dự án (tùy chọn) */
    demoUrl?: string;
}
//# sourceMappingURL=hackathon.types.d.ts.map