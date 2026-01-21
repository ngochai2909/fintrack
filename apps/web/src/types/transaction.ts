// ════════════════════════════════════════════════════════════
// TRANSACTION TYPES
// ════════════════════════════════════════════════════════════
// Types for Transactions module - Frontend
// Matching Backend DTOs and Prisma schema
// ════════════════════════════════════════════════════════════

import { TransactionType } from './category';

/**
 * Transaction Entity - Response from API
 * Represents a financial transaction (income/expense/transfer)
 */
export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  description: string | null;
  note: string | null;
  date: string; // ISO date string
  walletId: string;
  categoryId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  
  // Relations (when included)
  wallet?: {
    id: string;
    name: string;
    currency: string;
    type: string;
  };
  category?: {
    id: string;
    name: string;
    type: TransactionType;
    icon: string | null;
    color: string | null;
  };
}

/**
 * DTO for creating a new transaction
 * Matches CreateTransactionDto in Backend
 */
export interface CreateTransactionDto {
  amount: number;
  type: TransactionType | string;
  description?: string;
  note?: string;
  date?: string; // ISO date string
  walletId: string;
  categoryId: string;
}

/**
 * DTO for updating a transaction
 * Matches UpdateTransactionDto in Backend
 */
export interface UpdateTransactionDto {
  amount?: number;
  type?: TransactionType | string;
  description?: string;
  note?: string;
  date?: string; // ISO date string
  walletId?: string;
  categoryId?: string;
}
