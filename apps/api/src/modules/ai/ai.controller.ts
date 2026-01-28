/**
 * AI Controller - Endpoints for AI-powered transaction parsing
 */
import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AiService } from './ai.service';
import {
  ParseTransactionDto,
  CreateTransactionFromAiDto,
} from './dto/parse-transaction.dto';

@ApiTags('AI - Transaction Parsing')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  /**
   * Test endpoint to check AI service connectivity
   */
  @Get('test')
  @ApiOperation({
    summary: 'Test AI service',
    description: 'Check if AI service is accessible',
  })
  async testAiService() {
    return {
      status: 'ok',
      message: 'AI module is loaded in NestJS',
      endpoints: {
        parse: 'POST /ai/parse',
        createTransaction: 'POST /ai/transactions',
      },
    };
  }

  /**
   * Parse natural language text (without saving to DB)
   * Useful for preview/testing
   */
  @Post('parse')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Parse transaction text',
    description:
      'Parse natural language text into structured transaction data (without saving to database)',
  })
  async parseTransaction(
    @Body() dto: ParseTransactionDto,
    @CurrentUser('sub') userId: string,
  ) {
    // For parse-only, we still want to provide user context
    // So we could enhance this to fetch user's wallets/categories
    // For now, just pass through to AI service
    return this.aiService.parseTransaction(dto);
  }

  /**
   * Parse and create transaction in one go
   * This is the main endpoint for creating transactions via AI
   */
  @Post('transactions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create transaction from natural language',
    description:
      'Parse natural language text and automatically create a transaction in the database',
  })
  async createTransactionFromAi(
    @Body() dto: CreateTransactionFromAiDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.aiService.parseAndCreateTransaction(userId, dto);
  }
}
