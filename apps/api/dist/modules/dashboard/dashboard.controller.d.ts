import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getDashboardSummary(userId: string): Promise<{
        summary: {
            totalBalance: number;
            monthlyIncome: number;
            monthlyExpense: number;
            balanceChange: number;
            month: string;
        };
        recentTransactions: ({
            wallet: {
                id: string;
                name: string;
                currency: string;
            };
            category: {
                id: string;
                name: string;
                type: import(".prisma/client").$Enums.TransactionType;
                icon: string | null;
                color: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.TransactionType;
            userId: string;
            categoryId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            description: string | null;
            note: string | null;
            date: Date;
            walletId: string;
        })[];
        charts: {
            incomeByCategory: {
                categoryId: any;
                categoryName: string;
                categoryIcon: string;
                categoryColor: string;
                amount: number;
                count: any;
            }[];
            expenseByCategory: {
                categoryId: any;
                categoryName: string;
                categoryIcon: string;
                categoryColor: string;
                amount: number;
                count: any;
            }[];
            dailyTrend: {
                date: string;
                income: number;
                expense: number;
            }[];
        };
    }>;
}
