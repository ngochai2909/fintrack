// ════════════════════════════════════════════════════════════
// DASHBOARD SERVICE
// ════════════════════════════════════════════════════════════
// Business logic for Dashboard statistics and summaries
// ════════════════════════════════════════════════════════════

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionType } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  /**
   * GET DASHBOARD SUMMARY
   * 
   * Returns comprehensive dashboard data:
   * - Total balance across all wallets
   * - Income and expense for current month
   * - Recent transactions (last 10)
   * - Income/Expense by category (for pie charts)
   * - Daily income/expense trend for last 30 days (for line chart)
   * 
   * @param userId - Current user ID
   * @returns Dashboard summary object
   */
  async getDashboardSummary(userId: string) {
    // Get current month date range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Get last 30 days date range for trend
    const last30Days = new Date(now);
    last30Days.setDate(last30Days.getDate() - 30);

    // Parallel queries for better performance
    const [
      totalBalance,
      monthlyIncome,
      monthlyExpense,
      recentTransactions,
      incomeByCategory,
      expenseByCategory,
      last30DaysTransactions,
    ] = await Promise.all([
      // 1. Total balance across all wallets
      this.getTotalBalance(userId),

      // 2. Monthly income
      this.getMonthlyTotal(userId, TransactionType.INCOME, startOfMonth, endOfMonth),

      // 3. Monthly expense
      this.getMonthlyTotal(userId, TransactionType.EXPENSE, startOfMonth, endOfMonth),

      // 4. Recent transactions (last 10)
      this.getRecentTransactions(userId, 10),

      // 5. Income by category (for pie chart)
      this.getTransactionsByCategory(userId, TransactionType.INCOME, startOfMonth, endOfMonth),

      // 6. Expense by category (for pie chart)
      this.getTransactionsByCategory(userId, TransactionType.EXPENSE, startOfMonth, endOfMonth),

      // 7. Last 30 days transactions (for line chart)
      this.getTransactionsForTrend(userId, last30Days, now),
    ]);

    // Calculate balance change (income - expense)
    const balanceChange = monthlyIncome - monthlyExpense;

    // Process daily trend data
    const dailyTrend = this.processDailyTrend(last30DaysTransactions);

    return {
      // Summary
      summary: {
        totalBalance,
        monthlyIncome,
        monthlyExpense,
        balanceChange,
        month: now.toLocaleString('vi-VN', { month: 'long', year: 'numeric' }),
      },

      // Recent transactions
      recentTransactions,

      // Charts data
      charts: {
        incomeByCategory,
        expenseByCategory,
        dailyTrend,
      },
    };
  }

  /**
   * Get total balance across all user's wallets
   */
  private async getTotalBalance(userId: string): Promise<number> {
    const result = await this.prisma.wallet.aggregate({
      where: { userId },
      _sum: { balance: true },
    });

    return parseFloat(result._sum.balance?.toString() || '0');
  }

  /**
   * Get total amount for a specific transaction type in a date range
   */
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

  /**
   * Get recent transactions with relations
   */
  private async getRecentTransactions(userId: string, limit: number) {
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

  /**
   * Get transactions grouped by category
   * Used for pie charts
   */
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

    // Get category details
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

    // Map category details to transactions
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

  /**
   * Get all transactions for trend analysis
   */
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
        date: true,
        type: true,
        amount: true,
      },
      orderBy: { date: 'asc' },
    });
  }

  /**
   * Process transactions into daily trend data
   * Returns array of { date, income, expense } for each day in last 30 days
   */
  private processDailyTrend(
    transactions: Array<{ date: Date; type: TransactionType; amount: any }>,
  ) {
    // Create a map of date -> {income, expense}
    const dailyMap = new Map<string, { income: number; expense: number }>();

    // Initialize last 30 days
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
      dailyMap.set(dateKey, { income: 0, expense: 0 });
    }

    // Aggregate transactions by date and type
    transactions.forEach((t) => {
      const dateKey = new Date(t.date).toISOString().split('T')[0];
      const existing = dailyMap.get(dateKey);
      
      if (existing) {
        const amount = parseFloat(t.amount.toString());
        if (t.type === TransactionType.INCOME) {
          existing.income += amount;
        } else if (t.type === TransactionType.EXPENSE) {
          existing.expense += amount;
        }
      }
    });

    // Convert map to array
    return Array.from(dailyMap.entries()).map(([date, data]) => ({
      date,
      income: data.income,
      expense: data.expense,
    }));
  }
}
