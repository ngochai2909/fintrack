import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Decimal } from '@prisma/client/runtime/library';
export declare class TransactionsService {
    private prisma;
    constructor(prisma: PrismaService);
    createTransaction(userId: string, dto: CreateTransactionDto): Promise<any>;
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
        amount: Decimal;
        description: string | null;
        note: string | null;
        date: Date;
        walletId: string;
        categoryId: string;
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
        amount: Decimal;
        description: string | null;
        note: string | null;
        date: Date;
        walletId: string;
        categoryId: string;
    }>;
    updateTransaction(userId: string, transactionId: string, dto: UpdateTransactionDto): Promise<any>;
    deleteTransaction(userId: string, transactionId: string): Promise<void>;
    private calculateBalanceChange;
}
