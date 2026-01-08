'use client'

// ════════════════════════════════════════════════════════════
// EDIT WALLET PAGE
// ════════════════════════════════════════════════════════════
// Form để chỉnh sửa wallet
// ════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { walletsService } from '@/services/wallets.service'
import { Wallet, UpdateWalletDto } from '@/types/wallet'
import Link from 'next/link'

const CURRENCIES = [
  { code: 'VND', name: 'Việt Nam Đồng' },
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'JPY', name: 'Japanese Yen' }
]

export default function EditWalletPage() {
  const router = useRouter()
  const params = useParams()
  const walletId = params?.id as string

  // ────────────────────────────────────────────────────────────
  // State Management
  // ────────────────────────────────────────────────────────────
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<UpdateWalletDto>({
    name: '',
    balance: 0,
    currency: 'VND'
  })

  // ────────────────────────────────────────────────────────────
  // TODO 1: Fetch wallet data khi component mount
  // ────────────────────────────────────────────────────────────
  useEffect(() => {
    // TODO: Implement fetchWallet()
    // Gợi ý:
    // 1. Gọi walletsService.getById(walletId)
    // 2. Set wallet state
    // 3. Set formData với data từ wallet
    // 4. Handle error nếu có

    if (walletId) {
      fetchWallet()
    }
  }, [walletId])

  const fetchWallet = async () => {
    // TODO: Implement me!
    console.log('TODO: Fetch wallet', walletId)
  }

  // ────────────────────────────────────────────────────────────
  // TODO 2: Handle input change
  // ────────────────────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    // TODO: Implement me! (Giống như Create page)
    console.log('TODO: Handle change')
  }

  // ────────────────────────────────────────────────────────────
  // TODO 3: Handle form submit
  // ────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // TODO: Implement me!
    // Gợi ý:
    // 1. Validate form
    // 2. Gọi walletsService.update(walletId, formData)
    // 3. Navigate về /wallets
    // 4. Handle error

    console.log('TODO: Update wallet', walletId, formData)
  }

  // ────────────────────────────────────────────────────────────
  // Loading State
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
  // Not Found State
  // ────────────────────────────────────────────────────────────
  if (!wallet) {
    return (
      <div className='container mx-auto px-4 py-8 max-w-2xl'>
        <div className='bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg'>
          <p className='font-medium'>Không tìm thấy ví!</p>
          <Link
            href='/wallets'
            className='text-blue-600 hover:text-blue-800 font-medium mt-2 inline-block'
          >
            ← Quay lại danh sách
          </Link>
        </div>
      </div>
    )
  }

  // ────────────────────────────────────────────────────────────
  // Render Form
  // ────────────────────────────────────────────────────────────
  return (
    <div className='container mx-auto px-4 py-8 max-w-2xl'>
      {/* Header */}
      <div className='mb-8'>
        <Link
          href='/wallets'
          className='text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-2 mb-4'
        >
          ← Quay lại danh sách
        </Link>

        <h1 className='text-3xl font-bold text-gray-900'>Chỉnh Sửa Ví</h1>
        <p className='text-gray-600 mt-2'>Cập nhật thông tin ví</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className='bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6'>
          <p className='font-medium'>Lỗi:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Form - TODO 4: Implement form (tương tự Create page) */}
      <form
        onSubmit={handleSubmit}
        className='bg-white rounded-lg shadow-md p-8 border border-gray-200'
      >
        {/* Wallet Name */}
        <div className='mb-6'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Tên Ví <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
            className='w-full px-4 py-3 border border-gray-300 rounded-lg'
            required
          />
        </div>

        {/* Balance */}
        <div className='mb-6'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Số Dư
          </label>
          <input
            type='number'
            name='balance'
            value={formData.balance}
            onChange={handleChange}
            step='0.01'
            className='w-full px-4 py-3 border border-gray-300 rounded-lg'
          />
        </div>

        {/* Currency */}
        <div className='mb-8'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Loại Tiền Tệ
          </label>
          <select
            name='currency'
            value={formData.currency}
            onChange={handleChange}
            className='w-full px-4 py-3 border border-gray-300 rounded-lg'
          >
            {CURRENCIES.map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.name} ({curr.code})
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className='flex gap-4'>
          <button
            type='submit'
            disabled={submitting}
            className='flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg'
          >
            {submitting ? 'Đang lưu...' : 'Lưu Thay Đổi'}
          </button>
          <Link
            href='/wallets'
            className='flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg text-center'
          >
            Hủy
          </Link>
        </div>
      </form>
    </div>
  )
}

