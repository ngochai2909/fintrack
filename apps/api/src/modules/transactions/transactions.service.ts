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
   * Create transaction and update wallet balance atomically
   */
  async createTransaction(userId: string, dto: CreateTransactionDto) {
    const wallet = await this.prisma.wallet.findFirst({
      where: { id: dto.walletId, userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found or does not belong to you');
    }

    const category = await this.prisma.category.findFirst({
      where: {
        id: dto.categoryId,
        OR: [{ userId }, { userId: null }],
      },
    });

    if (!category) {
      throw new NotFoundException(
        'Category not found or does not belong to you',
      );
    }

    if (dto.type !== category.type) {
      throw new BadRequestException(
        `Transaction type (${dto.type}) must match category type (${category.type})`,
      );
    }

    const balanceChange = this.calculateBalanceChange(dto.type, dto.amount);

    if (dto.type === TransactionType.EXPENSE) {
      const newBalance = parseFloat(wallet.balance.toString()) + balanceChange;
      if (newBalance < 0) {
        throw new BadRequestException(
          'Insufficient balance in wallet for this expense',
        );
      }
    }

    const result = await this.prisma.$transaction(
      async (prisma: Prisma.TransactionClient) => {
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

    return {
      ...result,
      amount: Number(result.amount),
    };
  }

  /**
   * Get all transactions for user
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

    return transactions.map((t) => ({
      ...t,
      amount: Number(t.amount),
    }));
  }

  /**
   * Get transaction by ID with ownership check
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

    return {
      ...transaction,
      amount: Number(transaction.amount),
    };
  }

  /**
   * Update transaction with balance recalculation
   */
  async updateTransaction(
    userId: string,
    transactionId: string,
    dto: UpdateTransactionDto,
  ) {
    const oldTransaction = await this.getTransactionById(userId, transactionId);

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

      const newType = dto.type || oldTransaction.type;
      if (newType !== newCategory.type) {
        throw new BadRequestException(
          `Transaction type (${newType}) must match category type (${newCategory.type})`,
        );
      }
    }

    const finalAmount =
      dto.amount ?? parseFloat(oldTransaction.amount.toString());
    const finalType = dto.type ?? oldTransaction.type;
    const finalWalletId = dto.walletId ?? oldTransaction.walletId;

    const oldBalanceChange = this.calculateBalanceChange(
      oldTransaction.type,
      parseFloat(oldTransaction.amount.toString()),
    );
    const newBalanceChange = this.calculateBalanceChange(
      finalType,
      finalAmount,
    );

    if (finalType === TransactionType.EXPENSE) {
      const currentWallet = await this.prisma.wallet.findUnique({
        where: { id: finalWalletId },
      });

      if (currentWallet) {
        let projectedBalance = parseFloat(currentWallet.balance.toString());

        if (finalWalletId === oldTransaction.walletId) {
          projectedBalance -= oldBalanceChange;
        }

        projectedBalance += newBalanceChange;

        if (projectedBalance < 0) {
          throw new BadRequestException(
            'Insufficient balance in wallet for this expense',
          );
        }
      }
    }

    const result = await this.prisma.$transaction(
      async (prisma: Prisma.TransactionClient) => {
        await prisma.wallet.update({
          where: { id: oldTransaction.walletId },
          data: {
            balance: {
              decrement: oldBalanceChange,
            },
          },
        });

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

    return {
      ...result,
      amount: Number(result.amount),
    };
  }

  /**
   * Delete transaction and revert wallet balance
   */
  async deleteTransaction(userId: string, transactionId: string) {
    const transaction = await this.getTransactionById(userId, transactionId);

    const balanceChange = this.calculateBalanceChange(
      transaction.type,
      parseFloat(transaction.amount.toString()),
    );

    await this.prisma.$transaction(async (prisma: Prisma.TransactionClient) => {
      await prisma.wallet.update({
        where: { id: transaction.walletId },
        data: {
          balance: {
            decrement: balanceChange,
          },
        },
      });

      await prisma.transaction.delete({
        where: { id: transactionId },
      });
    });
  }

  /**
   * Calculate balance change based on transaction type
   */
  private calculateBalanceChange(
    type: TransactionType,
    amount: number,
  ): number {
    switch (type) {
      case TransactionType.INCOME:
        return amount;
      case TransactionType.EXPENSE:
        return -amount;
      case TransactionType.TRANSFER:
        throw new BadRequestException('TRANSFER type is not yet implemented');
      default:
        throw new BadRequestException('Invalid transaction type');
    }
  }
}
