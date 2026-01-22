// ════════════════════════════════════════════════════════════
// WALLETS SERVICE - Business Logic
// ════════════════════════════════════════════════════════════

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

  // ────────────────────────────────────────────────────────────
  // TODO 1: CREATE WALLET
  // ────────────────────────────────────────────────────────────
  /**
   * Tạo ví mới cho user
   *
   * YÊU CẦU:
   * 1. Check xem user đã có ví cùng tên chưa (không cho trùng)
   * 2. Nếu trùng → throw ConflictException
   * 3. Nếu không trùng → tạo wallet mới
   * 4. Return wallet vừa tạo
   *
   * HINT: Prisma queries bạn cần:
   * - this.prisma.wallet.findFirst({ where: { ... } })
   * - this.prisma.wallet.create({ data: { ... } })
   */

  async createWallet(userId: string, dto: CreateWalletDto) {
    // Step 1: Check duplicate name
    const existingWallet = await this.prisma.wallet.findFirst({
      where: {
        userId: userId,
        name: dto.name,
      },
    });
    if (existingWallet) {
      throw new ConflictException('Wallet name already exists');
    }

    // Step 2: Create wallet
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

    // Step 3: Return result (convert Decimal to Number)
    return {
      ...wallet,
      balance: Number(wallet.balance),
    };
  }

  // ────────────────────────────────────────────────────────────
  // TODO 2: GET ALL WALLETS (của user hiện tại)
  // ────────────────────────────────────────────────────────────
  /**
   * Lấy tất cả ví của user
   *
   * YÊU CẦU:
   * 1. Query tất cả wallets của userId
   * 2. Sort theo createdAt (mới nhất trước)
   * 3. Return array wallets
   *
   * HINT: Prisma query bạn cần:
   * - this.prisma.wallet.findMany({
   *     where: { ... },
   *     orderBy: { ... }
   *   })
   */
  async getWallets(userId: string) {
    // 🎯 YOUR CODE HERE - TODO 2

    const wallets = await this.prisma.wallet.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    // Convert Decimal to Number for frontend
    return wallets.map((w) => ({
      ...w,
      balance: Number(w.balance),
    }));
  }

  // ────────────────────────────────────────────────────────────
  // TODO 3: GET WALLET BY ID
  // ────────────────────────────────────────────────────────────
  /**
   * Lấy chi tiết 1 wallet
   *
   * YÊU CẦU:
   * 1. Tìm wallet theo id
   * 2. Nếu không tồn tại → throw NotFoundException
   * 3. Nếu wallet không thuộc về user → throw ForbiddenException
   * 4. Return wallet
   *
   * HINT: Prisma query bạn cần:
   * - this.prisma.wallet.findUnique({ where: { id: walletId } })
   */
  async getWalletById(userId: string, walletId: string) {
    // Step 1: Find wallet
    const wallet = await this.prisma.wallet.findUnique({
      where: { id: walletId },
    });

    // Step 2: Check exists
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    // Step 3: Check ownership
    if (wallet.userId !== userId) {
      throw new ForbiddenException('You do not own this wallet');
    }

    // Step 4: Return wallet (convert Decimal to Number)
    return {
      ...wallet,
      balance: Number(wallet.balance),
    };
  }

  // ────────────────────────────────────────────────────────────
  // TODO 4: UPDATE WALLET
  // ────────────────────────────────────────────────────────────
  /**
   * Cập nhật wallet
   *
   * YÊU CẦU:
   * 1. Tìm wallet (tái sử dụng getWalletById để check ownership)
   * 2. Nếu update name → check duplicate name với ví khác
   * 3. Update wallet
   * 4. Return wallet đã update
   *
   * HINT: Prisma queries bạn cần:
   * - await this.getWalletById(userId, walletId)
   * - this.prisma.wallet.findFirst({ where: { ... } })
   * - this.prisma.wallet.update({ where: { id }, data: { ... } })
   */
  async updateWallet(userId: string, walletId: string, dto: UpdateWalletDto) {
    // Step 1: Check wallet exists & ownership (dùng getWalletById)
    await this.getWalletById(userId, walletId);

    // Step 2: If updating name, check duplicate
    if (dto.name) {
      const existingWallet = await this.prisma.wallet.findFirst({
        where: {
          userId: userId,
          name: dto.name,
          id: { not: walletId }, // ← Loại trừ wallet hiện tại
        },
      });
      if (existingWallet) {
        throw new ConflictException('Wallet name already exists');
      }
    }

    // Step 3: Update wallet
    const updatedWallet = await this.prisma.wallet.update({
      where: { id: walletId },
      data: dto, // ← Prisma tự động bỏ qua undefined fields
    });

    // Step 4: Return updated wallet (convert Decimal to Number)
    return {
      ...updatedWallet,
      balance: Number(updatedWallet.balance),
    };
  }

  // ────────────────────────────────────────────────────────────
  // TODO 5: DELETE WALLET
  // ────────────────────────────────────────────────────────────
  /**
   * Xóa wallet
   *
   * YÊU CẦU:
   * 1. Check wallet exists & ownership (dùng getWalletById)
   * 2. Xóa wallet
   * 3. Return message thành công
   *
   * HINT: Prisma query bạn cần:
   * - await this.getWalletById(userId, walletId)
   * - this.prisma.wallet.delete({ where: { id: walletId } })
   */
  async deleteWallet(userId: string, walletId: string) {
    // Step 1: Check wallet exists & ownership
    await this.getWalletById(userId, walletId);

    // Step 2: Delete wallet
    await this.prisma.wallet.delete({
      where: { id: walletId },
    });

    // Step 3: Return success message
    return { message: 'Wallet deleted successfully' };
  }
}
