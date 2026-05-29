"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🔧 Creating lesson content for code lessons...\n');
    // Tìm tất cả bài học type CODE trong khóa học mới
    const lessons = await prisma.lesson.findMany({
        where: { type: 'CODE' },
        include: { lessonContent: true, phase: true },
    });
    console.log(`Found ${lessons.length} CODE lessons\n`);
    for (const lesson of lessons) {
        console.log(`📝 ${lesson.title} (${lesson.id})`);
        console.log(`   Phase: ${lesson.phase.title}`);
        console.log(`   Has content: ${lesson.lessonContent ? 'Yes' : 'NO ❌'}`);
        if (!lesson.lessonContent) {
            // Tạo lesson content
            await prisma.lessonContent.create({
                data: {
                    lessonId: lesson.id,
                    content: lesson.content || `<h2>${lesson.title}</h2><p>Nội dung bài tập</p>`,
                    starterCode: `// Solution for ${lesson.title}\nfunction solution() {\n  // Write your code here\n  \n}\n\n// Test\nconsole.log(solution());`,
                    testCases: JSON.stringify([
                        { input: 'test', expectedOutput: 'result', isPublic: true, points: 50 },
                    ]),
                    hints: JSON.stringify([
                        { content: 'Think about the problem carefully', penalty: 10 },
                    ]),
                    timeLimit: 1000,
                    memoryLimit: 256,
                },
            });
            console.log('   ✅ Created lesson content');
        }
        console.log('');
    }
    // Tạo thêm lesson content cho bài Two Sum cụ thể
    const twoSumLesson = await prisma.lesson.findFirst({
        where: { title: { contains: 'Two Sum' } },
    });
    if (twoSumLesson) {
        console.log('\n📝 Creating detailed content for Two Sum...');
        await prisma.lessonContent.upsert({
            where: { lessonId: twoSumLesson.id },
            update: {
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
  // Gợi ý: Sử dụng Map để lưu trữ giá trị và chỉ số
  
}

module.exports = { twoSum };`,
                testCases: JSON.stringify([
                    { input: '[2, 7, 11, 15], 9', expectedOutput: '[0, 1]', isPublic: true, points: 25 },
                    { input: '[3, 2, 4], 6', expectedOutput: '[1, 2]', isPublic: true, points: 25 },
                    { input: '[3, 3], 6', expectedOutput: '[0, 1]', isPublic: false, points: 50 },
                ]),
                hints: JSON.stringify([
                    { content: 'Sử dụng Map để lưu trữ giá trị và chỉ số', penalty: 10 },
                    { content: 'Với mỗi phần tử, kiểm tra xem (target - nums[i]) có trong Map không', penalty: 10 },
                ]),
                timeLimit: 1000,
                memoryLimit: 256,
            },
            create: {
                lessonId: twoSumLesson.id,
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
  // Gợi ý: Sử dụng Map để lưu trữ giá trị và chỉ số
  
}

module.exports = { twoSum };`,
                testCases: JSON.stringify([
                    { input: '[2, 7, 11, 15], 9', expectedOutput: '[0, 1]', isPublic: true, points: 25 },
                    { input: '[3, 2, 4], 6', expectedOutput: '[1, 2]', isPublic: true, points: 25 },
                    { input: '[3, 3], 6', expectedOutput: '[0, 1]', isPublic: false, points: 50 },
                ]),
                hints: JSON.stringify([
                    { content: 'Sử dụng Map để lưu trữ giá trị và chỉ số', penalty: 10 },
                    { content: 'Với mỗi phần tử, kiểm tra xem (target - nums[i]) có trong Map không', penalty: 10 },
                ]),
                timeLimit: 1000,
                memoryLimit: 256,
            },
        });
        console.log('   ✅ Updated Two Sum content');
    }
    // Tạo scoring config cho Two Sum
    if (twoSumLesson) {
        await prisma.scoringConfig.upsert({
            where: { lessonId: twoSumLesson.id },
            update: { baseScore: 100, penaltyPerHint: 10 },
            create: { lessonId: twoSumLesson.id, baseScore: 100, penaltyPerHint: 10 },
        });
        console.log('   ✅ Created scoring config');
    }
    console.log('\n✅ Done! All code lessons now have content.');
}
main()
    .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=createLessonContent.js.map