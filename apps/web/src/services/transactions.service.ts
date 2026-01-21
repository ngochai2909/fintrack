// ════════════════════════════════════════════════════════════
// TRANSACTIONS SERVICE
// ════════════════════════════════════════════════════════════
// Service layer for Transactions API calls
// Uses axiosInstance (auto token attachment & refresh)
// ════════════════════════════════════════════════════════════

import { axiosInstance } from '@/lib/axios';
import {
  Transaction,
  CreateTransactionDto,
  UpdateTransactionDto,
} from '@/types/transaction';

/**
 * Transactions Service
 * Handles all API calls related to transactions
 * 
 * API Endpoints:
 * - GET    /api/transactions          - Get all transactions
 * - POST   /api/transactions          - Create new transaction
 * - GET    /api/transactions/:id      - Get transaction by ID
 * - PATCH  /api/transactions/:id      - Update transaction
 * - DELETE /api/transactions/:id      - Delete transaction
 */
class TransactionsService {
  private readonly baseUrl = '/transactions';

  /**
   * Get all transactions
   * @returns Array of transactions with relations, ordered by date (newest first)
   */
  async getAll(): Promise<Transaction[]> {
    return axiosInstance.get(this.baseUrl);
  }

  /**
   * Get transaction by ID
   * @param id - Transaction UUID
   * @returns Transaction object with relations
   */
  async getById(id: string): Promise<Transaction> {
    return axiosInstance.get(`${this.baseUrl}/${id}`);
  }

  /**
   * Create a new transaction
   * @param data - Transaction data
   * @returns Created transaction
   */
  async create(data: CreateTransactionDto): Promise<Transaction> {
    return axiosInstance.post(this.baseUrl, data);
  }

  /**
   * Update an existing transaction
   * @param id - Transaction UUID
   * @param data - Updated transaction data
   * @returns Updated transaction
   */
  async update(id: string, data: UpdateTransactionDto): Promise<Transaction> {
    return axiosInstance.patch(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Delete a transaction
   * @param id - Transaction UUID
   * @returns Void (no content)
   */
  async delete(id: string): Promise<void> {
    return axiosInstance.delete(`${this.baseUrl}/${id}`);
  }
}

// Export singleton instance
export const transactionsService = new TransactionsService();
