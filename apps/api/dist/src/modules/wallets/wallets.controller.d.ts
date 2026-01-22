import { WalletsService } from './wallets.service';
import { CreateWalletDto, UpdateWalletDto } from './dto';
export declare class WalletsController {
    private walletsService;
    constructor(walletsService: WalletsService);
    createWallet(userId: string, dto: CreateWalletDto): Promise<{
        balance: number;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: import(".prisma/client").$Enums.WalletType;
        currency: string;
        color: string | null;
        icon: string | null;
        userId: string;
    }>;
    getWallets(userId: string): Promise<{
        balance: number;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: import(".prisma/client").$Enums.WalletType;
        currency: string;
        color: string | null;
        icon: string | null;
        userId: string;
    }[]>;
    getWalletById(userId: string, walletId: string): Promise<{
        balance: number;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: import(".prisma/client").$Enums.WalletType;
        currency: string;
        color: string | null;
        icon: string | null;
        userId: string;
    }>;
    updateWallet(userId: string, walletId: string, dto: UpdateWalletDto): Promise<{
        balance: number;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: import(".prisma/client").$Enums.WalletType;
        currency: string;
        color: string | null;
        icon: string | null;
        userId: string;
    }>;
    deleteWallet(userId: string, walletId: string): Promise<{
        message: string;
    }>;
}
