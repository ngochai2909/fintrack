"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🧹 Cleaning database...');
    await prisma.transaction.deleteMany();
    await prisma.category.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.user.deleteMany();
    console.log('✅ Database cleaned!');
    console.log('\n📦 Creating seed data...\n');
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
    const wallets = await Promise.all([
        prisma.wallet.create({
            data: {
                name: 'Tiền mặt',
                type: client_1.WalletType.CASH,
                balance: 5000000,
                currency: 'VND',
                color: '#10B981',
                userId: user.id,
            },
        }),
        prisma.wallet.create({
            data: {
                name: 'Vietcombank',
                type: client_1.WalletType.BANK,
                balance: 15000000,
                currency: 'VND',
                color: '#3B82F6',
                userId: user.id,
            },
        }),
        prisma.wallet.create({
            data: {
                name: 'Thẻ tín dụng TPBank',
                type: client_1.WalletType.CREDIT_CARD,
                balance: 8000000,
                currency: 'VND',
                color: '#EF4444',
                userId: user.id,
            },
        }),
    ]);
    console.log('💰 Wallets created:');
    wallets.forEach(w => console.log(`   - ${w.name}: ${w.balance.toLocaleString()} ${w.currency}`));
    console.log('');
    const incomeCategories = await Promise.all([
        prisma.category.create({
            data: {
                name: 'Lương',
                type: client_1.TransactionType.INCOME,
                icon: '💼',
                color: '#10B981',
                userId: user.id,
            },
        }),
        prisma.category.create({
            data: {
                name: 'Thưởng',
                type: client_1.TransactionType.INCOME,
                icon: '🎁',
                color: '#06B6D4',
                userId: user.id,
            },
        }),
        prisma.category.create({
            data: {
                name: 'Đầu tư',
                type: client_1.TransactionType.INCOME,
                icon: '📈',
                color: '#8B5CF6',
                userId: user.id,
            },
        }),
        prisma.category.create({
            data: {
                name: 'Freelance',
                type: client_1.TransactionType.INCOME,
                icon: '💻',
                color: '#F59E0B',
                userId: user.id,
            },
        }),
    ]);
    const expenseCategories = await Promise.all([
        prisma.category.create({
            data: {
                name: 'Ăn uống',
                type: client_1.TransactionType.EXPENSE,
                icon: '🍔',
                color: '#EF4444',
                userId: user.id,
            },
        }),
        prisma.category.create({
            data: {
                name: 'Di chuyển',
                type: client_1.TransactionType.EXPENSE,
                icon: '🚗',
                color: '#F97316',
                userId: user.id,
            },
        }),
        prisma.category.create({
            data: {
                name: 'Mua sắm',
                type: client_1.TransactionType.EXPENSE,
                icon: '🛍️',
                color: '#EC4899',
                userId: user.id,
            },
        }),
        prisma.category.create({
            data: {
                name: 'Giải trí',
                type: client_1.TransactionType.EXPENSE,
                icon: '🎮',
                color: '#8B5CF6',
                userId: user.id,
            },
        }),
        prisma.category.create({
            data: {
                name: 'Hóa đơn',
                type: client_1.TransactionType.EXPENSE,
                icon: '📄',
                color: '#6B7280',
                userId: user.id,
            },
        }),
        prisma.category.create({
            data: {
                name: 'Y tế',
                type: client_1.TransactionType.EXPENSE,
                icon: '🏥',
                color: '#DC2626',
                userId: user.id,
            },
        }),
        prisma.category.create({
            data: {
                name: 'Giáo dục',
                type: client_1.TransactionType.EXPENSE,
                icon: '📚',
                color: '#2563EB',
                userId: user.id,
            },
        }),
    ]);
    console.log('📁 Categories created:');
    console.log(`   Income: ${incomeCategories.length}`);
    console.log(`   Expense: ${expenseCategories.length}\n`);
    const now = new Date();
    const transactions = [];
    for (let i = 0; i < 30; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        if (i % 7 === 0) {
            transactions.push({
                amount: 15000000,
                type: client_1.TransactionType.INCOME,
                description: 'Lương tháng ' + (date.getMonth() + 1),
                date,
                walletId: wallets[1].id,
                categoryId: incomeCategories[0].id,
                userId: user.id,
            });
        }
        if (i % 10 === 0 && i > 0) {
            transactions.push({
                amount: 5000000,
                type: client_1.TransactionType.INCOME,
                description: 'Project website cho khách hàng',
                date,
                walletId: wallets[1].id,
                categoryId: incomeCategories[3].id,
                userId: user.id,
            });
        }
        const numExpenses = Math.floor(Math.random() * 3) + 2;
        for (let j = 0; j < numExpenses; j++) {
            const expenseCategory = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
            const wallet = wallets[Math.floor(Math.random() * wallets.length)];
            let amount;
            let description;
            switch (expenseCategory.name) {
                case 'Ăn uống':
                    amount = Math.floor(Math.random() * 150000) + 50000;
                    description = ['Cơm trưa', 'Cà phê', 'Ăn tối', 'Trà sữa'][Math.floor(Math.random() * 4)];
                    break;
                case 'Di chuyển':
                    amount = Math.floor(Math.random() * 200000) + 30000;
                    description = ['Grab', 'Xăng xe', 'Gửi xe', 'Taxi'][Math.floor(Math.random() * 4)];
                    break;
                case 'Mua sắm':
                    amount = Math.floor(Math.random() * 2000000) + 200000;
                    description = ['Quần áo', 'Giày dép', 'Phụ kiện', 'Đồ dùng'][Math.floor(Math.random() * 4)];
                    break;
                case 'Giải trí':
                    amount = Math.floor(Math.random() * 500000) + 100000;
                    description = ['Xem phim', 'Karaoke', 'Game', 'Du lịch'][Math.floor(Math.random() * 4)];
                    break;
                case 'Hóa đơn':
                    amount = Math.floor(Math.random() * 1000000) + 500000;
                    description = ['Điện', 'Nước', 'Internet', 'Điện thoại'][Math.floor(Math.random() * 4)];
                    break;
                case 'Y tế':
                    amount = Math.floor(Math.random() * 500000) + 200000;
                    description = ['Khám bệnh', 'Mua thuốc', 'Xét nghiệm'][Math.floor(Math.random() * 3)];
                    break;
                case 'Giáo dục':
                    amount = Math.floor(Math.random() * 2000000) + 500000;
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
                type: client_1.TransactionType.EXPENSE,
                description,
                date: txDate,
                walletId: wallet.id,
                categoryId: expenseCategory.id,
                userId: user.id,
            });
        }
    }
    let createdCount = 0;
    for (const tx of transactions) {
        await prisma.transaction.create({ data: tx });
        createdCount++;
    }
    console.log(`📊 Transactions created: ${createdCount}`);
    console.log(`   Income: ${transactions.filter(t => t.type === client_1.TransactionType.INCOME).length}`);
    console.log(`   Expense: ${transactions.filter(t => t.type === client_1.TransactionType.EXPENSE).length}\n`);
    console.log('🔄 Recalculating wallet balances...');
    for (const wallet of wallets) {
        const walletTransactions = transactions.filter(t => t.walletId === wallet.id);
        let balance = 0;
        if (wallet.name === 'Tiền mặt')
            balance = 5000000;
        if (wallet.name === 'Vietcombank')
            balance = 15000000;
        if (wallet.name === 'Thẻ tín dụng TPBank')
            balance = 8000000;
        for (const tx of walletTransactions) {
            if (tx.type === client_1.TransactionType.INCOME) {
                balance += tx.amount;
            }
            else if (tx.type === client_1.TransactionType.EXPENSE) {
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
//# sourceMappingURL=seed.js.map