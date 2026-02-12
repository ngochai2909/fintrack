import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsService } from '@/services/transactions.service';

/**
 * Hook to manage transactions data fetching and mutations
 */
export function useTransactions() {
  const queryClient = useQueryClient();

  // Fetch all transactions
  const {
    data: transactions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionsService.getAll(),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => transactionsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
    },
  });

  return {
    transactions: transactions || [],
    isLoading,
    error,
    deleteTransaction: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
