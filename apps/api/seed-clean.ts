import { PrismaClient, TransactionType, WalletType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning database...');
  
  // Delete in correct order
  await prisma.transaction.deleteMany();
  await prisma.category.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.user.deleteMany();
  
  console.log('✅ Database cleaned!\n');

  // ═══════════════════════════════════════════════════════════
  // 1. CREATE USER
  // ═══════════════════════════════════════════════════════════
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  const user = await prisma.user.create({
    data: {
      email: 'demo@fintrack.com',
      password: hashedPassword,
      firstName: 'Demo',
      lastName: 'User',
      role: 'MEMBER',
    },
  });
  
  console.log('👤 User: demo@fintrack.com / 123456\n');

  // ═══════════════════════════════════════════════════════════
  // 2. CREATE WALLETS (Start with initial balances)
  // ═══════════════════════════════════════════════════════════
  const walletCash = await prisma.wallet.create({
    data: {
      name: 'Tiền mặt',
      type: WalletType.CASH,
      balance: 10000000, // 10M start
      currency: 'VND',
      color: '#10B981',
      userId: user.id,
    },
  });

  const walletBank = await prisma.wallet.create({
    data: {
      name: 'Vietcombank',
      type: WalletType.BANK,
      balance: 50000000, // 50M start
      currency: 'VND',
      color: '#3B82F6',
      userId: user.id,
    },
  });

  const walletCredit = await prisma.wallet.create({
    data: {
      name: 'Thẻ tín dụng',
      type: WalletType.CREDIT_CARD,
      balance: 5000000, // 5M start
      currency: 'VND',
      color: '#EF4444',
      userId: user.id,
    },
  });
  
  console.log('💰 Wallets created\n');

  // ═══════════════════════════════════════════════════════════
  // 3. CREATE CATEGORIES
  // ═══════════════════════════════════════════════════════════
  
  const catSalary = await prisma.category.create({
    data: { name: 'Lương', type: TransactionType.INCOME, icon: '💼', color: '#10B981', userId: user.id },
  });

  const catFreelance = await prisma.category.create({
    data: { name: 'Freelance', type: TransactionType.INCOME, icon: '💻', color: '#F59E0B', userId: user.id },
  });

  const catFood = await prisma.category.create({
    data: { name: 'Ăn uống', type: TransactionType.EXPENSE, icon: '🍔', color: '#EF4444', userId: user.id },
  });

  const catTransport = await prisma.category.create({
    data: { name: 'Di chuyển', type: TransactionType.EXPENSE, icon: '🚗', color: '#F97316', userId: user.id },
  });

  const catShopping = await prisma.category.create({
    data: { name: 'Mua sắm', type: TransactionType.EXPENSE, icon: '🛍️', color: '#EC4899', userId: user.id },
  });

  const catBills = await prisma.category.create({
    data: { name: 'Hóa đơn', type: TransactionType.EXPENSE, icon: '📄', color: '#6B7280', userId: user.id },
  });
  
  console.log('📁 Categories created\n');

  // ═══════════════════════════════════════════════════════════
  // 4. CREATE TRANSACTIONS (Last 30 days)
  // ═══════════════════════════════════════════════════════════
  
  const now = new Date();
  let txCount = 0;

  // Salary - beginning of month
  const salaryDate = new Date(now.getFullYear(), now.getMonth(), 1);
  await prisma.transaction.create({
    data: {
      amount: 20000000, // 20M
      type: TransactionType.INCOME,
      description: 'Lương tháng ' + (now.getMonth() + 1),
      date: salaryDate,
      walletId: walletBank.id,
      categoryId: catSalary.id,
      userId: user.id,
    },
  });
  txCount++;

  // Freelance income
  const freelanceDate = new Date(now);
  freelanceDate.setDate(freelanceDate.getDate() - 10);
  await prisma.transaction.create({
    data: {
      amount: 8000000, // 8M
      type: TransactionType.INCOME,
      description: 'Project website',
      date: freelanceDate,
      walletId: walletBank.id,
      categoryId: catFreelance.id,
      userId: user.id,
    },
  });
  txCount++;

  // Create daily expenses for last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // 2-3 expenses per day
    const numExpenses = Math.floor(Math.random() * 2) + 2;

    for (let j = 0; j < numExpenses; j++) {
      const categories = [catFood, catTransport, catShopping, catBills];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const wallets = [walletCash, walletBank, walletCredit];
      const wallet = wallets[Math.floor(Math.random() * wallets.length)];

      let amount: number;
      let description: string;

      if (category.name === 'Ăn uống') {
        amount = Math.floor(Math.random() * 100000) + 30000; // 30k-130k
        description = ['Cơm trưa', 'Cà phê', 'Ăn tối'][Math.floor(Math.random() * 3)];
      } else if (category.name === 'Di chuyển') {
        amount = Math.floor(Math.random() * 100000) + 20000; // 20k-120k
        description = ['Grab', 'Xăng xe', 'Gửi xe'][Math.floor(Math.random() * 3)];
      } else if (category.name === 'Mua sắm') {
        amount = Math.floor(Math.random() * 1000000) + 100000; // 100k-1.1M
        description = ['Quần áo', 'Giày dép', 'Đồ dùng'][Math.floor(Math.random() * 3)];
      } else {
        amount = Math.floor(Math.random() * 500000) + 200000; // 200k-700k
        description = ['Điện', 'Nước', 'Internet'][Math.floor(Math.random() * 3)];
      }

      await prisma.transaction.create({
        data: {
          amount,
          type: TransactionType.EXPENSE,
          description,
          date,
          walletId: wallet.id,
          categoryId: category.id,
          userId: user.id,
        },
      });
      txCount++;
    }
  }

  console.log(`📊 ${txCount} transactions created\n`);

  // ═══════════════════════════════════════════════════════════
  // 5. RECALCULATE WALLET BALANCES
  // ═══════════════════════════════════════════════════════════
  console.log('🔄 Recalculating balances...\n');

  for (const wallet of [walletCash, walletBank, walletCredit]) {
    const transactions = await prisma.transaction.findMany({
      where: { walletId: wallet.id },
    });

    let balance = 0;
    // Set initial balance based on wallet
    if (wallet.id === walletCash.id) balance = 10000000;
    if (wallet.id === walletBank.id) balance = 50000000;
    if (wallet.id === walletCredit.id) balance = 5000000;

    for (const tx of transactions) {
      const amount = parseFloat(tx.amount.toString());
      if (tx.type === TransactionType.INCOME) {
        balance += amount;
      } else {
        balance -= amount;
      }
    }

    await prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance },
    });

    console.log(`   ${wallet.name}: ${balance.toLocaleString('vi-VN')} ₫`);
  }

  console.log('\n✅ DONE!\n');
  console.log('═══════════════════════════════════════');
  console.log('📧 Email: demo@fintrack.com');
  console.log('🔑 Password: 123456');
  console.log('═══════════════════════════════════════\n');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
