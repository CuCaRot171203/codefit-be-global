import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting seed for new CodeFit course...\n');

  // Get or create user role
  let role = await prisma.role.findFirst({ where: { name: 'user' } });
  if (!role) {
    role = await prisma.role.create({
      data: { name: 'user', description: 'Regular user' },
    });
    console.log('✅ Created role: user');
  }

  // Get or create admin role
  let adminRole = await prisma.role.findFirst({ where: { name: 'admin' } });
  if (!adminRole) {
    adminRole = await prisma.role.create({
      data: { name: 'admin', description: 'Administrator' },
    });
    console.log('✅ Created role: admin');
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
  } else {
    console.log('ℹ️  Using existing user:', user.email);
  }

  // ============================================
  // CREATE COURSE
  // ============================================
  let course = await prisma.course.findFirst({
    where: { title: { contains: 'JavaScript Cơ Bản - Test' } },
  });

  if (!course) {
    course = await prisma.course.create({
      data: {
        title: 'JavaScript Cơ Bản - Test',
        description: 'Khóa học JavaScript cơ bản dành cho người mới bắt đầu lập trình. Đặc biệt phù hợp với sinh viên FPT University.',
        price: 0,
        level: 'BEGINNER',
        image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
        duration: '4 tuần',
        creatorId: user.id,
        unlockLessonsCount: 2, // Unlock 2 lessons at a time
        unlockByPhase: false,
        subscriptionType: 'FREE',
      },
    });
    console.log('✅ Created course:', course.title);
  } else {
    // Delete existing phases and lessons for clean slate
    await prisma.phase.deleteMany({ where: { courseId: course.id } });
    console.log('ℹ️  Using existing course:', course.title);
  }

  // ============================================
  // PHASE 1: JavaScript Cơ Bản (5 bài)
  // ============================================
  const phase1 = await prisma.phase.create({
    data: {
      courseId: course.id,
      title: 'Chương 1: JavaScript Cơ Bản',
      orderIndex: 1,
    },
  });
  console.log('\n📚 Created Phase 1:', phase1.title);

  // Lessons for Phase 1
  const lessonsPhase1Data = [
    {
      title: 'Bài 1: Giới thiệu JavaScript',
      type: 'LECTURE',
      content: `
        <h2>Giới thiệu về JavaScript</h2>
        <p>JavaScript là ngôn ngữ lập trình phổ biến nhất thế giới, được sử dụng để tạo các trang web tương tác.</p>
        
        <h3>JavaScript là gì?</h3>
        <ul>
          <li>JavaScript là ngôn ngữ lập trình của Web</li>
          <li>JavaScript được sử dụng rộng rãi trong phát triển web</li>
          <li>JavaScript có thể cập nhật HTML và CSS</li>
        </ul>

        <h3>Ví dụ đơn giản</h3>
        <pre><code>console.log("Hello, World!");</code></pre>
        
        <h3>Tại sao nên học JavaScript?</h3>
        <ol>
          <li>Dễ học cho người mới bắt đầu</li>
          <li>Có nhu cầu tuyển dụng cao</li>
          <li>Có thể sử dụng cho cả frontend và backend</li>
        </ol>
      `,
    },
    {
      title: 'Bài 2: Biến và Kiểu dữ liệu',
      type: 'LECTURE',
      content: `
        <h2>Biến và Kiểu dữ liệu trong JavaScript</h2>
        
        <h3>Khai báo biến</h3>
        <p>Trong JavaScript, chúng ta có 3 cách khai báo biến:</p>
        <ul>
          <li><code>let</code> - khai báo biến có phạm vi block</li>
          <li><code>const</code> - khai báo hằng số</li>
          <li><code>var</code> - khai báo biến (cách cũ)</li>
        </ul>

        <h3>Kiểu dữ liệu</h3>
        <p>JavaScript có các kiểu dữ liệu cơ bản:</p>
        <ul>
          <li>Number - số (vd: 42, 3.14)</li>
          <li>String - chuỗi (vd: "Hello")</li>
          <li>Boolean - đúng/sai (true, false)</li>
          <li>Undefined - chưa được gán giá trị</li>
          <li>Null - giá trị rỗng</li>
        </ul>

        <h3>Ví dụ</h3>
        <pre><code>let name = "FPT";
let age = 20;
let isStudent = true;</code></pre>
      `,
    },
    {
      title: 'Bài 3: Toán tử và Biểu thức',
      type: 'LECTURE',
      content: `
        <h2>Toán tử trong JavaScript</h2>
        
        <h3>Toán tử số học</h3>
        <table>
          <tr><td>+</td><td>Cộng</td></tr>
          <tr><td>-</td><td>Trừ</td></tr>
          <tr><td>*</td><td>Nhân</td></tr>
          <tr><td>/</td><td>Chia</td></tr>
          <tr><td>%</td><td>Chia lấy dư</td></tr>
        </table>

        <h3>Ví dụ</h3>
        <pre><code>let a = 10;
let b = 3;
console.log(a + b);  // 13
console.log(a - b);  // 7
console.log(a * b);  // 30
console.log(a / b);  // 3.33...
console.log(a % b);  // 1</code></pre>
      `,
    },
    {
      title: 'Bài 4: Bài tập Two Sum',
      type: 'CODE',
      content: `
        <h2>Bài tập: Two Sum</h2>
        <p>Đây là bài tập lập trình kinh điển giúp bạn làm quen với việc giải thuật toán.</p>
        
        <h3>Đề bài</h3>
        <p>Cho một mảng số nguyên <code>nums</code> và một số nguyên <code>target</code>, hãy tìm hai số trong mảng sao cho tổng của chúng bằng <code>target</code>.</p>
        <p>Trả về chỉ số của hai số đó.</p>

        <h3>Ví dụ</h3>
        <pre><code>Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1]  // vì nums[0] + nums[1] = 2 + 7 = 9</code></pre>

        <h3>Gợi ý</h3>
        <p>Sử dụng HashMap để lưu trữ các giá trị đã duyệt qua.</p>
      `,
      starterCode: `// Two Sum Solution
function twoSum(nums, target) {
  // Viết code của bạn ở đây
  
}

// Test
console.log(twoSum([2, 7, 11, 15], 9)); // Expected: [0, 1]`,
      starterLanguage: 'javascript',
      hints: JSON.stringify([
        { content: 'Sử dụng Map để lưu trữ giá trị và chỉ số', penalty: 10 },
        { content: 'Với mỗi phần tử, kiểm tra xem (target - nums[i]) có trong Map không', penalty: 10 },
      ]),
      testCases: JSON.stringify([
        { input: '[2, 7, 11, 15], 9', expectedOutput: '[0, 1]', isPublic: true, points: 25 },
        { input: '[3, 2, 4], 6', expectedOutput: '[1, 2]', isPublic: true, points: 25 },
        { input: '[3, 3], 6', expectedOutput: '[0, 1]', isPublic: false, points: 25 },
      ]),
      timeLimit: 1000,
      memoryLimit: 256,
      baseScore: 100,
      penaltyPerHint: 10,
    },
    {
      title: 'Bài 5: Bài tập Reverse String',
      type: 'CODE',
      content: `
        <h2>Bài tập: Reverse String</h2>
        
        <h3>Đề bài</h3>
        <p>Đảo ngược chuỗi được nhập vào.</p>

        <h3>Ví dụ</h3>
        <pre><code>Input: "hello"
Output: "olleh"</code></pre>

        <h3>Yêu cầu</h3>
        <ul>
          <li>Viết hoa các nguyên âm (a, e, i, o, u)</li>
          <li>Giữ nguyên các ký tự khác</li>
        </ul>
      `,
      starterCode: `// Reverse and Capitalize Vowels
function reverseAndCapitalize(str) {
  // Viết code của bạn ở đây
  
}

// Test
console.log(reverseAndCapitalize("hello")); // Expected: "OlEH"`,
      starterLanguage: 'javascript',
      hints: JSON.stringify([
        { content: 'Đảo ngược chuỗi bằng split("").reverse().join("")', penalty: 10 },
        { content: 'Kiểm tra từng ký tự có phải nguyên âm không', penalty: 10 },
      ]),
      testCases: JSON.stringify([
        { input: '"hello"', expectedOutput: '"OlEH"', isPublic: true, points: 50 },
        { input: '"javascript"', expectedOutput: '"tpircSavaJ"', isPublic: false, points: 50 },
      ]),
      timeLimit: 1000,
      memoryLimit: 256,
      baseScore: 100,
      penaltyPerHint: 10,
    },
  ];

  for (let i = 0; i < lessonsPhase1Data.length; i++) {
    const lessonData = lessonsPhase1Data[i];
    const isLocked = i < 3; // Lock first 3 lessons

    const lesson = await prisma.lesson.create({
      data: {
        phaseId: phase1.id,
        title: lessonData.title,
        type: lessonData.type,
        orderIndex: i + 1,
        isPublished: true,
        status: 'PUBLISHED',
        content: lessonData.content,
        publishedAt: new Date(),
      },
    });

    // Create lesson content for code lessons
    if (lessonData.type === 'CODE' && lessonData.starterCode) {
      await prisma.lessonContent.create({
        data: {
          lessonId: lesson.id,
          content: lessonData.content,
          starterCode: lessonData.starterCode,
          testCases: lessonData.testCases || '[]',
          hints: lessonData.hints || '[]',
          timeLimit: lessonData.timeLimit || 1000,
          memoryLimit: lessonData.memoryLimit || 256,
        },
      });

      // Create scoring config
      await prisma.scoringConfig.create({
        data: {
          lessonId: lesson.id,
          baseScore: lessonData.baseScore || 100,
          penaltyPerHint: lessonData.penaltyPerHint || 10,
        },
      });
    }

    console.log(`  ${isLocked ? '🔒' : '📖'} ${lessonData.title}${isLocked ? ' (LOCKED)' : ''}`);
  }

  // ============================================
  // MINITEST PHASE 1
  // ============================================
  // Create problems for minitest
  const problem1 = await prisma.problem.upsert({
    where: { id: 'prob-two-sum-seed' },
    update: {},
    create: {
      id: 'prob-two-sum-seed',
      title: 'Two Sum (Minitest)',
      description: 'Given an array of integers, return indices of the two numbers that add up to target.',
      difficulty: 'EASY',
      timeLimit: 1000,
      memoryLimit: 256,
    },
  });

  const problem2 = await prisma.problem.upsert({
    where: { id: 'prob-palindrome-seed' },
    update: {},
    create: {
      id: 'prob-palindrome-seed',
      title: 'Palindrome Number',
      description: 'Determine if an integer is a palindrome.',
      difficulty: 'EASY',
      timeLimit: 1000,
      memoryLimit: 256,
    },
  });

  // Create testcases for problem 1
  await prisma.testcase.upsert({
    where: { id: 'tc-two-sum-1' },
    update: {},
    create: {
      id: 'tc-two-sum-1',
      problemId: problem1.id,
      input: 'nums = [2, 7, 11, 15], target = 9',
      expectedOutput: '[0, 1]',
      isPublic: true,
    },
  });

  await prisma.testcase.upsert({
    where: { id: 'tc-two-sum-2' },
    update: {},
    create: {
      id: 'tc-two-sum-2',
      problemId: problem1.id,
      input: 'nums = [3, 2, 4], target = 6',
      expectedOutput: '[1, 2]',
      isPublic: true,
    },
  });

  // Create testcases for problem 2
  await prisma.testcase.upsert({
    where: { id: 'tc-palindrome-1' },
    update: {},
    create: {
      id: 'tc-palindrome-1',
      problemId: problem2.id,
      input: '121',
      expectedOutput: 'true',
      isPublic: true,
    },
  });

  await prisma.testcase.upsert({
    where: { id: 'tc-palindrome-2' },
    update: {},
    create: {
      id: 'tc-palindrome-2',
      problemId: problem2.id,
      input: '-121',
      expectedOutput: 'false',
      isPublic: false,
    },
  });

  // Create minitest for Phase 1
  const minitestPhase1 = await prisma.minitest.create({
    data: {
      phaseId: phase1.id,
      title: 'Mini Test - Chương 1',
      orderIndex: 1,
    },
  });

  // Link problems to minitest
  await prisma.minitestQuestion.createMany({
    data: [
      { minitestId: minitestPhase1.id, problemId: problem1.id },
      { minitestId: minitestPhase1.id, problemId: problem2.id },
    ],
    skipDuplicates: true,
  });

  console.log('\n📝 Created Minitest:', minitestPhase1.title);
  console.log('   - Two Sum');
  console.log('   - Palindrome Number');

  // ============================================
  // PHASE 2: Cấu trúc điều khiển (2 bài)
  // ============================================
  const phase2 = await prisma.phase.create({
    data: {
      courseId: course.id,
      title: 'Chương 2: Cấu trúc điều khiển',
      orderIndex: 2,
    },
  });
  console.log('\n📚 Created Phase 2:', phase2.title);

  const lessonsPhase2Data = [
    {
      title: 'Bài 6: Câu lệnh If-Else',
      type: 'LECTURE',
      content: `
        <h2>Câu lệnh If-Else trong JavaScript</h2>
        
        <h3>Cú pháp</h3>
        <pre><code>if (condition) {
  // code block nếu condition là true
} else {
  // code block nếu condition là false
}</code></pre>

        <h3>Ví dụ</h3>
        <pre><code>let age = 18;
if (age >= 18) {
  console.log("Bạn là người lớn");
} else {
  console.log("Bạn là trẻ em");
}</code></pre>

        <h3>If-Else If-Else</h3>
        <pre><code>let score = 85;
if (score >= 90) {
  console.log("Xuất sắc");
} else if (score >= 70) {
  console.log("Giỏi");
} else if (score >= 50) {
  console.log("Trung bình");
} else {
  console.log("Yếu");
}</code></pre>
      `,
    },
    {
      title: 'Bài 7: Bài tập FizzBuzz',
      type: 'CODE',
      content: `
        <h2>Bài tập: FizzBuzz</h2>
        
        <h3>Đề bài</h3>
        <p>Viết chương trình in các số từ 1 đến n:</p>
        <ul>
          <li>Nếu số chia hết cho 3, in "Fizz"</li>
          <li>Nếu số chia hết cho 5, in "Buzz"</li>
          <li>Nếu số chia hết cho cả 3 và 5, in "FizzBuzz"</li>
          <li>Nếu không, in số đó</li>
        </ul>

        <h3>Ví dụ</h3>
        <pre><code>Input: 15
Output: 1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz</code></pre>
      `,
      starterCode: `// FizzBuzz
function fizzBuzz(n) {
  // Viết code của bạn ở đây
  // Trả về mảng kết quả
  
}

// Test
console.log(fizzBuzz(15));`,
      starterLanguage: 'javascript',
      hints: JSON.stringify([
        { content: 'Kiểm tra chia hết cho 15 trước (3 và 5)', penalty: 10 },
        { content: 'Sau đó kiểm tra chia hết cho 3, rồi 5', penalty: 10 },
      ]),
      testCases: JSON.stringify([
        { input: '3', expectedOutput: '["1","2","Fizz"]', isPublic: true, points: 33 },
        { input: '5', expectedOutput: '["1","2","Fizz","4","Buzz"]', isPublic: true, points: 33 },
        { input: '15', expectedOutput: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]', isPublic: false, points: 34 },
      ]),
      timeLimit: 1000,
      memoryLimit: 256,
      baseScore: 100,
      penaltyPerHint: 10,
    },
  ];

  for (let i = 0; i < lessonsPhase2Data.length; i++) {
    const lessonData = lessonsPhase2Data[i];
    
    const lesson = await prisma.lesson.create({
      data: {
        phaseId: phase2.id,
        title: lessonData.title,
        type: lessonData.type,
        orderIndex: i + 1,
        isPublished: true,
        status: 'PUBLISHED',
        content: lessonData.content,
        publishedAt: new Date(),
      },
    });

    // Create lesson content for code lessons
    if (lessonData.type === 'CODE' && lessonData.starterCode) {
      await prisma.lessonContent.create({
        data: {
          lessonId: lesson.id,
          content: lessonData.content,
          starterCode: lessonData.starterCode,
          testCases: lessonData.testCases || '[]',
          hints: lessonData.hints || '[]',
          timeLimit: lessonData.timeLimit || 1000,
          memoryLimit: lessonData.memoryLimit || 256,
        },
      });

      await prisma.scoringConfig.create({
        data: {
          lessonId: lesson.id,
          baseScore: lessonData.baseScore || 100,
          penaltyPerHint: lessonData.penaltyPerHint || 10,
        },
      });
    }

    console.log(`  📖 ${lessonData.title}`);
  }

  // ============================================
  // FINAL TEST (Course Level)
  // ============================================
  const problem3 = await prisma.problem.upsert({
    where: { id: 'prob-fizzbuzz-final-seed' },
    update: {},
    create: {
      id: 'prob-fizzbuzz-final-seed',
      title: 'FizzBuzz (Final Test)',
      description: 'Classic FizzBuzz problem for final test.',
      difficulty: 'EASY',
      timeLimit: 1000,
      memoryLimit: 256,
    },
  });

  // Create testcases for final test problem
  await prisma.testcase.upsert({
    where: { id: 'tc-fizzbuzz-final-1' },
    update: {},
    create: {
      id: 'tc-fizzbuzz-final-1',
      problemId: problem3.id,
      input: '3',
      expectedOutput: '["1","2","Fizz"]',
      isPublic: true,
    },
  });

  await prisma.testcase.upsert({
    where: { id: 'tc-fizzbuzz-final-2' },
    update: {},
    create: {
      id: 'tc-fizzbuzz-final-2',
      problemId: problem3.id,
      input: '15',
      expectedOutput: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]',
      isPublic: true,
    },
  });

  // Create Project (Final Test) for course
  const finalTest = await prisma.project.upsert({
    where: { id: `project-${course.id}-final` },
    update: {},
    create: {
      id: `project-${course.id}-final`,
      courseId: course.id,
      title: 'Final Test - JavaScript Cơ Bản',
      description: 'Bài kiểm tra cuối khóa. Hoàn thành tất cả bài tập để nhận chứng chỉ.',
    },
  });

  console.log('\n🎯 Created Final Test:', finalTest.title);

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
        currentUnlocks: 2, // Initially unlock 2 lessons
        completedLessons: 0,
        progress: 0,
      },
    });
    console.log('\n✅ Created enrollment for user:', user.email);
  } else {
    // Reset enrollment progress
    await prisma.enrollment.update({
      where: { id: existingEnrollment.id },
      data: {
        currentUnlocks: 2,
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
  console.log(`   Phases: 2`);
  console.log(`   Total Lessons: 7`);
  console.log(`   Code Exercises: 3 (Bài 4, 5, 7)`);
  console.log(`   Minitests: 1 (Phase 1)`);
  console.log(`   Final Test: 1`);
  console.log('\n🔓 Lesson Unlock System:');
  console.log(`   - Initial unlocks: 2 lessons`);
  console.log(`   - Phase 1: 5 lessons (3 locked initially)`);
  console.log(`   - Phase 2: 2 lessons`);
  console.log(`   - Complete Phase 1 lessons → Unlock Minitest`);
  console.log(`   - Complete all lessons → Unlock Final Test`);
  console.log('\n🌐 Access URLs:');
  console.log(`   - Course: http://localhost:8000/user/course/${course.id}`);
  console.log(`   - Login: testuser@codefit.com / password123`);
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
