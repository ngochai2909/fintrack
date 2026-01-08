// ════════════════════════════════════════════════════════════
// WALLETS SERVICE - API Layer
// ════════════════════════════════════════════════════════════
// Service này chịu trách nhiệm gọi API Backend
// Tương tự như Controller trong Backend
// ════════════════════════════════════════════════════════════

import axiosInstance from '@/lib/axios'
import { Wallet, CreateWalletDto, UpdateWalletDto } from '@/types/wallet'

// ────────────────────────────────────────────────────────────
// Wallets Service Object
// ────────────────────────────────────────────────────────────
export const walletsService = {
  /**
   * TODO: Implement getAll()
   * 
   * Mục tiêu: Lấy danh sách tất cả wallets của user hiện tại
   * 
   * Gợi ý:
   * - Endpoint: GET /wallets
   * - Return type: Promise<Wallet[]>
   * - Dùng: axiosInstance.get()
   * 
   * Ví dụ tham khảo authService.getUser() trong auth.service.ts
   */
  async getAll(): Promise<Wallet[]> {
    // TODO: Implement me!
    throw new Error('Not implemented')
  },

  /**
   * TODO: Implement getById()
   * 
   * Mục tiêu: Lấy chi tiết 1 wallet theo ID
   * 
   * Gợi ý:
   * - Endpoint: GET /wallets/:id
   * - Return type: Promise<Wallet>
   * - Dùng: axiosInstance.get()
   */
  async getById(id: string): Promise<Wallet> {
    // TODO: Implement me!
    throw new Error('Not implemented')
  },

  /**
   * TODO: Implement create()
   * 
   * Mục tiêu: Tạo wallet mới
   * 
   * Gợi ý:
   * - Endpoint: POST /wallets
   * - Body: CreateWalletDto
   * - Return type: Promise<Wallet>
   * - Dùng: axiosInstance.post()
   * 
   * Ví dụ tham khảo authService.register() trong auth.service.ts
   */
  async create(data: CreateWalletDto): Promise<Wallet> {
    // TODO: Implement me!
    throw new Error('Not implemented')
  },

  /**
   * TODO: Implement update()
   * 
   * Mục tiêu: Cập nhật wallet
   * 
   * Gợi ý:
   * - Endpoint: PATCH /wallets/:id
   * - Body: UpdateWalletDto
   * - Return type: Promise<Wallet>
   * - Dùng: axiosInstance.patch()
   */
  async update(id: string, data: UpdateWalletDto): Promise<Wallet> {
    // TODO: Implement me!
    throw new Error('Not implemented')
  },

  /**
   * TODO: Implement delete()
   * 
   * Mục tiêu: Xóa wallet
   * 
   * Gợi ý:
   * - Endpoint: DELETE /wallets/:id
   * - Return type: Promise<void>
   * - Dùng: axiosInstance.delete()
   */
  async delete(id: string): Promise<void> {
    // TODO: Implement me!
    throw new Error('Not implemented')
  }
}

