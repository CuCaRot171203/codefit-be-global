import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Checking lesson types and test cases...\n');

  const lessons = await prisma.lesson.findMany({
    include: { lessonContent: true },
    orderBy: { title: 'asc' }
  });

  console.log('📚 All Lessons:\n');
  
  for (const lesson of lessons) {
    let testCount = 0;
    try {
      const tests = JSON.parse(lesson.lessonContent?.testCases || '[]');
      testCount = tests.length;
    } catch {}

    console.log(`${lesson.id}`);
    console.log(`   Title: ${lesson.title}`);
    console.log(`   Type: ${lesson.type}`);
    console.log(`   Test Cases: ${testCount}`);
    console.log('');
  }

  // Tìm bài CODE có test case = 0
  const codeLessonsWithoutTests = await prisma.lesson.findMany({
    where: { type: 'CODE' },
    include: { lessonContent: true },
  });

  console.log('\n🔴 CODE lessons without test cases:');
  for (const lesson of codeLessonsWithoutTests) {
    let testCount = 0;
    try {
      const tests = JSON.parse(lesson.lessonContent?.testCases || '[]');
      testCount = tests.length;
    } catch {}

    if (testCount === 0) {
      console.log(`   ❌ ${lesson.title} (${lesson.id})`);
    }
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
