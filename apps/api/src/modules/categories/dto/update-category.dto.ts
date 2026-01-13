import { IsString, IsEnum, IsOptional, Matches } from 'class-validator';
import { TransactionType } from '@prisma/client';

/**
 * DTO for updating an existing category
 *
 * ALL FIELDS ARE OPTIONAL (partial update)
 *
 * TODO: Add validation decorators for each field
 */
export class UpdateCategoryDto {
  // TODO: Add @IsOptional() and @IsString() decorators
  @IsOptional()
  @IsString()
  name?: string;

  // TODO: Add @IsOptional(), @IsEnum(), and @IsIn() decorators
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  // TODO: Add @IsOptional() and @IsString() decorators
  @IsOptional()
  @IsString()
  icon?: string;

  // TODO: Add @IsOptional() and @IsString() decorators
  @IsOptional()
  @IsString()
  @Matches(/^#([0-9a-fA-F]{6})$/)
  color?: string;
}
