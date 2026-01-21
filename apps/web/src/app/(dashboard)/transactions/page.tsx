'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsService } from '@/services/transactions.service';
import Link from 'next/link';
import { Transaction } from '@/types/transaction';
import { TransactionType } from '@/types/category';
import { useState } from 'react';

/**
 * TRANSACTIONS LIST PAGE
 * 
 * Display all transactions with:
 * - Grouping by date
 * - Filtering by type (INCOME, EXPENSE, ALL)
 * - Search by description
 * - Beautiful UI with category icons and colors
 * - Edit and Delete actions
 */
export default function TransactionsPage() {
  const queryClient = useQueryClient();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all transactions
  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionsService.getAll(),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => transactionsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['wallets'] }); // Refresh wallets list (balance changed)
    },
  });

  // Handle delete
  const handleDelete = async (transaction: Transaction) => {
    const confirm = window.confirm(
      `Bạn có chắc muốn xóa giao dịch "${transaction.description || 'Không có mô tả'}"?\nSố tiền: ${formatAmount(transaction.amount, transaction.wallet?.currency || 'VND')}`
    );
    
    if (confirm) {
      try {
        await deleteMutation.mutateAsync(transaction.id);
      } catch (err: any) {
        alert(err.response?.data?.message || 'Không thể xóa giao dịch');
      }
    }
  };

  // Filter and search transactions
  const filteredTransactions = transactions?.filter((t) => {
    // Filter by type
    if (filterType !== 'ALL' && t.type !== filterType) {
      return false;
    }
    
    // Search by description or category name
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchDescription = t.description?.toLowerCase().includes(query);
      const matchCategory = t.category?.name.toLowerCase().includes(query);
      const matchWallet = t.wallet?.name.toLowerCase().includes(query);
      return matchDescription || matchCategory || matchWallet;
    }
    
    return true;
  }) || [];

  // Group transactions by date
  const groupedTransactions = groupByDate(filteredTransactions);

  // Calculate totals
  const totals = calculateTotals(filteredTransactions);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải giao dịch...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-red-600 font-medium">Lỗi khi tải giao dịch</p>
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

  // Empty state
  if (!transactions || transactions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">💳 Giao dịch</h1>
            <Link
              href="/transactions/new"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-medium shadow-lg hover:shadow-xl transition-all"
            >
              + Tạo giao dịch mới
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">💳</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Chưa có giao dịch nào
            </h3>
            <p className="text-gray-500 mb-6">
              Tạo giao dịch đầu tiên để theo dõi thu chi của bạn
            </p>
            <Link
              href="/transactions/new"
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-medium"
            >
              Tạo giao dịch đầu tiên
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              💳 Giao dịch
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý thu chi của bạn
            </p>
          </div>
          <Link
            href="/transactions/new"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2 justify-center"
          >
            <span className="text-xl">+</span>
            <span>Tạo giao dịch mới</span>
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <SummaryCard
            title="Tổng thu nhập"
            amount={totals.income}
            icon="💰"
            color="green"
          />
          <SummaryCard
            title="Tổng chi tiêu"
            amount={totals.expense}
            icon="💸"
            color="red"
          />
          <SummaryCard
            title="Số dư"
            amount={totals.balance}
            icon={totals.balance >= 0 ? '✅' : '⚠️'}
            color={totals.balance >= 0 ? 'blue' : 'yellow'}
          />
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Type Filter */}
            <div className="flex gap-2">
              <FilterButton
                label="Tất cả"
                active={filterType === 'ALL'}
                onClick={() => setFilterType('ALL')}
              />
              <FilterButton
                label="💰 Thu"
                active={filterType === TransactionType.INCOME}
                onClick={() => setFilterType(TransactionType.INCOME)}
              />
              <FilterButton
                label="💸 Chi"
                active={filterType === TransactionType.EXPENSE}
                onClick={() => setFilterType(TransactionType.EXPENSE)}
              />
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="🔍 Tìm kiếm giao dịch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Results count */}
          <div className="mt-3 text-sm text-gray-600">
            Hiển thị {filteredTransactions.length} / {transactions.length} giao dịch
          </div>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Không tìm thấy giao dịch
            </h3>
            <p className="text-gray-500">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedTransactions).map(([date, transactions]) => (
              <div key={date}>
                {/* Date Header */}
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-lg font-semibold text-gray-700">
                    {formatDateHeader(date)}
                  </h2>
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <span className="text-sm text-gray-500">
                    {transactions.length} giao dịch
                  </span>
                </div>

                {/* Transactions */}
                <div className="space-y-2">
                  {transactions.map((transaction) => (
                    <TransactionCard
                      key={transaction.id}
                      transaction={transaction}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Summary Card Component
 */
function SummaryCard({
  title,
  amount,
  icon,
  color,
}: {
  title: string;
  amount: number;
  icon: string;
  color: 'green' | 'red' | 'blue' | 'yellow';
}) {
  const colorClasses = {
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
    blue: 'bg-blue-50 border-blue-200',
    yellow: 'bg-yellow-50 border-yellow-200',
  };

  const textColorClasses = {
    green: 'text-green-700',
    red: 'text-red-700',
    blue: 'text-blue-700',
    yellow: 'text-yellow-700',
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm font-medium text-gray-600">{title}</span>
      </div>
      <p className={`text-2xl font-bold ${textColorClasses[color]}`}>
        {formatAmount(amount, 'VND')}
      </p>
    </div>
  );
}

/**
 * Filter Button Component
 */
function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        active
          ? 'bg-blue-500 text-white shadow-md'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );
}

/**
 * Transaction Card Component
 */
function TransactionCard({
  transaction,
  onDelete,
}: {
  transaction: Transaction;
  onDelete: (transaction: Transaction) => void;
}) {
  const isIncome = transaction.type === TransactionType.INCOME;

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 border border-gray-200">
      <div className="flex items-center gap-4">
        {/* Category Icon */}
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl shadow-sm flex-shrink-0"
          style={{
            backgroundColor: transaction.category?.color || '#6B7280',
            color: 'white',
          }}
        >
          {transaction.category?.icon || '📁'}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-800 truncate">
              {transaction.description || transaction.category?.name || 'Không có mô tả'}
            </h3>
            {transaction.type === TransactionType.INCOME && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                Thu
              </span>
            )}
            {transaction.type === TransactionType.EXPENSE && (
              <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                Chi
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>💰 {transaction.wallet?.name}</span>
            <span>📁 {transaction.category?.name}</span>
            <span>🕒 {formatTime(transaction.date)}</span>
          </div>
          {transaction.note && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
              📝 {transaction.note}
            </p>
          )}
        </div>

        {/* Amount */}
        <div className="text-right flex-shrink-0">
          <p
            className={`text-xl font-bold ${
              isIncome ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isIncome ? '+' : '-'}
            {formatAmount(transaction.amount, transaction.wallet?.currency || 'VND')}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-shrink-0">
          <Link
            href={`/transactions/${transaction.id}`}
            className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium transition-colors"
          >
            ✏️
          </Link>
          <button
            onClick={() => onDelete(transaction)}
            className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium transition-colors"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ════════════════════════════════════════════════════════════

/**
 * Group transactions by date
 */
function groupByDate(transactions: Transaction[]): Record<string, Transaction[]> {
  const grouped: Record<string, Transaction[]> = {};
  
  transactions.forEach((t) => {
    const date = new Date(t.date).toISOString().split('T')[0]; // YYYY-MM-DD
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(t);
  });
  
  return grouped;
}

/**
 * Calculate totals (income, expense, balance)
 */
function calculateTotals(transactions: Transaction[]) {
  const income = transactions
    .filter((t) => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expense = transactions
    .filter((t) => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);
  
  return {
    income,
    expense,
    balance: income - expense,
  };
}

/**
 * Format amount with currency
 */
function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currency === 'VND' ? 'VND' : 'USD',
  }).format(amount);
}

/**
 * Format date header (e.g., "Hôm nay", "Hôm qua", "12/01/2024")
 */
function formatDateHeader(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Reset time to compare dates only
  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  
  if (date.getTime() === today.getTime()) {
    return '📅 Hôm nay';
  } else if (date.getTime() === yesterday.getTime()) {
    return '📅 Hôm qua';
  } else {
    return '📅 ' + date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}

/**
 * Format time (HH:mm)
 */
function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
