import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hash('admin123', 12);
  
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@modern-times.com' },
    update: {},
    create: {
      email: 'admin@modern-times.com',
      name: '管理者',
      role: 'admin',
      password: hashedPassword,
    },
  });

  console.log({ admin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 