import { AiService } from './ai.service';
import { ParseTransactionDto, CreateTransactionFromAiDto } from './dto/parse-transaction.dto';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    testAiService(): Promise<{
        status: string;
        message: string;
        endpoints: {
            parse: string;
            createTransaction: string;
        };
    }>;
    parseTransaction(dto: ParseTransactionDto, userId: string): Promise<import("./dto/parse-transaction.dto").ParseTransactionResponseDto>;
    createTransactionFromAi(dto: CreateTransactionFromAiDto, userId: string): Promise<{
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
