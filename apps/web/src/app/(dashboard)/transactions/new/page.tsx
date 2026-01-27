'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { transactionsService } from '@/services/transactions.service';
import { walletsService } from '@/services/wallets.service';
import { categoriesService } from '@/services/categories.service';
import { useRouter } from 'next/navigation';
import { CreateTransactionDto } from '@/types/transaction';
import { TransactionType } from '@/types/category';

/**
 * CREATE TRANSACTION PAGE
 * 
 * Features:
 * - Select transaction type (INCOME, EXPENSE)
 * - Select wallet with real-time balance display
 * - Select category (filtered by transaction type)
 * - Enter amount with validation
 * - Optional description and note
 * - Date picker
 * - Form validation
 */
export default function NewTransactionPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Form state
  const [formData, setFormData] = useState<CreateTransactionDto>({
    amount: 0,
    type: TransactionType.EXPENSE, // Default to EXPENSE
    description: '',
    note: '',
    date: new Date().toISOString().split('T')[0], // Today's date YYYY-MM-DD
    walletId: '',
    categoryId: '',
  });

  const [error, setError] = useState('');

  // Fetch wallets
  const { data: wallets, isLoading: walletsLoading } = useQuery({
    queryKey: ['wallets'],
    queryFn: () => walletsService.getAll(),
  });

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getAll(),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateTransactionDto) => transactionsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['wallets'] }); // Refresh wallets (balance changed)
      router.push('/transactions');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to create transaction');
    },
  });

  // Auto-select first wallet if not selected
  useEffect(() => {
    if (wallets && wallets.length > 0 && !formData.walletId) {
      setFormData((prev) => ({ ...prev, walletId: wallets[0].id }));
    }
  }, [wallets, formData.walletId]);

  // Auto-select first category of selected type if not selected
  useEffect(() => {
    if (categories && !formData.categoryId) {
      const matchingCategories = categories.filter((c) => c.type === formData.type);
      if (matchingCategories.length > 0) {
        setFormData((prev) => ({ ...prev, categoryId: matchingCategories[0].id }));
      }
    }
  }, [categories, formData.type, formData.categoryId]);

  // Handle change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));

    // If type changed, reset categoryId
    if (name === 'type') {
      const matchingCategories = categories?.filter((c) => c.type === value) || [];
      setFormData((prev) => ({
        ...prev,
        type: value as TransactionType,
        categoryId: matchingCategories.length > 0 ? matchingCategories[0].id : '',
      }));
    }

    // If category changed, auto-update type to match category type
    if (name === 'categoryId' && categories) {
      const selectedCategory = categories.find((c) => c.id === value);
      if (selectedCategory && selectedCategory.type !== formData.type) {
        setFormData((prev) => ({
          ...prev,
          type: selectedCategory.type,
          categoryId: value,
        }));
      }
    }
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.amount || formData.amount <= 0) {
      setError('Số tiền phải lớn hơn 0');
      return;
    }

    if (!formData.walletId) {
      setError('Vui lòng chọn ví');
      return;
    }

    if (!formData.categoryId) {
      setError('Vui lòng chọn danh mục');
      return;
    }

    // Prepare data
    const submitData: CreateTransactionDto = {
      ...formData,
      date: new Date(formData.date || new Date()).toISOString(),
    };

    // Submit
    createMutation.mutate(submitData);
  };

  // Filter categories by type
  const filteredCategories = categories?.filter((c) => c.type === formData.type) || [];

  // Get selected wallet for balance display
  const selectedWallet = wallets?.find((w) => w.id === formData.walletId);

  // Loading
  if (walletsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            ✨ Tạo giao dịch mới
          </h1>
          <p className="text-gray-600 mt-1">
            Ghi lại giao dịch thu/chi của bạn
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Loại giao dịch <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, type: TransactionType.INCOME }))
                  }
                  className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                    formData.type === TransactionType.INCOME
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <span className="text-2xl block mb-1">💰</span>
                  Thu nhập
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, type: TransactionType.EXPENSE }))
                  }
                  className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                    formData.type === TransactionType.EXPENSE
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <span className="text-2xl block mb-1">💸</span>
                  Chi tiêu
                </button>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Số tiền <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="amount"
                  value={formData.amount || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-2xl font-bold text-right"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                  {selectedWallet?.currency || 'VND'}
                </span>
              </div>
            </div>

            {/* Wallet */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ví <span className="text-red-500">*</span>
              </label>
              <select
                name="walletId"
                value={formData.walletId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {wallets?.map((wallet) => (
                  <option key={wallet.id} value={wallet.id}>
                    💰 {wallet.name} - {formatBalance(wallet.balance, wallet.currency)}
                  </option>
                ))}
              </select>
              {selectedWallet && (
                <p className="mt-2 text-sm text-gray-600">
                  Số dư hiện tại: <span className="font-semibold">{formatBalance(selectedWallet.balance, selectedWallet.currency)}</span>
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Danh mục <span className="text-red-500">*</span>
              </label>
              {filteredCategories.length === 0 ? (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                  ⚠️ Chưa có danh mục {formData.type === TransactionType.INCOME ? 'thu nhập' : 'chi tiêu'}. 
                  <a href="/categories/new" className="underline ml-1 font-semibold">Tạo danh mục mới</a>
                </div>
              ) : (
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {filteredCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon || '📁'} {category.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ngày giao dịch <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mô tả
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ví dụ: Mua sắm, Tiền lương tháng 1..."
              />
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ghi chú
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Thêm ghi chú (không bắt buộc)..."
                rows={3}
              />
            </div>

            {/* Preview */}
            <div className="border-t border-gray-200 pt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Xem trước
              </label>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl shadow-sm"
                    style={{
                      backgroundColor:
                        filteredCategories.find((c) => c.id === formData.categoryId)?.color || '#6B7280',
                      color: 'white',
                    }}
                  >
                    {filteredCategories.find((c) => c.id === formData.categoryId)?.icon || '📁'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">
                      {formData.description || filteredCategories.find((c) => c.id === formData.categoryId)?.name || 'Giao dịch'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedWallet?.name} • {formatDate(formData.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-xl font-bold ${
                        formData.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {formData.type === TransactionType.INCOME ? '+' : '-'}
                      {formatBalance(formData.amount, selectedWallet?.currency || 'VND')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={createMutation.isPending || filteredCategories.length === 0}
                className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
              >
                {createMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Đang tạo...
                  </span>
                ) : (
                  '✅ Tạo giao dịch'
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-8 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ════════════════════════════════════════════════════════════

function formatBalance(balance: number, currency: string): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currency === 'VND' ? 'VND' : 'USD',
  }).format(balance);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
