import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Creating detailed test cases for all CODE lessons...\n');

  // Tìm tất cả bài học type CODE
  const codeLessons = await prisma.lesson.findMany({
    where: { type: 'CODE' },
    include: { lessonContent: true },
  });

  console.log(`Found ${codeLessons.length} CODE lessons\n`);

  // Map bài học với test case cụ thể
  const testCaseMap: Record<string, any> = {
    'Two Sum': {
      testCases: [
        { input: '[2, 7, 11, 15], 9', expectedOutput: '[0, 1]', isPublic: true, points: 25 },
        { input: '[3, 2, 4], 6', expectedOutput: '[1, 2]', isPublic: true, points: 25 },
        { input: '[3, 3], 6', expectedOutput: '[0, 1]', isPublic: false, points: 25 },
        { input: '[1], 2', expectedOutput: '[]', isPublic: false, points: 25 },
      ],
      hints: [
        { content: 'Sử dụng Map để lưu trữ giá trị và chỉ số của phần tử đã duyệt', penalty: 10 },
        { content: 'Với mỗi phần tử nums[i], tìm xem (target - nums[i]) có trong Map không', penalty: 10 },
      ],
    },
    'Reverse String': {
      testCases: [
        { input: '"hello"', expectedOutput: '"olleh"', isPublic: true, points: 25 },
        { input: '"JavaScript"', expectedOutput: '"tpircSavaJ"', isPublic: true, points: 25 },
        { input: '"a"', expectedOutput: '"a"', isPublic: false, points: 25 },
        { input: '""', expectedOutput: '""', isPublic: false, points: 25 },
      ],
      hints: [
        { content: 'Đảo ngược chuỗi bằng split("").reverse().join("")', penalty: 10 },
      ],
    },
    'FizzBuzz': {
      testCases: [
        { input: '3', expectedOutput: '["1","2","Fizz"]', isPublic: true, points: 33 },
        { input: '5', expectedOutput: '["1","2","Fizz","4","Buzz"]', isPublic: true, points: 33 },
        { input: '15', expectedOutput: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]', isPublic: false, points: 34 },
      ],
      hints: [
        { content: 'Kiểm tra chia hết cho 15 trước (vì 15 = 3 x 5)', penalty: 10 },
        { content: 'Sau đó kiểm tra chia hết cho 3, rồi chia hết cho 5', penalty: 10 },
      ],
    },
  };

  for (const lesson of codeLessons) {
    console.log(`📝 ${lesson.title} (${lesson.id})`);
    
    // Tìm test case phù hợp
    let testData = null;
    for (const [key, data] of Object.entries(testCaseMap)) {
      if (lesson.title.toLowerCase().includes(key.toLowerCase())) {
        testData = data;
        break;
      }
    }

    if (!testData) {
      // Tạo test case mặc định
      testData = {
        testCases: [
          { input: 'test', expectedOutput: 'result', isPublic: true, points: 50 },
          { input: 'sample', expectedOutput: 'sample', isPublic: true, points: 50 },
        ],
        hints: [
          { content: 'Xem lại bài học để hiểu yêu cầu', penalty: 10 },
        ],
      };
    }

    // Update lesson content
    if (lesson.lessonContent) {
      await prisma.lessonContent.update({
        where: { lessonId: lesson.id },
        data: {
          testCases: JSON.stringify(testData.testCases),
          hints: JSON.stringify(testData.hints),
        },
      });
      console.log(`   ✅ Updated ${testData.testCases.length} test cases`);
    } else {
      // Tạo lesson content mới
      await prisma.lessonContent.create({
        data: {
          lessonId: lesson.id,
          content: lesson.content,
          testCases: JSON.stringify(testData.testCases),
          hints: JSON.stringify(testData.hints),
          starterCode: `// Solution for ${lesson.title}\nfunction solution() {\n  // Write your code here\n  \n}\n\nmodule.exports = { solution };`,
          timeLimit: 1000,
          memoryLimit: 256,
        },
      });
      console.log(`   ✅ Created lesson content with ${testData.testCases.length} test cases`);
    }

    // Update scoring config
    await prisma.scoringConfig.upsert({
      where: { lessonId: lesson.id },
      update: { baseScore: 100, penaltyPerHint: 10 },
      create: { lessonId: lesson.id, baseScore: 100, penaltyPerHint: 10 },
    });
    console.log('');
  }

  console.log('✅ Done! All CODE lessons now have test cases.');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
