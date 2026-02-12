import Link from 'next/link';
import { Transaction } from '@/types/transaction';
import { TransactionType } from '@/types/category';
import { formatCurrency } from '@/lib/formatters';
import { formatTransactionTime } from '../utils/date-formatters';

interface TransactionCardProps {
  transaction: Transaction;
  onDelete: (transaction: Transaction) => void;
}

export function TransactionCard({ transaction, onDelete }: TransactionCardProps) {
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
              {transaction.description ||
                transaction.category?.name ||
                'Không có mô tả'}
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
            <span>🕒 {formatTransactionTime(transaction.date)}</span>
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
            {formatCurrency(transaction.amount, { compact: false })}
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
