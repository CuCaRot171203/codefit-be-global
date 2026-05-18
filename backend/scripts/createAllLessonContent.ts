import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Creating default content for ALL lessons...\n');

  // Lấy tất cả bài học
  const lessons = await prisma.lesson.findMany({
    include: { lessonContent: true, phase: true },
  });

  console.log(`Found ${lessons.length} lessons\n`);

  for (const lesson of lessons) {
    console.log(`📝 ${lesson.title} (${lesson.id})`);
    console.log(`   Type: ${lesson.type}`);
    console.log(`   Phase: ${lesson.phase.title}`);
    console.log(`   Has content: ${lesson.lessonContent ? 'Yes ✅' : 'NO ❌'}`);

    if (!lesson.lessonContent) {
      // Tạo lesson content mặc định
      const defaultContent = lesson.type === 'CODE' 
        ? `
          <h2>${lesson.title}</h2>
          <p>Bài tập lập trình. Hoàn thành code và nộp bài.</p>
          <h3>Yêu cầu</h3>
          <p>Viết code để giải quyết bài toán.</p>
        `
        : `
          <h2>${lesson.title}</h2>
          <p>Nội dung bài học đang được cập nhật...</p>
        `;

      await prisma.lessonContent.create({
        data: {
          lessonId: lesson.id,
          content: defaultContent,
          starterCode: lesson.type === 'CODE' 
            ? `// Solution for ${lesson.title}\nfunction solution() {\n  // Write your code here\n  \n}\n\nmodule.exports = { solution };`
            : null,
          testCases: lesson.type === 'CODE' 
            ? JSON.stringify([
                { input: 'test', expectedOutput: 'result', isPublic: true, points: 100 },
              ])
            : null,
          hints: lesson.type === 'CODE'
            ? JSON.stringify([
                { content: 'Think about the problem carefully', penalty: 10 },
              ])
            : null,
          timeLimit: 1000,
          memoryLimit: 256,
        },
      });
      console.log('   ✅ Created lesson content');
    }

    // Tạo scoring config cho CODE lessons
    if (lesson.type === 'CODE') {
      const existingConfig = await prisma.scoringConfig.findUnique({
        where: { lessonId: lesson.id },
      });
      
      if (!existingConfig) {
        await prisma.scoringConfig.create({
          data: {
            lessonId: lesson.id,
            baseScore: 100,
            penaltyPerHint: 10,
          },
        });
        console.log('   ✅ Created scoring config');
      }
    }
    console.log('');
  }

  console.log('✅ Done! All lessons now have content.');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
