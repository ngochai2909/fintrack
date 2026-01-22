import { PrismaClient, TransactionType, WalletType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning database...');
  
  // Delete all data (in correct order due to foreign keys)
  await prisma.transaction.deleteMany();
  await prisma.category.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.user.deleteMany();
  
  console.log('✅ Database cleaned!');
  console.log('\n📦 Creating seed data...\n');

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
  
  console.log('👤 User created:');
  console.log(`   Email: ${user.email}`);
  console.log(`   Password: 123456`);
  console.log(`   ID: ${user.id}\n`);

  // ═══════════════════════════════════════════════════════════
  // 2. CREATE WALLETS
  // ═══════════════════════════════════════════════════════════
  const wallets = await Promise.all([
    prisma.wallet.create({
      data: {
        name: 'Tiền mặt',
        type: WalletType.CASH,
        balance: 5000000, // 5M
        currency: 'VND',
        color: '#10B981',
        userId: user.id,
      },
    }),
    prisma.wallet.create({
      data: {
        name: 'Vietcombank',
        type: WalletType.BANK,
        balance: 15000000, // 15M
        currency: 'VND',
        color: '#3B82F6',
        userId: user.id,
      },
    }),
    prisma.wallet.create({
      data: {
        name: 'Thẻ tín dụng TPBank',
        type: WalletType.CREDIT_CARD,
        balance: 8000000, // 8M
        currency: 'VND',
        color: '#EF4444',
        userId: user.id,
      },
    }),
  ]);
  
  console.log('💰 Wallets created:');
  wallets.forEach(w => console.log(`   - ${w.name}: ${w.balance.toLocaleString()} ${w.currency}`));
  console.log('');

  // ═══════════════════════════════════════════════════════════
  // 3. CREATE CATEGORIES
  // ═══════════════════════════════════════════════════════════
  
  // Income categories
  const incomeCategories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Lương',
        type: TransactionType.INCOME,
        icon: '💼',
        color: '#10B981',
        userId: user.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Thưởng',
        type: TransactionType.INCOME,
        icon: '🎁',
        color: '#06B6D4',
        userId: user.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Đầu tư',
        type: TransactionType.INCOME,
        icon: '📈',
        color: '#8B5CF6',
        userId: user.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Freelance',
        type: TransactionType.INCOME,
        icon: '💻',
        color: '#F59E0B',
        userId: user.id,
      },
    }),
  ]);

  // Expense categories
  const expenseCategories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Ăn uống',
        type: TransactionType.EXPENSE,
        icon: '🍔',
        color: '#EF4444',
        userId: user.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Di chuyển',
        type: TransactionType.EXPENSE,
        icon: '🚗',
        color: '#F97316',
        userId: user.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Mua sắm',
        type: TransactionType.EXPENSE,
        icon: '🛍️',
        color: '#EC4899',
        userId: user.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Giải trí',
        type: TransactionType.EXPENSE,
        icon: '🎮',
        color: '#8B5CF6',
        userId: user.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Hóa đơn',
        type: TransactionType.EXPENSE,
        icon: '📄',
        color: '#6B7280',
        userId: user.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Y tế',
        type: TransactionType.EXPENSE,
        icon: '🏥',
        color: '#DC2626',
        userId: user.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Giáo dục',
        type: TransactionType.EXPENSE,
        icon: '📚',
        color: '#2563EB',
        userId: user.id,
      },
    }),
  ]);
  
  console.log('📁 Categories created:');
  console.log(`   Income: ${incomeCategories.length}`);
  console.log(`   Expense: ${expenseCategories.length}\n`);

  // ═══════════════════════════════════════════════════════════
  // 4. CREATE TRANSACTIONS (Last 30 days)
  // ═══════════════════════════════════════════════════════════
  
  const now = new Date();
  const transactions = [];

  // Generate transactions for last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // 1-2 income transactions per week
    if (i % 7 === 0) {
      transactions.push({
        amount: 15000000, // Lương
        type: TransactionType.INCOME,
        description: 'Lương tháng ' + (date.getMonth() + 1),
        date,
        walletId: wallets[1].id, // Vietcombank
        categoryId: incomeCategories[0].id, // Lương
        userId: user.id,
      });
    }

    if (i % 10 === 0 && i > 0) {
      transactions.push({
        amount: 5000000, // Freelance
        type: TransactionType.INCOME,
        description: 'Project website cho khách hàng',
        date,
        walletId: wallets[1].id,
        categoryId: incomeCategories[3].id, // Freelance
        userId: user.id,
      });
    }

    // Daily expenses (2-4 per day)
    const numExpenses = Math.floor(Math.random() * 3) + 2;
    
    for (let j = 0; j < numExpenses; j++) {
      const expenseCategory = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
      const wallet = wallets[Math.floor(Math.random() * wallets.length)];
      
      let amount: number;
      let description: string;

      // Different amounts based on category
      switch (expenseCategory.name) {
        case 'Ăn uống':
          amount = Math.floor(Math.random() * 150000) + 50000; // 50k-200k
          description = ['Cơm trưa', 'Cà phê', 'Ăn tối', 'Trà sữa'][Math.floor(Math.random() * 4)];
          break;
        case 'Di chuyển':
          amount = Math.floor(Math.random() * 200000) + 30000; // 30k-230k
          description = ['Grab', 'Xăng xe', 'Gửi xe', 'Taxi'][Math.floor(Math.random() * 4)];
          break;
        case 'Mua sắm':
          amount = Math.floor(Math.random() * 2000000) + 200000; // 200k-2.2M
          description = ['Quần áo', 'Giày dép', 'Phụ kiện', 'Đồ dùng'][Math.floor(Math.random() * 4)];
          break;
        case 'Giải trí':
          amount = Math.floor(Math.random() * 500000) + 100000; // 100k-600k
          description = ['Xem phim', 'Karaoke', 'Game', 'Du lịch'][Math.floor(Math.random() * 4)];
          break;
        case 'Hóa đơn':
          amount = Math.floor(Math.random() * 1000000) + 500000; // 500k-1.5M
          description = ['Điện', 'Nước', 'Internet', 'Điện thoại'][Math.floor(Math.random() * 4)];
          break;
        case 'Y tế':
          amount = Math.floor(Math.random() * 500000) + 200000; // 200k-700k
          description = ['Khám bệnh', 'Mua thuốc', 'Xét nghiệm'][Math.floor(Math.random() * 3)];
          break;
        case 'Giáo dục':
          amount = Math.floor(Math.random() * 2000000) + 500000; // 500k-2.5M
          description = ['Học phí', 'Sách', 'Khóa học online'][Math.floor(Math.random() * 3)];
          break;
        default:
          amount = Math.floor(Math.random() * 200000) + 50000;
          description = 'Chi tiêu khác';
      }

      const txDate = new Date(date);
      txDate.setHours(Math.floor(Math.random() * 24));
      txDate.setMinutes(Math.floor(Math.random() * 60));

      transactions.push({
        amount,
        type: TransactionType.EXPENSE,
        description,
        date: txDate,
        walletId: wallet.id,
        categoryId: expenseCategory.id,
        userId: user.id,
      });
    }
  }

  // Create all transactions
  let createdCount = 0;
  for (const tx of transactions) {
    await prisma.transaction.create({ data: tx });
    createdCount++;
  }
  
  console.log(`📊 Transactions created: ${createdCount}`);
  console.log(`   Income: ${transactions.filter(t => t.type === TransactionType.INCOME).length}`);
  console.log(`   Expense: ${transactions.filter(t => t.type === TransactionType.EXPENSE).length}\n`);

  // ═══════════════════════════════════════════════════════════
  // 5. RECALCULATE WALLET BALANCES
  // ═══════════════════════════════════════════════════════════
  console.log('🔄 Recalculating wallet balances...');
  
  for (const wallet of wallets) {
    const walletTransactions = transactions.filter(t => t.walletId === wallet.id);
    
    let balance = 0;
    if (wallet.name === 'Tiền mặt') balance = 5000000;
    if (wallet.name === 'Vietcombank') balance = 15000000;
    if (wallet.name === 'Thẻ tín dụng TPBank') balance = 8000000;

    for (const tx of walletTransactions) {
      if (tx.type === TransactionType.INCOME) {
        balance += tx.amount;
      } else if (tx.type === TransactionType.EXPENSE) {
        balance -= tx.amount;
      }
    }

    await prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance },
    });
    
    console.log(`   ${wallet.name}: ${balance.toLocaleString()} VND`);
  }

  console.log('\n✅ SEED COMPLETED!\n');
  console.log('═══════════════════════════════════════════════════');
  console.log('🎯 LOGIN CREDENTIALS:');
  console.log('   Email: demo@fintrack.com');
  console.log('   Password: 123456');
  console.log('═══════════════════════════════════════════════════\n');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
