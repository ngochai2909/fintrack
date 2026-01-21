// ════════════════════════════════════════════════════════════
// DASHBOARD TYPES
// ════════════════════════════════════════════════════════════
// Types for Dashboard statistics
// ════════════════════════════════════════════════════════════

import { Transaction } from './transaction';

/**
 * Dashboard Summary Response
 */
export interface DashboardSummary {
  summary: {
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpense: number;
    balanceChange: number;
    month: string;
  };
  
  recentTransactions: Transaction[];
  
  charts: {
    incomeByCategory: CategoryData[];
    expenseByCategory: CategoryData[];
    dailyTrend: DailyTrendData[];
  };
}

/**
 * Category data for pie charts
 */
export interface CategoryData {
  categoryId: string;
  categoryName: string;
  categoryIcon: string | null;
  categoryColor: string | null;
  amount: number;
  count: number;
}

/**
 * Daily trend data for line chart
 */
export interface DailyTrendData {
  date: string; // YYYY-MM-DD
  income: number;
  expense: number;
}
