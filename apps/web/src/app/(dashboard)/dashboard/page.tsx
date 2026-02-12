'use client';

import { useCopilotReadable } from '@copilotkit/react-core';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import {
  DashboardSummaryCards,
  DailyTrendChart,
  CategoryPieChart,
  RecentTransactionsList,
} from '@/features/dashboard/components';
import { LoadingSpinner, ErrorState, PageHeader } from '@/components/ui';

/**
 * DASHBOARD PAGE
 * 
 * Displays:
 * - Summary statistics (balance, income, expense)
 * - Recent transactions
 * - Line chart (income/expense trend)
 * - Pie charts (category breakdown)
 */
export default function DashboardPage() {
  const { dashboard, isLoading, error } = useDashboard();

  // Make dashboard data readable by CopilotKit AI
  useCopilotReadable({
    description:
      'Tổng quan tài chính: totalBalance (tổng số dư tất cả ví), monthlyIncome (thu nhập tháng này), monthlyExpense (chi tiêu tháng này), balanceChange (chênh lệch thu chi), month (tháng hiện tại)',
    value: dashboard
      ? {
      totalBalance: dashboard.summary.totalBalance,
      monthlyIncome: dashboard.summary.monthlyIncome,
      monthlyExpense: dashboard.summary.monthlyExpense,
      balanceChange: dashboard.summary.balanceChange,
      month: dashboard.summary.month,
        }
      : null,
  });

  useCopilotReadable({
    description:
      'Biểu đồ xu hướng 30 ngày qua - mỗi ngày có: date (ngày), income (thu nhập ngày đó), expense (chi tiêu ngày đó)',
    value: dashboard?.charts.dailyTrend || [],
  });

  useCopilotReadable({
    description:
      'Phân bố thu nhập theo danh mục - mỗi item có: categoryName (tên danh mục), categoryId, amount (tổng tiền), count (số giao dịch)',
    value: dashboard?.charts.incomeByCategory || [],
  });

  useCopilotReadable({
    description:
      'Phân bố chi tiêu theo danh mục - mỗi item có: categoryName (tên danh mục), categoryId, amount (tổng tiền), count (số giao dịch)',
    value: dashboard?.charts.expenseByCategory || [],
  });

  useCopilotReadable({
    description:
      '10 giao dịch gần đây nhất - mỗi giao dịch có: id, type, amount, description, date, wallet, category',
    value: dashboard?.recentTransactions || [],
  });

  // Loading state
  if (isLoading) {
    return <LoadingSpinner message="Đang tải dashboard..." />;
  }

  // Error state
  if (error || !dashboard) {
    return (
      <ErrorState
        title="Lỗi khi tải dashboard"
        message="Không thể kết nối đến server"
        onRetry={() => window.location.reload()}
      />
    );
  }

  const { summary, recentTransactions, charts } = dashboard;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <PageHeader
          icon="📊"
          title="Dashboard"
          description={`Tổng quan tài chính của bạn - ${summary.month}`}
        />

        {/* Summary Cards */}
        <div className="mb-8">
          <DashboardSummaryCards summary={summary} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <DailyTrendChart data={charts.dailyTrend} />
          <CategoryPieChart
                    data={charts.incomeByCategory}
            title="Thu nhập theo danh mục"
            icon="💰"
            type="income"
          />
        </div>

        {/* Expense Pie Chart & Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryPieChart
            data={charts.expenseByCategory}
            title="Chi tiêu theo danh mục"
            icon="💸"
            type="expense"
          />
          <RecentTransactionsList transactions={recentTransactions} />
        </div>
      </div>
    </div>
  );
}
