import { WalletType } from '@prisma/client';
export declare class CreateWalletDto {
    name: string;
    type?: WalletType;
    balance?: number;
    currency?: string;
    icon?: string;
    color?: string;
}
