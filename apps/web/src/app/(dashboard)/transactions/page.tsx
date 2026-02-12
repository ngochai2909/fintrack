'use client';

import { formatCurrency } from '@/lib/formatters';
import { Transaction } from '@/types/transaction';
import { useTransactions, useTransactionFilters } from '@/features/transactions/hooks';
import {
  SummaryCard,
  TransactionFilters,
  TransactionsList,
} from '@/features/transactions/components';
import { LoadingSpinner, ErrorState, EmptyState, PageHeader } from '@/components/ui';

/**
 * TRANSACTIONS LIST PAGE
 * 
 * Display all transactions with filtering, search, and summary
 */
export default function TransactionsPage() {
  // Fetch transactions data
  const { transactions, isLoading, error, deleteTransaction } = useTransactions();

  // Filter and group logic
  const {
    filterType,
    searchQuery,
    setFilterType,
    setSearchQuery,
    filteredTransactions,
    groupedTransactions,
    totals,
  } = useTransactionFilters(transactions);

  // Handle delete with confirmation
  const handleDelete = async (transaction: Transaction) => {
    const confirm = window.confirm(
      `Bạn có chắc muốn xóa giao dịch "${
        transaction.description || 'Không có mô tả'
      }"?\nSố tiền: ${formatCurrency(transaction.amount, { compact: false })}`
    );
    
    if (confirm) {
      try {
        await deleteTransaction(transaction.id);
      } catch (err) {
        const error = err as { response?: { data?: { message?: string } } };
        alert(error.response?.data?.message || 'Không thể xóa giao dịch');
      }
    }
  };

  // Loading state
  if (isLoading) {
    return <LoadingSpinner message="Đang tải giao dịch..." />;
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        title="Lỗi khi tải giao dịch"
        message="Không thể kết nối đến server"
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Empty state
  if (transactions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <PageHeader
            icon="💳"
            title="Giao dịch"
            action={{
              label: 'Tạo giao dịch mới',
              href: '/transactions/new',
              icon: '+',
            }}
          />

          <EmptyState
            icon="💳"
            title="Chưa có giao dịch nào"
            description="Tạo giao dịch đầu tiên để theo dõi thu chi của bạn"
            actionLabel="Tạo giao dịch đầu tiên"
            actionHref="/transactions/new"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <PageHeader
          icon="💳"
          title="Giao dịch"
          description="Quản lý thu chi của bạn"
          action={{
            label: 'Tạo giao dịch mới',
            href: '/transactions/new',
            icon: '+',
          }}
        />

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
        <div className="mb-6">
          <TransactionFilters
            filterType={filterType}
            searchQuery={searchQuery}
            onFilterTypeChange={setFilterType}
            onSearchQueryChange={setSearchQuery}
            totalCount={transactions.length}
            filteredCount={filteredTransactions.length}
          />
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
          <TransactionsList
            groupedTransactions={groupedTransactions}
                      onDelete={handleDelete}
                    />
        )}
      </div>
    </div>
  );
}
