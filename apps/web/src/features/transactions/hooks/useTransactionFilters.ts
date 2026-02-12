import { useState, useMemo } from 'react';
import { Transaction } from '@/types/transaction';
import {
  filterTransactions,
  groupTransactionsByDate,
  calculateTransactionTotals,
} from '../utils/transaction.helpers';

/**
 * Hook to manage transaction filtering and grouping logic
 */
export function useTransactionFilters(transactions: Transaction[]) {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter transactions
  const filteredTransactions = useMemo(
    () => filterTransactions(transactions, filterType, searchQuery),
    [transactions, filterType, searchQuery]
  );

  // Group by date
  const groupedTransactions = useMemo(
    () => groupTransactionsByDate(filteredTransactions),
    [filteredTransactions]
  );

  // Calculate totals
  const totals = useMemo(
    () => calculateTransactionTotals(filteredTransactions),
    [filteredTransactions]
  );

  return {
    filterType,
    searchQuery,
    setFilterType,
    setSearchQuery,
    filteredTransactions,
    groupedTransactions,
    totals,
  };
}
