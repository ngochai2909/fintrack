import { axiosInstance } from '@/lib/axios';
import {
  Transaction,
  CreateTransactionDto,
  UpdateTransactionDto,
} from '@/types/transaction';

class TransactionsService {
  private readonly baseUrl = '/transactions';

  async getAll(): Promise<Transaction[]> {
    return axiosInstance.get(this.baseUrl);
  }

  async getById(id: string): Promise<Transaction> {
    return axiosInstance.get(`${this.baseUrl}/${id}`);
  }

  async create(data: CreateTransactionDto): Promise<Transaction> {
    return axiosInstance.post(this.baseUrl, data);
  }

  async update(id: string, data: UpdateTransactionDto): Promise<Transaction> {
    return axiosInstance.patch(`${this.baseUrl}/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return axiosInstance.delete(`${this.baseUrl}/${id}`);
  }
}

export const transactionsService = new TransactionsService();
