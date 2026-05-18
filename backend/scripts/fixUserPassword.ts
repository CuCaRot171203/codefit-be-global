import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Fixing test user password...\n');

  // Hash password mới
  const hashedPassword = await bcrypt.hash('password123', 10);
  console.log('✅ Password hashed successfully');

  // Tìm user
  const user = await prisma.user.findFirst({
    where: { email: 'testuser@codefit.com' },
  });

  if (user) {
    // Update password đã hash
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
    console.log('✅ Updated password for user:', user.email);
  } else {
    // Tạo user mới với password đã hash
    const role = await prisma.role.findFirst({ where: { name: 'user' } });
    
    if (!role) {
      console.error('❌ Role "user" not found. Please run seed first.');
      return;
    }

    const newUser = await prisma.user.create({
      data: {
        email: 'testuser@codefit.com',
        username: 'testuser',
        password: hashedPassword,
        fullName: 'Test User',
        roleId: role.id,
      },
    });
    console.log('✅ Created new user:', newUser.email);
  }

  console.log('\n✅ Done! You can now login with:');
  console.log('   Email: testuser@codefit.com');
  console.log('   Password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
