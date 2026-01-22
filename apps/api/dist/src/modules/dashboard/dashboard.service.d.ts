import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardSummary(userId: string): Promise<{
        summary: {
            totalBalance: number;
            monthlyIncome: number;
            monthlyExpense: number;
            balanceChange: number;
            month: string;
        };
        recentTransactions: {
            amount: number;
            wallet: {
                id: string;
                name: string;
                currency: string;
            };
            category: {
                id: string;
                name: string;
                type: import(".prisma/client").$Enums.TransactionType;
                color: string | null;
                icon: string | null;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.TransactionType;
            userId: string;
            description: string | null;
            note: string | null;
            date: Date;
            walletId: string;
            categoryId: string;
        }[];
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
    private getTotalBalance;
    private getMonthlyTotal;
    private getRecentTransactions;
    private getTransactionsByCategory;
    private getTransactionsForTrend;
    private processDailyTrend;
}
