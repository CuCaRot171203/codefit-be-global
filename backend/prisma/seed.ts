import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed data...');

  // Clean existing data (order matters for foreign key constraints)
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

  console.log('🧹 Cleaned existing data');

  // ============ Create Roles ============
  const adminRole = await prisma.role.create({
    data: {
      name: 'admin',
      description: 'Quản trị viên - có toàn quyền truy cập hệ thống',
    },
  });

  const userRole = await prisma.role.create({
    data: {
      name: 'user',
      description: 'Học viên - có thể học và tham gia các khóa học',
    },
  });

  const lectureRole = await prisma.role.create({
    data: {
      name: 'lecture',
      description: 'Giảng viên - có thể tạo và quản lý khóa học',
    },
  });

  console.log('👥 Created 3 roles: admin, user, lecture');

  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('password123', 10);

  // ============ Create Admin ============
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@codefit.com',
      username: 'admin',
      password: adminPassword,
      roleId: adminRole.id,
      bio: 'System Administrator',
    },
  });

  // ============ Create Users (Students) ============
  const student1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      username: 'johndoe',
      password: userPassword,
      roleId: userRole.id,
      bio: 'Passionate developer learning new skills',
    },
  });

  const student2 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      username: 'janedoe',
      password: userPassword,
      roleId: userRole.id,
      bio: 'Full-stack developer',
    },
  });

  console.log('👥 Created 3 users (1 admin, 2 students)');

  // ============ Create Lectures ============
  const lecture1 = await prisma.user.create({
    data: {
      email: 'thanh.nguyen@codefit.com',
      username: 'thanhnguyen',
      password: userPassword,
      roleId: lectureRole.id,
      fullName: 'Nguyễn Văn Thành',
      bio: 'Senior Frontend Developer với 8+ năm kinh nghiệm. Chuyên gia React, TypeScript và các framework hiện đại.',
      phone: '0901234567',
      school: 'ĐH Bách Khoa TP.HCM',
    },
  });

  const lecture2 = await prisma.user.create({
    data: {
      email: 'linh.tran@codefit.com',
      username: 'linhtran',
      password: userPassword,
      roleId: lectureRole.id,
      fullName: 'Trần Thị Linh',
      bio: 'Backend Developer chuyên về Node.js, Python và Cloud Architecture. AWS Certified Solutions Architect.',
      phone: '0902345678',
      school: 'ĐH FPT',
    },
  });

  console.log('🎓 Created 2 lectures');

  // Create Courses
  const course1 = await prisma.course.create({
    data: {
      title: 'JavaScript Fundamentals',
      description: 'Learn JavaScript from basics to advanced concepts including ES6+, async/await, and modern patterns.',
      price: 99000,
      originalPrice: 199000,
      image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80',
      duration: '40 Giờ học',
      level: 'beginner',
      creatorId: adminUser.id,
      unlockLessonsCount: 3,
      unlockByPhase: false,
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: 'React Masterclass',
      description: 'Master React.js with hooks, context, Redux, and build production-ready applications.',
      price: 149000,
      originalPrice: 299000,
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
      duration: '60 Giờ học',
      level: 'intermediate',
      creatorId: lecture1.id,
      unlockLessonsCount: 0,
      unlockByPhase: false,
    },
  });

  const course3 = await prisma.course.create({
    data: {
      title: 'Python for Data Science',
      description: 'Học Python từ cơ bản đến nâng cao, ứng dụng trong Data Science và Machine Learning.',
      price: 199000,
      originalPrice: 399000,
      image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80',
      duration: '80 Giờ học',
      level: 'intermediate',
      creatorId: lecture2.id,
      unlockLessonsCount: 1,
      unlockByPhase: true,
    },
  });

  const course4 = await prisma.course.create({
    data: {
      title: 'Docker & Kubernetes Masterclass',
      description: 'Nắm vững containerization và orchestration để deploy ứng dụng enterprise.',
      price: 249000,
      originalPrice: 499000,
      image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80',
      duration: '50 Giờ học',
      level: 'advanced',
      creatorId: adminUser.id,
    },
  });

  // Test course for PayOS (5000 VND)
  const courseTest = await prisma.course.create({
    data: {
      title: 'Test PayOS Course',
      description: 'Khóa học test thanh toán PayOS - Giá 5000đ',
      price: 5000,
      originalPrice: 10000,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      duration: '1 Giờ học',
      level: 'beginner',
      creatorId: adminUser.id,
    },
  });

  console.log('📚 Created 5 courses');

  // Create Activate Codes for courses (CFE- format)
  await prisma.activateCode.createMany({
    data: [
      // Course 1 - JavaScript
      { code: 'CFE-A1B2C3D4E5F6G7H8', courseId: course1.id, createdBy: adminUser.id, type: 'ADMIN_CREATED' },
      { code: 'CFE-I9J0K1L2M3N4O5P6', courseId: course1.id, createdBy: adminUser.id, type: 'ADMIN_CREATED' },
      { code: 'CFE-Q7R8S9T0U1V2W3X4', courseId: course1.id, createdBy: adminUser.id, type: 'BULK_GENERATED' },
      // Course 2 - React
      { code: 'CFE-Y5Z6A7B8C9D0E1F2', courseId: course2.id, createdBy: lecture1.id, type: 'ADMIN_CREATED' },
      { code: 'CFE-G3H4I5J6K7L8M9N0', courseId: course2.id, createdBy: lecture1.id, type: 'BULK_GENERATED' },
      // Course 3 - Python
      { code: 'CFE-O1P2Q3R4S5T6U7V8', courseId: course3.id, createdBy: lecture2.id, type: 'ADMIN_CREATED' },
      { code: 'CFE-W9X0Y1Z2A3B4C5D6', courseId: course3.id, createdBy: lecture2.id, type: 'BULK_GENERATED' },
      // Course 4 - Docker
      { code: 'CFE-E7F8G9H0I1J2K3L4', courseId: course4.id, createdBy: adminUser.id, type: 'ADMIN_CREATED' },
    ],
  });

  console.log('🔑 Created activate codes');

  // Create Phases for Course 1
  const phase1 = await prisma.phase.create({
    data: {
      courseId: course1.id,
      title: 'Introduction to JavaScript',
      orderIndex: 1,
    },
  });

  const phase2 = await prisma.phase.create({
    data: {
      courseId: course1.id,
      title: 'Functions and Scope',
      orderIndex: 2,
    },
  });

  const phase3 = await prisma.phase.create({
    data: {
      courseId: course1.id,
      title: 'DOM Manipulation',
      orderIndex: 3,
    },
  });

  console.log('📑 Created 3 phases');

  // Create Lessons for Phase 1
  const lesson1 = await prisma.lesson.create({
    data: {
      phaseId: phase1.id,
      title: 'Variables and Data Types',
      content: '<h1>Variables in JavaScript</h1><p>Learn about let, const, and var...</p>',
      type: 'video',
      orderIndex: 1,
    },
  });

  const lesson2 = await prisma.lesson.create({
    data: {
      phaseId: phase1.id,
      title: 'Operators and Expressions',
      content: '<h1>JavaScript Operators</h1><p>Arithmetic, comparison, and logical operators...</p>',
      type: 'video',
      orderIndex: 2,
    },
  });

  const lesson3 = await prisma.lesson.create({
    data: {
      phaseId: phase1.id,
      title: 'Control Flow',
      content: '<h1>Conditionals</h1><p>if/else, switch, and ternary operators...</p>',
      type: 'code',
      orderIndex: 3,
    },
  });

  // Create Lessons for Phase 2
  const lesson4 = await prisma.lesson.create({
    data: {
      phaseId: phase2.id,
      title: 'Function Declarations',
      content: '<h1>Functions</h1><p>Learn to declare and call functions...</p>',
      type: 'video',
      orderIndex: 1,
    },
  });

  const lesson5 = await prisma.lesson.create({
    data: {
      phaseId: phase2.id,
      title: 'Arrow Functions',
      content: '<h1>Arrow Functions</h1><p>Modern syntax for functions in ES6...</p>',
      type: 'code',
      orderIndex: 2,
    },
  });

  console.log('📖 Created 5 lessons');

  // Create LessonContents for lessons (after all lessons exist)
  // Lesson 1: Variables - Simple function that should pass
  await prisma.lessonContent.create({
    data: {
      lessonId: lesson1.id,
      content: '<h1>Variables in JavaScript</h1><h2>Let, Const, and Var</h2><p>In JavaScript, we have three ways to declare variables:</p><ul><li><strong>let</strong> - for variables that can be reassigned</li><li><strong>const</strong> - for constants that cannot be reassigned</li><li><strong>var</strong> - the old way (avoid using)</li></ul><h2>Task</h2><p>Write a function <code>createVariable()</code> that returns the number <strong>42</strong>.</p>',
      testCases: JSON.stringify([
        { id: 'test-1', input: 'createVariable()', expectedOutput: '42', isPublic: true, points: 50 },
      ]),
      hints: JSON.stringify([
        { id: 'hint-1', content: 'Use return to return a value from a function', penalty: 5 },
      ]),
      starterCode: 'function createVariable() {\n  // Return the number 42\n}',
      timeLimit: 5000,
      memoryLimit: 256,
    },
  });

  // Lesson 2: Operators - Function to add two numbers
  await prisma.lessonContent.create({
    data: {
      lessonId: lesson2.id,
      content: '<h1>JavaScript Operators</h1><h2>Arithmetic Operators</h2><p>JavaScript supports standard arithmetic operators:</p><ul><li>+ Addition</li><li>- Subtraction</li><li>* Multiplication</li><li>/ Division</li><li>% Modulus (remainder)</li></ul><h2>Task</h2><p>Write a function <code>add(a, b)</code> that returns the sum of two numbers.</p>',
      testCases: JSON.stringify([
        { id: 'test-1', input: 'add(2, 3)', expectedOutput: '5', isPublic: true, points: 50 },
        { id: 'test-2', input: 'add(10, 20)', expectedOutput: '30', isPublic: true, points: 50 },
      ]),
      hints: JSON.stringify([
        { id: 'hint-1', content: 'Use the + operator to add numbers', penalty: 5 },
      ]),
      starterCode: 'function add(a, b) {\n  // Return a + b\n}',
      timeLimit: 3000,
      memoryLimit: 128,
    },
  });

  // Lesson 3: Control Flow - Check positive/negative/zero
  await prisma.lessonContent.create({
    data: {
      lessonId: lesson3.id,
      content: '<h1>Control Flow in JavaScript</h1><h2>If/Else Statements</h2><pre><code>if (condition) {\n  // code to run if true\n} else if (otherCondition) {\n  // code to run if otherCondition is true\n} else {\n  // code to run if all conditions are false\n}</code></pre><h2>Task</h2><p>Write a function <code>checkNumber(num)</code> that returns <strong>"positive"</strong> if num > 0, <strong>"negative"</strong> if num < 0, or <strong>"zero"</strong> if num === 0.</p>',
      testCases: JSON.stringify([
        { id: 'test-1', input: 'checkNumber(5)', expectedOutput: '"positive"', isPublic: true, points: 33 },
        { id: 'test-2', input: 'checkNumber(-3)', expectedOutput: '"negative"', isPublic: true, points: 33 },
        { id: 'test-3', input: 'checkNumber(0)', expectedOutput: '"zero"', isPublic: true, points: 34 },
      ]),
      hints: JSON.stringify([
        { id: 'hint-1', content: 'Remember to use === instead of == for strict comparison', penalty: 5 },
        { id: 'hint-2', content: 'Return a string: "positive", "negative", or "zero"', penalty: 5 },
      ]),
      starterCode: 'function checkNumber(num) {\n  // Return "positive", "negative", or "zero"\n}',
      timeLimit: 3000,
      memoryLimit: 128,
    },
  });

  // Lesson 4: Functions - Greet function
  await prisma.lessonContent.create({
    data: {
      lessonId: lesson4.id,
      content: '<h1>Functions in JavaScript</h1><h2>Function Declaration</h2><pre><code>function functionName(parameters) {\n  // function body\n  return value;\n}</code></pre><h2>Task</h2><p>Write a function <code>greet(name)</code> that returns <strong>"Hello, {name}!"</strong></p>',
      testCases: JSON.stringify([
        { id: 'test-1', input: 'greet("World")', expectedOutput: '"Hello, World!"', isPublic: true, points: 50 },
        { id: 'test-2', input: 'greet("CodeFit")', expectedOutput: '"Hello, CodeFit!"', isPublic: true, points: 50 },
      ]),
      hints: JSON.stringify([
        { id: 'hint-1', content: 'Use template literals: `Hello, ${name}!`', penalty: 5 },
        { id: 'hint-2', content: "Don't forget the return statement", penalty: 5 },
      ]),
      starterCode: 'function greet(name) {\n  // Return "Hello, {name}!"\n}',
      timeLimit: 5000,
      memoryLimit: 256,
    },
  });

  // Lesson 5: Arrow Functions - Multiply
  await prisma.lessonContent.create({
    data: {
      lessonId: lesson5.id,
      content: '<h1>Arrow Functions</h1><h2>Basic Syntax</h2><pre><code>const functionName = (parameters) => {\n  // function body\n  return value;\n};\n\n// Short form for single expressions\nconst add = (a, b) => a + b;</code></pre><h2>Task</h2><p>Write an arrow function <code>multiply(a, b)</code> that returns the product of two numbers.</p>',
      testCases: JSON.stringify([
        { id: 'test-1', input: 'multiply(3, 4)', expectedOutput: '12', isPublic: true, points: 50 },
        { id: 'test-2', input: 'multiply(5, 6)', expectedOutput: '30', isPublic: true, points: 50 },
      ]),
      hints: JSON.stringify([
        { id: 'hint-1', content: 'Arrow function syntax: const multiply = (a, b) => ...', penalty: 5 },
        { id: 'hint-2', content: 'Use * operator for multiplication', penalty: 5 },
      ]),
      starterCode: 'const multiply = (a, b) => {\n  // Return a * b\n};',
      timeLimit: 5000,
      memoryLimit: 256,
    },
  });

  console.log('📝 Created 5 lesson contents');

  // Create Problems
  const problem1 = await prisma.problem.create({
    data: {
      title: 'Two Sum',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      difficulty: 'EASY',
      timeLimit: 1000,
      memoryLimit: 256,
    },
  });

  const problem2 = await prisma.problem.create({
    data: {
      title: 'Reverse String',
      description: 'Write a function that reverses a string. The input string is given as an array of characters.',
      difficulty: 'EASY',
      timeLimit: 1000,
      memoryLimit: 256,
    },
  });

  const problem3 = await prisma.problem.create({
    data: {
      title: 'Valid Parentheses',
      description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
      difficulty: 'MEDIUM',
      timeLimit: 2000,
      memoryLimit: 256,
    },
  });

  const problem4 = await prisma.problem.create({
    data: {
      title: 'Merge Two Sorted Lists',
      description: 'Merge two sorted linked lists and return it as a sorted list.',
      difficulty: 'MEDIUM',
      timeLimit: 2000,
      memoryLimit: 512,
    },
  });

  const problem5 = await prisma.problem.create({
    data: {
      title: 'Binary Tree Inorder Traversal',
      description: 'Given the root of a binary tree, return the inorder traversal of its nodes values.',
      difficulty: 'HARD',
      timeLimit: 3000,
      memoryLimit: 512,
    },
  });

  console.log('💻 Created 5 problems');

  // Create Testcases for Problem 1
  await prisma.testcase.createMany({
    data: [
      {
        problemId: problem1.id,
        input: '[2,7,11,15]\n9',
        expectedOutput: '[0,1]',
        isPublic: true,
      },
      {
        problemId: problem1.id,
        input: '[3,2,4]\n6',
        expectedOutput: '[1,2]',
        isPublic: true,
      },
      {
        problemId: problem1.id,
        input: '[3,3]\n6',
        expectedOutput: '[0,1]',
        isPublic: false,
      },
    ],
  });

  // Create Testcases for Problem 2
  await prisma.testcase.createMany({
    data: [
      {
        problemId: problem2.id,
        input: '["h","e","l","l","o"]',
        expectedOutput: '["o","l","l","e","h"]',
        isPublic: true,
      },
      {
        problemId: problem2.id,
        input: '["H","a","n","n","a","h"]',
        expectedOutput: '["h","a","n","n","a","H"]',
        isPublic: true,
      },
    ],
  });

  // Create Testcases for Problem 3
  await prisma.testcase.createMany({
    data: [
      {
        problemId: problem3.id,
        input: '"()"',
        expectedOutput: 'true',
        isPublic: true,
      },
      {
        problemId: problem3.id,
        input: '"()[]{}"',
        expectedOutput: 'true',
        isPublic: true,
      },
      {
        problemId: problem3.id,
        input: '"(]"',
        expectedOutput: 'false',
        isPublic: false,
      },
    ],
  });

  console.log('✅ Created testcases');

  // Create Enrollments
  await prisma.enrollment.createMany({
    data: [
      {
        userId: student1.id,
        courseId: course1.id,
        progress: 60,
        createdAt: new Date('2024-01-15'),
      },
      {
        userId: student1.id,
        courseId: course2.id,
        progress: 25,
        createdAt: new Date('2024-02-01'),
      },
      {
        userId: student2.id,
        courseId: course1.id,
        progress: 100,
        createdAt: new Date('2024-01-10'),
      },
    ],
  });

  console.log('📝 Created enrollments');

  // Note: No Progress for students - they need to complete lessons themselves

  // Note: No Lesson Progress for students - they need to complete lessons themselves

  // Create Submissions
  await prisma.submission.createMany({
    data: [
      {
        userId: student1.id,
        problemId: problem1.id,
        code: 'function twoSum(nums, target) { const map = new Map(); for (let i = 0; i < nums.length; i++) { const complement = target - nums[i]; if (map.has(complement)) return [map.get(complement), i]; map.set(nums[i], i); } }',
        language: 'javascript',
        status: 'AC',
        runtime: 45,
        memory: 128,
        createdAt: new Date('2024-01-20'),
      },
      {
        userId: student1.id,
        problemId: problem2.id,
        code: 'function reverseString(s) { return s.reverse(); }',
        language: 'javascript',
        status: 'AC',
        runtime: 12,
        memory: 64,
        createdAt: new Date('2024-01-21'),
      },
      {
        userId: student2.id,
        problemId: problem1.id,
        code: 'function twoSum(nums, target) { for (let i = 0; i < nums.length; i++) { for (let j = i + 1; j < nums.length; j++) { if (nums[i] + nums[j] === target) return [i, j]; } } }',
        language: 'javascript',
        status: 'AC',
        runtime: 156,
        memory: 256,
        createdAt: new Date('2024-01-19'),
      },
      {
        userId: student2.id,
        problemId: problem3.id,
        code: 'function isValid(s) { const stack = []; const map = { ")": "(", "]": "[", "}": "{" }; for (let char of s) { if (map[char]) { if (stack.pop() !== map[char]) return false; } else { stack.push(char); } } return stack.length === 0; }',
        language: 'javascript',
        status: 'AC',
        runtime: 78,
        memory: 128,
        createdAt: new Date('2024-01-22'),
      },
    ],
  });

  console.log('📤 Created submissions');

  // Create Minitest
  const minitest1 = await prisma.minitest.create({
    data: {
      phaseId: phase1.id,
      title: 'Quiz 1 - JavaScript Basics',
    },
  });

  await prisma.minitestQuestion.createMany({
    data: [
      { minitestId: minitest1.id, problemId: problem1.id },
      { minitestId: minitest1.id, problemId: problem2.id },
    ],
  });

  await prisma.minitestSubmission.create({
    data: {
      userId: student1.id,
      minitestId: minitest1.id,
      score: 100,
    },
  });

  console.log('📝 Created minitest');

  // Create Hackathon
  const hackathon1 = await prisma.hackathon.create({
    data: {
      title: '24-Hour Coding Challenge',
      description: 'Build a REST API in 24 hours using Node.js and Express',
      startTime: new Date('2024-03-01T00:00:00Z'),
      endTime: new Date('2024-03-02T00:00:00Z'),
    },
  });

  await prisma.hackathonParticipant.createMany({
    data: [
      { userId: student1.id, hackathonId: hackathon1.id },
      { userId: student2.id, hackathonId: hackathon1.id },
    ],
  });

  await prisma.hackathonSubmission.create({
    data: {
      userId: student1.id,
      hackathonId: hackathon1.id,
      problemId: problem3.id,
      score: 95,
    },
  });

  console.log('🏆 Created hackathon');

  // Create Project
  const project1 = await prisma.project.create({
    data: {
      courseId: course1.id,
      title: 'JavaScript Calculator',
      description: 'Build a fully functional calculator using JavaScript',
    },
  });

  await prisma.projectSubmission.create({
    data: {
      userId: student1.id,
      projectId: project1.id,
      fileUrl: 'https://storage.codefit.com/projects/calc-v1.zip',
      status: 'approved',
    },
  });

  console.log('📁 Created project');

  // Create Certificates
  await prisma.certificate.create({
    data: {
      userId: student2.id,
      courseId: course1.id,
      issuedAt: new Date('2024-02-01'),
    },
  });

  console.log('🎓 Created certificate');

  // Create User Stats
  await prisma.userStats.createMany({
    data: [
      { userId: student1.id, score: 1150, frequency: 25, rank: 5 },
      { userId: student2.id, score: 1200, frequency: 30, rank: 3 },
    ],
  });

  console.log('📈 Created user stats');

  // Create Feedback
  await prisma.feedback.createMany({
    data: [
      {
        userId: student1.id,
        message: 'Excellent course! Very comprehensive content.',
      },
      {
        userId: student2.id,
        message: 'Good course but could use more examples.',
      },
    ],
  });

  console.log('💬 Created feedback');

  // Create Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: student1.id,
        type: 'submission',
        title: 'Submission Graded',
        content: 'Your submission for "Two Sum" has been graded. Status: Accepted',
        isRead: true,
      },
      {
        userId: student1.id,
        type: 'hackathon',
        title: 'Hackathon Starting Soon',
        content: '24-Hour Coding Challenge starts in 1 hour!',
        isRead: false,
      },
      {
        userId: student2.id,
        type: 'system',
        title: 'Welcome to CodeFit!',
        content: 'Thanks for joining CodeFit. Start your coding journey today!',
        isRead: true,
      },
    ],
  });

  console.log('🔔 Created notifications');

  console.log('\n✅ Seed completed successfully!');
  console.log('\n📋 Summary:');
  console.log(`   - 1 Admin (admin@codefit.com / admin123)`);
  console.log(`   - 2 Lectures (thanh.nguyen@codefit.com, linh.tran@codefit.com)`);
  console.log(`   - 2 Users (john@example.com, jane@example.com / password123)`);
  console.log(`   - 5 Courses`);
  console.log(`   - 8 Unlock Codes (CFE-XXXXXXXXXXXXXXXXXXXX format)`);
  console.log(`   - Example code: CFE-A1B2C3D4E5F6G7H8`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
