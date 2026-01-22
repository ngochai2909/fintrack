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
exports.WalletsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let WalletsService = class WalletsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createWallet(userId, dto) {
        const existingWallet = await this.prisma.wallet.findFirst({
            where: {
                userId: userId,
                name: dto.name,
            },
        });
        if (existingWallet) {
            throw new common_1.ConflictException('Wallet name already exists');
        }
        const wallet = await this.prisma.wallet.create({
            data: {
                name: dto.name,
                type: dto.type ?? client_1.WalletType.CASH,
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
    async getWallets(userId) {
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
    async getWalletById(userId, walletId) {
        const wallet = await this.prisma.wallet.findUnique({
            where: { id: walletId },
        });
        if (!wallet) {
            throw new common_1.NotFoundException('Wallet not found');
        }
        if (wallet.userId !== userId) {
            throw new common_1.ForbiddenException('You do not own this wallet');
        }
        return {
            ...wallet,
            balance: Number(wallet.balance),
        };
    }
    async updateWallet(userId, walletId, dto) {
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
                throw new common_1.ConflictException('Wallet name already exists');
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
    async deleteWallet(userId, walletId) {
        await this.getWalletById(userId, walletId);
        await this.prisma.wallet.delete({
            where: { id: walletId },
        });
        return { message: 'Wallet deleted successfully' };
    }
};
exports.WalletsService = WalletsService;
exports.WalletsService = WalletsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WalletsService);
//# sourceMappingURL=wallets.service.js.map