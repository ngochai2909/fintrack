const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('\n🔍 CHECKING DATABASE...\n');
  
  // Check users
  const users = await prisma.user.findMany({
    select: { id: true, email: true, firstName: true, lastName: true }
  });
  console.log('👥 USERS:', users.length);
  users.forEach(u => console.log(`   - ${u.email} (${u.firstName} ${u.lastName})`));
  
  // Check wallets
  const wallets = await prisma.wallet.findMany({
    include: { user: { select: { email: true } } }
  });
  console.log('\n💰 WALLETS:', wallets.length);
  wallets.forEach(w => console.log(`   - ${w.name}: ${w.balance} ${w.currency} (Owner: ${w.user.email})`));
  
  // Check transactions
  const transactions = await prisma.transaction.count();
  console.log('\n📊 TRANSACTIONS:', transactions);
  
  await prisma.$disconnect();
}

main();
