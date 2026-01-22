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
    console.log('✅ Database cleaned!\n');
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
    const walletCash = await prisma.wallet.create({
        data: {
            name: 'Tiền mặt',
            type: client_1.WalletType.CASH,
            balance: 10000000,
            currency: 'VND',
            color: '#10B981',
            userId: user.id,
        },
    });
    const walletBank = await prisma.wallet.create({
        data: {
            name: 'Vietcombank',
            type: client_1.WalletType.BANK,
            balance: 50000000,
            currency: 'VND',
            color: '#3B82F6',
            userId: user.id,
        },
    });
    const walletCredit = await prisma.wallet.create({
        data: {
            name: 'Thẻ tín dụng',
            type: client_1.WalletType.CREDIT_CARD,
            balance: 5000000,
            currency: 'VND',
            color: '#EF4444',
            userId: user.id,
        },
    });
    console.log('💰 Wallets created\n');
    const catSalary = await prisma.category.create({
        data: { name: 'Lương', type: client_1.TransactionType.INCOME, icon: '💼', color: '#10B981', userId: user.id },
    });
    const catFreelance = await prisma.category.create({
        data: { name: 'Freelance', type: client_1.TransactionType.INCOME, icon: '💻', color: '#F59E0B', userId: user.id },
    });
    const catFood = await prisma.category.create({
        data: { name: 'Ăn uống', type: client_1.TransactionType.EXPENSE, icon: '🍔', color: '#EF4444', userId: user.id },
    });
    const catTransport = await prisma.category.create({
        data: { name: 'Di chuyển', type: client_1.TransactionType.EXPENSE, icon: '🚗', color: '#F97316', userId: user.id },
    });
    const catShopping = await prisma.category.create({
        data: { name: 'Mua sắm', type: client_1.TransactionType.EXPENSE, icon: '🛍️', color: '#EC4899', userId: user.id },
    });
    const catBills = await prisma.category.create({
        data: { name: 'Hóa đơn', type: client_1.TransactionType.EXPENSE, icon: '📄', color: '#6B7280', userId: user.id },
    });
    console.log('📁 Categories created\n');
    const now = new Date();
    let txCount = 0;
    const salaryDate = new Date(now.getFullYear(), now.getMonth(), 1);
    await prisma.transaction.create({
        data: {
            amount: 20000000,
            type: client_1.TransactionType.INCOME,
            description: 'Lương tháng ' + (now.getMonth() + 1),
            date: salaryDate,
            walletId: walletBank.id,
            categoryId: catSalary.id,
            userId: user.id,
        },
    });
    txCount++;
    const freelanceDate = new Date(now);
    freelanceDate.setDate(freelanceDate.getDate() - 10);
    await prisma.transaction.create({
        data: {
            amount: 8000000,
            type: client_1.TransactionType.INCOME,
            description: 'Project website',
            date: freelanceDate,
            walletId: walletBank.id,
            categoryId: catFreelance.id,
            userId: user.id,
        },
    });
    txCount++;
    for (let i = 0; i < 30; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const numExpenses = Math.floor(Math.random() * 2) + 2;
        for (let j = 0; j < numExpenses; j++) {
            const categories = [catFood, catTransport, catShopping, catBills];
            const category = categories[Math.floor(Math.random() * categories.length)];
            const wallets = [walletCash, walletBank, walletCredit];
            const wallet = wallets[Math.floor(Math.random() * wallets.length)];
            let amount;
            let description;
            if (category.name === 'Ăn uống') {
                amount = Math.floor(Math.random() * 100000) + 30000;
                description = ['Cơm trưa', 'Cà phê', 'Ăn tối'][Math.floor(Math.random() * 3)];
            }
            else if (category.name === 'Di chuyển') {
                amount = Math.floor(Math.random() * 100000) + 20000;
                description = ['Grab', 'Xăng xe', 'Gửi xe'][Math.floor(Math.random() * 3)];
            }
            else if (category.name === 'Mua sắm') {
                amount = Math.floor(Math.random() * 1000000) + 100000;
                description = ['Quần áo', 'Giày dép', 'Đồ dùng'][Math.floor(Math.random() * 3)];
            }
            else {
                amount = Math.floor(Math.random() * 500000) + 200000;
                description = ['Điện', 'Nước', 'Internet'][Math.floor(Math.random() * 3)];
            }
            await prisma.transaction.create({
                data: {
                    amount,
                    type: client_1.TransactionType.EXPENSE,
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
    console.log('🔄 Recalculating balances...\n');
    for (const wallet of [walletCash, walletBank, walletCredit]) {
        const transactions = await prisma.transaction.findMany({
            where: { walletId: wallet.id },
        });
        let balance = 0;
        if (wallet.id === walletCash.id)
            balance = 10000000;
        if (wallet.id === walletBank.id)
            balance = 50000000;
        if (wallet.id === walletCredit.id)
            balance = 5000000;
        for (const tx of transactions) {
            const amount = parseFloat(tx.amount.toString());
            if (tx.type === client_1.TransactionType.INCOME) {
                balance += amount;
            }
            else {
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
//# sourceMappingURL=seed-clean.js.map