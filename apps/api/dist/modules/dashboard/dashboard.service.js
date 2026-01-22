"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardSummary(userId) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        const last30Days = new Date(now);
        last30Days.setDate(last30Days.getDate() - 30);
        const [totalBalance, monthlyIncome, monthlyExpense, recentTransactions, incomeByCategory, expenseByCategory, last30DaysTransactions,] = await Promise.all([
            this.getTotalBalance(userId),
            this.getMonthlyTotal(userId, client_1.TransactionType.INCOME, startOfMonth, endOfMonth),
            this.getMonthlyTotal(userId, client_1.TransactionType.EXPENSE, startOfMonth, endOfMonth),
            this.getRecentTransactions(userId, 10),
            this.getTransactionsByCategory(userId, client_1.TransactionType.INCOME, startOfMonth, endOfMonth),
            this.getTransactionsByCategory(userId, client_1.TransactionType.EXPENSE, startOfMonth, endOfMonth),
            this.getTransactionsForTrend(userId, last30Days, now),
        ]);
        const balanceChange = monthlyIncome - monthlyExpense;
        const dailyTrend = this.processDailyTrend(last30DaysTransactions);
        return {
            summary: {
                totalBalance,
                monthlyIncome,
                monthlyExpense,
                balanceChange,
                month: now.toLocaleString('vi-VN', { month: 'long', year: 'numeric' }),
            },
            recentTransactions,
            charts: {
                incomeByCategory,
                expenseByCategory,
                dailyTrend,
            },
        };
    }
    async getTotalBalance(userId) {
        const result = await this.prisma.wallet.aggregate({
            where: { userId },
            _sum: { balance: true },
        });
        return parseFloat(result._sum.balance?.toString() || '0');
    }
    async getMonthlyTotal(userId, type, startDate, endDate) {
        const result = await this.prisma.transaction.aggregate({
            where: {
                userId,
                type,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            _sum: { amount: true },
        });
        return parseFloat(result._sum.amount?.toString() || '0');
    }
    async getRecentTransactions(userId, limit) {
        return this.prisma.transaction.findMany({
            where: { userId },
            take: limit,
            orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
            include: {
                wallet: {
                    select: {
                        id: true,
                        name: true,
                        currency: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        icon: true,
                        color: true,
                    },
                },
            },
        });
    }
    async getTransactionsByCategory(userId, type, startDate, endDate) {
        const transactions = await this.prisma.transaction.groupBy({
            by: ['categoryId'],
            where: {
                userId,
                type,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            _sum: { amount: true },
            _count: { id: true },
        });
        const categoryIds = transactions.map((t) => t.categoryId);
        const categories = await this.prisma.category.findMany({
            where: { id: { in: categoryIds } },
            select: {
                id: true,
                name: true,
                icon: true,
                color: true,
            },
        });
        return transactions.map((t) => {
            const category = categories.find((c) => c.id === t.categoryId);
            return {
                categoryId: t.categoryId,
                categoryName: category?.name || 'Unknown',
                categoryIcon: category?.icon || '📁',
                categoryColor: category?.color || '#6B7280',
                amount: parseFloat(t._sum.amount?.toString() || '0'),
                count: t._count.id,
            };
        });
    }
    async getTransactionsForTrend(userId, startDate, endDate) {
        return this.prisma.transaction.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                date: true,
                type: true,
                amount: true,
            },
            orderBy: { date: 'asc' },
        });
    }
    processDailyTrend(transactions) {
        const dailyMap = new Map();
        const now = new Date();
        for (let i = 29; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateKey = date.toISOString().split('T')[0];
            dailyMap.set(dateKey, { income: 0, expense: 0 });
        }
        transactions.forEach((t) => {
            const dateKey = new Date(t.date).toISOString().split('T')[0];
            const existing = dailyMap.get(dateKey);
            if (existing) {
                const amount = parseFloat(t.amount.toString());
                if (t.type === client_1.TransactionType.INCOME) {
                    existing.income += amount;
                }
                else if (t.type === client_1.TransactionType.EXPENSE) {
                    existing.expense += amount;
                }
            }
        });
        return Array.from(dailyMap.entries()).map(([date, data]) => ({
            date,
            income: data.income,
            expense: data.expense,
        }));
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map