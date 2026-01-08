'use client'

// ════════════════════════════════════════════════════════════
// CREATE WALLET PAGE
// ════════════════════════════════════════════════════════════
// Form để tạo wallet mới
// ════════════════════════════════════════════════════════════

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { walletsService } from '@/services/wallets.service'
import { CreateWalletDto } from '@/types/wallet'
import Link from 'next/link'

const CURRENCIES = [
  { code: 'VND', name: 'Việt Nam Đồng' },
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'JPY', name: 'Japanese Yen' }
]

export default function NewWalletPage() {
  const router = useRouter()

  // ────────────────────────────────────────────────────────────
  // State Management
  // ────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // TODO 1: Tạo state cho form data
  // Gợi ý: Dùng useState<CreateWalletDto>
  const [formData, setFormData] = useState<CreateWalletDto>({
    name: '',
    balance: 0,
    currency: 'VND'
  })

  // ────────────────────────────────────────────────────────────
  // TODO 2: Handle input change
  // ────────────────────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    // TODO: Implement me!
    // Gợi ý:
    // 1. Lấy name và value từ e.target
    // 2. Update formData state
    // 3. Chú ý: balance là number, cần parseFloat()

    console.log('TODO: Handle change', e.target.name, e.target.value)
  }

  // ────────────────────────────────────────────────────────────
  // TODO 3: Handle form submit
  // ────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // TODO: Implement me!
    // Gợi ý:
    // 1. Validate form (name không được empty)
    // 2. Set loading = true
    // 3. Gọi walletsService.create(formData)
    // 4. Navigate về /wallets (dùng router.push)
    // 5. Handle error nếu có

    console.log('TODO: Submit form', formData)
  }

  // ────────────────────────────────────────────────────────────
  // Render
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

        <h1 className='text-3xl font-bold text-gray-900'>Tạo Ví Mới</h1>
        <p className='text-gray-600 mt-2'>
          Điền thông tin để tạo ví quản lý tài chính
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className='bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6'>
          <p className='font-medium'>Lỗi:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className='bg-white rounded-lg shadow-md p-8 border border-gray-200'
      >
        {/* TODO 4: Implement form fields */}

        {/* Wallet Name */}
        <div className='mb-6'>
          <label
            htmlFor='name'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Tên Ví <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            id='name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            placeholder='VD: Ví tiền mặt'
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
            required
          />
        </div>

        {/* Balance */}
        <div className='mb-6'>
          <label
            htmlFor='balance'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Số Dư Ban Đầu
          </label>
          <input
            type='number'
            id='balance'
            name='balance'
            value={formData.balance}
            onChange={handleChange}
            placeholder='0'
            step='0.01'
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
          />
        </div>

        {/* Currency */}
        <div className='mb-8'>
          <label
            htmlFor='currency'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Loại Tiền Tệ <span className='text-red-500'>*</span>
          </label>
          <select
            id='currency'
            name='currency'
            value={formData.currency}
            onChange={handleChange}
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
            required
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
            disabled={loading}
            className='flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-medium transition-colors'
          >
            {loading ? 'Đang tạo...' : 'Tạo Ví'}
          </button>
          <Link
            href='/wallets'
            className='flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium text-center transition-colors'
          >
            Hủy
          </Link>
        </div>
      </form>
    </div>
  )
}

