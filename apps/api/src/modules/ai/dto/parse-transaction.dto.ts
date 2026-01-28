/**
 * DTOs for AI Transaction Parsing
 */
import { IsString, IsOptional, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';

// ============================================
// Request DTOs
// ============================================

export class WalletInfoDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'Ví hàng ngày' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'CASH' })
  @IsString()
  type: string;

  @ApiProperty({ example: 500000 })
  balance: number;
}

export class CategoryInfoDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'Xăng xe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'EXPENSE', enum: ['INCOME', 'EXPENSE', 'TRANSFER'] })
  @IsString()
  type: TransactionType;
}

export class UserContextDataDto {
  @ApiPropertyOptional({ type: [WalletInfoDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WalletInfoDto)
  wallets?: WalletInfoDto[];

  @ApiPropertyOptional({ type: [CategoryInfoDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryInfoDto)
  categories?: CategoryInfoDto[];
}

export class ParseTransactionDto {
  @ApiProperty({
    description: 'Natural language text describing the transaction',
    example: 'Đổ xăng hết 19K, ghi vào ví Hàng ngày',
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiPropertyOptional({
    description: "User's wallets and categories for context",
    type: UserContextDataDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserContextDataDto)
  user_data?: UserContextDataDto;
}

// ============================================
// Response DTOs
// ============================================

export class ParsedTransactionDto {
  @ApiProperty({ example: 'EXPENSE', enum: ['INCOME', 'EXPENSE', 'TRANSFER'] })
  type: TransactionType;

  @ApiProperty({ example: 19000 })
  amount: number;

  @ApiProperty({ example: 'đổ xăng' })
  description: string;

  @ApiPropertyOptional({ example: 'Ví hàng ngày' })
  wallet_name?: string;

  @ApiPropertyOptional({ example: 'Xăng xe' })
  category_name?: string;

  @ApiPropertyOptional({ example: null })
  note?: string;

  @ApiProperty({ example: 0.95 })
  confidence: number;
}

export class ParseTransactionResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiPropertyOptional({ type: ParsedTransactionDto })
  data?: ParsedTransactionDto;

  @ApiPropertyOptional({ example: null })
  error?: string;

  @ApiPropertyOptional({ example: 'Transaction parsed successfully' })
  message?: string;
}

// ============================================
// Create Transaction DTO (for saving to DB)
// ============================================

export class CreateTransactionFromAiDto {
  @ApiProperty({
    description: 'Natural language text describing the transaction',
    example: 'Đổ xăng hết 19K, ghi vào ví Hàng ngày',
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiPropertyOptional({
    description: 'Wallet ID to use (if not specified, AI will try to find from wallet name)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString()
  walletId?: string;

  @ApiPropertyOptional({
    description: 'Category ID to use (if not specified, AI will try to find or suggest)',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsOptional()
  @IsString()
  categoryId?: string;
}
