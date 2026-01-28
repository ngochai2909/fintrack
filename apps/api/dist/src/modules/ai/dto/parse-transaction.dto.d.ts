import { TransactionType } from '@prisma/client';
export declare class WalletInfoDto {
    id: string;
    name: string;
    type: string;
    balance: number;
}
export declare class CategoryInfoDto {
    id: string;
    name: string;
    type: TransactionType;
}
export declare class UserContextDataDto {
    wallets?: WalletInfoDto[];
    categories?: CategoryInfoDto[];
}
export declare class ParseTransactionDto {
    text: string;
    user_data?: UserContextDataDto;
}
export declare class ParsedTransactionDto {
    type: TransactionType;
    amount: number;
    description: string;
    wallet_name?: string;
    category_name?: string;
    note?: string;
    confidence: number;
}
export declare class ParseTransactionResponseDto {
    success: boolean;
    data?: ParsedTransactionDto;
    error?: string;
    message?: string;
}
export declare class CreateTransactionFromAiDto {
    text: string;
    walletId?: string;
    categoryId?: string;
}
