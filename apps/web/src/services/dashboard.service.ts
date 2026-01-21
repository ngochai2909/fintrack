// ════════════════════════════════════════════════════════════
// DASHBOARD SERVICE
// ════════════════════════════════════════════════════════════
// Service layer for Dashboard API calls
// ════════════════════════════════════════════════════════════

import { axiosInstance } from '@/lib/axios';
import { DashboardSummary } from '@/types/dashboard';

/**
 * Dashboard Service
 * Handles API calls related to dashboard statistics
 */
class DashboardService {
  private readonly baseUrl = '/dashboard';

  /**
   * Get dashboard summary
   * Returns all statistics and data for the dashboard
   */
  async getSummary(): Promise<DashboardSummary> {
    return axiosInstance.get(`${this.baseUrl}/summary`);
  }
}

// Export singleton instance
export const dashboardService = new DashboardService();
