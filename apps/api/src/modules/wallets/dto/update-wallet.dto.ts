import { IsString, IsOptional, IsIn, IsNumber, Min, IsEnum } from 'class-validator';
import { WalletType } from '@prisma/client';

export class UpdateWalletDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(WalletType)
  @IsOptional()
  type?: WalletType;

  @IsNumber()
  @Min(0)
  @IsOptional()
  balance?: number;

  @IsString()
  @IsIn(['VND', 'USD', 'EUR', 'JPY'])
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  color?: string;
}

