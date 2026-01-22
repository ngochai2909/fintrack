import { axiosInstance } from '@/lib/axios';
import { DashboardSummary } from '@/types/dashboard';

class DashboardService {
  private readonly baseUrl = '/dashboard';

  async getSummary(): Promise<DashboardSummary> {
    return axiosInstance.get(`${this.baseUrl}/summary`);
  }
}

export const dashboardService = new DashboardService();
