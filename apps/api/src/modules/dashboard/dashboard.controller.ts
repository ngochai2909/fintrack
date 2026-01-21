// ════════════════════════════════════════════════════════════
// DASHBOARD CONTROLLER
// ════════════════════════════════════════════════════════════
// REST API endpoints for Dashboard
// ════════════════════════════════════════════════════════════

import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

/**
 * DASHBOARD CONTROLLER
 * 
 * Protected by JWT authentication
 * Base path: /api/dashboard
 * 
 * Endpoints:
 * - GET /api/dashboard/summary - Get dashboard summary with statistics
 */
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * GET DASHBOARD SUMMARY
   * GET /api/dashboard/summary
   * 
   * Returns comprehensive dashboard data including:
   * - Total balance
   * - Monthly income and expense
   * - Recent transactions
   * - Category breakdown (for pie charts)
   * - Daily trend (for line chart)
   * 
   * @param userId - From JWT token
   * @returns Dashboard summary object
   */
  @Get('summary')
  async getDashboardSummary(@CurrentUser('sub') userId: string) {
    return this.dashboardService.getDashboardSummary(userId);
  }
}
