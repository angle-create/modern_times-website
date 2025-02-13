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

  // Create store information
  const storeInfo = await prisma.storeInfo.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Modern Times 本店',
      address: '〒020-0871 岩手県盛岡市中ノ橋通1-5-23',
      phone: '019-123-4567',
      email: 'info@modern-times.com',
      businessHours: `平日: 10:00 - 19:00
土日祝: 9:00 - 18:00
定休日: 毎週水曜日`,
      parkingInfo: '店舗前に4台、提携駐車場に10台あり',
    },
  });

  console.log({ admin, storeInfo });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 