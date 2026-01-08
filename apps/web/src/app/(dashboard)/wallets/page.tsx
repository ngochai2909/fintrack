'use client'

// ════════════════════════════════════════════════════════════
// WALLETS LIST PAGE
// ════════════════════════════════════════════════════════════
// Trang này hiển thị danh sách tất cả wallets
// ════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react'
import { walletsService } from '@/services/wallets.service'
import { Wallet } from '@/types/wallet'
import Link from 'next/link'

export default function WalletsPage() {
  // ────────────────────────────────────────────────────────────
  // State Management
  // ────────────────────────────────────────────────────────────
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ────────────────────────────────────────────────────────────
  // TODO 1: Fetch wallets khi component mount
  // ────────────────────────────────────────────────────────────
  useEffect(() => {
    // TODO: Implement fetchWallets()
    // Gợi ý:
    // 1. Set loading = true
    // 2. Gọi walletsService.getAll()
    // 3. Set data vào state
    // 4. Handle error nếu có
    // 5. Set loading = false

    fetchWallets()
  }, [])

  const fetchWallets = async () => {
    // TODO: Implement me!
    console.log('TODO: Fetch wallets from API')
  }

  // ────────────────────────────────────────────────────────────
  // TODO 2: Implement Delete Handler
  // ────────────────────────────────────────────────────────────
  const handleDelete = async (id: string, name: string) => {
    // TODO: Implement me!
    // Gợi ý:
    // 1. Confirm với user
    // 2. Gọi walletsService.delete(id)
    // 3. Remove khỏi state (filter)
    // 4. Show success message
    console.log('TODO: Delete wallet', id, name)
  }

  // ────────────────────────────────────────────────────────────
  // Render Loading State
  // ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Đang tải...</p>
        </div>
      </div>
    )
  }

  // ────────────────────────────────────────────────────────────
  // Render Main UI
  // ────────────────────────────────────────────────────────────
  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Header */}
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Quản lý Ví</h1>
          <p className='text-gray-600 mt-2'>
            Tổng số ví: <span className='font-semibold'>{wallets.length}</span>
          </p>
        </div>
        <Link
          href='/wallets/new'
          className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-colors'
        >
          + Tạo Ví Mới
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className='bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6'>
          <p className='font-medium'>Lỗi:</p>
          <p>{error}</p>
        </div>
      )}

      {/* TODO 3: Hiển thị Empty State khi chưa có ví */}
      {/* Gợi ý: Check wallets.length === 0 */}

      {/* TODO 4: Hiển thị danh sách wallets */}
      {/* Gợi ý:
          - Map qua wallets array
          - Mỗi wallet render trong 1 card
          - Hiển thị: name, balance, currency
          - Buttons: Edit, Delete
      */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {wallets.map((wallet) => (
          <div
            key={wallet.id}
            className='bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200'
          >
            {/* TODO: Render wallet info */}
            <h3 className='text-xl font-bold'>{wallet.name}</h3>
            <p className='text-2xl text-blue-600 mt-2'>
              {wallet.balance} {wallet.currency}
            </p>

            {/* TODO: Add Edit & Delete buttons */}
          </div>
        ))}
      </div>
    </div>
  )
}

