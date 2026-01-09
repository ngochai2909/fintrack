/**
 * Category Types & Interfaces
 * 
 * PATTERN: Similar to wallet.ts
 * 
 * TODO: Define types matching the Prisma Category model
 */

/**
 * Transaction Type Enum
 * Must match Prisma's TransactionType enum
 */
export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

/**
 * Category Interface
 * Must match the Category model from Prisma schema
 * 
 * TODO: Define all fields
 */
export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon?: string;
  color?: string;
  isDefault: boolean;
  userId?: string | null; // null for system default categories
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO for creating a category
 * 
 * TODO: Define required and optional fields
 */
export interface CreateCategoryDto {
  name: string;
  type: TransactionType;
  icon?: string;
  color?: string;
}

/**
 * DTO for updating a category
 * All fields are optional (partial update)
 * 
 * TODO: Define optional fields
 */
export interface UpdateCategoryDto {
  name?: string;
  type?: TransactionType;
  icon?: string;
  color?: string;
}
