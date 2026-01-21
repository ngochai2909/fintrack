// ════════════════════════════════════════════════════════════
// TRANSACTIONS CONTROLLER
// ════════════════════════════════════════════════════════════
// REST API endpoints for Transactions management
// ════════════════════════════════════════════════════════════

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

/**
 * TRANSACTIONS CONTROLLER
 * 
 * All routes are protected by JWT authentication
 * Base path: /api/transactions
 * 
 * Endpoints:
 * - POST   /api/transactions           - Create transaction
 * - GET    /api/transactions           - Get all user's transactions
 * - GET    /api/transactions/:id       - Get transaction by ID
 * - PATCH  /api/transactions/:id       - Update transaction
 * - DELETE /api/transactions/:id       - Delete transaction
 */
@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * CREATE TRANSACTION
   * POST /api/transactions
   * 
   * Creates a new transaction and updates wallet balance
   * 
   * @param userId - From JWT token
   * @param dto - Transaction data
   * @returns Created transaction with relations
   */
  @Post()
  async createTransaction(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateTransactionDto,
  ) {
    return this.transactionsService.createTransaction(userId, dto);
  }

  /**
   * GET ALL TRANSACTIONS
   * GET /api/transactions
   * 
   * Returns all transactions for the current user
   * Ordered by date (newest first)
   * 
   * @param userId - From JWT token
   * @returns Array of transactions
   */
  @Get()
  async getTransactions(@CurrentUser('sub') userId: string) {
    return this.transactionsService.getTransactions(userId);
  }

  /**
   * GET TRANSACTION BY ID
   * GET /api/transactions/:id
   * 
   * @param userId - From JWT token
   * @param id - Transaction UUID
   * @returns Transaction with relations
   */
  @Get(':id')
  async getTransactionById(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
  ) {
    return this.transactionsService.getTransactionById(userId, id);
  }

  /**
   * UPDATE TRANSACTION
   * PATCH /api/transactions/:id
   * 
   * Updates transaction and adjusts wallet balance accordingly
   * 
   * @param userId - From JWT token
   * @param id - Transaction UUID
   * @param dto - Updated transaction data
   * @returns Updated transaction
   */
  @Patch(':id')
  async updateTransaction(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.transactionsService.updateTransaction(userId, id, dto);
  }

  /**
   * DELETE TRANSACTION
   * DELETE /api/transactions/:id
   * 
   * Deletes transaction and reverts wallet balance
   * 
   * @param userId - From JWT token
   * @param id - Transaction UUID
   * @returns 204 No Content
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTransaction(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
  ) {
    await this.transactionsService.deleteTransaction(userId, id);
  }
}
