// ════════════════════════════════════════════════════════════
// CREATE TRANSACTION DTO
// ════════════════════════════════════════════════════════════
// Data Transfer Object for creating a new transaction
// ════════════════════════════════════════════════════════════

import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsEnum,
  IsString,
  IsOptional,
  IsDateString,
  IsUUID,
} from 'class-validator';
import { TransactionType } from '@prisma/client';

export class CreateTransactionDto {
  /**
   * Transaction amount (must be positive)
   * Backend will handle sign based on type
   */
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  /**
   * Transaction type (INCOME, EXPENSE, TRANSFER)
   */
  @IsNotEmpty()
  @IsEnum(TransactionType)
  type: TransactionType;

  /**
   * Short description of the transaction
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Additional notes
   */
  @IsOptional()
  @IsString()
  note?: string;

  /**
   * Transaction date (ISO string)
   * If not provided, defaults to current date
   */
  @IsOptional()
  @IsDateString()
  date?: string;

  /**
   * Wallet ID (UUID)
   */
  @IsNotEmpty()
  @IsUUID()
  walletId: string;

  /**
   * Category ID (UUID)
   */
  @IsNotEmpty()
  @IsUUID()
  categoryId: string;
}
