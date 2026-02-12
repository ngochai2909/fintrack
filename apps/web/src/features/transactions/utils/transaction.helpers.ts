import { Transaction } from '@/types/transaction';
import { TransactionType } from '@/types/category';

/**
 * Group transactions by date (YYYY-MM-DD)
 */
export function groupTransactionsByDate(
  transactions: Transaction[]
): Record<string, Transaction[]> {
  const grouped: Record<string, Transaction[]> = {};

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date).toISOString().split('T')[0];
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(transaction);
  });

  return grouped;
}

/**
 * Calculate totals from transactions
 */
export function calculateTransactionTotals(transactions: Transaction[]) {
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
 * Filter transactions by type and search query
 */
export function filterTransactions(
  transactions: Transaction[],
  filterType: string,
  searchQuery: string
): Transaction[] {
  return transactions.filter((transaction) => {
    // Filter by type
    if (filterType !== 'ALL' && transaction.type !== filterType) {
      return false;
    }

    // Search by description, category name, or wallet name
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchDescription = transaction.description
        ?.toLowerCase()
        .includes(query);
      const matchCategory = transaction.category?.name
        .toLowerCase()
        .includes(query);
      const matchWallet = transaction.wallet?.name.toLowerCase().includes(query);
      return matchDescription || matchCategory || matchWallet;
    }

    return true;
  });
}

/**
 * Sort transactions by date (newest first)
 */
export function sortTransactionsByDate(
  transactions: Transaction[],
  order: 'asc' | 'desc' = 'desc'
): Transaction[] {
  return [...transactions].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
}
