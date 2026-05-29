const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Find user by email
  const user = await prisma.user.findFirst({
    where: { email: 'tungnguyenthanh710@gmail.com' },
    select: { id: true, email: true, fullName: true }
  });
  console.log('User:', JSON.stringify(user, null, 2));
  
  if (user) {
    // Check enrollment for this course
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        courseId: 'bcfa6894-d0d7-4305-8587-4b9d4030015c'
      },
      select: { id: true, userId: true, currentUnlocks: true, completedLessons: true }
    });
    console.log('Enrollment:', JSON.stringify(enrollment, null, 2));
  }
  
  await prisma.$disconnect();
}

main().catch(console.error);
