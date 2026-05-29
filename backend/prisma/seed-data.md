# Seed Data - Tài liệu cho Tester

> Ngày cập nhật: **29/05/2026**

## Tổng quan

File này mô tả chi tiết các dữ liệu được tạo bởi các seed scripts trong thư mục `prisma/`.

---

## Các Seed Scripts

| Script | Lệnh | Mô tả |
|--------|------|-------|
| Seed mặc định | `npm run db:seed` | Tạo dữ liệu cơ bản (users, courses, problems...) |
| Seed đầy đủ | `npm run db:seed:full` | Tạo đầy đủ dữ liệu (users, courses, problems, submissions...) |
| Seed admin | `npm run db:seed:admin` | Chỉ tạo 3 tài khoản admin |

---

## Tài khoản người dùng

### Admin

#### Seed mặc định (`npm run db:seed`)

| Email | Username | Password |
|-------|----------|----------|
| admin@codefit.com | admin | admin123 |

#### Seed đầy đủ (`npm run db:seed:full`)

| Email | Username | Họ và Tên | Password |
|-------|----------|-----------|----------|
| admin1@codefit.edu.vn | admin1 | Trần Văn A | admin123 |
| admin2@codefit.edu.vn | admin2 | Lê Thị B | admin123 |
| admin3@codefit.edu.vn | admin3 | Phạm Văn C | admin123 |

---

### Giảng viên

#### Seed mặc định

| Email | Username | Họ và Tên | Password |
|-------|----------|-----------|----------|
| thanh.nguyen@codefit.com | thanhnguyen | Nguyễn Văn Thành | password123 |
| linh.tran@codefit.com | linhtran | Trần Thị Linh | password123 |

#### Seed đầy đủ

| Email | Username | Họ và Tên | Password |
|-------|----------|-----------|----------|
| thanh.nguyen@codefit.edu.vn | thanhnguyen | Nguyễn Văn Thành | lecture123 |
| linh.tran@codefit.edu.vn | linhtran | Trần Thị Linh | lecture123 |
| duc.pham@codefit.edu.vn | ducpham | Phạm Văn Đức | lecture123 |

---

### Học viên

#### Seed mặc định

| Email | Username | Password |
|-------|----------|----------|
| john@example.com | johndoe | password123 |
| jane@example.com | janedoe | password123 |

#### Seed đầy đủ

| Email | Username | Họ và Tên | Password |
|-------|----------|-----------|----------|
| student1@codefit.com | student1 | Nguyễn Văn Minh | student123 |
| student2@codefit.com | student2 | Trần Thị Hoa | student123 |
| student3@codefit.com | student3 | Lê Văn Đức | student123 |

---

## Khóa học

### Seed mặc định (5 khóa)

#### 1. JavaScript Fundamentals

| Thuộc tính | Giá trị |
|------------|---------|
| Giá | 99,000 VND |
| Giá gốc | 199,000 VND |
| Cấp độ | Beginner |
| Thời lượng | 40 Giờ học |
| Người tạo | admin@codefit.com |

#### 2. React Masterclass

| Thuộc tính | Giá trị |
|------------|---------|
| Giá | 149,000 VND |
| Giá gốc | 299,000 VND |
| Cấp độ | Intermediate |
| Thời lượng | 60 Giờ học |
| Người tạo | thanh.nguyen@codefit.com |

#### 3. Python for Data Science

| Thuộc tính | Giá trị |
|------------|---------|
| Giá | 199,000 VND |
| Giá gốc | 399,000 VND |
| Cấp độ | Intermediate |
| Thời lượng | 80 Giờ học |
| Người tạo | linh.tran@codefit.com |

#### 4. Docker & Kubernetes Masterclass

| Thuộc tính | Giá trị |
|------------|---------|
| Giá | 249,000 VND |
| Giá gốc | 499,000 VND |
| Cấp độ | Advanced |
| Thời lượng | 50 Giờ học |
| Người tạo | admin@codefit.com |

#### 5. Test PayOS Course

| Thuộc tính | Giá trị |
|------------|---------|
| Giá | 5,000 VND |
| Giá gốc | 10,000 VND |
| Cấp độ | Beginner |
| Thời lượng | 1 Giờ học |

---

### Seed đầy đủ (3 khóa)

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

---

## Mã kích hoạt khóa học

### Seed mặc định (Format: CFE-XXXXXXXXXXXXXXXXXXXXXXXX)

| Mã Code | Khóa học |
|---------|----------|
| CFE-A1B2C3D4E5F6G7H8 | JavaScript Fundamentals |
| CFE-Y5Z6A7B8C9D0E1F2 | React Masterclass |
| CFE-O1P2Q3R4S5T6U7V8 | Python for Data Science |
| CFE-E7F8G9H0I1J2K3L4 | Docker & Kubernetes Masterclass |

### Seed đầy đủ (Format: CFE-XXXXXXXXXXXXXXXX)

| Mã Code | Khóa học |
|---------|----------|
| CFE-JS2026BEGINNER | JavaScript Fundamentals |
| CFE-REACT2026MASTER | React Masterclass |
| CFE-PY2026DATA | Python for Data Science |

