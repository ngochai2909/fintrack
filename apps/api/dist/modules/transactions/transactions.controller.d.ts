import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    createTransaction(userId: string, dto: CreateTransactionDto): Promise<{
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
    }>;
    getTransactions(userId: string): Promise<({
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
    })[]>;
    getTransactionById(userId: string, id: string): Promise<{
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
    }>;
    updateTransaction(userId: string, id: string, dto: UpdateTransactionDto): Promise<{
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
    }>;
    deleteTransaction(userId: string, id: string): Promise<void>;
}
