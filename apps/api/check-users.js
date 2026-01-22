const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      _count: {
        select: {
          wallets: true,
          transactions: true,
          categories: true,
        },
      },
    },
  });

  console.log('\n👥 ALL USERS:\n');
  for (const user of users) {
    console.log(`📧 ${user.email}`);
    console.log(`   Name: ${user.firstName} ${user.lastName}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Wallets: ${user._count.wallets}`);
    console.log(`   Transactions: ${user._count.transactions}`);
    console.log(`   Categories: ${user._count.categories}`);
    console.log('');
  }

  await prisma.$disconnect();
}

main();
