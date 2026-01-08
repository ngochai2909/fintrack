'use client'

// ════════════════════════════════════════════════════════════
// CREATE WALLET PAGE - WITH REACT QUERY
// ════════════════════════════════════════════════════════════
// Sử dụng React Query Mutation để create wallet
// ════════════════════════════════════════════════════════════

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
  const queryClient = useQueryClient()

  // ────────────────────────────────────────────────────────────
  // State Management
  // ────────────────────────────────────────────────────────────
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<CreateWalletDto>({
    name: '',
    balance: 0,
    currency: 'VND'
  })

  // ────────────────────────────────────────────────────────────
  // ✅ REACT QUERY - Create Mutation
  // ────────────────────────────────────────────────────────────
  // Thay thế: loading state + try-catch trong handleSubmit
  // ────────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (data: CreateWalletDto) => walletsService.create(data),
    onSuccess: () => {
      // Invalidate wallets query để refetch list
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
      alert('✅ Tạo ví thành công!')
      router.push('/wallets')
    },
    onError: (err) => {
      console.error('❌ Error:', err)
      const error = err as { response?: { data?: { message?: string } } }
      setError(error.response?.data?.message || 'Failed to create wallet')
    }
  })

  // ────────────────────────────────────────────────────────────
  // Handle input change
  // ────────────────────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'balance' ? parseFloat(value) || 0 : value
    }))
  }

  // ────────────────────────────────────────────────────────────
  // Handle form submit
  // ────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim()) {
      setError('Vui lòng nhập tên ví')
      return
    }

    setError(null)
    createMutation.mutate(formData)
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
            disabled={createMutation.isPending}
            className='flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-medium transition-colors'
          >
            {createMutation.isPending ? 'Đang tạo...' : 'Tạo Ví'}
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
