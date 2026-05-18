# CodeFit Backend API

> Ngày cập nhật: **18/05/2026**

## Mục lục

- [Cài đặt](#cài-đặt)
- [Di chuyển cơ sở dữ liệu](#di-chuyển-cơ-sở-dữ-liệu)
- [Seed Data](#seed-data)
- [API Endpoints](#api-endpoints)
- [Xác thực](#xác-thực)
- [Database Schema](#database-schema)

---

## Cài đặt

```bash
# Cài đặt dependencies
npm install

# Tạo file .env với nội dung:
# DATABASE_URL="mysql://user:password@localhost:3306/codefit"
# JWT_SECRET="your-secret-key"
# PORT=5000

# Tạo Prisma Client
npx prisma generate

# Chạy migration
npx prisma migrate dev
```

---

## Di chuyển cơ sở dữ liệu

### Các lệnh

```bash
# Development - apply migrations
npx prisma migrate dev

# Production - apply migrations
npx prisma migrate deploy

# Reset database (CẢNH BÁO: xóa hết dữ liệu)
npx prisma migrate reset

# Tạo migration mới
npx prisma migrate dev --name migration_name

# Mở Studio - trình chỉnh sửa database trực quan
npx prisma studio
```

---

## Seed Data

### Tổng quan

Seed data là các dữ liệu mẫu được tạo sẵn để phục vụ việc phát triển và kiểm thử ứng dụng.

### Các loại seed

| Lệnh | Mô tả |
|------|-------|
| `npm run db:seed` | Seed mặc định (cũ) |
| `npm run db:seed:full` | Seed đầy đủ cho tester |
| `npm run db:seed:admin` | Seed chỉ có 3 tài khoản admin |

### Seed đầy đủ (db:seed:full)

Tạo dữ liệu đầy đủ với:

- **9 người dùng:**
  - 3 Admin: `admin1@codefit.edu.vn`, `admin2@codefit.edu.vn`, `admin3@codefit.edu.vn` (password: `admin123`)
  - 3 Giảng viên: `thanh.nguyen@codefit.edu.vn`, `linh.tran@codefit.edu.vn`, `duc.pham@codefit.edu.vn` (password: `lecture123`)
  - 3 Học viên: `student1@codefit.com`, `student2@codefit.com`, `student3@codefit.com` (password: `student123`)

- **3 khóa học đầy đủ chức năng:**
  - JavaScript Fundamentals (beginner)
  - React Masterclass (intermediate)
  - Python for Data Science (intermediate)

- **5 bài toán** với testcases

- **Hackathons, Projects, Certificates, Notifications...**

Xem chi tiết tại [prisma/seed-data.md](prisma/seed-data.md)

### Seed admin (db:seed:admin)

Chỉ tạo 3 tài khoản admin với email `@codefit.edu.vn`:

- `admin1@codefit.edu.vn` (password: `admin123`)
- `admin2@codefit.edu.vn` (password: `admin123`)
- `admin3@codefit.edu.vn` (password: `admin123`)

Không có courses hay dữ liệu khác.

---

## Công nghệ sử dụng

| Công nghệ | Mô tả |
|-----------|-------|
| **Runtime** | Node.js |
| **Framework** | Express.js v5 |
| **ORM** | Prisma v6 |
| **Database** | MySQL |
| **Auth** | JWT (jsonwebtoken) |
| **Validation** | bcrypt |
| **File Upload** | Multer |
| **Payment** | PayOS |
| **Email** | Nodemailer |
| **Image** | ImageKit |
| **Cache** | Redis (ioredis) |
| **Queue** | RabbitMQ (amqplib) |

---

## Cấu trúc thư mục

```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── migrations/       # Database migrations
│   ├── seed.ts           # Seed mặc định
│   ├── seed-full.ts      # Seed đầy đủ
│   ├── seed-admin.ts     # Seed admin
│   └── seed-data.md      # Tài liệu seed data
├── src/
│   ├── modules/          # Module chức năng
│   │   ├── auth/         # Xác thực
│   │   ├── user/         # Người dùng
│   │   ├── course/       # Khóa học
│   │   ├── lesson/       # Bài học
│   │   ├── problem/      # Bài toán
│   │   ├── submission/   # Bài nộp
│   │   ├── hackathon/   # Cuộc thi
│   │   ├── payment/     # Thanh toán
│   │   ├── notification/# Thông báo
│   │   └── ...
│   ├── middleware/       # Middleware
│   ├── routes/           # Routes
│   ├── utils/           # Tiện ích
│   └── server.ts        # Entry point
└── server.ts
```

---

## API Endpoints

Base URL: `http://localhost:5000/api`

### Định dạng phản hồi

**Thành công:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Thao tác thành công"
}
```

**Lỗi:**
```json
{
  "success": false,
  "message": "Mô tả lỗi"
}
```

---

### Auth `/api/auth`

| Phương thức | Endpoint | Auth | Mô tả | Body |
|-------------|----------|------|-------|------|
| POST | `/auth/register` | Không | Đăng ký người dùng | `{ email, username, password }` |
| POST | `/auth/login` | Không | Đăng nhập | `{ email, password }` |
| GET | `/auth/me` | Có | Lấy thông tin user hiện tại | - |

**Đăng ký:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "password123"
}
```

**Đăng nhập:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

---

### User `/api/users`

| Phương thức | Endpoint | Auth | Mô tả | Body |
|-------------|----------|------|-------|------|
| GET | `/users/profile` | Có | Lấy profile | - |
| PUT | `/users/profile` | Có | Cập nhật profile | `{ username?, avatar?, bio? }` |
| POST | `/users/change-password` | Có | Đổi mật khẩu | `{ currentPassword, newPassword }` |

---

### Course `/api/courses`

| Phương thức | Endpoint | Auth | Mô tả | Body |
|-------------|----------|------|-------|------|
| GET | `/courses` | Không | Lấy tất cả khóa học | - |
| GET | `/courses/:id` | Không | Lấy khóa học theo ID | - |
| POST | `/courses` | Có | Tạo khóa học | `{ title, description, price?, level }` |
| PUT | `/courses/:id` | Có | Cập nhật khóa học | `{ title?, description?, price?, level? }` |
| DELETE | `/courses/:id` | Có | Xóa khóa học | - |
| GET | `/courses/my/creator` | Có | Lấy khóa học đã tạo | - |

**Cấp độ khóa học:** `beginner`, `intermediate`, `advanced`

---

### Phase `/api/phases`

| Phương thức | Endpoint | Auth | Mô tả | Body |
|-------------|----------|------|-------|------|
| POST | `/phases` | Có | Tạo phase | `{ courseId, title, orderIndex }` |
| GET | `/phases/course/:courseId` | Không | Lấy phases theo khóa học | - |
| GET | `/phases/:id` | Không | Lấy phase theo ID | - |
| PUT | `/phases/:id` | Có | Cập nhật phase | `{ title?, orderIndex? }` |
| DELETE | `/phases/:id` | Có | Xóa phase | - |

---

### Lesson `/api/lessons`

| Phương thức | Endpoint | Auth | Mô tả | Body |
|-------------|----------|------|-------|------|
| POST | `/lessons` | Có | Tạo bài học | `{ phaseId, title, content, type, orderIndex }` |
| GET | `/lessons/phase/:phaseId` | Không | Lấy bài học theo phase | - |
| GET | `/lessons/:id` | Không | Lấy bài học theo ID | - |
| PUT | `/lessons/:id` | Có | Cập nhật bài học | `{ title?, content?, type?, orderIndex? }` |
| DELETE | `/lessons/:id` | Có | Xóa bài học | - |

**Loại bài học:** `video`, `code`

---

### Enrollment `/api/enrollments`

| Phương thức | Endpoint | Auth | Mô tả | Body |
|-------------|----------|------|-------|------|
| POST | `/enrollments` | Có | Đăng ký khóa học | `{ courseId }` |
| GET | `/enrollments` | Có | Lấy danh sách đăng ký | - |
| GET | `/enrollments/:courseId` | Có | Lấy enrollment theo khóa học | - |
| PUT | `/enrollments/:enrollmentId/progress` | Có | Cập nhật tiến độ | `{ progress }` |
| DELETE | `/enrollments/:courseId` | Có | Hủy đăng ký | - |

---

### Progress `/api/progress`

| Phương thức | Endpoint | Auth | Mô tả | Body |
|-------------|----------|------|-------|------|
| GET | `/progress/:courseId` | Có | Lấy tiến độ khóa học | - |
| PUT | `/progress/:courseId` | Có | Cập nhật tiến độ | `{ completedLessons, totalLessons }` |

---

### Lesson Progress `/api/lesson-progress`

| Phương thức | Endpoint | Auth | Mô tả | Body |
|-------------|----------|------|-------|------|
| GET | `/lesson-progress/lesson/:lessonId` | Có | Lấy tiến độ bài học | - |
| GET | `/lesson-progress/course/:courseId` | Có | Lấy tiến độ theo khóa học | - |
| POST | `/lesson-progress/complete` | Có | Đánh dấu hoàn thành | `{ lessonId, courseId }` |
| PUT | `/lesson-progress/lesson/:lessonId/incomplete` | Có | Bỏ đánh dấu hoàn thành | - |

---

### Problem `/api/problems`

| Phương thức | Endpoint | Auth | Mô tả | Body |
|-------------|----------|------|-------|------|
| POST | `/problems` | Có | Tạo bài toán | `{ title, description, difficulty, timeLimit?, memoryLimit? }` |
| GET | `/problems/:id` | Không | Lấy bài toán theo ID | - |
| GET | `/problems/:problemId/testcases/public` | Không | Lấy testcases public | - |
| PUT | `/problems/:id` | Có | Cập nhật bài toán | `{ title?, description?, difficulty?, timeLimit?, memoryLimit? }` |
| DELETE | `/problems/:id` | Có | Xóa bài toán | - |

**Độ khó:** `EASY`, `MEDIUM`, `HARD`

---

### Testcase `/api/testcases`

| Phương thức | Endpoint | Auth | Mô tả | Body |
|-------------|----------|------|-------|------|
| POST | `/testcases` | Có | Tạo testcase | `{ problemId, input, expectedOutput, isPublic? }` |
| GET | `/testcases/problem/:problemId` | Có | Lấy tất cả testcases | - |
| GET | `/testcases/problem/:problemId/public` | Không | Lấy testcases public | - |
| GET | `/testcases/:id` | Không | Lấy testcase theo ID | - |
| PUT | `/testcases/:id` | Có | Cập nhật testcase | `{ input?, expectedOutput?, isPublic? }` |
| DELETE | `/testcases/:id` | Có | Xóa testcase | - |

---

### Submission `/api/submissions`

| Phương thức | Endpoint | Auth | Mô tả | Body |
|-------------|----------|------|-------|------|
| POST | `/submissions` | Có | Tạo submission | `{ problemId, code, language }` |
| GET | `/submissions/:id` | Có | Lấy submission theo ID | - |
| GET | `/submissions` | Có | Lấy danh sách submission | - |

**Trạng thái submission:** `PENDING`, `RUNNING`, `AC` (Accepted), `WA` (Wrong Answer), `RE` (Runtime Error), `CE` (Compilation Error), `TLE` (Time Limit Exceeded), `MLE` (Memory Limit Exceeded)

---

### Minitest `/api/minitests`

| Phương thức | Endpoint | Auth | Mô tả | Body |
|-------------|----------|------|-------|------|
| POST | `/minitests` | Có | Tạo minitest | `{ phaseId, title, problemIds }` |
| GET | `/minitests/:id` | Không | Lấy minitest theo ID | - |
| GET | `/minitests/course/:courseId` | Không | Lấy minitests theo khóa học | - |
| POST | `/minitests/:id/submit` | Có | Nộp bài minitest | `{ answers: [{ problemId, code, language }] }` |
| GET | `/minitests/my/results` | Có | Lấy kết quả minitest | - |

---

### Hackathon `/api/hackathons`

| Phương thức | Endpoint | Auth | Mô tả | Body |
|-------------|----------|------|-------|------|
| POST | `/hackathons` | Có | Tạo hackathon | `{ title, description, startTime, endTime }` |
| GET | `/hackathons/active` | Không | Lấy hackathons đang diễn ra | - |
| GET | `/hackathons/upcoming` | Không | Lấy hackathons sắp diễn ra | - |
| GET | `/hackathons/:id` | Không | Lấy hackathon theo ID | - |
| POST | `/hackathons/:id/join` | Có | Tham gia hackathon | `{ teamName }` |
| GET | `/hackathons/:id/participants` | Không | Lấy danh sách tham gia | - |
| POST | `/hackathons/:id/submit` | Có | Nộp bài hackathon | `{ problemId, code, language }` |
| GET | `/hackathons/:id/submissions` | Không | Lấy danh sách bài nộp | - |
| PUT | `/hackathons/:id/submissions/:submissionId/grade` | Có | Chấm điểm | `{ score }` |

---

### Leaderboard `/api/leaderboard`

| Phương thức | Endpoint | Auth | Mô tả | Query |
|-------------|----------|------|-------|-------|
| GET | `/leaderboard` | Không | Lấy bảng xếp hạng toàn cục | `?limit=50` |
| GET | `/leaderboard/course/:courseId` | Không | Lấy bảng xếp hạng theo khóa học | `?limit=50` |
| GET | `/leaderboard/my-rank` | Có | Lấy hạng của mình | - |

---

### Certificate `/api/certificates`

| Phương thức | Endpoint | Auth | Mô tả | Body |
|-------------|----------|------|-------|------|
| GET | `/certificates/my` | Có | Lấy chứng chỉ của mình | - |
| GET | `/certificates/course/:courseId` | Có | Lấy chứng chỉ theo khóa học | - |
| POST | `/certificates/generate` | Có | Tạo chứng chỉ | `{ courseId }` |
| GET | `/certificates/verify/:certificateId` | Không | Xác minh chứng chỉ | - |

---

### Project `/api/projects`

| Phương thức | Endpoint | Auth | Mô tả | Body |
|-------------|----------|------|-------|------|
| POST | `/projects` | Có | Tạo dự án | `{ courseId, title, description }` |
| GET | `/projects/my` | Có | Lấy dự án của mình | - |
| GET | `/projects/course/:courseId` | Không | Lấy dự án theo khóa học | - |
| GET | `/projects/:id` | Không | Lấy dự án theo ID | - |
| PUT | `/projects/:id` | Có | Cập nhật dự án | `{ title?, description? }` |
| DELETE | `/projects/:id` | Có | Xóa dự án | - |

---

### Feedback `/api/feedback`

| Phương thức | Endpoint | Auth | Mô tả | Body |
|-------------|----------|------|-------|------|
| POST | `/feedback` | Có | Tạo feedback | `{ targetId, targetType, message, rating }` |
| GET | `/feedback/:targetId/:targetType` | Không | Lấy feedback theo đối tượng | - |
| GET | `/feedback/:targetId/:targetType/rating` | Không | Lấy điểm đánh giá trung bình | - |
| PUT | `/feedback/:id` | Có | Cập nhật feedback | `{ message?, rating? }` |
| DELETE | `/feedback/:id` | Có | Xóa feedback | - |

**Loại đối tượng:** `course`, `lesson`, `hackathon`

---

### Notification `/api/notifications`

| Phương thức | Endpoint | Auth | Mô tả | Body |
|-------------|----------|------|-------|------|
| POST | `/notifications` | Có | Tạo thông báo | `{ userId, type, title, content }` |
| GET | `/notifications` | Có | Lấy thông báo của mình | - |
| GET | `/notifications/unread` | Có | Lấy thông báo chưa đọc | - |
| GET | `/notifications/unread/count` | Có | Lấy số thông báo chưa đọc | - |
| PUT | `/notifications/:id/read` | Có | Đánh dấu đã đọc | - |
| PUT | `/notifications/read-all` | Có | Đánh dấu đã đọc tất cả | - |
| DELETE | `/notifications/:id` | Có | Xóa thông báo | - |

**Loại thông báo:** `submission`, `hackathon`, `system`

---

### Stats `/api/stats`

| Phương thức | Endpoint | Auth | Mô tả |
|-------------|----------|------|-------|
| GET | `/stats/me` | Có | Lấy thống kê của mình |
| GET | `/stats/course/:courseId` | Không | Lấy thống kê khóa học |
| GET | `/stats/platform` | Không | Lấy thống kê toàn nền tảng |

**Thống kê của mình:**
```json
{
  "userId": "uuid",
  "score": 1500,
  "frequency": 45,
  "rank": 12
}
```

**Thống kê toàn nền tảng:**
```json
{
  "totalUsers": 100,
  "totalCourses": 20,
  "totalSubmissions": 5000,
  "averageScore": 750
}
```

---

## Xác thực

Các endpoint được bảo vệ cần có header `Authorization: Bearer <token>`.

Lấy token từ phản hồi đăng nhập.

---

## Database Schema

Xem chi tiết tại [prisma/schema.prisma](prisma/schema.prisma).

### Models

| Model | Mô tả |
|-------|-------|
| Role | Vai trò người dùng |
| User | Tài khoản người dùng |
| UserSession | Phiên đăng nhập |
| Course | Khóa học |
| Enrollment | Đăng ký khóa học |
| Phase | Giai đoạn khóa học |
| Lesson | Bài học |
| LessonContent | Nội dung bài học |
| LessonProgress | Tiến độ bài học |
| LessonRequest | Yêu cầu bài học |
| LessonReview | Phê duyệt bài học |
| LessonSubmission | Bài nộp bài học |
| ScoringConfig | Cấu hình chấm điểm |
| Problem | Bài toán |
| Testcase | Testcase |
| Submission | Bài nộp code |
| SubmissionResult | Kết quả testcase |
| Progress | Tiến độ khóa học |
| Minitest | Bài kiểm tra nhỏ |
| MinitestQuestion | Câu hỏi minitest |
| MinitestSubmission | Bài nộp minitest |
| Hackathon | Cuộc thi |
| HackathonParticipant | Người tham gia |
| HackathonSubmission | Bài nộp hackathon |
| Project | Dự án |
| ProjectSubmission | Bài nộp dự án |
| Certificate | Chứng chỉ |
| UserStats | Thống kê người dùng |
| Feedback | Nhận xét |
| Notification | Thông báo |
| NotificationTarget | Mục tiêu thông báo |
| Conversation | Cuộc trò chuyện |
| ConversationMessage | Tin nhắn |
| AIRequest | Yêu cầu AI |
| Payment | Thanh toán |
| ActivateCode | Mã kích hoạt |
| CourseSubscription | Đăng ký subscribe |
| LectureCourse | Giảng viên - Khóa học |
