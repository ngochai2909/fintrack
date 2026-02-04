'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';
import { useCopilotReadable } from '@copilotkit/react-core';
import Link from 'next/link';
import { TransactionType } from '@/types/category';
import { formatCardAmount, formatCurrency as formatCurrencyUtil, formatShortDate } from '@/lib/formatters';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

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
  // Fetch dashboard data
  const { data: dashboard, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardService.getSummary(),
    refetchInterval: 60000, // Refetch every minute
  });

  // 🤖 Share dashboard data with CopilotKit (must be called unconditionally)
  useCopilotReadable({
    description: 'Tổng quan tài chính của người dùng, bao gồm số dư, thu nhập, chi tiêu tháng này',
    value: dashboard ? {
      totalBalance: dashboard.summary.totalBalance,
      monthlyIncome: dashboard.summary.monthlyIncome,
      monthlyExpense: dashboard.summary.monthlyExpense,
      balanceChange: dashboard.summary.balanceChange,
      month: dashboard.summary.month,
    } : null,
  });

  useCopilotReadable({
    description: 'Dữ liệu biểu đồ xu hướng 30 ngày - thu nhập và chi tiêu theo ngày',
    value: dashboard?.charts.dailyTrend || [],
  });

  useCopilotReadable({
    description: 'Phân bố thu nhập theo danh mục',
    value: dashboard?.charts.incomeByCategory || [],
  });

  useCopilotReadable({
    description: 'Phân bố chi tiêu theo danh mục',
    value: dashboard?.charts.expenseByCategory || [],
  });

  useCopilotReadable({
    description: 'Các giao dịch gần đây (10 giao dịch mới nhất)',
    value: dashboard?.recentTransactions || [],
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !dashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-red-600 font-medium">Lỗi khi tải dashboard</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const { summary, recentTransactions, charts } = dashboard;
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            📊 Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Tổng quan tài chính của bạn - {summary.month}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            title="Tổng số dư"
            value={summary.totalBalance}
            icon="💰"
            color="blue"
            isCurrency
          />
          <SummaryCard
            title="Thu nhập tháng này"
            value={summary.monthlyIncome}
            icon="📈"
            color="green"
            isCurrency
            prefix="+"
          />
          <SummaryCard
            title="Chi tiêu tháng này"
            value={summary.monthlyExpense}
            icon="📉"
            color="red"
            isCurrency
            prefix="-"
          />
          <SummaryCard
            title="Chênh lệch"
            value={summary.balanceChange}
            icon={summary.balanceChange >= 0 ? '✅' : '⚠️'}
            color={summary.balanceChange >= 0 ? 'green' : 'yellow'}
            isCurrency
            prefix={summary.balanceChange >= 0 ? '+' : ''}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Line Chart - Daily Trend */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              📈 Xu hướng 30 ngày
            </h2>
            {charts.dailyTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={charts.dailyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => formatDateShort(date)}
                    fontSize={12}
                  />
                  <YAxis
                    fontSize={12}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#10B981"
                    strokeWidth={2}
                    name="Thu nhập"
                  />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="#EF4444"
                    strokeWidth={2}
                    name="Chi tiêu"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart message="Chưa có dữ liệu trong 30 ngày qua" />
            )}
          </div>

          {/* Pie Chart - Income by Category */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              💰 Thu nhập theo danh mục
            </h2>
            {charts.incomeByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={charts.incomeByCategory}
                    dataKey="amount"
                    nameKey="categoryName"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ categoryName, amount }) =>
                      `${categoryName}: ${formatCurrency(amount)}`
                    }
                    labelLine={false}
                  >
                    {charts.incomeByCategory.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.categoryColor || CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart message="Chưa có thu nhập tháng này" />
            )}
          </div>

          {/* Pie Chart - Expense by Category */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              💸 Chi tiêu theo danh mục
            </h2>
            {charts.expenseByCategory.length > 0 ? (
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-full md:w-1/2">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={charts.expenseByCategory}
                        dataKey="amount"
                        nameKey="categoryName"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={false}
                      >
                        {charts.expenseByCategory.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.categoryColor || CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2">
                  <div className="space-y-3">
                    {charts.expenseByCategory.map((cat, index) => (
                      <div key={cat.categoryId} className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{
                            backgroundColor: cat.categoryColor || CHART_COLORS[index % CHART_COLORS.length],
                          }}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {cat.categoryIcon} {cat.categoryName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {cat.count} giao dịch
                          </p>
                        </div>
                        <p className="font-semibold text-red-600">
                          {formatCurrency(cat.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <EmptyChart message="Chưa có chi tiêu tháng này" />
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              💳 Giao dịch gần đây
            </h2>
            <Link
              href="/transactions"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Xem tất cả →
            </Link>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💳</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Chưa có giao dịch nào
              </h3>
              <p className="text-gray-500 mb-6">
                Tạo giao dịch đầu tiên để bắt đầu theo dõi
              </p>
              <Link
                href="/transactions/new"
                className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-medium"
              >
                Tạo giao dịch mới
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => {
                const isIncome = transaction.type === TransactionType.INCOME;
                return (
                  <Link
                    key={transaction.id}
                    href={`/transactions/${transaction.id}`}
                    className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                  >
                    {/* Category Icon */}
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
                      style={{
                        backgroundColor: transaction.category?.color || '#6B7280',
                        color: 'white',
                      }}
                    >
                      {transaction.category?.icon || '📁'}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {transaction.description || transaction.category?.name || 'Giao dịch'}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>💰 {transaction.wallet?.name}</span>
                        <span>•</span>
                        <span>{formatDateTime(transaction.date)}</span>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="text-right flex-shrink-0">
                      <p
                        className={`text-lg font-bold ${
                          isIncome ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {isIncome ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// COMPONENTS
// ════════════════════════════════════════════════════════════

/**
 * Summary Card Component
 */
function SummaryCard({
  title,
  value,
  icon,
  color,
  isCurrency = false,
  prefix = '',
}: {
  title: string;
  value: number;
  icon: string;
  color: 'blue' | 'green' | 'red' | 'yellow';
  isCurrency?: boolean;
  prefix?: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-6`}>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">{icon}</span>
        <span className="text-sm font-medium text-gray-600">{title}</span>
      </div>
      <p className="text-2xl font-bold">
        {prefix}
        {isCurrency ? formatCardAmount(value) : value.toLocaleString('vi-VN')}
      </p>
    </div>
  );
}

/**
 * Empty Chart Placeholder
 */
function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-[300px] text-gray-400">
      <div className="text-center">
        <div className="text-4xl mb-2">📊</div>
        <p>{message}</p>
      </div>
    </div>
  );
}

/**
 * Custom Tooltip for Chart
 */
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg p-3 shadow-lg">
        <p className="font-medium text-gray-800 mb-2">{formatDateFull(label)}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

// ════════════════════════════════════════════════════════════
// HELPER FUNCTIONS & CONSTANTS
// ════════════════════════════════════════════════════════════

const CHART_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#6366F1', // indigo
  '#14B8A6', // teal
];

/**
 * Format currency - wrapper for charts/tooltips
 */
function formatCurrency(amount: number): string {
  return formatCurrencyUtil(amount, { compact: false });
}

function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}`;
}

function formatDateFull(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
