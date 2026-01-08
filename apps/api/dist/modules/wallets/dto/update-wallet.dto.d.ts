import { WalletType } from '@prisma/client';
export declare class UpdateWalletDto {
    name?: string;
    type?: WalletType;
    balance?: number;
    currency?: string;
    icon?: string;
    color?: string;
}
