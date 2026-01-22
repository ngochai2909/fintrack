'use client'

// ════════════════════════════════════════════════════════════
// WALLETS LIST PAGE - WITH REACT QUERY
// ════════════════════════════════════════════════════════════
// Sử dụng React Query để quản lý data fetching & caching
// ════════════════════════════════════════════════════════════

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { walletsService } from '@/services/wallets.service'
import Link from 'next/link'
import { formatCardAmount } from '@/lib/formatters'

export default function WalletsPage() {
  const queryClient = useQueryClient()

  // ────────────────────────────────────────────────────────────
  // ✅ REACT QUERY - Fetch Wallets
  // ────────────────────────────────────────────────────────────
  // Thay thế: useState + useEffect + fetchWallets
  // ────────────────────────────────────────────────────────────
  const {
    data: wallets = [], // Default [] nếu chưa có data
    isLoading, // Loading state tự động
    error // Error state tự động
  } = useQuery({
    queryKey: ['wallets'], // Unique key để identify query
    queryFn: walletsService.getAll, // Function để fetch data
    staleTime: 1000 * 60 * 2 // 2 minutes
  })

  // ────────────────────────────────────────────────────────────
  // ✅ REACT QUERY - Delete Mutation
  // ────────────────────────────────────────────────────────────
  // Thay thế: handleDelete với manual state update
  // ────────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (id: string) => walletsService.delete(id),
    onSuccess: () => {
      // Tự động refetch danh sách wallets sau khi xóa
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
      alert('✅ Xóa ví thành công!')
    },
    onError: (error: any) => {
      console.error('❌ Error:', error)
      alert(error.response?.data?.message || 'Failed to delete wallet')
    }
  })

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Bạn có chắc muốn xóa ví "${name}"?`)) {
      deleteMutation.mutate(id)
    }
  }

  // ────────────────────────────────────────────────────────────
  // Render Loading State
  // ────────────────────────────────────────────────────────────
  if (isLoading) {
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
            Tổng số ví:{' '}
            <span className='font-semibold'>{wallets?.length || 0}</span>
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
          <p>
            {(error as any)?.response?.data?.message ||
              'Failed to fetch wallets'}
          </p>
        </div>
      )}

      {/* Empty State - Khi chưa có ví nào */}
      {!isLoading && wallets.length === 0 && (
        <div className='text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300'>
          <div className='text-6xl mb-4'>💰</div>
          <h3 className='text-xl font-semibold text-gray-900 mb-2'>
            Chưa có ví nào
          </h3>
          <p className='text-gray-600 mb-6'>
            Bắt đầu bằng cách tạo ví đầu tiên để quản lý tài chính của bạn.
          </p>
          <Link
            href='/wallets/new'
            className='inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors'
          >
            🎉 Tạo Ví Đầu Tiên
          </Link>
        </div>
      )}

      {/* Danh sách Wallets */}
      {wallets.length > 0 && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className='bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200'
            >
              {/* Header với Edit/Delete buttons */}
              <div className='flex justify-between items-start mb-4'>
                <h3 className='text-xl font-bold text-gray-900'>
                  {wallet.name}
                </h3>
                <div className='flex gap-2'>
                  {/* Edit Button */}
                  <Link
                    href={`/wallets/${wallet.id}`}
                    className='text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded transition-colors'
                    title='Chỉnh sửa'
                  >
                    ✏️
                  </Link>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(wallet.id, wallet.name)}
                    className='text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition-colors'
                    title='Xóa'
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Balance */}
              <p className='text-3xl font-bold text-blue-600 mb-4'>
                {formatCardAmount(wallet.balance)}
              </p>

              {/* Metadata */}
              <div className='text-sm text-gray-500 border-t pt-3'>
                <p>
                  Tạo: {new Date(wallet.createdAt).toLocaleDateString('vi-VN')}
                </p>
                {wallet.updatedAt !== wallet.createdAt && (
                  <p className='mt-1'>
                    Cập nhật:{' '}
                    {new Date(wallet.updatedAt).toLocaleDateString('vi-VN')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
