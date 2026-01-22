import { axiosInstance } from '@/lib/axios'
import { Wallet, CreateWalletDto, UpdateWalletDto } from '@/types/wallet'

export const walletsService = {
  async getAll(): Promise<Wallet[]> {
    return axiosInstance.get<Wallet[]>('/wallets') as unknown as Promise<Wallet[]>
  },

  async getById(id: string): Promise<Wallet> {
    return axiosInstance.get<Wallet>(`/wallets/${id}`) as unknown as Promise<Wallet>
  },

  async create(data: CreateWalletDto): Promise<Wallet> {
    return axiosInstance.post<Wallet>('/wallets', data) as unknown as Promise<Wallet>
  },

  async update(id: string, data: UpdateWalletDto): Promise<Wallet> {
    return axiosInstance.patch<Wallet>(`/wallets/${id}`, data) as unknown as Promise<Wallet>
  },

  async delete(id: string): Promise<void> {
    return axiosInstance.delete<void>(`/wallets/${id}`) as unknown as Promise<void>
  }
}
