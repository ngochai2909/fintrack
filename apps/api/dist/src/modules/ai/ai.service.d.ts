import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { ParseTransactionDto, ParseTransactionResponseDto, CreateTransactionFromAiDto } from './dto/parse-transaction.dto';
export declare class AiService {
    private readonly configService;
    private readonly prisma;
    private readonly logger;
    private readonly aiServiceUrl;
    constructor(configService: ConfigService, prisma: PrismaService);
    parseTransaction(dto: ParseTransactionDto): Promise<ParseTransactionResponseDto>;
    parseAndCreateTransaction(userId: string, dto: CreateTransactionFromAiDto): Promise<{
        success: boolean;
        data: {
            transaction: {
                wallet: {
                    id: string;
                    name: string;
                    type: import(".prisma/client").$Enums.WalletType;
                };
                category: {
                    id: string;
                    name: string;
                    type: import(".prisma/client").$Enums.TransactionType;
                    color: string | null;
                    icon: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                type: import(".prisma/client").$Enums.TransactionType;
                userId: string;
                amount: import("@prisma/client/runtime/library").Decimal;
                description: string | null;
                note: string | null;
                date: Date;
                walletId: string;
                categoryId: string;
            };
            parsed: import("./dto/parse-transaction.dto").ParsedTransactionDto;
        };
        message: string;
    }>;
}
