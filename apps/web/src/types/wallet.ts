// ════════════════════════════════════════════════════════════
// WALLET TYPES
// ════════════════════════════════════════════════════════════
// Tương tự như DTOs trong Backend
// ════════════════════════════════════════════════════════════

/**
 * Wallet entity - Response từ API
 */
export interface Wallet {
  id: string
  name: string
  balance: number
  currency: string
  userId: string
  createdAt: string
  updatedAt: string
}

/**
 * DTO để tạo wallet mới
 */
export interface CreateWalletDto {
  name: string
  balance?: number
  currency?: string
}

/**
 * DTO để update wallet
 */
export interface UpdateWalletDto {
  name?: string
  balance?: number
  currency?: string
}
