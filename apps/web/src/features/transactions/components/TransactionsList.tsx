import { Transaction } from '@/types/transaction';
import { TransactionCard } from './TransactionCard';
import { formatTransactionDateHeader } from '../utils/date-formatters';

interface TransactionsListProps {
  groupedTransactions: Record<string, Transaction[]>;
  onDelete: (transaction: Transaction) => void;
}

export function TransactionsList({
  groupedTransactions,
  onDelete,
}: TransactionsListProps) {
  return (
    <div className="space-y-6">
      {Object.entries(groupedTransactions).map(([date, transactions]) => (
        <div key={date}>
          {/* Date Header */}
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-lg font-semibold text-gray-700">
              {formatTransactionDateHeader(date)}
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
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
