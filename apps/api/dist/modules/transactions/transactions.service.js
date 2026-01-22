"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let TransactionsService = class TransactionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTransaction(userId, dto) {
        const wallet = await this.prisma.wallet.findFirst({
            where: {
                id: dto.walletId,
                userId,
            },
        });
        if (!wallet) {
            throw new common_1.NotFoundException('Wallet not found or does not belong to you');
        }
        const category = await this.prisma.category.findFirst({
            where: {
                id: dto.categoryId,
                OR: [{ userId }, { userId: null }],
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found or does not belong to you');
        }
        if (dto.type !== category.type) {
            throw new common_1.BadRequestException(`Transaction type (${dto.type}) must match category type (${category.type})`);
        }
        const balanceChange = this.calculateBalanceChange(dto.type, dto.amount);
        if (dto.type === client_1.TransactionType.EXPENSE) {
            const newBalance = parseFloat(wallet.balance.toString()) + balanceChange;
            if (newBalance < 0) {
                throw new common_1.BadRequestException('Insufficient balance in wallet for this expense');
            }
        }
        const result = await this.prisma.$transaction(async (prisma) => {
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
        });
        return result;
    }
    async getTransactions(userId) {
        return this.prisma.transaction.findMany({
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
    }
    async getTransactionById(userId, transactionId) {
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
            throw new common_1.NotFoundException('Transaction not found');
        }
        if (transaction.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to access this transaction');
        }
        return transaction;
    }
    async updateTransaction(userId, transactionId, dto) {
        const oldTransaction = await this.getTransactionById(userId, transactionId);
        if (dto.walletId && dto.walletId !== oldTransaction.walletId) {
            const newWallet = await this.prisma.wallet.findFirst({
                where: {
                    id: dto.walletId,
                    userId,
                },
            });
            if (!newWallet) {
                throw new common_1.NotFoundException('New wallet not found or does not belong to you');
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
                throw new common_1.NotFoundException('New category not found or does not belong to you');
            }
            const newType = dto.type || oldTransaction.type;
            if (newType !== newCategory.type) {
                throw new common_1.BadRequestException(`Transaction type (${newType}) must match category type (${newCategory.type})`);
            }
        }
        const finalAmount = dto.amount ?? parseFloat(oldTransaction.amount.toString());
        const finalType = dto.type ?? oldTransaction.type;
        const finalWalletId = dto.walletId ?? oldTransaction.walletId;
        const oldBalanceChange = this.calculateBalanceChange(oldTransaction.type, parseFloat(oldTransaction.amount.toString()));
        const newBalanceChange = this.calculateBalanceChange(finalType, finalAmount);
        if (finalType === client_1.TransactionType.EXPENSE) {
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
                    throw new common_1.BadRequestException('Insufficient balance in wallet for this expense');
                }
            }
        }
        const result = await this.prisma.$transaction(async (prisma) => {
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
        });
        return result;
    }
    async deleteTransaction(userId, transactionId) {
        const transaction = await this.getTransactionById(userId, transactionId);
        const balanceChange = this.calculateBalanceChange(transaction.type, parseFloat(transaction.amount.toString()));
        await this.prisma.$transaction(async (prisma) => {
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
    calculateBalanceChange(type, amount) {
        switch (type) {
            case client_1.TransactionType.INCOME:
                return amount;
            case client_1.TransactionType.EXPENSE:
                return -amount;
            case client_1.TransactionType.TRANSFER:
                throw new common_1.BadRequestException('TRANSFER type is not yet implemented');
            default:
                throw new common_1.BadRequestException('Invalid transaction type');
        }
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map