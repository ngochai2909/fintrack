import Link from 'next/link';
import { Transaction } from '@/types/transaction';
import { TransactionType } from '@/types/category';
import { formatCurrency, formatShortDate } from '@/lib/formatters';

interface RecentTransactionsListProps {
  transactions: Transaction[];
}

export function RecentTransactionsList({ transactions }: RecentTransactionsListProps) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          🕒 Giao dịch gần đây
        </h2>
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <div className="text-4xl mb-2">💳</div>
          <p className="text-gray-500">Chưa có giao dịch nào</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          🕒 Giao dịch gần đây
        </h2>
        <Link
          href="/transactions"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Xem tất cả →
        </Link>
      </div>

      <div className="space-y-3">
        {transactions.map((transaction) => (
          <RecentTransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
}

function RecentTransactionItem({ transaction }: { transaction: Transaction }) {
  const isIncome = transaction.type === TransactionType.INCOME;

  return (
    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      {/* Category Icon */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
        style={{
          backgroundColor: transaction.category?.color || '#6B7280',
          color: 'white',
        }}
      >
        {transaction.category?.icon || '📁'}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 truncate">
          {transaction.description || transaction.category?.name || 'Không có mô tả'}
        </p>
        <p className="text-xs text-gray-500">
          {transaction.category?.name} • {formatShortDate(transaction.date)}
        </p>
      </div>

      {/* Amount */}
      <div className="text-right flex-shrink-0">
        <p className={`font-bold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
          {isIncome ? '+' : '-'}
          {formatCurrency(transaction.amount)}
        </p>
      </div>
    </div>
  );
}
