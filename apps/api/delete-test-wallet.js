const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const wallet = await prisma.wallet.findFirst({
    where: { name: 'Cash', balance: 1000000 }
  });
  
  if (wallet) {
    await prisma.wallet.delete({ where: { id: wallet.id } });
    console.log('✅ Đã xóa ví test "Cash"!');
  } else {
    console.log('❌ Không tìm thấy ví test!');
  }
  
  await prisma.$disconnect();
}

main();
