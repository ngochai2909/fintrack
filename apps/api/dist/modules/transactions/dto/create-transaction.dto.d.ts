import { TransactionType } from '@prisma/client';
export declare class CreateTransactionDto {
    amount: number;
    type: TransactionType;
    description?: string;
    note?: string;
    date?: string;
    walletId: string;
    categoryId: string;
}
