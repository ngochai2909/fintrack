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
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let AiService = AiService_1 = class AiService {
    configService;
    prisma;
    logger = new common_1.Logger(AiService_1.name);
    aiServiceUrl;
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        this.aiServiceUrl =
            this.configService.get('AI_SERVICE_URL') ||
                'http://localhost:8001';
        this.logger.log(`AI Service URL: ${this.aiServiceUrl}`);
    }
    async parseTransaction(dto) {
        try {
            this.logger.log(`Parsing transaction text: "${dto.text}"`);
            const response = await fetch(`${this.aiServiceUrl}/api/v1/ai/parse-transaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dto),
            });
            if (!response.ok) {
                const errorText = await response.text();
                this.logger.error(`AI Service error: ${response.status} - ${errorText}`);
                throw new common_1.InternalServerErrorException(`AI Service returned error: ${response.status}`);
            }
            const result = await response.json();
            if (!result.success) {
                this.logger.warn(`AI parsing failed: ${result.error}`);
                throw new common_1.BadRequestException(result.error || 'Failed to parse transaction');
            }
            this.logger.log(`Successfully parsed: ${JSON.stringify(result.data)}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Error calling AI service: ${error.message}`, error.stack);
            if (error instanceof common_1.BadRequestException || error instanceof common_1.InternalServerErrorException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to connect to AI service. Please ensure it is running.');
        }
    }
    async parseAndCreateTransaction(userId, dto) {
        try {
            this.logger.log(`Creating transaction from AI for user: ${userId}`);
            const [wallets, categories] = await Promise.all([
                this.prisma.wallet.findMany({
                    where: { userId, isActive: true },
                    select: { id: true, name: true, type: true, balance: true },
                }),
                this.prisma.category.findMany({
                    where: {
                        OR: [{ userId }, { userId: null }],
                    },
                    select: { id: true, name: true, type: true },
                }),
            ]);
            if (wallets.length === 0) {
                throw new common_1.BadRequestException('You need to create at least one wallet first');
            }
            const userContextData = {
                wallets: wallets.map((w) => ({
                    id: w.id,
                    name: w.name,
                    type: w.type,
                    balance: Number(w.balance),
                })),
                categories: categories.map((c) => ({
                    id: c.id,
                    name: c.name,
                    type: c.type,
                })),
            };
            const parseResult = await this.parseTransaction({
                text: dto.text,
                user_data: userContextData,
            });
            if (!parseResult.success || !parseResult.data) {
                throw new common_1.BadRequestException('Failed to parse transaction');
            }
            const parsedData = parseResult.data;
            let walletId = dto.walletId;
            if (!walletId && parsedData.wallet_name) {
                const walletName = parsedData.wallet_name.toLowerCase();
                const wallet = wallets.find((w) => w.name.toLowerCase() === walletName ||
                    w.name.toLowerCase().includes(walletName));
                if (wallet) {
                    walletId = wallet.id;
                }
            }
            if (!walletId) {
                walletId = wallets[0].id;
                this.logger.warn(`No wallet specified, using default: ${wallets[0].name}`);
            }
            const wallet = await this.prisma.wallet.findFirst({
                where: { id: walletId, userId },
            });
            if (!wallet) {
                throw new common_1.NotFoundException('Wallet not found');
            }
            let categoryId = dto.categoryId;
            if (!categoryId && parsedData.category_name) {
                const categoryName = parsedData.category_name.toLowerCase();
                const category = categories.find((c) => c.type === parsedData.type &&
                    (c.name.toLowerCase() === categoryName ||
                        c.name.toLowerCase().includes(categoryName)));
                if (category) {
                    categoryId = category.id;
                }
                else {
                    this.logger.log(`Creating new category: ${parsedData.category_name}`);
                    const newCategory = await this.prisma.category.create({
                        data: {
                            name: parsedData.category_name,
                            type: parsedData.type,
                            userId,
                        },
                    });
                    categoryId = newCategory.id;
                }
            }
            if (!categoryId) {
                const defaultCategory = categories.find((c) => c.type === parsedData.type);
                if (defaultCategory) {
                    categoryId = defaultCategory.id;
                }
                else {
                    throw new common_1.BadRequestException(`No category found for transaction type: ${parsedData.type}`);
                }
            }
            const transaction = await this.prisma.transaction.create({
                data: {
                    userId,
                    walletId,
                    categoryId,
                    type: parsedData.type,
                    amount: parsedData.amount,
                    description: parsedData.description,
                    note: parsedData.note,
                    date: new Date(),
                },
                include: {
                    wallet: {
                        select: { id: true, name: true, type: true },
                    },
                    category: {
                        select: { id: true, name: true, type: true, color: true, icon: true },
                    },
                },
            });
            const balanceChange = parsedData.type === client_1.TransactionType.INCOME
                ? parsedData.amount
                : -parsedData.amount;
            await this.prisma.wallet.update({
                where: { id: walletId },
                data: {
                    balance: {
                        increment: balanceChange,
                    },
                },
            });
            this.logger.log(`Transaction created successfully: ${transaction.id}`);
            return {
                success: true,
                data: {
                    transaction,
                    parsed: parsedData,
                },
                message: 'Transaction created successfully from AI parsing',
            };
        }
        catch (error) {
            this.logger.error(`Error creating transaction from AI: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], AiService);
//# sourceMappingURL=ai.service.js.map