# Seed Data - Tài liệu cho Tester

> Ngày cập nhật: **18/05/2026**

## Tổng quan

File này mô tả chi tiết các dữ liệu được tạo bởi các seed scripts trong thư mục `prisma/`.

---

## Các Seed Scripts

| Script | Lệnh | Mô tả |
|--------|------|-------|
| Seed đầy đủ | `npm run db:seed:full` | Tạo đầy đủ dữ liệu (users, courses, problems...) |
| Seed admin | `npm run db:seed:admin` | Chỉ tạo 3 tài khoản admin |

---

## Biểu dữ liệu (seed-full.ts)

### Tài khoản người dùng

#### Admin (3 tài khoản)

| Email | Username | Họ và Tên | Password |
|-------|----------|-----------|----------|
| admin1@codefit.edu.vn | admin1 | Trần Văn A | admin123 |
| admin2@codefit.edu.vn | admin2 | Lê Thị B | admin123 |
| admin3@codefit.edu.vn | admin3 | Phạm Văn C | admin123 |

**Vai trò:** Quản trị viên - có quyền quản lý hệ thống, khóa học, người dùng

#### Giảng viên (3 tài khoản)

| Email | Username | Họ và Tên | Password |
|-------|----------|-----------|----------|
| thanh.nguyen@codefit.edu.vn | thanhnguyen | Nguyễn Văn Thành | lecture123 |
| linh.tran@codefit.edu.vn | linhtran | Trần Thị Linh | lecture123 |
| duc.pham@codefit.edu.vn | ducpham | Phạm Văn Đức | lecture123 |

**Vai trò:** Giảng viên - có quyền tạo và quản lý khóa học

#### Học viên (3 tài khoản)

| Email | Username | Họ và Tên | Password |
|-------|----------|-----------|----------|
| student1@codefit.com | student1 | Nguyễn Văn Minh | student123 |
| student2@codefit.com | student2 | Trần Thị Hoa | student123 |
| student3@codefit.com | student3 | Lê Văn Đức | student123 |

**Vai trò:** Học viên - có thể học và tham gia các khóa học

---

### Khóa học (3 khóa)

#### 1. JavaScript Fundamentals

| Thuộc tính | Giá trị |
|------------|---------|
| Giá | 99,000 VND |
| Giá gốc | 199,000 VND |
| Cấp độ | Beginner |
| Thời lượng | 40 Giờ học |
| Người tạo | admin1@codefit.edu.vn |

**Cấu trúc:**
- **Phase 1:** Biến và Kiểu Dữ Liệu
  - Biến trong JavaScript (video)
  - Toán tử và Biểu thức (video)
  - Rẽ nhánh điều kiện (code)
- **Phase 2:** Hàm và Phạm Vi
  - Khai báo Hàm (video)
  - Arrow Functions (code)
- **Phase 3:** DOM Manipulation
  - Giới thiệu DOM (video)

**Activation Code:** `CFE-JS2026BEGINNER`

#### 2. React Masterclass

| Thuộc tính | Giá trị |
|------------|---------|
| Giá | 149,000 VND |
| Giá gốc | 299,000 VND |
| Cấp độ | Intermediate |
| Thời lượng | 60 Giờ học |
| Người tạo | thanh.nguyen@codefit.edu.vn |

**Cấu trúc:**
- **Phase 1:** React Cơ Bản
  - Giới thiệu React (video)
  - Components và JSX (code)
- **Phase 2:** React Hooks
  - useState Hook (code)
  - useEffect Hook (code)

**Activation Code:** `CFE-REACT2026MASTER`

#### 3. Python for Data Science

| Thuộc tính | Giá trị |
|------------|---------|
| Giá | 199,000 VND |
| Giá gốc | 399,000 VND |
| Cấp độ | Intermediate |
| Thời lượng | 80 Giờ học |
| Người tạo | duc.pham@codefit.edu.vn |

**Cấu trúc:**
- **Phase 1:** Python Cơ Bản
  - Biến và Kiểu dữ liệu Python (video)
  - Lists và Dictionaries (code)
- **Phase 2:** Python for Analysis
  - NumPy Fundamentals (code)
  - Pandas DataFrames (code)

**Activation Code:** `CFE-PY2026DATA`

---

### Problems (5 bài)

| STT | Tên | Độ khó | Mô tả |
|-----|-----|--------|-------|
| 1 | Two Sum | Easy | Tìm 2 số có tổng bằng target |
| 2 | Reverse String | Easy | Đảo ngược string |
| 3 | Valid Parentheses | Medium | Kiểm tra dấu ngoặc hợp lệ |
| 4 | FizzBuzz | Easy | Bài toán FizzBuzz |
| 5 | Palindrome Number | Easy | Kiểm tra số đối xứng |

---

### Enrollments (Học viên đăng ký)

| Học viên | Khóa học | Tiến độ |
|----------|----------|---------|
| student1@codefit.com | JavaScript Fundamentals | 50% |
| student1@codefit.com | React Masterclass | 25% |
| student2@codefit.com | JavaScript Fundamentals | 100% (Hoàn thành) |
| student2@codefit.com | Python for Data Science | 50% |
| student3@codefit.com | JavaScript Fundamentals | 17% |
| student3@codefit.com | Python for Data Science | 25% |

---

### Hackathons (2 cuộc thi)

#### 1. Frontend Challenge - React Summit 2026
- **Trạng thái:** Đang diễn ra (Active)
- **Thời gian:** Hiện tại - 7 ngày
- **Thời lượng:** 120 phút

#### 2. Algorithm Challenge - Week
- **Trạng thái:** Sắp diễn ra (Upcoming)
- **Thời gian:** 7 ngày - 14 ngày
- **Thời lượng:** 180 phút

---

### Projects (2 dự án)

| Tên | Khóa học | Trạng thái |
|-----|----------|------------|
| Ứng dụng Calculator | JavaScript Fundamentals | Đã nộp (approved) |
| Todo App với React | React Masterclass | Đã nộp (approved) |

---

### Certificates (Chứng chỉ)

| Học viên | Khóa học | Ngày cấp |
|----------|----------|----------|
| Trần Thị Hoa (student2) | JavaScript Fundamentals | 2024-02-01 |
| Nguyễn Văn Minh (student1) | React Masterclass | 2024-02-15 |

---

## Hướng dẫn sử dụng

### Đăng nhập với tài khoản admin

1. Truy cập trang đăng nhập
2. Nhập email: `admin1@codefit.edu.vn`
3. Nhập password: `admin123`
4. Đăng nhập thành công với quyền quản trị

### Đăng nhập với tài khoản học viên

1. Truy cập trang đăng nhập
2. Nhập email: `student1@codefit.com`
3. Nhập password: `student123`
4. Đăng nhập thành công với quyền học viên

### Kích hoạt khóa học bằng mã code

1. Đăng nhập với tài khoản học viên
2. Truy cập trang "Nhập mã kích hoạt"
3. Nhập một trong các mã code:
   - `CFE-JS2026BEGINNER` - JavaScript Fundamentals
   - `CFE-REACT2026MASTER` - React Masterclass
   - `CFE-PY2026DATA` - Python for Data Science

---

## Lưu ý

- Tất cả passwords đều là `admin123`, `lecture123`, `student123` theo vai trò
- Email admin có domain `@codefit.edu.vn`
- Học viên có email domain `@codefit.com`
- Khóa học đã có sẵn lessons và lesson contents
- Problems có testcases cho việc nộp bài
