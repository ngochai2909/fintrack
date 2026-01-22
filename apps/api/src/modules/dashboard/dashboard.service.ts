import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionType } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get dashboard summary with statistics and charts data
   */
  async getDashboardSummary(userId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const last30Days = new Date(now);
    last30Days.setDate(last30Days.getDate() - 30);

    const [
      totalBalance,
      monthlyIncome,
      monthlyExpense,
      recentTransactions,
      incomeByCategory,
      expenseByCategory,
      last30DaysTransactions,
    ] = await Promise.all([
      this.getTotalBalance(userId),
      this.getMonthlyTotal(userId, TransactionType.INCOME, startOfMonth, endOfMonth),
      this.getMonthlyTotal(userId, TransactionType.EXPENSE, startOfMonth, endOfMonth),
      this.getRecentTransactions(userId, 10),
      this.getTransactionsByCategory(userId, TransactionType.INCOME, startOfMonth, endOfMonth),
      this.getTransactionsByCategory(userId, TransactionType.EXPENSE, startOfMonth, endOfMonth),
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

  private async getTotalBalance(userId: string): Promise<number> {
    const result = await this.prisma.wallet.aggregate({
      where: { userId },
      _sum: { balance: true },
    });

    return parseFloat(result._sum.balance?.toString() || '0');
  }

  private async getMonthlyTotal(
    userId: string,
    type: TransactionType,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
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

  private async getRecentTransactions(userId: string, limit: number) {
    const transactions = await this.prisma.transaction.findMany({
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

    return transactions.map((t) => ({
      ...t,
      amount: Number(t.amount),
    }));
  }

  private async getTransactionsByCategory(
    userId: string,
    type: TransactionType,
    startDate: Date,
    endDate: Date,
  ) {
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

    const categoryIds = transactions.map((t: any) => t.categoryId);
    const categories = await this.prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: {
        id: true,
        name: true,
        icon: true,
        color: true,
      },
    });

    return transactions.map((t: any) => {
      const category = categories.find((c: any) => c.id === t.categoryId);
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

  private async getTransactionsForTrend(
    userId: string,
    startDate: Date,
    endDate: Date,
  ) {
    return this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        amount: true,
        type: true,
        date: true,
      },
      orderBy: { date: 'asc' },
    });
  }

  private processDailyTrend(transactions: any[]) {
    const dailyMap = new Map<string, { income: number; expense: number }>();

    transactions.forEach((t) => {
      const dateKey = t.date.toISOString().split('T')[0];
      const existing = dailyMap.get(dateKey) || { income: 0, expense: 0 };

      const amount = parseFloat(t.amount.toString());

      if (t.type === TransactionType.INCOME) {
        existing.income += amount;
      } else if (t.type === TransactionType.EXPENSE) {
        existing.expense += amount;
      }

      dailyMap.set(dateKey, existing);
    });

    return Array.from(dailyMap.entries())
      .map(([date, data]) => ({
        date,
        income: data.income,
        expense: data.expense,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
}
