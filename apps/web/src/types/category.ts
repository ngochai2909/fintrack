// ════════════════════════════════════════════════════════════
// CATEGORY TYPES
// ════════════════════════════════════════════════════════════
// Types for Categories module - Frontend
// Matching Backend DTOs and Prisma schema
// ════════════════════════════════════════════════════════════

/**
 * Transaction Type Enum
 * Must match Prisma schema TransactionType enum
 */
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER',
}

/**
 * Category Entity - Response from API
 * Represents a transaction category (income/expense/transfer)
 */
export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string | null;
  color: string | null;
  isDefault: boolean;
  userId: string | null; // null for system default categories
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO for creating a new category
 * Matches CreateCategoryDto in Backend
 */
export interface CreateCategoryDto {
  name: string;
  type: TransactionType | string; // Allow string for form compatibility
  icon?: string;
  color?: string;
}

/**
 * DTO for updating a category
 * Matches UpdateCategoryDto in Backend
 */
export interface UpdateCategoryDto {
  name?: string;
  type?: TransactionType | string; // Allow string for form compatibility
  icon?: string;
  color?: string;
}
