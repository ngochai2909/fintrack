// ════════════════════════════════════════════════════════════
// UPDATE TRANSACTION DTO
// ════════════════════════════════════════════════════════════
// Data Transfer Object for updating a transaction
// All fields are optional
// ════════════════════════════════════════════════════════════

import {
  IsOptional,
  IsNumber,
  IsPositive,
  IsEnum,
  IsString,
  IsDateString,
  IsUUID,
} from 'class-validator';
import { TransactionType } from '@prisma/client';

export class UpdateTransactionDto {
  /**
   * Transaction amount (must be positive)
   */
  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount?: number;

  /**
   * Transaction type (INCOME, EXPENSE, TRANSFER)
   */
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  /**
   * Short description
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
   */
  @IsOptional()
  @IsDateString()
  date?: string;

  /**
   * Wallet ID (UUID)
   */
  @IsOptional()
  @IsUUID()
  walletId?: string;

  /**
   * Category ID (UUID)
   */
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
