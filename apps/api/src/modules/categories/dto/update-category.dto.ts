import { IsString, IsEnum, IsOptional } from 'class-validator';
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
  name?: string;

  // TODO: Add @IsOptional(), @IsEnum(), and @IsIn() decorators
  type?: TransactionType;

  // TODO: Add @IsOptional() and @IsString() decorators
  icon?: string;

  // TODO: Add @IsOptional() and @IsString() decorators
  color?: string;
}
