import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting seed for CodeFit Course with Final Test & Project...\n');

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
  } else {
    console.log('ℹ️  Using existing user:', user.email);
  }

  // ============================================
  // CREATE COURSE
  // ============================================
  let course = await prisma.course.findFirst({
    where: { title: { contains: 'Web Development Bootcamp' } },
  });

  if (!course) {
    course = await prisma.course.create({
      data: {
        title: 'Web Development Bootcamp',
        description: 'Khóa học lập trình Web từ cơ bản đến nâng cao. Hoàn thành khóa học để nhận chứng chỉ.',
        price: 0,
        level: 'BEGINNER',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
        duration: '8 tuần',
        creatorId: user.id,
        unlockLessonsCount: 1,
        unlockByPhase: false,
        subscriptionType: 'FREE',
      },
    });
    console.log('✅ Created course:', course.title);
  } else {
    // Delete existing phases
    await prisma.phase.deleteMany({ where: { courseId: course.id } });
    await prisma.hackathon.deleteMany({ where: { title: { contains: 'Final Test' } } });
    await prisma.project.deleteMany({ where: { courseId: course.id } });
    console.log('ℹ️  Using existing course:', course.title);
  }

  // ============================================
  // HELPER: Create Problem
  // ============================================
  const createProblem = async (id: string, title: string, description: string, difficulty: string, testCases: any[]) => {
    const problem = await prisma.problem.upsert({
      where: { id },
      update: {},
      create: {
        id,
        title,
        description,
        difficulty,
        timeLimit: 2000,
        memoryLimit: 256,
      },
    });

    for (const tc of testCases) {
      await prisma.testcase.upsert({
        where: { id: tc.id },
        update: {},
        create: {
          id: tc.id,
          problemId: problem.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          isPublic: tc.isPublic,
        },
      });
    }

    return problem;
  };

  // ============================================
  // HELPER: Create Lesson with Content
  // ============================================
  const createLesson = async (phaseId: string, title: string, orderIndex: number, content: string, starterCode: string, testCases: any[], hints: any[]) => {
    const lesson = await prisma.lesson.create({
      data: {
        phaseId,
        title,
        type: 'CODE',
        orderIndex,
        isPublished: true,
        status: 'PUBLISHED',
        content,
        publishedAt: new Date(),
      },
    });

    await prisma.lessonContent.create({
      data: {
        lessonId: lesson.id,
        content,
        starterCode,
        testCases: JSON.stringify(testCases),
        hints: JSON.stringify(hints),
        timeLimit: 1000,
        memoryLimit: 256,
      },
    });

    await prisma.scoringConfig.create({
      data: {
        lessonId: lesson.id,
        baseScore: 100,
        penaltyPerHint: 10,
      },
    });

    return lesson;
  };

  // ============================================
  // HELPER: Create Minitest
  // ============================================
  const createMinitest = async (phaseId: string, title: string, orderIndex: number, problems: any[]) => {
    const minitest = await prisma.minitest.create({
      data: {
        phaseId,
        title,
        orderIndex,
      },
    });

    for (const p of problems) {
      await prisma.minitestQuestion.create({
        data: {
          minitestId: minitest.id,
          problemId: p.problemId,
        },
      });
    }

    return minitest;
  };

  // ============================================
  // PHASE 1: HTML & CSS Basics
  // ============================================
  const phase1 = await prisma.phase.create({
    data: {
      courseId: course.id,
      title: 'Chương 1: HTML & CSS Cơ Bản',
      orderIndex: 1,
    },
  });
  console.log('\n📚 Created Phase 1:', phase1.title);

  // Problem for Minitest 1
  const prob1 = await createProblem(
    'prob-m1-hello',
    'In dòng chữ (Minitest Chương 1)',
    'In ra dòng chữ "Hello World"',
    'EASY',
    [
      { id: 'tc-m1-h1', input: '', expectedOutput: 'Hello World', isPublic: true },
    ]
  );

  // Lesson 1.1: Hello World
  const lesson1_1 = await createLesson(
    phase1.id,
    'Bài 1.1: Hello World',
    1,
    `<h2>Bài 1.1: In dòng chữ đầu tiên</h2>
<p>Trong bài học này, bạn sẽ học cách in ra dòng chữ "Hello World" sử dụng Python.</p>
<h3>📖 Nội dung</h3>
<p>Hàm <code>print()</code> được sử dụng để in dữ liệu ra màn hình console.</p>
<h3>🎯 Yêu cầu</h3>
<ul>
  <li>In ra dòng chữ: <strong>Hello World</strong></li>
  <li>Chính xác như yêu cầu (phân biệt hoa thường)</li>
</ul>`,
    `# In ra dòng chữ Hello World
print("Hello World")`,
    [
      { id: 't1-1', input: '', expectedOutput: 'Hello World', isPublic: true, points: 50 },
      { id: 't1-2', input: '', expectedOutput: 'Hello World', isPublic: false, points: 50 },
    ],
    [
      { content: 'Dùng hàm print() để in', penalty: 5 },
    ]
  );
  console.log('  ✅ Bài 1.1: Hello World');

  // Minitest Phase 1
  const minitest1 = await createMinitest(phase1.id, 'Mini Test - Chương 1: HTML & CSS', 1, [
    { problemId: prob1.id },
  ]);
  console.log('  📝 Mini Test Chương 1');

  // ============================================
  // PHASE 2: JavaScript Fundamentals
  // ============================================
  const phase2 = await prisma.phase.create({
    data: {
      courseId: course.id,
      title: 'Chương 2: JavaScript Cơ Bản',
      orderIndex: 2,
    },
  });
  console.log('\n📚 Created Phase 2:', phase2.title);

  // Problem for Minitest 2
  const prob2 = await createProblem(
    'prob-m2-sum',
    'Tính tổng 2 số (Minitest Chương 2)',
    'Tính tổng của 2 số nguyên',
    'EASY',
    [
      { id: 'tc-m2-s1', input: '3 5', expectedOutput: '8', isPublic: true },
      { id: 'tc-m2-s2', input: '10 20', expectedOutput: '30', isPublic: true },
    ]
  );

  // Lesson 2.1: Tính tổng
  const lesson2_1 = await createLesson(
    phase2.id,
    'Bài 2.1: Tính tổng 2 số',
    1,
    `<h2>Bài 2.1: Tính tổng 2 số nguyên</h2>
<p>Viết chương trình tính tổng của 2 số nguyên.</p>
<h3>📖 Ví dụ</h3>
<pre>
Input:  3 5
Output: 8
</pre>
<h3>🎯 Yêu cầu</h3>
<ul>
  <li>Đọc 2 số nguyên từ input</li>
  <li>Tính và in ra tổng</li>
</ul>`,
    `# Đọc input và tính tổng 2 số
# Input: 2 số nguyên
a, b = map(int, input().split())
print(a + b)`,
    [
      { id: 't2-1', input: '3 5', expectedOutput: '8', isPublic: true, points: 25 },
      { id: 't2-2', input: '1 2', expectedOutput: '3', isPublic: true, points: 25 },
      { id: 't2-3', input: '10 20', expectedOutput: '30', isPublic: false, points: 25 },
      { id: 't2-4', input: '100 200', expectedOutput: '300', isPublic: false, points: 25 },
    ],
    [
      { content: 'Dùng input().split() để đọc nhiều giá trị', penalty: 5 },
      { content: 'Dùng int() để chuyển sang số nguyên', penalty: 5 },
    ]
  );
  console.log('  ✅ Bài 2.1: Tính tổng');

  // Minitest Phase 2
  const minitest2 = await createMinitest(phase2.id, 'Mini Test - Chương 2: JavaScript', 1, [
    { problemId: prob2.id },
  ]);
  console.log('  📝 Mini Test Chương 2');

  // ============================================
  // PHASE 3: React Basics
  // ============================================
  const phase3 = await prisma.phase.create({
    data: {
      courseId: course.id,
      title: 'Chương 3: React Cơ Bản',
      orderIndex: 3,
    },
  });
  console.log('\n📚 Created Phase 3:', phase3.title);

  // Problem for Minitest 3
  const prob3 = await createProblem(
    'prob-m3-factorial',
    'Tính giai thừa (Minitest Chương 3)',
    'Tính giai thừa của một số nguyên dương',
    'EASY',
    [
      { id: 'tc-m3-f1', input: '5', expectedOutput: '120', isPublic: true },
      { id: 'tc-m3-f2', input: '0', expectedOutput: '1', isPublic: true },
    ]
  );

  // Lesson 3.1: Giai thừa
  const lesson3_1 = await createLesson(
    phase3.id,
    'Bài 3.1: Tính giai thừa',
    1,
    `<h2>Bài 3.1: Tính giai thừa</h2>
<p>Tính giai thừa của một số nguyên dương n.</p>
<h3>📖 Định nghĩa</h3>
<p>n! = n × (n-1) × (n-2) × ... × 2 × 1</p>
<p>Quy ước: 0! = 1</p>
<h3>📖 Ví dụ</h3>
<pre>
Input:  5
Output: 120

Input:  0
Output: 1
</pre>
<h3>🎯 Yêu cầu</h3>
<ul>
  <li>Nếu n = 0, trả về 1</li>
  <li>Nếu n > 0, tính n!</li>
</ul>`,
    `# Tính giai thừa
n = int(input())
# Viết code của bạn ở đây
result = 1
for i in range(1, n + 1):
    result *= i
print(result)`,
    [
      { id: 't3-1', input: '5', expectedOutput: '120', isPublic: true, points: 20 },
      { id: 't3-2', input: '0', expectedOutput: '1', isPublic: true, points: 20 },
      { id: 't3-3', input: '10', expectedOutput: '3628800', isPublic: false, points: 30 },
      { id: 't3-4', input: '1', expectedOutput: '1', isPublic: false, points: 30 },
    ],
    [
      { content: 'Dùng vòng lặp for từ 1 đến n', penalty: 5 },
      { content: '0! = 1 theo quy ước toán học', penalty: 5 },
    ]
  );
  console.log('  ✅ Bài 3.1: Tính giai thừa');

  // Minitest Phase 3
  const minitest3 = await createMinitest(phase3.id, 'Mini Test - Chương 3: React', 1, [
    { problemId: prob3.id },
  ]);
  console.log('  📝 Mini Test Chương 3');

  // ============================================
  // FINAL TEST (Using Hackathon)
  // ============================================
  console.log('\n📚 Creating Final Test...');

  // Create final test problems
  const probFinal1 = await createProblem(
    'prob-final-1',
    'Kiểm tra số nguyên tố',
    'Kiểm tra xem một số có phải là số nguyên tố hay không',
    'MEDIUM',
    [
      { id: 'tc-f1-1', input: '7', expectedOutput: 'true', isPublic: true },
      { id: 'tc-f1-2', input: '4', expectedOutput: 'false', isPublic: true },
    ]
  );

  const probFinal2 = await createProblem(
    'prob-final-2',
    'Fibonacci',
    'Tính số Fibonacci thứ n',
    'MEDIUM',
    [
      { id: 'tc-f2-1', input: '10', expectedOutput: '55', isPublic: true },
      { id: 'tc-f2-2', input: '0', expectedOutput: '0', isPublic: true },
    ]
  );

  const finalTest = await prisma.hackathon.create({
    data: {
      courseId: course.id, // Link to course
      title: 'Final Test - Web Development Bootcamp',
      description: `Bài kiểm tra tổng hợp cuối khóa. Hoàn thành bài test để nhận chứng chỉ hoàn thành khóa học.

<b>📋 Nội dung:</b>
- Kiểm tra số nguyên tố
- Dãy Fibonacci

<b>⏰ Thời gian:</b> 60 phút

<b>📜 Yêu cầu:</b>
- Pass tất cả các bài tập
- Sau khi hoàn thành, bạn sẽ được tạo chứng chỉ`,
      startTime: new Date(),
      endTime: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    },
  });

  // Join user to final test
  await prisma.hackathonParticipant.upsert({
    where: {
      userId_hackathonId: {
        userId: user.id,
        hackathonId: finalTest.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      hackathonId: finalTest.id,
    },
  });

  console.log('  ✅ Final Test created:', finalTest.title);

  // ============================================
  // PROJECT (Upload Project)
  // ============================================
  console.log('\n📚 Creating Final Project...');

  const project = await prisma.project.create({
    data: {
      courseId: course.id,
      title: 'Project Cuối Khóa - Xây dựng Website Portfolio',
      description: `<h2>Project Cuối Khóa</h2>
<p>Hoàn thành project này để nhận chứng chỉ hoàn thành khóa học.</p>

<h3>📋 Yêu cầu Project:</h3>
<ul>
  <li><strong>HTML:</strong> Cấu trúc trang web đúng semantic</li>
  <li><strong>CSS:</strong> Styling responsive, sử dụng Flexbox/Grid</li>
  <li><strong>JavaScript:</strong> Tối thiểu 2 tính năng tương tác</li>
</ul>

<h3>📤 Upload:</h3>
<ul>
  <li>Định dạng: .zip hoặc .rar</li>
  <li>Dung lượng tối đa: <strong>25MB</strong></li>
  <li>Bao gồm: index.html, styles.css, script.js và các file cần thiết</li>
</ul>

<h3>📜 Tiêu chí chấm điểm:</h3>
<ul>
  <li>Code sạch, có comment (20 điểm)</li>
  <li>Responsive design (30 điểm)</li>
  <li>Tính năng tương tác (30 điểm)</li>
  <li>Giao diện đẹp (20 điểm)</li>
</ul>

<p>✅ Sau khi approved, bạn sẽ nhận được chứng chỉ hoàn thành khóa học!</p>`,
    },
  });

  console.log('  ✅ Final Project created:', project.title);

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
        currentUnlocks: 10,
        completedLessons: 0,
        progress: 0,
      },
    });
    console.log('\n✅ Created enrollment for user:', user.email);
  } else {
    await prisma.enrollment.update({
      where: { id: existingEnrollment.id },
      data: {
        currentUnlocks: 10,
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
  console.log(`   URL: http://localhost:8000/user/courses/${course.id}/content`);
  console.log(`\n   📚 Chương 1: HTML & CSS Cơ Bản`);
  console.log(`      - Bài 1.1: Hello World`);
  console.log(`      - 📝 Mini Test Chương 1`);
  console.log(`\n   📚 Chương 2: JavaScript Cơ Bản`);
  console.log(`      - Bài 2.1: Tính tổng 2 số`);
  console.log(`      - 📝 Mini Test Chương 2`);
  console.log(`\n   📚 Chương 3: React Cơ Bản`);
  console.log(`      - Bài 3.1: Tính giai thừa`);
  console.log(`      - 📝 Mini Test Chương 3`);
  console.log(`\n   🎯 Final Test: ${finalTest.title}`);
  console.log(`      - URL: http://localhost:8000/user/hackathon`);
  console.log(`\n   📦 Final Project: ${project.title}`);
  console.log(`      - Upload file (max 25MB)`);
  console.log(`\n   🏆 Certificate: Tự động tạo sau khi hoàn thành`);
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
