import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { WalletType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWalletDto, UpdateWalletDto } from './dto';

@Injectable()
export class WalletsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create new wallet for user
   */
  async createWallet(userId: string, dto: CreateWalletDto) {
    const existingWallet = await this.prisma.wallet.findFirst({
      where: {
        userId: userId,
        name: dto.name,
      },
    });
    
    if (existingWallet) {
      throw new ConflictException('Wallet name already exists');
    }

    const wallet = await this.prisma.wallet.create({
      data: {
        name: dto.name,
        type: dto.type ?? WalletType.CASH,
        balance: dto.balance ?? 0,
        currency: dto.currency ?? 'VND',
        icon: dto.icon,
        color: dto.color,
        userId: userId,
      },
    });

    return {
      ...wallet,
      balance: Number(wallet.balance),
    };
  }

  /**
   * Get all wallets for user
   */
  async getWallets(userId: string) {
    const wallets = await this.prisma.wallet.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return wallets.map((w) => ({
      ...w,
      balance: Number(w.balance),
    }));
  }

  /**
   * Get wallet by ID
   */
  async getWalletById(userId: string, walletId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { id: walletId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    if (wallet.userId !== userId) {
      throw new ForbiddenException('You do not own this wallet');
    }

    return {
      ...wallet,
      balance: Number(wallet.balance),
    };
  }

  /**
   * Update wallet
   */
  async updateWallet(userId: string, walletId: string, dto: UpdateWalletDto) {
    await this.getWalletById(userId, walletId);

    if (dto.name) {
      const existingWallet = await this.prisma.wallet.findFirst({
        where: {
          userId: userId,
          name: dto.name,
          id: { not: walletId },
        },
      });
      
      if (existingWallet) {
        throw new ConflictException('Wallet name already exists');
      }
    }

    const updatedWallet = await this.prisma.wallet.update({
      where: { id: walletId },
      data: dto,
    });

    return {
      ...updatedWallet,
      balance: Number(updatedWallet.balance),
    };
  }

  /**
   * Delete wallet
   */
  async deleteWallet(userId: string, walletId: string) {
    await this.getWalletById(userId, walletId);

    await this.prisma.wallet.delete({
      where: { id: walletId },
    });

    return {
      message: 'Wallet deleted successfully',
    };
  }
}
