// ════════════════════════════════════════════════════════════
// TRANSACTIONS SERVICE
// ════════════════════════════════════════════════════════════
// Business logic for Transactions CRUD + Wallet Balance Management
// ════════════════════════════════════════════════════════════

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionType, Prisma } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  /**
   * CREATE TRANSACTION
   *
   * Steps:
   * 1. Validate wallet and category exist and belong to user
   * 2. Create transaction
   * 3. Update wallet balance:
   *    - INCOME: add to balance
   *    - EXPENSE: subtract from balance
   *    - TRANSFER: (not implemented yet, requires 2 wallets)
   *
   * @param userId - Current user ID
   * @param dto - Transaction data
   * @returns Created transaction with relations
   */
  async createTransaction(userId: string, dto: CreateTransactionDto) {
    // Validate wallet exists and belongs to user
    const wallet = await this.prisma.wallet.findFirst({
      where: {
        id: dto.walletId,
        userId,
      },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found or does not belong to you');
    }

    // Validate category exists (either user's or system default)
    const category = await this.prisma.category.findFirst({
      where: {
        id: dto.categoryId,
        OR: [{ userId }, { userId: null }], // User's category or system default
      },
    });

    if (!category) {
      throw new NotFoundException(
        'Category not found or does not belong to you',
      );
    }

    // Validate transaction type matches category type
    if (dto.type !== category.type) {
      throw new BadRequestException(
        `Transaction type (${dto.type}) must match category type (${category.type})`,
      );
    }

    // Calculate balance change
    const balanceChange = this.calculateBalanceChange(dto.type, dto.amount);

    // Check if wallet has enough balance for EXPENSE
    if (dto.type === TransactionType.EXPENSE) {
      const newBalance = parseFloat(wallet.balance.toString()) + balanceChange;
      if (newBalance < 0) {
        throw new BadRequestException(
          'Insufficient balance in wallet for this expense',
        );
      }
    }

    // Use transaction (database transaction, not our Transaction model)
    // to ensure atomicity: both transaction creation and wallet update must succeed
    const result = await this.prisma.$transaction(
      async (prisma: Prisma.TransactionClient) => {
        // Create transaction
        const transaction = await prisma.transaction.create({
          data: {
            amount: dto.amount,
            type: dto.type,
            description: dto.description,
            note: dto.note,
            date: dto.date ? new Date(dto.date) : new Date(),
            walletId: dto.walletId,
            categoryId: dto.categoryId,
            userId,
          },
          include: {
            wallet: {
              select: {
                id: true,
                name: true,
                balance: true,
                currency: true,
              },
            },
            category: {
              select: {
                id: true,
                name: true,
                type: true,
                icon: true,
                color: true,
              },
            },
          },
        });

        // Update wallet balance
        await prisma.wallet.update({
          where: { id: dto.walletId },
          data: {
            balance: {
              increment: balanceChange,
            },
          },
        });

        return transaction;
      },
    );

    // 🔥 Convert Decimal to Number for frontend
    return {
      ...result,
      amount: Number(result.amount),
    };
  }

  /**
   * GET ALL TRANSACTIONS
   *
   * Returns all transactions for the current user
   * Ordered by date (newest first)
   *
   * @param userId - Current user ID
   * @returns Array of transactions with relations
   */
  async getTransactions(userId: string) {
    const transactions = await this.prisma.transaction.findMany({
      where: { userId },
      include: {
        wallet: {
          select: {
            id: true,
            name: true,
            currency: true,
            type: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            type: true,
            icon: true,
            color: true,
          },
        },
      },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    });

    // 🔥 Convert Decimal to Number for frontend
    return transactions.map((t) => ({
      ...t,
      amount: Number(t.amount),
    }));
  }

  /**
   * GET TRANSACTION BY ID
   *
   * @param userId - Current user ID
   * @param transactionId - Transaction ID
   * @returns Transaction with relations
   * @throws NotFoundException if not found
   * @throws ForbiddenException if not owner
   */
  async getTransactionById(userId: string, transactionId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        wallet: {
          select: {
            id: true,
            name: true,
            currency: true,
            type: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            type: true,
            icon: true,
            color: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this transaction',
      );
    }

    // 🔥 Convert Decimal to Number for frontend
    return {
      ...transaction,
      amount: Number(transaction.amount),
    };
  }

  /**
   * UPDATE TRANSACTION
   *
   * Complex logic:
   * 1. Get old transaction
   * 2. Revert old wallet balance change
   * 3. If wallet changed, revert old wallet and apply to new wallet
   * 4. Update transaction
   * 5. Apply new wallet balance change
   *
   * @param userId - Current user ID
   * @param transactionId - Transaction ID
   * @param dto - Updated transaction data
   * @returns Updated transaction
   */
  async updateTransaction(
    userId: string,
    transactionId: string,
    dto: UpdateTransactionDto,
  ) {
    // Get existing transaction
    const oldTransaction = await this.getTransactionById(userId, transactionId);

    // Validate new wallet if changed
    if (dto.walletId && dto.walletId !== oldTransaction.walletId) {
      const newWallet = await this.prisma.wallet.findFirst({
        where: {
          id: dto.walletId,
          userId,
        },
      });

      if (!newWallet) {
        throw new NotFoundException(
          'New wallet not found or does not belong to you',
        );
      }
    }

    // Validate new category if changed
    if (dto.categoryId && dto.categoryId !== oldTransaction.categoryId) {
      const newCategory = await this.prisma.category.findFirst({
        where: {
          id: dto.categoryId,
          OR: [{ userId }, { userId: null }],
        },
      });

      if (!newCategory) {
        throw new NotFoundException(
          'New category not found or does not belong to you',
        );
      }

      // Validate type matches
      const newType = dto.type || oldTransaction.type;
      if (newType !== newCategory.type) {
        throw new BadRequestException(
          `Transaction type (${newType}) must match category type (${newCategory.type})`,
        );
      }
    }

    // Determine final values (use new value if provided, else keep old)
    const finalAmount =
      dto.amount ?? parseFloat(oldTransaction.amount.toString());
    const finalType = dto.type ?? oldTransaction.type;
    const finalWalletId = dto.walletId ?? oldTransaction.walletId;

    // Calculate old and new balance changes
    const oldBalanceChange = this.calculateBalanceChange(
      oldTransaction.type,
      parseFloat(oldTransaction.amount.toString()),
    );
    const newBalanceChange = this.calculateBalanceChange(
      finalType,
      finalAmount,
    );

    // Check if wallet has enough balance for the update
    if (finalType === TransactionType.EXPENSE) {
      const currentWallet = await this.prisma.wallet.findUnique({
        where: { id: finalWalletId },
      });

      if (currentWallet) {
        // Calculate what the balance would be after reverting old and applying new
        let projectedBalance = parseFloat(currentWallet.balance.toString());

        // If same wallet, revert old change first
        if (finalWalletId === oldTransaction.walletId) {
          projectedBalance -= oldBalanceChange;
        }

        // Then apply new change
        projectedBalance += newBalanceChange;

        if (projectedBalance < 0) {
          throw new BadRequestException(
            'Insufficient balance in wallet for this expense',
          );
        }
      }
    }

    // Use database transaction for atomicity
    const result = await this.prisma.$transaction(
      async (prisma: Prisma.TransactionClient) => {
        // STEP 1: Revert old wallet balance
        await prisma.wallet.update({
          where: { id: oldTransaction.walletId },
          data: {
            balance: {
              decrement: oldBalanceChange, // Reverse the old change
            },
          },
        });

        // STEP 2: Update transaction
        const updatedTransaction = await prisma.transaction.update({
          where: { id: transactionId },
          data: {
            amount: finalAmount,
            type: finalType,
            description: dto.description,
            note: dto.note,
            date: dto.date ? new Date(dto.date) : undefined,
            walletId: finalWalletId,
            categoryId: dto.categoryId,
          },
          include: {
            wallet: {
              select: {
                id: true,
                name: true,
                balance: true,
                currency: true,
              },
            },
            category: {
              select: {
                id: true,
                name: true,
                type: true,
                icon: true,
                color: true,
              },
            },
          },
        });

        // STEP 3: Apply new wallet balance
        await prisma.wallet.update({
          where: { id: finalWalletId },
          data: {
            balance: {
              increment: newBalanceChange,
            },
          },
        });

        return updatedTransaction;
      },
    );

    // 🔥 Convert Decimal to Number for frontend
    return {
      ...result,
      amount: Number(result.amount),
    };
  }

  /**
   * DELETE TRANSACTION
   *
   * Steps:
   * 1. Get transaction
   * 2. Revert wallet balance change
   * 3. Delete transaction
   *
   * @param userId - Current user ID
   * @param transactionId - Transaction ID
   */
  async deleteTransaction(userId: string, transactionId: string) {
    // Get transaction (also validates ownership)
    const transaction = await this.getTransactionById(userId, transactionId);

    // Calculate balance change to revert
    const balanceChange = this.calculateBalanceChange(
      transaction.type,
      parseFloat(transaction.amount.toString()),
    );

    // Use database transaction
    await this.prisma.$transaction(async (prisma: Prisma.TransactionClient) => {
      // Revert wallet balance
      await prisma.wallet.update({
        where: { id: transaction.walletId },
        data: {
          balance: {
            decrement: balanceChange, // Reverse the change
          },
        },
      });

      // Delete transaction
      await prisma.transaction.delete({
        where: { id: transactionId },
      });
    });
  }

  /**
   * HELPER: Calculate balance change
   *
   * @param type - Transaction type
   * @param amount - Transaction amount
   * @returns Balance change (positive for INCOME, negative for EXPENSE)
   */
  private calculateBalanceChange(
    type: TransactionType,
    amount: number,
  ): number {
    switch (type) {
      case TransactionType.INCOME:
        return amount; // Add to balance
      case TransactionType.EXPENSE:
        return -amount; // Subtract from balance
      case TransactionType.TRANSFER:
        // TODO: Implement TRANSFER logic (requires 2 wallets)
        throw new BadRequestException('TRANSFER type is not yet implemented');
      default:
        throw new BadRequestException('Invalid transaction type');
    }
  }
}
