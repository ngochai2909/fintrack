import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Prisma } from '@prisma/client';
export declare class TransactionsService {
    private prisma;
    constructor(prisma: PrismaService);
    createTransaction(userId: string, dto: CreateTransactionDto): Promise<{
        wallet: {
            id: string;
            name: string;
            balance: Prisma.Decimal;
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
        amount: Prisma.Decimal;
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
        amount: Prisma.Decimal;
        description: string | null;
        note: string | null;
        date: Date;
        walletId: string;
    })[]>;
    getTransactionById(userId: string, transactionId: string): Promise<{
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
        amount: Prisma.Decimal;
        description: string | null;
        note: string | null;
        date: Date;
        walletId: string;
    }>;
    updateTransaction(userId: string, transactionId: string, dto: UpdateTransactionDto): Promise<{
        wallet: {
            id: string;
            name: string;
            balance: Prisma.Decimal;
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
        amount: Prisma.Decimal;
        description: string | null;
        note: string | null;
        date: Date;
        walletId: string;
    }>;
    deleteTransaction(userId: string, transactionId: string): Promise<void>;
    private calculateBalanceChange;
}
