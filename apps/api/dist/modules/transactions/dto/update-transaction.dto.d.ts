import { TransactionType } from '@prisma/client';
export declare class UpdateTransactionDto {
    amount?: number;
    type?: TransactionType;
    description?: string;
    note?: string;
    date?: string;
    walletId?: string;
    categoryId?: string;
}
