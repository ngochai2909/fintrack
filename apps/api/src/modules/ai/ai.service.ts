/**
 * AI Service - Handles communication with FastAPI AI Service
 */
import {
  Injectable,
  Logger,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  ParseTransactionDto,
  ParseTransactionResponseDto,
  CreateTransactionFromAiDto,
  UserContextDataDto,
} from './dto/parse-transaction.dto';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly aiServiceUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    // Get AI Service URL from environment
    this.aiServiceUrl =
      this.configService.get<string>('AI_SERVICE_URL') ||
      'http://localhost:8001';
    this.logger.log(`AI Service URL: ${this.aiServiceUrl}`);
  }

  /**
   * Call FastAPI AI Service to parse natural language text
   */
  async parseTransaction(
    dto: ParseTransactionDto,
  ): Promise<ParseTransactionResponseDto> {
    try {
      this.logger.log(`Parsing transaction text: "${dto.text}"`);

      const response = await fetch(
        `${this.aiServiceUrl}/api/v1/ai/parse-transaction`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dto),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`AI Service error: ${response.status} - ${errorText}`);
        throw new InternalServerErrorException(
          `AI Service returned error: ${response.status}`,
        );
      }

      const result: ParseTransactionResponseDto = await response.json();

      if (!result.success) {
        this.logger.warn(`AI parsing failed: ${result.error}`);
        throw new BadRequestException(result.error || 'Failed to parse transaction');
      }

      this.logger.log(`Successfully parsed: ${JSON.stringify(result.data)}`);
      return result;
    } catch (error) {
      this.logger.error(`Error calling AI service: ${error.message}`, error.stack);
      
      if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
        throw error;
      }
      
      throw new InternalServerErrorException(
        'Failed to connect to AI service. Please ensure it is running.',
      );
    }
  }

  /**
   * Parse transaction and save to database
   */
  async parseAndCreateTransaction(
    userId: string,
    dto: CreateTransactionFromAiDto,
  ) {
    try {
      this.logger.log(`Creating transaction from AI for user: ${userId}`);

      // 1. Get user's wallets and categories for context
      const [wallets, categories] = await Promise.all([
        this.prisma.wallet.findMany({
          where: { userId, isActive: true },
          select: { id: true, name: true, type: true, balance: true },
        }),
        this.prisma.category.findMany({
          where: {
            OR: [{ userId }, { userId: null }], // User's + default categories
          },
          select: { id: true, name: true, type: true },
        }),
      ]);

      if (wallets.length === 0) {
        throw new BadRequestException('You need to create at least one wallet first');
      }

      // 2. Prepare user context data
      const userContextData: UserContextDataDto = {
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

      // 3. Call AI to parse transaction
      const parseResult = await this.parseTransaction({
        text: dto.text,
        user_data: userContextData,
      });

      if (!parseResult.success || !parseResult.data) {
        throw new BadRequestException('Failed to parse transaction');
      }

      const parsedData = parseResult.data;

      // 4. Find or determine wallet
      let walletId = dto.walletId;
      if (!walletId && parsedData.wallet_name) {
        // Try to find wallet by name
        const wallet = wallets.find(
          (w) =>
            w.name.toLowerCase() === parsedData.wallet_name.toLowerCase() ||
            w.name.toLowerCase().includes(parsedData.wallet_name.toLowerCase()),
        );
        if (wallet) {
          walletId = wallet.id;
        }
      }

      // If still no wallet, use the first one
      if (!walletId) {
        walletId = wallets[0].id;
        this.logger.warn(`No wallet specified, using default: ${wallets[0].name}`);
      }

      // Verify wallet exists and belongs to user
      const wallet = await this.prisma.wallet.findFirst({
        where: { id: walletId, userId },
      });

      if (!wallet) {
        throw new NotFoundException('Wallet not found');
      }

      // 5. Find or create category
      let categoryId = dto.categoryId;
      if (!categoryId && parsedData.category_name) {
        // Try to find category by name and type
        const category = categories.find(
          (c) =>
            c.type === parsedData.type &&
            (c.name.toLowerCase() === parsedData.category_name.toLowerCase() ||
              c.name.toLowerCase().includes(parsedData.category_name.toLowerCase())),
        );

        if (category) {
          categoryId = category.id;
        } else {
          // Create new category for user
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

      // If still no category, find a default one with matching type
      if (!categoryId) {
        const defaultCategory = categories.find((c) => c.type === parsedData.type);
        if (defaultCategory) {
          categoryId = defaultCategory.id;
        } else {
          throw new BadRequestException(
            `No category found for transaction type: ${parsedData.type}`,
          );
        }
      }

      // 6. Create transaction
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

      // 7. Update wallet balance
      const balanceChange =
        parsedData.type === TransactionType.INCOME
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
    } catch (error) {
      this.logger.error(
        `Error creating transaction from AI: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