---

## Problems

### Seed mặc định

| STT | Tên | Độ khó | Mô tả |
|-----|-----|--------|-------|
| 1 | Two Sum | Easy | Tìm 2 số có tổng bằng target |
| 2 | Reverse String | Easy | Đảo ngược string |
| 3 | Valid Parentheses | Medium | Kiểm tra dấu ngoặc hợp lệ |
| 4 | Merge Two Sorted Lists | Medium | Gộp 2 linked lists đã sắp xếp |
| 5 | Binary Tree Inorder Traversal | Hard | Duyệt cây theo thứ tự inorder |

### Seed đầy đủ (thêm)

| STT | Tên | Độ khó | Mô tả |
|-----|-----|--------|-------|
| 6 | FizzBuzz | Easy | Bài toán FizzBuzz |
| 7 | Palindrome Number | Easy | Kiểm tra số đối xứng |
| 8 | Python Two Sum | Easy | Two Sum version Python |
| 9 | Python List Sum | Easy | Tính tổng list |

---

## Enrollments (Seed đầy đủ)

| Học viên | Khóa học | Tiến độ |
|----------|----------|---------|
| student1@codefit.com | JavaScript Fundamentals | 50% |
| student1@codefit.com | React Masterclass | 25% |
| student2@codefit.com | JavaScript Fundamentals | 100% (Hoàn thành) |
| student2@codefit.com | Python for Data Science | 50% |
| student3@codefit.com | JavaScript Fundamentals | 17% |
| student3@codefit.com | Python for Data Science | 25% |

---

## Hackathons (Seed đầy đủ)

#### 1. Frontend Challenge - React Summit 2026
- **Trạng thái:** Đang diễn ra (Active)
- **Thời gian:** Hiện tại - 7 ngày
- **Thời lượng:** 120 phút

#### 2. Algorithm Challenge - Week
- **Trạng thái:** Sắp diễn ra (Upcoming)
- **Thời gian:** 7 ngày - 14 ngày
- **Thời lượng:** 180 phút

---

## Projects (Seed đầy đủ)

| Tên | Khóa học | Trạng thái |
|-----|----------|------------|
| Ứng dụng Calculator | JavaScript Fundamentals | Đã nộp (approved) |
| Todo App với React | React Masterclass | Đã nộp (approved) |

---

## Certificates (Seed đầy đủ)

| Học viên | Khóa học | Ngày cấp |
|----------|----------|----------|
| Trần Thị Hoa (student2) | JavaScript Fundamentals | 2024-02-01 |
| Nguyễn Văn Minh (student1) | React Masterclass | 2024-02-15 |

---

## Hướng dẫn sử dụng

### Đăng nhập với tài khoản admin

**Seed mặc định:**
1. Truy cập trang đăng nhập
2. Nhập email: `admin@codefit.com`
3. Nhập password: `admin123`
4. Đăng nhập thành công với quyền quản trị

**Seed đầy đủ:**
1. Truy cập trang đăng nhập
2. Nhập email: `admin1@codefit.edu.vn`
3. Nhập password: `admin123`
4. Đăng nhập thành công với quyền quản trị

### Đăng nhập với tài khoản học viên

**Seed mặc định:**
1. Truy cập trang đăng nhập
2. Nhập email: `john@example.com`
3. Nhập password: `password123`
4. Đăng nhập thành công với quyền học viên

**Seed đầy đủ:**
1. Truy cập trang đăng nhập
2. Nhập email: `student1@codefit.com`
3. Nhập password: `student123`
4. Đăng nhập thành công với quyền học viên

### Kích hoạt khóa học bằng mã code

**Seed mặc định:**
1. Đăng nhập với tài khoản học viên
2. Truy cập trang "Nhập mã kích hoạt"
3. Nhập một trong các mã code:
   - `CFE-A1B2C3D4E5F6G7H8` - JavaScript Fundamentals
   - `CFE-Y5Z6A7B8C9D0E1F2` - React Masterclass
   - `CFE-O1P2Q3R4S5T6U7V8` - Python for Data Science

**Seed đầy đủ:**
1. Đăng nhập với tài khoản học viên
2. Truy cập trang "Nhập mã kích hoạt"
3. Nhập một trong các mã code:
   - `CFE-JS2026BEGINNER` - JavaScript Fundamentals
   - `CFE-REACT2026MASTER` - React Masterclass
   - `CFE-PY2026DATA` - Python for Data Science

---

## Lưu ý

- **Seed mặc định:** Password là `admin123` cho admin, `password123` cho user/lecture
- **Seed đầy đủ:** Password là `admin123` cho admin, `lecture123` cho lecture, `student123` cho student
- Email admin có domain `@codefit.com` (mặc định) hoặc `@codefit.edu.vn` (đầy đủ)
- Học viên có email domain `@codefit.com` hoặc `@example.com`
- Khóa học đã có sẵn lessons và lesson contents
- Problems có testcases cho việc nộp bài
- Mã kích hoạt có format khác nhau giữa 2 seed scripts
