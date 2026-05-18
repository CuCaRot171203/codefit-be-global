/**
 * Seed script - Full data version
 * Run with: npm run db:seed:full
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function cleanDatabase() {
  await prisma.submissionResult.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.minitestSubmission.deleteMany();
  await prisma.minitestQuestion.deleteMany();
  await prisma.minitest.deleteMany();
  await prisma.hackathonSubmission.deleteMany();
  await prisma.hackathonParticipant.deleteMany();
  await prisma.hackathon.deleteMany();
  await prisma.projectSubmission.deleteMany();
  await prisma.project.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.userStats.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.notificationTarget.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.lessonReview.deleteMany();
  await prisma.scoringConfig.deleteMany();
  await prisma.lessonSubmission.deleteMany();
  await prisma.lessonRequest.deleteMany();
  await prisma.lessonContent.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.activateCode.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.phase.deleteMany();
  await prisma.lectureCourse.deleteMany();
  await prisma.course.deleteMany();
  await prisma.testcase.deleteMany();
  await prisma.problem.deleteMany();
  await prisma.userSession.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.courseSubscription.deleteMany();
  await prisma.conversationMessage.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.aIRequest.deleteMany();

  console.log('Da xoa du lieu cu');
}

async function main() {
  console.log('Bat dau seed du lieu day du...\n');

  await cleanDatabase();

  // ============ ROLES ============
  const adminRole = await prisma.role.create({
    data: { name: 'admin', description: 'Quan tri vien' },
  });

  const userRole = await prisma.role.create({
    data: { name: 'user', description: 'Hoc vien' },
  });

  const lectureRole = await prisma.role.create({
    data: { name: 'lecture', description: 'Giang vien' },
  });

  console.log('Tao 3 roles: admin, user, lecture');

  // ============ ADMIN USERS ============
  const adminPassword = await bcrypt.hash('admin123', 10);
  const lecturePassword = await bcrypt.hash('lecture123', 10);
  const studentPassword = await bcrypt.hash('student123', 10);

  const admin1 = await prisma.user.create({
    data: {
      email: 'admin1@codefit.edu.vn',
      username: 'admin1',
      password: adminPassword,
      roleId: adminRole.id,
      fullName: 'Tran Van A',
      bio: 'Quan tri he thong',
    },
  });

  const admin2 = await prisma.user.create({
    data: {
      email: 'admin2@codefit.edu.vn',
      username: 'admin2',
      password: adminPassword,
      roleId: adminRole.id,
      fullName: 'Le Thi B',
      bio: 'Quan ly noi dung',
    },
  });

  const admin3 = await prisma.user.create({
    data: {
      email: 'admin3@codefit.edu.vn',
      username: 'admin3',
      password: adminPassword,
      roleId: adminRole.id,
      fullName: 'Pham Van C',
      bio: 'Ky thuat he thong',
    },
  });

  console.log('Tao 3 admin users');

  // ============ LECTURE USERS ============
  const lecture1 = await prisma.user.create({
    data: {
      email: 'thanh.nguyen@codefit.edu.vn',
      username: 'thanhnguyen',
      password: lecturePassword,
      roleId: lectureRole.id,
      fullName: 'Nguyen Van Thanh',
      bio: 'Giang vien Frontend - Chuyen gia React, TypeScript',
      phone: '0901234567',
      school: 'DH Bach Khoa TP.HCM',
    },
  });

  const lecture2 = await prisma.user.create({
    data: {
      email: 'linh.tran@codefit.edu.vn',
      username: 'linhtran',
      password: lecturePassword,
      roleId: lectureRole.id,
      fullName: 'Tran Thi Linh',
      bio: 'Giang vien Backend - Node.js, Python, Cloud Architecture',
      phone: '0902345678',
      school: 'DH FPT',
    },
  });

  const lecture3 = await prisma.user.create({
    data: {
      email: 'duc.pham@codefit.edu.vn',
      username: 'ducpham',
      password: lecturePassword,
      roleId: lectureRole.id,
      fullName: 'Pham Van Duc',
      bio: 'Giang vien Data Science - Python, Machine Learning',
      phone: '0903456789',
      school: 'DH Khoa hoc Tu nhien',
    },
  });

  console.log('Tao 3 lecture users');

  // ============ STUDENT USERS ============
  const student1 = await prisma.user.create({
    data: {
      email: 'student1@codefit.com',
      username: 'student1',
      password: studentPassword,
      roleId: userRole.id,
      fullName: 'Nguyen Van Minh',
      bio: 'Sinh vien IT, dang hoc React',
    },
  });

  const student2 = await prisma.user.create({
    data: {
      email: 'student2@codefit.com',
      username: 'student2',
      password: studentPassword,
      roleId: userRole.id,
      fullName: 'Tran Thi Hoa',
      bio: 'Sinh vien CNTT, thich lap trinh web',
    },
  });

  const student3 = await prisma.user.create({
    data: {
      email: 'student3@codefit.com',
      username: 'student3',
      password: studentPassword,
      roleId: userRole.id,
      fullName: 'Le Van Duc',
      bio: 'Sinh vien, muon hoc Python cho Data Science',
    },
  });

  console.log('Tao 3 student users');

  // ============ COURSE 1: JavaScript Fundamentals ============
  const course1 = await prisma.course.create({
    data: {
      title: 'JavaScript Fundamentals',
      description: 'Khoa hoc JavaScript co ban den nang cao, bao gom ES6+, async/await va cac pattern hien dai.',
      price: 99000,
      originalPrice: 199000,
      image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80',
      duration: '40 Gio hoc',
      level: 'beginner',
      creatorId: admin1.id,
      unlockLessonsCount: 3,
      unlockByPhase: false,
    },
  });

  // Phases for Course 1
  const c1_phase1 = await prisma.phase.create({
    data: { courseId: course1.id, title: 'Bien va Kieu Du Lieu', orderIndex: 1 },
  });

  const c1_phase2 = await prisma.phase.create({
    data: { courseId: course1.id, title: 'Ham va Pham Vi', orderIndex: 2 },
  });

  const c1_phase3 = await prisma.phase.create({
    data: { courseId: course1.id, title: 'DOM Manipulation', orderIndex: 3 },
  });

  // Lessons for Phase 1
  const c1_l1 = await prisma.lesson.create({
    data: {
      phaseId: c1_phase1.id,
      title: 'Bien trong JavaScript',
      content: '<h1>Bien trong JavaScript</h1><p>Tim hieu ve let, const va var</p>',
      type: 'video',
      orderIndex: 1,
      status: 'PUBLISHED',
      isPublished: true,
    },
  });

  const c1_l2 = await prisma.lesson.create({
    data: {
      phaseId: c1_phase1.id,
      title: 'Toan tu va Bieu thuc',
      content: '<h1>Toan tu JavaScript</h1><p>Toan tu so hoc, so sanh va logic</p>',
      type: 'video',
      orderIndex: 2,
      status: 'PUBLISHED',
      isPublished: true,
    },
  });

  const c1_l3 = await prisma.lesson.create({
    data: {
      phaseId: c1_phase1.id,
      title: 'Roi rac dieu kien',
      content: '<h1>Cau truc dieu kien</h1><p>if/else, switch va toan tu ba ngôi</p>',
      type: 'code',
      orderIndex: 3,
      status: 'PUBLISHED',
      isPublished: true,
    },
  });

  // Lessons for Phase 2
  const c1_l4 = await prisma.lesson.create({
    data: {
      phaseId: c1_phase2.id,
      title: 'Khai bao Ham',
      content: '<h1>Ham trong JavaScript</h1><p>Cach khai bao va goi ham</p>',
      type: 'video',
      orderIndex: 1,
      status: 'PUBLISHED',
      isPublished: true,
    },
  });

  const c1_l5 = await prisma.lesson.create({
    data: {
      phaseId: c1_phase2.id,
      title: 'Arrow Functions',
      content: '<h1>Arrow Functions</h1><p>Cu phap hien dai cho ham ES6</p>',
      type: 'code',
      orderIndex: 2,
      status: 'PUBLISHED',
      isPublished: true,
    },
  });

  // Lessons for Phase 3
  const c1_l6 = await prisma.lesson.create({
    data: {
      phaseId: c1_phase3.id,
      title: 'Gioi thieu DOM',
      content: '<h1>Document Object Model</h1><p>Tim hieu ve DOM trong JavaScript</p>',
      type: 'video',
      orderIndex: 1,
      status: 'PUBLISHED',
      isPublished: true,
    },
  });

  // Lesson Contents for Course 1
  await prisma.lessonContent.create({
    data: {
      lessonId: c1_l1.id,
      content: '<h1>Bien trong JavaScript</h1><h2>Let, Const, Var</h2><p>Trong JavaScript co 3 cach khai bao bien:</p><ul><li><strong>let</strong> - cho bien co the gan lai</li><li><strong>const</strong> - cho hang khong the gan lai</li><li><strong>var</strong> - cach cu (nen tranh)</li></ul><h2>Tac vu</h2><p>Viet ham <code>createVariable()</code> tra ve so <strong>42</strong>.</p>',
      testCases: JSON.stringify([
        { id: 'test-1', input: 'createVariable()', expectedOutput: '42', isPublic: true, points: 100 },
      ]),
      hints: JSON.stringify([
        { id: 'hint-1', content: 'Su dung return de tra ve gia tri', penalty: 5 },
      ]),
      starterCode: 'function createVariable() {\n  // Tra ve so 42\n}',
      timeLimit: 5000,
      memoryLimit: 256,
    },
  });

  await prisma.lessonContent.create({
    data: {
      lessonId: c1_l2.id,
      content: '<h1>Toan tu JavaScript</h1><h2>Toan tu So hoc</h2><p>JavaScript ho tro cac toan tu tieu chuan:</p><ul><li>+ Cong</li><li>- Tru</li><li>* Nhan</li><li>/ Chia</li><li>% Chia lay du</li></ul><h2>Tac vu</h2><p>Viet ham <code>add(a, b)</code> tra ve tong hai so.</p>',
      testCases: JSON.stringify([
        { id: 'test-1', input: 'add(2, 3)', expectedOutput: '5', isPublic: true, points: 50 },
        { id: 'test-2', input: 'add(10, 20)', expectedOutput: '30', isPublic: true, points: 50 },
      ]),
      hints: JSON.stringify([
        { id: 'hint-1', content: 'Su dung toan tu + de cong so', penalty: 5 },
      ]),
      starterCode: 'function add(a, b) {\n  // Tra ve a + b\n}',
      timeLimit: 3000,
      memoryLimit: 128,
    },
  });

  await prisma.lessonContent.create({
    data: {
      lessonId: c1_l3.id,
      content: '<h1>Dieu kien trong JavaScript</h1><h2>Cau truc if/else</h2><pre><code>if (dieuKien) {\n  // code neu true\n} else {\n  // code neu false\n}</code></pre><h2>Tac vu</h2><p>Viet ham <code>checkNumber(num)</code> tra ve <strong>"positive"</strong> neu num > 0, <strong>"negative"</strong> neu num < 0, hoac <strong>"zero"</strong> neu num === 0.</p>',
      testCases: JSON.stringify([
        { id: 'test-1', input: 'checkNumber(5)', expectedOutput: '"positive"', isPublic: true, points: 33 },
        { id: 'test-2', input: 'checkNumber(-3)', expectedOutput: '"negative"', isPublic: true, points: 33 },
        { id: 'test-3', input: 'checkNumber(0)', expectedOutput: '"zero"', isPublic: true, points: 34 },
      ]),
      hints: JSON.stringify([
        { id: 'hint-1', content: 'Su dung === thay vi == de so sanh nghiem ngat', penalty: 5 },
        { id: 'hint-2', content: 'Tra ve string: "positive", "negative", hoac "zero"', penalty: 5 },
      ]),
      starterCode: 'function checkNumber(num) {\n  // Tra ve "positive", "negative", hoac "zero"\n}',
      timeLimit: 3000,
      memoryLimit: 128,
    },
  });

  await prisma.lessonContent.create({
    data: {
      lessonId: c1_l4.id,
      content: '<h1>Ham trong JavaScript</h1><h2>Khai bao Ham</h2><pre><code>function tenHam(thamSo) {\n  // than ham\n  return giaTri;\n}</code></pre><h2>Tac vu</h2><p>Viet ham <code>greet(name)</code> tra ve <strong>"Hello, {name}!"</strong></p>',
      testCases: JSON.stringify([
        { id: 'test-1', input: 'greet("World")', expectedOutput: '"Hello, World!"', isPublic: true, points: 50 },
        { id: 'test-2', input: 'greet("CodeFit")', expectedOutput: '"Hello, CodeFit!"', isPublic: true, points: 50 },
      ]),
      hints: JSON.stringify([
        { id: 'hint-1', content: 'Su dung template literals: `Hello, ${name}!`', penalty: 5 },
      ]),
      starterCode: 'function greet(name) {\n  // Tra ve "Hello, {name}!"\n}',
      timeLimit: 5000,
      memoryLimit: 256,
    },
  });

  await prisma.lessonContent.create({
    data: {
      lessonId: c1_l5.id,
      content: '<h1>Arrow Functions</h1><h2>Cu phap co ban</h2><pre><code>const tenHam = (thamSo) => {\n  // than ham\n  return giaTri;\n};</code></pre><h2>Tac vu</h2><p>Viet arrow function <code>multiply(a, b)</code> tra ve tich hai so.</p>',
      testCases: JSON.stringify([
        { id: 'test-1', input: 'multiply(3, 4)', expectedOutput: '12', isPublic: true, points: 50 },
        { id: 'test-2', input: 'multiply(5, 6)', expectedOutput: '30', isPublic: true, points: 50 },
      ]),
      hints: JSON.stringify([
        { id: 'hint-1', content: 'Arrow function syntax: const multiply = (a, b) => ...', penalty: 5 },
        { id: 'hint-2', content: 'Su dung * de nhan', penalty: 5 },
      ]),
      starterCode: 'const multiply = (a, b) => {\n  // Tra ve a * b\n};',
      timeLimit: 5000,
      memoryLimit: 256,
    },
  });

  await prisma.lessonContent.create({
    data: {
      lessonId: c1_l6.id,
      content: '<h1>Gioi thieu DOM</h1><p>Document Object Model cho phep truy cap va thao tac voi cac phan tu HTML.</p>',
      testCases: JSON.stringify([
        { id: 'test-1', input: '1 + 1', expectedOutput: '2', isPublic: true, points: 100 },
      ]),
      hints: JSON.stringify([]),
      starterCode: '// DOM Example\nconsole.log("Hello DOM");',
      timeLimit: 5000,
      memoryLimit: 256,
    },
  });

  // Scoring Configs for Course 1
  await prisma.scoringConfig.createMany({
    data: [
      { lessonId: c1_l1.id, baseScore: 100, penaltyPerHint: 10 },
      { lessonId: c1_l2.id, baseScore: 100, penaltyPerHint: 10 },
      { lessonId: c1_l3.id, baseScore: 100, penaltyPerHint: 10 },
      { lessonId: c1_l4.id, baseScore: 100, penaltyPerHint: 10 },
      { lessonId: c1_l5.id, baseScore: 100, penaltyPerHint: 10 },
      { lessonId: c1_l6.id, baseScore: 100, penaltyPerHint: 10 },
    ],
  });

  console.log('Khoa hoc 1: JavaScript Fundamentals - Hoan tat');

  // ============ COURSE 2: React Masterclass ============
  const course2 = await prisma.course.create({
    data: {
      title: 'React Masterclass',
      description: 'Chu trien khai React.js voi hooks, context, Redux va xay dung ung dung san sang san xuat.',
      price: 149000,
      originalPrice: 299000,
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
      duration: '60 Gio hoc',
      level: 'intermediate',
      creatorId: lecture1.id,
      unlockLessonsCount: 0,
      unlockByPhase: false,
    },
  });

  const c2_phase1 = await prisma.phase.create({
    data: { courseId: course2.id, title: 'React Co Ban', orderIndex: 1 },
  });

  const c2_phase2 = await prisma.phase.create({
    data: { courseId: course2.id, title: 'React Hooks', orderIndex: 2 },
  });

  const c2_l1 = await prisma.lesson.create({
    data: {
      phaseId: c2_phase1.id,
      title: 'Gioi thieu React',
      content: '<h1>React la gi?</h1><p>React la thu vien JavaScript de xay dung giao dien nguoi dung.</p>',
      type: 'video',
      orderIndex: 1,
      status: 'PUBLISHED',
      isPublished: true,
    },
  });

  const c2_l2 = await prisma.lesson.create({
    data: {
      phaseId: c2_phase1.id,
      title: 'Components va JSX',
      content: '<h1>Components</h1><p>Hoc cach tao React components bang JSX.</p>',
      type: 'code',
      orderIndex: 2,
      status: 'PUBLISHED',
      isPublished: true,
    },
  });

  const c2_l3 = await prisma.lesson.create({
    data: {
      phaseId: c2_phase2.id,
      title: 'useState Hook',
      content: '<h1>useState</h1><p>Quan ly trang thai trong React voi useState.</p>',
      type: 'code',
      orderIndex: 1,
      status: 'PUBLISHED',
      isPublished: true,
    },
  });

  const c2_l4 = await prisma.lesson.create({
    data: {
      phaseId: c2_phase2.id,
      title: 'useEffect Hook',
      content: '<h1>useEffect</h1><p>Xu ly side effects trong React.</p>',
      type: 'code',
      orderIndex: 2,
      status: 'PUBLISHED',
      isPublished: true,
    },
  });

  await prisma.lessonContent.create({
    data: {
      lessonId: c2_l1.id,
      content: '<h1>Gioi thieu React</h1><p>React duoc phat trien boi Facebook, la thu vien UI pho bien nhat.</p>',
      testCases: JSON.stringify([
        { id: 'test-1', input: '1 + 1', expectedOutput: '2', isPublic: true, points: 100 },
      ]),
      hints: JSON.stringify([]),
      starterCode: '// Gioi thieu React\nconst App = () => <h1>Hello React!</h1>;',
      timeLimit: 5000,
      memoryLimit: 256,
    },
  });

  await prisma.lessonContent.create({
    data: {
      lessonId: c2_l2.id,
      content: '<h1>JSX Basics</h1><p>JSX cho phep viet HTML trong JavaScript.</p><h2>Tac vu</h2><p>Viet ham <code>createElement()</code> tra ve string "React".</p>',
      testCases: JSON.stringify([
        { id: 'test-1', input: 'createElement()', expectedOutput: '"React"', isPublic: true, points: 100 },
      ]),
      hints: JSON.stringify([
        { id: 'hint-1', content: 'Tra ve string "React"', penalty: 5 },
      ]),
      starterCode: 'function createElement() {\n  // Tra ve "React"\n}',
      timeLimit: 5000,
      memoryLimit: 256,
    },
  });

  await prisma.lessonContent.create({
    data: {
      lessonId: c2_l3.id,
      content: '<h1>useState Hook</h1><p>useState tra ve mot cap gia tri: [currentState, setFunction].</p><h2>Tac vu</h2><p>Viet ham <code>initialState()</code> tra ve so 0.</p>',
      testCases: JSON.stringify([
        { id: 'test-1', input: 'initialState()', expectedOutput: '0', isPublic: true, points: 100 },
      ]),
      hints: JSON.stringify([
        { id: 'hint-1', content: 'Tra ve so 0', penalty: 5 },
      ]),
      starterCode: 'function initialState() {\n  // Tra ve 0\n}',
      timeLimit: 5000,
      memoryLimit: 256,
    },
  });

  await prisma.lessonContent.create({
    data: {
      lessonId: c2_l4.id,
      content: '<h1>useEffect Hook</h1><p>useEffect cho phep thuc hien side effects trong function components.</p><h2>Tac vu</h2><p>Viet ham <code>logMessage()</code> tra ve string "Effect ran".</p>',
      testCases: JSON.stringify([
        { id: 'test-1', input: 'logMessage()', expectedOutput: '"Effect ran"', isPublic: true, points: 100 },
      ]),
      hints: JSON.stringify([
        { id: 'hint-1', content: 'Tra ve string "Effect ran"', penalty: 5 },
      ]),
      starterCode: 'function logMessage() {\n  // Tra ve "Effect ran"\n}',
      timeLimit: 5000,
      memoryLimit: 256,
    },
  });

  await prisma.scoringConfig.createMany({
    data: [
      { lessonId: c2_l1.id, baseScore: 100, penaltyPerHint: 10 },
      { lessonId: c2_l2.id, baseScore: 100, penaltyPerHint: 10 },
      { lessonId: c2_l3.id, baseScore: 100, penaltyPerHint: 10 },
      { lessonId: c2_l4.id, baseScore: 100, penaltyPerHint: 10 },
    ],
  });

  console.log('Khoa hoc 2: React Masterclass - Hoan tat');

  // ============ COURSE 3: Python for Data Science ============
  const course3 = await prisma.course.create({
    data: {
      title: 'Python for Data Science',
      description: 'Hoc Python tu co ban den nang cao, ung dung trong Data Science va Machine Learning.',
      price: 199000,
      originalPrice: 399000,
      image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80',
      duration: '80 Gio hoc',
      level: 'intermediate',
      creatorId: lecture3.id,
      unlockLessonsCount: 1,
      unlockByPhase: true,
    },
  });

  const c3_phase1 = await prisma.phase.create({
    data: { courseId: course3.id, title: 'Python Co Ban', orderIndex: 1 },
  });

  const c3_phase2 = await prisma.phase.create({
    data: { courseId: course3.id, title: 'Python for Analysis', orderIndex: 2 },
  });

  const c3_l1 = await prisma.lesson.create({
    data: {
      phaseId: c3_phase1.id,
      title: 'Bien va Kieu du lieu Python',
      content: '<h1>Bien Python</h1><p>Python la ngon ngu dong, khong can khai bao kieu.</p>',
      type: 'video',
      orderIndex: 1,
      status: 'PUBLISHED',
      isPublished: true,
    },
  });

  const c3_l2 = await prisma.lesson.create({
    data: {
      phaseId: c3_phase1.id,
      title: 'Lists va Dictionaries',
      content: '<h1>Collections</h1><p>Hoc ve list, tuple, dict trong Python.</p>',
      type: 'code',
      orderIndex: 2,
      status: 'PUBLISHED',
      isPublished: true,
    },
  });

  const c3_l3 = await prisma.lesson.create({
    data: {
      phaseId: c3_phase2.id,
      title: 'NumPy Fundamentals',
      content: '<h1>NumPy</h1><p>Thu vien tinh toan khoa hoc cho Python.</p>',
      type: 'code',
      orderIndex: 1,
      status: 'PUBLISHED',
      isPublished: true,
    },
  });

  const c3_l4 = await prisma.lesson.create({
    data: {
      phaseId: c3_phase2.id,
      title: 'Pandas DataFrames',
      content: '<h1>Pandas</h1><p>Thu vien xu ly du lieu bang cach.</p>',
      type: 'code',
      orderIndex: 2,
      status: 'PUBLISHED',
      isPublished: true,
    },
  });

  await prisma.lessonContent.create({
    data: {
      lessonId: c3_l1.id,
      content: '<h1>Bien Python</h1><p>Python khong can khai bao kieu du lieu.</p><h2>Tac vu</h2><p>Viet ham <code>getValue()</code> tra ve so 42.</p>',
      testCases: JSON.stringify([
        { id: 'test-1', input: 'getValue()', expectedOutput: '42', isPublic: true, points: 100 },
      ]),
      hints: JSON.stringify([
        { id: 'hint-1', content: 'Tra ve so 42', penalty: 5 },
      ]),
      starterCode: 'def getValue():\n    # Tra ve 42\n    pass',
      timeLimit: 5000,
      memoryLimit: 256,
    },
  });

  await prisma.lessonContent.create({
    data: {
      lessonId: c3_l2.id,
      content: '<h1>Lists</h1><p>List la mot collection co thu tu trong Python.</p><h2>Tac vu</h2><p>Viet ham <code>sumList(nums)</code> tra ve tong cac so trong list.</p>',
      testCases: JSON.stringify([
        { id: 'test-1', input: 'sumList([1, 2, 3])', expectedOutput: '6', isPublic: true, points: 50 },
        { id: 'test-2', input: 'sumList([10, 20])', expectedOutput: '30', isPublic: true, points: 50 },
      ]),
      hints: JSON.stringify([
        { id: 'hint-1', content: 'Su dung vong for hoac ham sum()', penalty: 5 },
      ]),
      starterCode: 'def sumList(nums):\n    # Tra ve tong\n    pass',
      timeLimit: 5000,
      memoryLimit: 256,
    },
  });

  await prisma.lessonContent.create({
    data: {
      lessonId: c3_l3.id,
      content: '<h1>NumPy</h1><p>NumPy la thu vien tinh toan mang cho Python.</p><h2>Tac vu</h2><p>Viet ham <code>createArray()</code> tra ve list [1, 2, 3].</p>',
      testCases: JSON.stringify([
        { id: 'test-1', input: 'createArray()', expectedOutput: '[1, 2, 3]', isPublic: true, points: 100 },
      ]),
      hints: JSON.stringify([
        { id: 'hint-1', content: 'Tra ve list [1, 2, 3]', penalty: 5 },
      ]),
      starterCode: 'def createArray():\n    # Tra ve [1, 2, 3]\n    pass',
      timeLimit: 5000,
      memoryLimit: 256,
    },
  });

  await prisma.lessonContent.create({
    data: {
      lessonId: c3_l4.id,
      content: '<h1>Pandas DataFrames</h1><p>Pandas cung cap DataFrame de xu ly du lieu.</p><h2>Tac vu</h2><p>Viet ham <code>getColumns()</code> tra ve string "columns".</p>',
      testCases: JSON.stringify([
        { id: 'test-1', input: 'getColumns()', expectedOutput: '"columns"', isPublic: true, points: 100 },
      ]),
      hints: JSON.stringify([
        { id: 'hint-1', content: 'Tra ve string "columns"', penalty: 5 },
      ]),
      starterCode: 'def getColumns():\n    # Tra ve "columns"\n    pass',
      timeLimit: 5000,
      memoryLimit: 256,
    },
  });

  await prisma.scoringConfig.createMany({
    data: [
      { lessonId: c3_l1.id, baseScore: 100, penaltyPerHint: 10 },
      { lessonId: c3_l2.id, baseScore: 100, penaltyPerHint: 10 },
      { lessonId: c3_l3.id, baseScore: 100, penaltyPerHint: 10 },
      { lessonId: c3_l4.id, baseScore: 100, penaltyPerHint: 10 },
    ],
  });

  console.log('Khoa hoc 3: Python for Data Science - Hoan tat');

  // ============ PROBLEMS ============
  const problem1 = await prisma.problem.create({
    data: {
      title: 'Two Sum',
      description: 'Cho mot mang so nguyen va mot so nguyen target, tra ve chi so cua hai so sao cho tong cua chung bang target.',
      difficulty: 'EASY',
      timeLimit: 1000,
      memoryLimit: 256,
    },
  });

  const problem2 = await prisma.problem.create({
    data: {
      title: 'Reverse String',
      description: 'Viet ham dao nguoc mot string.',
      difficulty: 'EASY',
      timeLimit: 1000,
      memoryLimit: 256,
    },
  });

  const problem3 = await prisma.problem.create({
    data: {
      title: 'Valid Parentheses',
      description: 'Cho mot string chi chua cac ky tu "(", ")", "{", "}", "[" va "]", xac dinh xem string co hop le khong.',
      difficulty: 'MEDIUM',
      timeLimit: 2000,
      memoryLimit: 256,
    },
  });

  const problem4 = await prisma.problem.create({
    data: {
      title: 'FizzBuzz',
      description: 'Viet ham tra ve "Fizz" neu chia het cho 3, "Buzz" neu chia het cho 5, "FizzBuzz" neu chia het cho ca 3 va 5, nguoc lai tra ve so.',
      difficulty: 'EASY',
      timeLimit: 1000,
      memoryLimit: 256,
    },
  });

  const problem5 = await prisma.problem.create({
    data: {
      title: 'Palindrome Number',
      description: 'Xac dinh mot so nguyen co phai la palindrome khong.',
      difficulty: 'EASY',
      timeLimit: 1000,
      memoryLimit: 256,
    },
  });

  // Testcases
  await prisma.testcase.createMany({
    data: [
      { problemId: problem1.id, input: '[2,7,11,15]\n9', expectedOutput: '[0,1]', isPublic: true },
      { problemId: problem1.id, input: '[3,2,4]\n6', expectedOutput: '[1,2]', isPublic: true },
      { problemId: problem1.id, input: '[3,3]\n6', expectedOutput: '[0,1]', isPublic: false },
      { problemId: problem2.id, input: '"hello"', expectedOutput: '"olleh"', isPublic: true },
      { problemId: problem2.id, input: '"world"', expectedOutput: '"dlrow"', isPublic: true },
      { problemId: problem3.id, input: '"()"', expectedOutput: 'true', isPublic: true },
      { problemId: problem3.id, input: '"()[]{}"', expectedOutput: 'true', isPublic: true },
      { problemId: problem3.id, input: '"(]"', expectedOutput: 'false', isPublic: false },
      { problemId: problem4.id, input: '3', expectedOutput: '"Fizz"', isPublic: true },
      { problemId: problem4.id, input: '5', expectedOutput: '"Buzz"', isPublic: true },
      { problemId: problem4.id, input: '15', expectedOutput: '"FizzBuzz"', isPublic: true },
      { problemId: problem5.id, input: '121', expectedOutput: 'true', isPublic: true },
      { problemId: problem5.id, input: '-121', expectedOutput: 'false', isPublic: true },
    ],
  });

  console.log('Tao 5 problems voi testcases');

  // ============ ENROLLMENTS ============
  await prisma.enrollment.createMany({
    data: [
      { userId: student1.id, courseId: course1.id, progress: 50, completedLessons: 3, currentUnlocks: 3 },
      { userId: student1.id, courseId: course2.id, progress: 25, completedLessons: 1, currentUnlocks: 1 },
      { userId: student2.id, courseId: course1.id, progress: 100, completedLessons: 6, currentUnlocks: 6 },
      { userId: student2.id, courseId: course3.id, progress: 50, completedLessons: 2, currentUnlocks: 2 },
      { userId: student3.id, courseId: course1.id, progress: 17, completedLessons: 1, currentUnlocks: 1 },
      { userId: student3.id, courseId: course3.id, progress: 25, completedLessons: 1, currentUnlocks: 1 },
    ],
  });

  console.log('Tao enrollments');

  // ============ PROGRESS ============
  await prisma.progress.createMany({
    data: [
      { userId: student1.id, courseId: course1.id, score: 250, completedLessons: 3, totalLessons: 6, percentage: 50 },
      { userId: student1.id, courseId: course2.id, score: 100, completedLessons: 1, totalLessons: 4, percentage: 25 },
      { userId: student2.id, courseId: course1.id, score: 600, completedLessons: 6, totalLessons: 6, percentage: 100 },
      { userId: student2.id, courseId: course3.id, score: 200, completedLessons: 2, totalLessons: 4, percentage: 50 },
      { userId: student3.id, courseId: course1.id, score: 100, completedLessons: 1, totalLessons: 6, percentage: 17 },
      { userId: student3.id, courseId: course3.id, score: 100, completedLessons: 1, totalLessons: 4, percentage: 25 },
    ],
  });

  // ============ LESSON PROGRESS ============
  await prisma.lessonProgress.createMany({
    data: [
      { userId: student1.id, lessonId: c1_l1.id, courseId: course1.id, isCompleted: true, completedAt: new Date('2024-01-15') },
      { userId: student1.id, lessonId: c1_l2.id, courseId: course1.id, isCompleted: true, completedAt: new Date('2024-01-16') },
      { userId: student1.id, lessonId: c1_l3.id, courseId: course1.id, isCompleted: true, completedAt: new Date('2024-01-17') },
      { userId: student1.id, lessonId: c2_l1.id, courseId: course2.id, isCompleted: true, completedAt: new Date('2024-01-18') },
      { userId: student2.id, lessonId: c1_l1.id, courseId: course1.id, isCompleted: true, completedAt: new Date('2024-01-10') },
      { userId: student2.id, lessonId: c1_l2.id, courseId: course1.id, isCompleted: true, completedAt: new Date('2024-01-11') },
      { userId: student2.id, lessonId: c1_l3.id, courseId: course1.id, isCompleted: true, completedAt: new Date('2024-01-12') },
      { userId: student2.id, lessonId: c1_l4.id, courseId: course1.id, isCompleted: true, completedAt: new Date('2024-01-13') },
      { userId: student2.id, lessonId: c1_l5.id, courseId: course1.id, isCompleted: true, completedAt: new Date('2024-01-14') },
      { userId: student2.id, lessonId: c1_l6.id, courseId: course1.id, isCompleted: true, completedAt: new Date('2024-01-15') },
      { userId: student2.id, lessonId: c3_l1.id, courseId: course3.id, isCompleted: true, completedAt: new Date('2024-01-20') },
      { userId: student2.id, lessonId: c3_l2.id, courseId: course3.id, isCompleted: true, completedAt: new Date('2024-01-21') },
      { userId: student3.id, lessonId: c1_l1.id, courseId: course1.id, isCompleted: true, completedAt: new Date('2024-01-25') },
      { userId: student3.id, lessonId: c3_l1.id, courseId: course3.id, isCompleted: true, completedAt: new Date('2024-01-26') },
    ],
  });

  // ============ SUBMISSIONS ============
  await prisma.submission.createMany({
    data: [
      {
        userId: student1.id, problemId: problem1.id,
        code: 'function twoSum(nums, target) { const map = new Map(); for (let i = 0; i < nums.length; i++) { const complement = target - nums[i]; if (map.has(complement)) return [map.get(complement), i]; map.set(nums[i], i); } }',
        language: 'javascript', status: 'AC', runtime: 45, memory: 128,
        createdAt: new Date('2024-01-20'),
      },
      {
        userId: student1.id, problemId: problem2.id,
        code: 'function reverseString(s) { return s.split("").reverse().join(""); }',
        language: 'javascript', status: 'AC', runtime: 12, memory: 64,
        createdAt: new Date('2024-01-21'),
      },
      {
        userId: student1.id, problemId: problem4.id,
        code: 'function fizzBuzz(n) { if (n % 15 === 0) return "FizzBuzz"; if (n % 3 === 0) return "Fizz"; if (n % 5 === 0) return "Buzz"; return n.toString(); }',
        language: 'javascript', status: 'AC', runtime: 8, memory: 32,
        createdAt: new Date('2024-01-22'),
      },
      {
        userId: student2.id, problemId: problem1.id,
        code: 'function twoSum(nums, target) { for (let i = 0; i < nums.length; i++) { for (let j = i + 1; j < nums.length; j++) { if (nums[i] + nums[j] === target) return [i, j]; } } }',
        language: 'javascript', status: 'AC', runtime: 156, memory: 256,
        createdAt: new Date('2024-01-19'),
      },
      {
        userId: student2.id, problemId: problem3.id,
        code: 'function isValid(s) { const stack = []; const map = { ")": "(", "]": "[", "}": "{" }; for (let char of s) { if (map[char]) { if (stack.pop() !== map[char]) return false; } else { stack.push(char); } } return stack.length === 0; }',
        language: 'javascript', status: 'AC', runtime: 78, memory: 128,
        createdAt: new Date('2024-01-22'),
      },
      {
        userId: student2.id, problemId: problem5.id,
        code: 'function isPalindrome(x) { const str = x.toString(); return str === str.split("").reverse().join(""); }',
        language: 'javascript', status: 'AC', runtime: 15, memory: 64,
        createdAt: new Date('2024-01-23'),
      },
      {
        userId: student3.id, problemId: problem1.id,
        code: 'function twoSum(nums, target) { return nums.map((num, i) => [i, nums.indexOf(target - num)]).filter(a => a[1] !== -1 && a[0] !== a[1])[0]; }',
        language: 'javascript', status: 'WA', runtime: 200, memory: 256,
        createdAt: new Date('2024-01-25'),
      },
    ],
  });

  console.log('Tao submissions');

  // ============ MINITEST ============
  const minitest1 = await prisma.minitest.create({
    data: { phaseId: c1_phase1.id, title: 'Kiem tra 1 - JavaScript Co Ban', orderIndex: 0 },
  });

  await prisma.minitestQuestion.createMany({
    data: [
      { minitestId: minitest1.id, problemId: problem1.id },
      { minitestId: minitest1.id, problemId: problem2.id },
    ],
  });

  await prisma.minitestSubmission.createMany({
    data: [
      { userId: student1.id, minitestId: minitest1.id, score: 100, result: '{"passed": 2, "total": 2}' },
      { userId: student2.id, minitestId: minitest1.id, score: 100, result: '{"passed": 2, "total": 2}' },
    ],
  });

  console.log('Tao minitest');

  // ============ HACKATHON ============
  const now = new Date();
  const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const twoWeeksLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  const hackathon1 = await prisma.hackathon.create({
    data: {
      title: 'Frontend Challenge - React Summit 2026',
      description: 'Xay dung mot ung dung React hien dai voi hooks, context va toi uu hoa hieu nang.',
      startTime: now,
      endTime: oneWeekLater,
      durationMinutes: 120,
      maxParticipants: 100,
    },
  });

  const hackathon2 = await prisma.hackathon.create({
    data: {
      title: 'Algorithm Challenge - Week',
      description: 'Giai quyet cac bai toan thuat toan phuc tap su dung JavaScript.',
      startTime: oneWeekLater,
      endTime: twoWeeksLater,
      durationMinutes: 180,
      maxParticipants: 50,
    },
  });

  await prisma.hackathonParticipant.createMany({
    data: [
      { userId: student1.id, hackathonId: hackathon1.id },
      { userId: student2.id, hackathonId: hackathon1.id },
      { userId: student3.id, hackathonId: hackathon1.id },
      { userId: student1.id, hackathonId: hackathon2.id },
      { userId: student2.id, hackathonId: hackathon2.id },
    ],
  });

  await prisma.hackathonSubmission.createMany({
    data: [
      { userId: student1.id, hackathonId: hackathon1.id, problemId: problem1.id, score: 95 },
      { userId: student2.id, hackathonId: hackathon1.id, problemId: problem3.id, score: 88 },
    ],
  });

  console.log('Tao hackathons');

  // ============ PROJECT ============
  const project1 = await prisma.project.create({
    data: {
      courseId: course1.id,
      title: 'Ung dung Calculator',
      description: 'Xay dung mot may tinh hoan chinh su dung JavaScript thuan',
    },
  });

  const project2 = await prisma.project.create({
    data: {
      courseId: course2.id,
      title: 'Todo App voi React',
      description: 'Xay dung ung dung Todo su dung React voi Redux',
    },
  });

  await prisma.projectSubmission.createMany({
    data: [
      { userId: student1.id, projectId: project1.id, fileUrl: 'https://storage.codefit.com/projects/calc-v1.zip', status: 'approved' },
      { userId: student2.id, projectId: project1.id, fileUrl: 'https://storage.codefit.com/projects/calc-v2.zip', status: 'approved' },
      { userId: student1.id, projectId: project2.id, fileUrl: 'https://storage.codefit.com/projects/todo-react.zip', status: 'approved' },
    ],
  });

  console.log('Tao projects');

  // ============ CERTIFICATES ============
  await prisma.certificate.createMany({
    data: [
      { userId: student2.id, courseId: course1.id, courseTitle: 'JavaScript Fundamentals', userName: 'Tran Thi Hoa' },
      { userId: student1.id, courseId: course2.id, courseTitle: 'React Masterclass', userName: 'Nguyen Van Minh' },
    ],
  });

  console.log('Tao certificates');

  // ============ USER STATS ============
  await prisma.userStats.createMany({
    data: [
      { userId: student1.id, score: 1230, frequency: 28, rank: 4 },
      { userId: student2.id, score: 1450, frequency: 35, rank: 2 },
      { userId: student3.id, score: 580, frequency: 12, rank: 15 },
    ],
  });

  console.log('Tao user stats');

  // ============ FEEDBACK ============
  await prisma.feedback.createMany({
    data: [
      { userId: student1.id, message: 'Khoa hoc rat hay! Noi dung de hieu, bai tap thuc hanh tot.' },
      { userId: student2.id, message: 'Khoa hoc chat luong cao, giang vien huong dan chi tiet.' },
      { userId: student3.id, message: 'Can them nhieu bai tap hon cho phan Python co ban.' },
    ],
  });

  console.log('Tao feedback');

  // ============ NOTIFICATIONS ============
  await prisma.notification.createMany({
    data: [
      {
        userId: student1.id, type: 'submission', title: 'Bai nop duoc cham diem',
        content: 'Bai nop "Two Sum" da duoc cham diem. Trang thai: Accepted',
        isRead: true,
      },
      {
        userId: student1.id, type: 'hackathon', title: 'Hackathon sap bat dau',
        content: 'Frontend Challenge se bat dau trong 1 gio!',
        isRead: false,
      },
      {
        userId: student2.id, type: 'system', title: 'Chao mung den CodeFit!',
        content: 'Cam on ban da tham gia CodeFit. Bat dau hanh trinh hoc tap ngay hom nay!',
        isRead: true,
      },
      {
        userId: student2.id, type: 'submission', title: 'Chung nhan duoc cap',
        content: 'Chuc mung! Ban da hoan thanh khoa hoc JavaScript Fundamentals.',
        isRead: false,
      },
      {
        userId: student3.id, type: 'system', title: 'Chao mung den CodeFit!',
        content: 'Cam on ban da tham gia CodeFit. Bat dau hanh trinh hoc tap ngay hom nay!',
        isRead: true,
      },
    ],
  });

  console.log('Tao notifications');

  // ============ ACTIVATION CODES ============
  await prisma.activateCode.createMany({
    data: [
      { code: 'CFE-JS2026BEGINNER', courseId: course1.id, createdBy: admin1.id, type: 'ADMIN_CREATED' },
      { code: 'CFE-REACT2026MASTER', courseId: course2.id, createdBy: lecture1.id, type: 'ADMIN_CREATED' },
      { code: 'CFE-PY2026DATA', courseId: course3.id, createdBy: lecture3.id, type: 'ADMIN_CREATED' },
    ],
  });

  console.log('Tao activation codes');

  // ============ SUMMARY ============
  console.log('\n========== SEED HOAN TAT ==========');
  console.log('\nADMIN (password: admin123):');
  console.log('  - admin1@codefit.edu.vn');
  console.log('  - admin2@codefit.edu.vn');
  console.log('  - admin3@codefit.edu.vn');
  console.log('\nLECTURE (password: lecture123):');
  console.log('  - thanh.nguyen@codefit.edu.vn');
  console.log('  - linh.tran@codefit.edu.vn');
  console.log('  - duc.pham@codefit.edu.vn');
  console.log('\nSTUDENT (password: student123):');
  console.log('  - student1@codefit.com');
  console.log('  - student2@codefit.com');
  console.log('  - student3@codefit.com');
  console.log('\nKHOA HOC:');
  console.log('  1. JavaScript Fundamentals (99,000 VND)');
  console.log('  2. React Masterclass (149,000 VND)');
  console.log('  3. Python for Data Science (199,000 VND)');
  console.log('\nXem chi tiet tai: seed-data.md');
  console.log('===================================\n');
}

main()
  .catch((e) => {
    console.error('Seed that bai:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
