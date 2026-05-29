"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🚀 Starting seed for CodeFit course with detailed test cases...\n');
    // Get or create user role
    let role = await prisma.role.findFirst({ where: { name: 'user' } });
    if (!role) {
        role = await prisma.role.create({
            data: { name: 'user', description: 'Regular user' },
        });
        console.log('✅ Created role: user');
    }
    // Find or create test user
    let user = await prisma.user.findFirst({
        where: { email: 'testuser@codefit.com' },
    });
    if (!user) {
        user = await prisma.user.create({
            data: {
                email: 'testuser@codefit.com',
                username: 'testuser',
                password: 'password123',
                fullName: 'Test User',
                roleId: role.id,
            },
        });
        console.log('✅ Created test user:', user.email);
    }
    else {
        console.log('ℹ️  Using existing user:', user.email);
    }
    // ============================================
    // CREATE COURSE
    // ============================================
    let course = await prisma.course.findFirst({
        where: { title: { contains: 'JavaScript Cơ Bản - Chi Tiết' } },
    });
    if (!course) {
        course = await prisma.course.create({
            data: {
                title: 'JavaScript Cơ Bản - Chi Tiết',
                description: 'Khóa học JavaScript cơ bản với các bài tập có test case chi tiết. Phù hợp cho sinh viên FPT University.',
                price: 0,
                level: 'BEGINNER',
                image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
                duration: '6 tuần',
                creatorId: user.id,
                unlockLessonsCount: 3,
                unlockByPhase: false,
                subscriptionType: 'FREE',
            },
        });
        console.log('✅ Created course:', course.title);
    }
    else {
        // Delete existing phases and lessons for clean slate
        await prisma.phase.deleteMany({ where: { courseId: course.id } });
        console.log('ℹ️  Using existing course:', course.title);
    }
    // ============================================
    // LESSON DATA STRUCTURE
    // ============================================
    // Format cho mỗi bài học CODE:
    // {
    //   title: string,
    //   content: HTML content với công thức,
    //   starterCode: code khởi đầu,
    //   testCases: array of { input, expectedOutput, isPublic, points },
    //   hints: array of { content, penalty }
    // }
    // ============================================
    // PHASE 1: JavaScript Cơ Bản - Biến & Toán Tử
    // ============================================
    const phase1 = await prisma.phase.create({
        data: {
            courseId: course.id,
            title: 'Chương 1: Biến và Toán Tử',
            orderIndex: 1,
        },
    });
    console.log('\n📚 Created Phase 1:', phase1.title);
    // Bài 1.1: Tính tổng 2 số
    const lesson1_1 = await prisma.lesson.create({
        data: {
            phaseId: phase1.id,
            title: 'Bài 1.1: Tính tổng 2 số',
            type: 'CODE',
            orderIndex: 1,
            isPublished: true,
            status: 'PUBLISHED',
            content: `
        <h2>Bài 1.1: Tính tổng 2 số nguyên</h2>
        
        <h3>📖 Công thức</h3>
        <p>Cho 2 số nguyên <code>a</code> và <code>b</code>, tính tổng của chúng.</p>
        <pre><code>tong = a + b</code></pre>

        <h3>📝 Đề bài</h3>
        <p>Viết function <code>calculateSum(a, b)</code> nhận vào 2 số nguyên và trả về tổng của chúng.</p>

        <h3>💡 Ví dụ</h3>
        <pre><code>Input:  a = 2, b = 3
Output: 5

Input:  a = 10, b = 20
Output: 30

Input:  a = -5, b = 5
Output: 0</code></pre>

        <h3>🎯 Yêu cầu</h3>
        <ul>
          <li>Trả về kết quả là một số nguyên</li>
          <li>Có thể xử lý số âm</li>
        </ul>
      `,
            publishedAt: new Date(),
        },
    });
    await prisma.lessonContent.create({
        data: {
            lessonId: lesson1_1.id,
            content: lesson1_1.content,
            starterCode: `// Tính tổng 2 số
function calculateSum(a, b) {
  // Viết code của bạn ở đây
  // Trả về tổng của a và b
  
}
module.exports = { calculateSum };`,
            testCases: JSON.stringify([
                // 5 Public test cases
                { id: 'test-0', input: '2, 3', expectedOutput: '5', isPublic: true, points: 10 },
                { id: 'test-1', input: '10, 20', expectedOutput: '30', isPublic: true, points: 10 },
                { id: 'test-2', input: '-5, 5', expectedOutput: '0', isPublic: true, points: 10 },
                { id: 'test-3', input: '7, 8', expectedOutput: '15', isPublic: true, points: 10 },
                { id: 'test-4', input: '0, 0', expectedOutput: '0', isPublic: true, points: 10 },
                // 5 Hidden test cases
                { id: 'test-5', input: '100, -50', expectedOutput: '50', isPublic: false, points: 10 },
                { id: 'test-6', input: '-100, -100', expectedOutput: '-200', isPublic: false, points: 10 },
                { id: 'test-7', input: '999, 1', expectedOutput: '1000', isPublic: false, points: 10 },
                { id: 'test-8', input: '-999, 999', expectedOutput: '0', isPublic: false, points: 10 },
                { id: 'test-9', input: '50, 50', expectedOutput: '100', isPublic: false, points: 10 },
            ]),
            hints: JSON.stringify([
                { content: 'Sử dụng toán tử + để cộng 2 số', penalty: 5 },
                { content: 'return a + b;', penalty: 10 },
            ]),
            timeLimit: 1000,
            memoryLimit: 256,
        },
    });
    await prisma.scoringConfig.create({
        data: {
            lessonId: lesson1_1.id,
            baseScore: 100,
            penaltyPerHint: 10,
        },
    });
    console.log('  ✅ Bài 1.1: Tính tổng 2 số');
    // Bài 1.2: Tính tích 2 số
    const lesson1_2 = await prisma.lesson.create({
        data: {
            phaseId: phase1.id,
            title: 'Bài 1.2: Tính tích 2 số',
            type: 'CODE',
            orderIndex: 2,
            isPublished: true,
            status: 'PUBLISHED',
            content: `
        <h2>Bài 1.2: Tính tích 2 số nguyên</h2>
        
        <h3>📖 Công thức</h3>
        <p>Cho 2 số nguyên <code>a</code> và <code>b</code>, tính tích của chúng.</p>
        <pre><code>tich = a * b</code></pre>

        <h3>📝 Đề bài</h3>
        <p>Viết function <code>calculateProduct(a, b)</code> nhận vào 2 số nguyên và trả về tích của chúng.</p>

        <h3>💡 Ví dụ</h3>
        <pre><code>Input:  a = 3, b = 4
Output: 12

Input:  a = 5, b = 6
Output: 30

Input:  a = -2, b = 5
Output: -10</code></pre>

        <h3>🎯 Yêu cầu</h3>
        <ul>
          <li>Trả về kết quả là một số nguyên</li>
          <li>Có thể xử lý số âm</li>
        </ul>
      `,
            publishedAt: new Date(),
        },
    });
    await prisma.lessonContent.create({
        data: {
            lessonId: lesson1_2.id,
            content: lesson1_2.content,
            starterCode: `// Tính tích 2 số
function calculateProduct(a, b) {
  // Viết code của bạn ở đây
  // Trả về tích của a và b
  
}
module.exports = { calculateProduct };`,
            testCases: JSON.stringify([
                // 5 Public test cases
                { id: 'test-0', input: '3, 4', expectedOutput: '12', isPublic: true, points: 10 },
                { id: 'test-1', input: '5, 6', expectedOutput: '30', isPublic: true, points: 10 },
                { id: 'test-2', input: '-2, 5', expectedOutput: '-10', isPublic: true, points: 10 },
                { id: 'test-3', input: '7, 8', expectedOutput: '56', isPublic: true, points: 10 },
                { id: 'test-4', input: '0, 99', expectedOutput: '0', isPublic: true, points: 10 },
                // 5 Hidden test cases
                { id: 'test-5', input: '-3, -4', expectedOutput: '12', isPublic: false, points: 10 },
                { id: 'test-6', input: '7, 0', expectedOutput: '0', isPublic: false, points: 10 },
                { id: 'test-7', input: '-5, -5', expectedOutput: '25', isPublic: false, points: 10 },
                { id: 'test-8', input: '100, 100', expectedOutput: '10000', isPublic: false, points: 10 },
                { id: 'test-9', input: '12, 12', expectedOutput: '144', isPublic: false, points: 10 },
            ]),
            hints: JSON.stringify([
                { content: 'Sử dụng toán tử * để nhân 2 số', penalty: 5 },
                { content: 'return a * b;', penalty: 10 },
            ]),
            timeLimit: 1000,
            memoryLimit: 256,
        },
    });
    await prisma.scoringConfig.create({
        data: {
            lessonId: lesson1_2.id,
            baseScore: 100,
            penaltyPerHint: 10,
        },
    });
    console.log('  ✅ Bài 1.2: Tính tích 2 số');
    // Bài 1.3: Kiểm tra số chẵn/lẻ
    const lesson1_3 = await prisma.lesson.create({
        data: {
            phaseId: phase1.id,
            title: 'Bài 1.3: Kiểm tra số chẵn/lẻ',
            type: 'CODE',
            orderIndex: 3,
            isPublished: true,
            status: 'PUBLISHED',
            content: `
        <h2>Bài 1.3: Kiểm tra số chẵn/lẻ</h2>
        
        <h3>📖 Công thức</h3>
        <p>Kiểm tra xem một số nguyên có phải là số chẵn hay không.</p>
        <pre><code>số chẵn = (n % 2) == 0</code></pre>

        <h3>📝 Đề bài</h3>
        <p>Viết function <code>isEven(n)</code> nhận vào một số nguyên và trả về <code>true</code> nếu là số chẵn, <code>false</code> nếu là số lẻ.</p>

        <h3>💡 Ví dụ</h3>
        <pre><code>Input:  4
Output: true

Input:  7
Output: false

Input:  0
Output: true

Input:  -2
Output: true</code></pre>

        <h3>🎯 Yêu cầu</h3>
        <ul>
          <li>Trả về giá trị boolean (true/false)</li>
          <li>0 là số chẵn</li>
          <li>Số âm cũng có thể là số chẵn</li>
        </ul>
      `,
            publishedAt: new Date(),
        },
    });
    await prisma.lessonContent.create({
        data: {
            lessonId: lesson1_3.id,
            content: lesson1_3.content,
            starterCode: `// Kiểm tra số chẵn/lẻ
function isEven(n) {
  // Viết code của bạn ở đây
  // Trả về true nếu n là số chẵn, false nếu là số lẻ
  
}
module.exports = { isEven };`,
            testCases: JSON.stringify([
                // 5 Public test cases
                { id: 'test-0', input: '4', expectedOutput: 'true', isPublic: true, points: 10 },
                { id: 'test-1', input: '7', expectedOutput: 'false', isPublic: true, points: 10 },
                { id: 'test-2', input: '0', expectedOutput: 'true', isPublic: true, points: 10 },
                { id: 'test-3', input: '10', expectedOutput: 'true', isPublic: true, points: 10 },
                { id: 'test-4', input: '3', expectedOutput: 'false', isPublic: true, points: 10 },
                // 5 Hidden test cases
                { id: 'test-5', input: '-2', expectedOutput: 'true', isPublic: false, points: 10 },
                { id: 'test-6', input: '-3', expectedOutput: 'false', isPublic: false, points: 10 },
                { id: 'test-7', input: '100', expectedOutput: 'true', isPublic: false, points: 10 },
                { id: 'test-8', input: '99', expectedOutput: 'false', isPublic: false, points: 10 },
                { id: 'test-9', input: '-100', expectedOutput: 'true', isPublic: false, points: 10 },
            ]),
            hints: JSON.stringify([
                { content: 'Sử dụng toán tử % (chia lấy dư) để kiểm tra', penalty: 5 },
                { content: 'Nếu n % 2 == 0 thì là số chẵn', penalty: 8 },
            ]),
            timeLimit: 1000,
            memoryLimit: 256,
        },
    });
    await prisma.scoringConfig.create({
        data: {
            lessonId: lesson1_3.id,
            baseScore: 100,
            penaltyPerHint: 10,
        },
    });
    console.log('  ✅ Bài 1.3: Kiểm tra số chẵn/lẻ');
    // MINITEST PHASE 1
    const problem1_1 = await prisma.problem.upsert({
        where: { id: 'prob-p1-sum-seed' },
        update: {},
        create: {
            id: 'prob-p1-sum-seed',
            title: 'Tính tổng (Minitest Chương 1)',
            description: 'Tính tổng 2 số nguyên',
            difficulty: 'EASY',
            timeLimit: 1000,
            memoryLimit: 256,
        },
    });
    await prisma.testcase.upsert({
        where: { id: 'tc-p1-sum-1' },
        update: {},
        create: {
            id: 'tc-p1-sum-1',
            problemId: problem1_1.id,
            input: '5, 3',
            expectedOutput: '8',
            isPublic: true,
        },
    });
    await prisma.testcase.upsert({
        where: { id: 'tc-p1-sum-2' },
        update: {},
        create: {
            id: 'tc-p1-sum-2',
            problemId: problem1_1.id,
            input: '-2, 4',
            expectedOutput: '2',
            isPublic: true,
        },
    });
    const minitest1 = await prisma.minitest.create({
        data: {
            phaseId: phase1.id,
            title: 'Mini Test - Chương 1: Biến và Toán Tử',
            orderIndex: 1,
        },
    });
    await prisma.minitestQuestion.createMany({
        data: [
            { minitestId: minitest1.id, problemId: problem1_1.id },
        ],
        skipDuplicates: true,
    });
    console.log('\n📝 Created Minitest Phase 1:', minitest1.title);
    // ============================================
    // PHASE 2: Cấu Trúc Điều Khiển
    // ============================================
    const phase2 = await prisma.phase.create({
        data: {
            courseId: course.id,
            title: 'Chương 2: Cấu Trúc Điều Khiển',
            orderIndex: 2,
        },
    });
    console.log('\n📚 Created Phase 2:', phase2.title);
    // Bài 2.1: Tìm số lớn hơn
    const lesson2_1 = await prisma.lesson.create({
        data: {
            phaseId: phase2.id,
            title: 'Bài 2.1: Tìm số lớn hơn',
            type: 'CODE',
            orderIndex: 1,
            isPublished: true,
            status: 'PUBLISHED',
            content: `
        <h2>Bài 2.1: Tìm số lớn hơn trong 2 số</h2>
        
        <h3>📖 Công thức</h3>
        <p>So sánh 2 số nguyên và trả về số lớn hơn.</p>
        <pre><code>if (a > b) {
  return a;
} else {
  return b;
}</code></pre>

        <h3>📝 Đề bài</h3>
        <p>Viết function <code>findMax(a, b)</code> nhận vào 2 số nguyên và trả về số lớn hơn.</p>

        <h3>💡 Ví dụ</h3>
        <pre><code>Input:  a = 5, b = 3
Output: 5

Input:  a = 2, b = 8
Output: 8

Input:  a = 5, b = 5
Output: 5

Input:  a = -1, b = -3
Output: -1</code></pre>

        <h3>🎯 Yêu cầu</h3>
        <ul>
          <li>Nếu 2 số bằng nhau, trả về số đó</li>
          <li>Có thể xử lý số âm</li>
        </ul>
      `,
            publishedAt: new Date(),
        },
    });
    await prisma.lessonContent.create({
        data: {
            lessonId: lesson2_1.id,
            content: lesson2_1.content,
            starterCode: `// Tìm số lớn hơn
function findMax(a, b) {
  // Viết code của bạn ở đây
  // Trả về số lớn hơn trong 2 số
  
}
module.exports = { findMax };`,
            testCases: JSON.stringify([
                // 5 Public test cases
                { id: 'test-0', input: '5, 3', expectedOutput: '5', isPublic: true, points: 10 },
                { id: 'test-1', input: '2, 8', expectedOutput: '8', isPublic: true, points: 10 },
                { id: 'test-2', input: '5, 5', expectedOutput: '5', isPublic: true, points: 10 },
                { id: 'test-3', input: '-1, -3', expectedOutput: '-1', isPublic: true, points: 10 },
                { id: 'test-4', input: '0, 0', expectedOutput: '0', isPublic: true, points: 10 },
                // 5 Hidden test cases
                { id: 'test-5', input: '100, 50', expectedOutput: '100', isPublic: false, points: 10 },
                { id: 'test-6', input: '-50, -100', expectedOutput: '-50', isPublic: false, points: 10 },
                { id: 'test-7', input: '999, 1000', expectedOutput: '1000', isPublic: false, points: 10 },
                { id: 'test-8', input: '-999, 999', expectedOutput: '999', isPublic: false, points: 10 },
                { id: 'test-9', input: '50, -50', expectedOutput: '50', isPublic: false, points: 10 },
            ]),
            hints: JSON.stringify([
                { content: 'Sử dụng câu lệnh if-else để so sánh', penalty: 5 },
                { content: 'So sánh a > b', penalty: 10 },
            ]),
            timeLimit: 1000,
            memoryLimit: 256,
        },
    });
    await prisma.scoringConfig.create({
        data: {
            lessonId: lesson2_1.id,
            baseScore: 100,
            penaltyPerHint: 10,
        },
    });
    console.log('  ✅ Bài 2.1: Tìm số lớn hơn');
    // Bài 2.2: Kiểm tra năm nhuận
    const lesson2_2 = await prisma.lesson.create({
        data: {
            phaseId: phase2.id,
            title: 'Bài 2.2: Kiểm tra năm nhuận',
            type: 'CODE',
            orderIndex: 2,
            isPublished: true,
            status: 'PUBLISHED',
            content: `
        <h2>Bài 2.2: Kiểm tra năm nhuận</h2>
        
        <h3>📖 Công thức</h3>
        <p>Một năm là năm nhuận nếu:</p>
        <ul>
          <li>Chia hết cho 400, HOẶC</li>
          <li>Chia hết cho 4 nhưng KHÔNG chia hết cho 100</li>
        </ul>
        <pre><code>isLeapYear = (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0)</code></pre>

        <h3>📝 Đề bài</h3>
        <p>Viết function <code>isLeapYear(year)</code> kiểm tra xem một năm có phải là năm nhuận hay không.</p>

        <h3>💡 Ví dụ</h3>
        <pre><code>Input:  2020
Output: true   // Chia hết cho 4, không chia hết cho 100

Input:  2000
Output: true   // Chia hết cho 400

Input:  1900
Output: false  // Chia hết cho 100 nhưng không chia hết cho 400

Input:  2023
Output: false  // Không chia hết cho 4</code></pre>

        <h3>🎯 Yêu cầu</h3>
        <ul>
          <li>Trả về giá trị boolean (true/false)</li>
          <li>Năm nhuận có 366 ngày (tháng 2 có 29 ngày)</li>
        </ul>
      `,
            publishedAt: new Date(),
        },
    });
    await prisma.lessonContent.create({
        data: {
            lessonId: lesson2_2.id,
            content: lesson2_2.content,
            starterCode: `// Kiểm tra năm nhuận
function isLeapYear(year) {
  // Viết code của bạn ở đây
  // Năm nhuận: chia hết cho 400 HOẶC (chia hết cho 4 VÀ không chia hết cho 100)
  
}
module.exports = { isLeapYear };`,
            testCases: JSON.stringify([
                // 5 Public test cases
                { id: 'test-0', input: '2020', expectedOutput: 'true', isPublic: true, points: 10 },
                { id: 'test-1', input: '2000', expectedOutput: 'true', isPublic: true, points: 10 },
                { id: 'test-2', input: '1900', expectedOutput: 'false', isPublic: true, points: 10 },
                { id: 'test-3', input: '2023', expectedOutput: 'false', isPublic: true, points: 10 },
                { id: 'test-4', input: '2024', expectedOutput: 'true', isPublic: true, points: 10 },
                // 5 Hidden test cases
                { id: 'test-5', input: '2001', expectedOutput: 'false', isPublic: false, points: 10 },
                { id: 'test-6', input: '2400', expectedOutput: 'true', isPublic: false, points: 10 },
                { id: 'test-7', input: '2100', expectedOutput: 'false', isPublic: false, points: 10 },
                { id: 'test-8', input: '1999', expectedOutput: 'false', isPublic: false, points: 10 },
                { id: 'test-9', input: '1600', expectedOutput: 'true', isPublic: false, points: 10 },
            ]),
            hints: JSON.stringify([
                { content: 'Năm nhuận chia hết cho 400', penalty: 5 },
                { content: 'Hoặc chia hết cho 4 nhưng không chia hết cho 100', penalty: 8 },
            ]),
            timeLimit: 1000,
            memoryLimit: 256,
        },
    });
    await prisma.scoringConfig.create({
        data: {
            lessonId: lesson2_2.id,
            baseScore: 100,
            penaltyPerHint: 10,
        },
    });
    console.log('  ✅ Bài 2.2: Kiểm tra năm nhuận');
    // Bài 2.3: FizzBuzz cơ bản
    const lesson2_3 = await prisma.lesson.create({
        data: {
            phaseId: phase2.id,
            title: 'Bài 2.3: FizzBuzz cơ bản',
            type: 'CODE',
            orderIndex: 3,
            isPublished: true,
            status: 'PUBLISHED',
            content: `
        <h2>Bài 2.3: FizzBuzz cơ bản</h2>
        
        <h3>📖 Công thức</h3>
        <p>Kiểm tra một số và trả về:</p>
        <ul>
          <li>"Fizz" nếu chia hết cho 3</li>
          <li>"Buzz" nếu chia hết cho 5</li>
          <li>"FizzBuzz" nếu chia hết cho cả 3 và 5</li>
          <li>Ngược lại, trả về chính số đó (dạng string)</li>
        </ul>

        <h3>📝 Đề bài</h3>
        <p>Viết function <code>fizzBuzz(n)</code> nhận vào một số nguyên và trả về kết quả theo quy tắc FizzBuzz.</p>

        <h3>💡 Ví dụ</h3>
        <pre><code>Input:  3
Output: "Fizz"

Input:  5
Output: "Buzz"

Input:  15
Output: "FizzBuzz"

Input:  7
Output: "7"

Input:  1
Output: "1"</code></pre>

        <h3>🎯 Yêu cầu</h3>
        <ul>
          <li>Kiểm tra FizzBuzz trước (chia hết cho cả 3 và 5)</li>
          <li>Trả về string (không phải number)</li>
        </ul>
      `,
            publishedAt: new Date(),
        },
    });
    await prisma.lessonContent.create({
        data: {
            lessonId: lesson2_3.id,
            content: lesson2_3.content,
            starterCode: `// FizzBuzz cơ bản
function fizzBuzz(n) {
  // Viết code của bạn ở đây
  // Trả về "Fizz", "Buzz", "FizzBuzz" hoặc số đó (dạng string)
  
}
module.exports = { fizzBuzz };`,
            testCases: JSON.stringify([
                // 5 Public test cases
                { id: 'test-0', input: '3', expectedOutput: '"Fizz"', isPublic: true, points: 10 },
                { id: 'test-1', input: '5', expectedOutput: '"Buzz"', isPublic: true, points: 10 },
                { id: 'test-2', input: '15', expectedOutput: '"FizzBuzz"', isPublic: true, points: 10 },
                { id: 'test-3', input: '7', expectedOutput: '"7"', isPublic: true, points: 10 },
                { id: 'test-4', input: '1', expectedOutput: '"1"', isPublic: true, points: 10 },
                // 5 Hidden test cases
                { id: 'test-5', input: '30', expectedOutput: '"FizzBuzz"', isPublic: false, points: 10 },
                { id: 'test-6', input: '9', expectedOutput: '"Fizz"', isPublic: false, points: 10 },
                { id: 'test-7', input: '10', expectedOutput: '"Buzz"', isPublic: false, points: 10 },
                { id: 'test-8', input: '2', expectedOutput: '"2"', isPublic: false, points: 10 },
                { id: 'test-9', input: '45', expectedOutput: '"FizzBuzz"', isPublic: false, points: 10 },
                { id: 'test-10', input: '100', expectedOutput: '"Buzz"', isPublic: false, points: 10 },
            ]),
            hints: JSON.stringify([
                { content: 'Kiểm tra chia hết cho 15 trước (cả 3 và 5)', penalty: 5 },
                { content: 'Sau đó kiểm tra chia hết cho 3, rồi 5', penalty: 8 },
            ]),
            timeLimit: 1000,
            memoryLimit: 256,
        },
    });
    await prisma.scoringConfig.create({
        data: {
            lessonId: lesson2_3.id,
            baseScore: 100,
            penaltyPerHint: 10,
        },
    });
    console.log('  ✅ Bài 2.3: FizzBuzz cơ bản');
    // MINITEST PHASE 2
    const problem2_1 = await prisma.problem.upsert({
        where: { id: 'prob-p2-max-seed' },
        update: {},
        create: {
            id: 'prob-p2-max-seed',
            title: 'Tìm số lớn hơn (Minitest Chương 2)',
            description: 'Tìm số lớn hơn trong 2 số nguyên',
            difficulty: 'EASY',
            timeLimit: 1000,
            memoryLimit: 256,
        },
    });
    await prisma.testcase.upsert({
        where: { id: 'tc-p2-max-1' },
        update: {},
        create: {
            id: 'tc-p2-max-1',
            problemId: problem2_1.id,
            input: '10, 20',
            expectedOutput: '20',
            isPublic: true,
        },
    });
    await prisma.testcase.upsert({
        where: { id: 'tc-p2-max-2' },
        update: {},
        create: {
            id: 'tc-p2-max-2',
            problemId: problem2_1.id,
            input: '-5, -1',
            expectedOutput: '-1',
            isPublic: true,
        },
    });
    const minitest2 = await prisma.minitest.create({
        data: {
            phaseId: phase2.id,
            title: 'Mini Test - Chương 2: Cấu Trúc Điều Khiển',
            orderIndex: 1,
        },
    });
    await prisma.minitestQuestion.createMany({
        data: [
            { minitestId: minitest2.id, problemId: problem2_1.id },
        ],
        skipDuplicates: true,
    });
    console.log('\n📝 Created Minitest Phase 2:', minitest2.title);
    // ============================================
    // PHASE 3: Vòng Lặp
    // ============================================
    const phase3 = await prisma.phase.create({
        data: {
            courseId: course.id,
            title: 'Chương 3: Vòng Lặp',
            orderIndex: 3,
        },
    });
    console.log('\n📚 Created Phase 3:', phase3.title);
    // Bài 3.1: Tính giai thừa
    const lesson3_1 = await prisma.lesson.create({
        data: {
            phaseId: phase3.id,
            title: 'Bài 3.1: Tính giai thừa',
            type: 'CODE',
            orderIndex: 1,
            isPublished: true,
            status: 'PUBLISHED',
            content: `
        <h2>Bài 3.1: Tính giai thừa</h2>
        
        <h3>📖 Công thức</h3>
        <p>Giai thừa của n (n!) là tích của tất cả các số nguyên từ 1 đến n.</p>
        <pre><code>n! = 1 × 2 × 3 × ... × n
0! = 1 (định nghĩa)</code></pre>

        <h3>📝 Đề bài</h3>
        <p>Viết function <code>factorial(n)</code> tính giai thừa của một số nguyên không âm.</p>

        <h3>💡 Ví dụ</h3>
        <pre><code>Input:  5
Output: 120  // 5! = 1*2*3*4*5 = 120

Input:  0
Output: 1   // 0! = 1 (định nghĩa)

Input:  1
Output: 1   // 1! = 1

Input:  3
Output: 6   // 3! = 1*2*3 = 6</code></pre>

        <h3>🎯 Yêu cầu</h3>
        <ul>
          <li>n là số nguyên không âm (n >= 0)</li>
          <li>0! = 1</li>
          <li>Có thể dùng vòng lặp hoặc đệ quy</li>
        </ul>
      `,
            publishedAt: new Date(),
        },
    });
    await prisma.lessonContent.create({
        data: {
            lessonId: lesson3_1.id,
            content: lesson3_1.content,
            starterCode: `// Tính giai thừa
function factorial(n) {
  // Viết code của bạn ở đây
  // Trả về n! (giai thừa của n)
  // Lưu ý: 0! = 1
  
}
module.exports = { factorial };`,
            testCases: JSON.stringify([
                // 5 Public test cases
                { id: 'test-0', input: '5', expectedOutput: '120', isPublic: true, points: 10 },
                { id: 'test-1', input: '0', expectedOutput: '1', isPublic: true, points: 10 },
                { id: 'test-2', input: '1', expectedOutput: '1', isPublic: true, points: 10 },
                { id: 'test-3', input: '3', expectedOutput: '6', isPublic: true, points: 10 },
                { id: 'test-4', input: '7', expectedOutput: '5040', isPublic: true, points: 10 },
                // 5 Hidden test cases
                { id: 'test-5', input: '10', expectedOutput: '3628800', isPublic: false, points: 10 },
                { id: 'test-6', input: '4', expectedOutput: '24', isPublic: false, points: 10 },
                { id: 'test-7', input: '6', expectedOutput: '720', isPublic: false, points: 10 },
                { id: 'test-8', input: '8', expectedOutput: '40320', isPublic: false, points: 10 },
                { id: 'test-9', input: '2', expectedOutput: '2', isPublic: false, points: 10 },
            ]),
            hints: JSON.stringify([
                { content: 'Sử dụng vòng lặp for để nhân các số từ 1 đến n', penalty: 5 },
                { content: 'Khởi tạo result = 1, sau đó nhân từ 1 đến n', penalty: 8 },
            ]),
            timeLimit: 1000,
            memoryLimit: 256,
        },
    });
    await prisma.scoringConfig.create({
        data: {
            lessonId: lesson3_1.id,
            baseScore: 100,
            penaltyPerHint: 10,
        },
    });
    console.log('  ✅ Bài 3.1: Tính giai thừa');
    // Bài 3.2: Đảo ngược chuỗi
    const lesson3_2 = await prisma.lesson.create({
        data: {
            phaseId: phase3.id,
            title: 'Bài 3.2: Đảo ngược chuỗi',
            type: 'CODE',
            orderIndex: 2,
            isPublished: true,
            status: 'PUBLISHED',
            content: `
        <h2>Bài 3.2: Đảo ngược chuỗi</h2>
        
        <h3>📖 Công thức</h3>
        <p>Đảo ngược thứ tự các ký tự trong chuỗi.</p>
        <pre><code>"hello" → "olleh"
"JavaScript" → "tpircSavaJ"</code></pre>

        <h3>📝 Đề bài</h3>
        <p>Viết function <code>reverseString(str)</code> đảo ngược chuỗi được nhập vào.</p>

        <h3>💡 Ví dụ</h3>
        <pre><code>Input:  "hello"
Output: "olleh"

Input:  "JavaScript"
Output: "tpircSavaJ"

Input:  "a"
Output: "a"

Input:  ""
Output: ""</code></pre>

        <h3>🎯 Yêu cầu</h3>
        <ul>
          <li>Trả về chuỗi đã được đảo ngược</li>
          <li>Chuỗi rỗng trả về chuỗi rỗng</li>
          <li>Chuỗi 1 ký tự trả về chính nó</li>
        </ul>
      `,
            publishedAt: new Date(),
        },
    });
    await prisma.lessonContent.create({
        data: {
            lessonId: lesson3_2.id,
            content: lesson3_2.content,
            starterCode: `// Đảo ngược chuỗi
function reverseString(str) {
  // Viết code của bạn ở đây
  // Trả về chuỗi đã được đảo ngược
  
}
module.exports = { reverseString };`,
            testCases: JSON.stringify([
                // 5 Public test cases
                { id: 'test-0', input: '"hello"', expectedOutput: '"olleh"', isPublic: true, points: 10 },
                { id: 'test-1', input: '"JavaScript"', expectedOutput: '"tpircSavaJ"', isPublic: true, points: 10 },
                { id: 'test-2', input: '"a"', expectedOutput: '"a"', isPublic: true, points: 10 },
                { id: 'test-3', input: '""', expectedOutput: '""', isPublic: true, points: 10 },
                { id: 'test-4', input: '"World"', expectedOutput: '"dlroW"', isPublic: true, points: 10 },
                // 5 Hidden test cases
                { id: 'test-5', input: '"CodeFit"', expectedOutput: '"tFidoC"', isPublic: false, points: 10 },
                { id: 'test-6', input: '"abc"', expectedOutput: '"cba"', isPublic: false, points: 10 },
                { id: 'test-7', input: '"12345"', expectedOutput: '"54321"', isPublic: false, points: 10 },
                { id: 'test-8', input: '"racecar"', expectedOutput: '"racecar"', isPublic: false, points: 10 },
                { id: 'test-9', input: '"Hi"', expectedOutput: '"iH"', isPublic: false, points: 10 },
            ]),
            hints: JSON.stringify([
                { content: 'Có thể dùng split("").reverse().join("")', penalty: 5 },
                { content: 'Hoặc dùng vòng lặp để xây dựng chuỗi mới', penalty: 8 },
            ]),
            timeLimit: 1000,
            memoryLimit: 256,
        },
    });
    await prisma.scoringConfig.create({
        data: {
            lessonId: lesson3_2.id,
            baseScore: 100,
            penaltyPerHint: 10,
        },
    });
    console.log('  ✅ Bài 3.2: Đảo ngược chuỗi');
    // Bài 3.3: Đếm số chữ số
    const lesson3_3 = await prisma.lesson.create({
        data: {
            phaseId: phase3.id,
            title: 'Bài 3.3: Đếm số chữ số',
            type: 'CODE',
            orderIndex: 3,
            isPublished: true,
            status: 'PUBLISHED',
            content: `
        <h2>Bài 3.3: Đếm số chữ số</h2>
        
        <h3>📖 Công thức</h3>
        <p>Đếm số chữ số trong một số nguyên.</p>
        <pre><code>12345 → 5 chữ số
0 → 1 chữ số
-123 → 3 chữ số</code></pre>

        <h3>📝 Đề bài</h3>
        <p>Viết function <code>countDigits(n)</code> đếm số chữ số của một số nguyên.</p>

        <h3>💡 Ví dụ</h3>
        <pre><code>Input:  12345
Output: 5

Input:  0
Output: 1

Input:  -456
Output: 3

Input:  9
Output: 1</code></pre>

        <h3>🎯 Yêu cầu</h3>
        <ul>
          <li>Đếm cả số âm (bỏ qua dấu trừ)</li>
          <li>0 có 1 chữ số</li>
          <li>Trả về số nguyên dương</li>
        </ul>
      `,
            publishedAt: new Date(),
        },
    });
    await prisma.lessonContent.create({
        data: {
            lessonId: lesson3_3.id,
            content: lesson3_3.content,
            starterCode: `// Đếm số chữ số
function countDigits(n) {
  // Viết code của bạn ở đây
  // Trả về số chữ số của n
  // Lưu ý: số âm thì bỏ qua dấu trừ, 0 có 1 chữ số
  
}
module.exports = { countDigits };`,
            testCases: JSON.stringify([
                // 5 Public test cases
                { id: 'test-0', input: '12345', expectedOutput: '5', isPublic: true, points: 10 },
                { id: 'test-1', input: '0', expectedOutput: '1', isPublic: true, points: 10 },
                { id: 'test-2', input: '-456', expectedOutput: '3', isPublic: true, points: 10 },
                { id: 'test-3', input: '9', expectedOutput: '1', isPublic: true, points: 10 },
                { id: 'test-4', input: '100', expectedOutput: '3', isPublic: true, points: 10 },
                // 5 Hidden test cases
                { id: 'test-5', input: '999', expectedOutput: '3', isPublic: false, points: 10 },
                { id: 'test-6', input: '-123', expectedOutput: '3', isPublic: false, points: 10 },
                { id: 'test-7', input: '7', expectedOutput: '1', isPublic: false, points: 10 },
                { id: 'test-8', input: '1000', expectedOutput: '4', isPublic: false, points: 10 },
                { id: 'test-9', input: '-9999', expectedOutput: '4', isPublic: false, points: 10 },
            ]),
            hints: JSON.stringify([
                { content: 'Chuyển số âm thành số dương bằng Math.abs()', penalty: 5 },
                { content: 'Dùng vòng lặp chia cho 10 đến khi n == 0', penalty: 8 },
            ]),
            timeLimit: 1000,
            memoryLimit: 256,
        },
    });
    await prisma.scoringConfig.create({
        data: {
            lessonId: lesson3_3.id,
            baseScore: 100,
            penaltyPerHint: 10,
        },
    });
    console.log('  ✅ Bài 3.3: Đếm số chữ số');
    // MINITEST PHASE 3
    const problem3_1 = await prisma.problem.upsert({
        where: { id: 'prob-p3-fact-seed' },
        update: {},
        create: {
            id: 'prob-p3-fact-seed',
            title: 'Tính giai thừa (Minitest Chương 3)',
            description: 'Tính giai thừa của một số nguyên',
            difficulty: 'EASY',
            timeLimit: 1000,
            memoryLimit: 256,
        },
    });
    await prisma.testcase.upsert({
        where: { id: 'tc-p3-fact-1' },
        update: {},
        create: {
            id: 'tc-p3-fact-1',
            problemId: problem3_1.id,
            input: '5',
            expectedOutput: '120',
            isPublic: true,
        },
    });
    await prisma.testcase.upsert({
        where: { id: 'tc-p3-fact-2' },
        update: {},
        create: {
            id: 'tc-p3-fact-2',
            problemId: problem3_1.id,
            input: '0',
            expectedOutput: '1',
            isPublic: true,
        },
    });
    const minitest3 = await prisma.minitest.create({
        data: {
            phaseId: phase3.id,
            title: 'Mini Test - Chương 3: Vòng Lặp',
            orderIndex: 1,
        },
    });
    await prisma.minitestQuestion.createMany({
        data: [
            { minitestId: minitest3.id, problemId: problem3_1.id },
        ],
        skipDuplicates: true,
    });
    console.log('\n📝 Created Minitest Phase 3:', minitest3.title);
    // ============================================
    // ENROLLMENT
    // ============================================
    const existingEnrollment = await prisma.enrollment.findFirst({
        where: { userId: user.id, courseId: course.id },
    });
    if (!existingEnrollment) {
        await prisma.enrollment.create({
            data: {
                userId: user.id,
                courseId: course.id,
                currentUnlocks: 3,
                completedLessons: 0,
                progress: 0,
            },
        });
        console.log('\n✅ Created enrollment for user:', user.email);
    }
    else {
        await prisma.enrollment.update({
            where: { id: existingEnrollment.id },
            data: {
                currentUnlocks: 3,
                completedLessons: 0,
                progress: 0,
            },
        });
        console.log('\n✅ Reset enrollment progress');
    }
    // ============================================
    // SUMMARY
    // ============================================
    console.log('\n' + '='.repeat(60));
    console.log('✅ SEED COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('\n📋 Course Summary:');
    console.log(`   Course ID: ${course.id}`);
    console.log(`   Title: ${course.title}`);
    console.log(`   URL: http://localhost:8000/user/course/${course.id}`);
    console.log(`\n   📚 Phase 1: Biến và Toán Tử`);
    console.log(`      - Bài 1.1: Tính tổng 2 số`);
    console.log(`      - Bài 1.2: Tính tích 2 số`);
    console.log(`      - Bài 1.3: Kiểm tra số chẵn/lẻ`);
    console.log(`      - 📝 Mini Test Chương 1`);
    console.log(`\n   📚 Phase 2: Cấu Trúc Điều Khiển`);
    console.log(`      - Bài 2.1: Tìm số lớn hơn`);
    console.log(`      - Bài 2.2: Kiểm tra năm nhuận`);
    console.log(`      - Bài 2.3: FizzBuzz cơ bản`);
    console.log(`      - 📝 Mini Test Chương 2`);
    console.log(`\n   📚 Phase 3: Vòng Lặp`);
    console.log(`      - Bài 3.1: Tính giai thừa`);
    console.log(`      - Bài 3.2: Đảo ngược chuỗi`);
    console.log(`      - Bài 3.3: Đếm số chữ số`);
    console.log(`      - 📝 Mini Test Chương 3`);
    console.log('\n🔑 Login: testuser@codefit.com / password123');
    console.log('='.repeat(60) + '\n');
}
main()
    .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seedDetailedCourse.js.map