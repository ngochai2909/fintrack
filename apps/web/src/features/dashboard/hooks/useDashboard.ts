import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';

/**
 * Hook to fetch dashboard summary data
 */
export function useDashboard() {
  const {
    data: dashboard,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardService.getSummary(),
    refetchInterval: 60000, // Refetch every minute
  });

  return {
    dashboard,
    isLoading,
    error,
  };
}
