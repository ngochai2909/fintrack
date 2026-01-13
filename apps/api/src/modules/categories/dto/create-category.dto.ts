import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  Matches,
} from 'class-validator';
import { TransactionType } from '@prisma/client';

/**
 * DTO for creating a new category
 *
 * FIELDS TO VALIDATE:
 * - name: required, string
 * - type: required, enum (INCOME, EXPENSE, TRANSFER)
 * - icon: optional, string (emoji or icon name)
 * - color: optional, string (hex color)
 *
 * TODO: Add validation decorators for each field
 */
export class CreateCategoryDto {
  // TODO: Add @IsNotEmpty() and @IsString() decorators
  @IsNotEmpty()
  @IsString()
  name: string;

  // TODO: Add @IsNotEmpty(), @IsEnum(), and @IsIn() decorators
  // Validate that type is one of: INCOME, EXPENSE, TRANSFER

  @IsNotEmpty()
  @IsEnum(TransactionType)
  type: TransactionType;

  // TODO: Add @IsOptional() and @IsString() decorators
  @IsOptional()
  @IsString()
  icon?: string;

  // TODO: Add @IsOptional() and @IsString() decorators
  // Optional: Add regex validation for hex color format (#RRGGBB)
  @IsOptional()
  @IsString()
  @Matches(/^#([0-9a-fA-F]{6})$/)
  color?: string;
}
