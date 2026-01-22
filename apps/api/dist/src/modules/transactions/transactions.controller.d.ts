import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    createTransaction(userId: string, dto: CreateTransactionDto): Promise<{
        amount: number;
        wallet: {
            id: string;
            name: string;
            balance: import("@prisma/client/runtime/library").Decimal;
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
    }>;
    getTransactions(userId: string): Promise<{
        amount: number;
        wallet: {
            id: string;
            name: string;
            type: import(".prisma/client").$Enums.WalletType;
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
    }[]>;
    getTransactionById(userId: string, id: string): Promise<{
        amount: number;
        wallet: {
            id: string;
            name: string;
            type: import(".prisma/client").$Enums.WalletType;
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
    }>;
    updateTransaction(userId: string, id: string, dto: UpdateTransactionDto): Promise<{
        amount: number;
        wallet: {
            id: string;
            name: string;
            balance: import("@prisma/client/runtime/library").Decimal;
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
    }>;
    deleteTransaction(userId: string, id: string): Promise<void>;
}
