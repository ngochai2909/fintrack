import { TransactionType } from '@prisma/client';
export declare class UpdateCategoryDto {
    name?: string;
    type?: TransactionType;
    icon?: string;
    color?: string;
}
