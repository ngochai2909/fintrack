'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesService } from '@/services/categories.service';
import { useRouter } from 'next/navigation';
import { CreateCategoryDto, TransactionType } from '@/types/category';

/**
 * CREATE CATEGORY PAGE
 * 
 * PATTERN: Similar to wallets/new/page.tsx
 * 
 * FORM FIELDS:
 * - name: string (required)
 * - type: TransactionType (required, dropdown/radio)
 * - icon: string (optional, emoji picker or text input)
 * - color: string (optional, color picker or text input)
 * 
 * REACT QUERY:
 * - useMutation for creating category
 * 
 * TODO: Implement the form
 */
export default function NewCategoryPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // TODO: Create form state
  const [formData, setFormData] = useState<CreateCategoryDto>({
    name: '',
    type: 'EXPENSE', // Default type
    icon: '',
    color: '#6B7280', // Default color
  });

  const [error, setError] = useState('');

  // TODO: Use useMutation for creating category
  const createMutation = useMutation({
    mutationFn: (data: CreateCategoryDto) => categoriesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      router.push('/categories');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to create category');
    },
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.name.trim()) {
      setError('Tên danh mục không được để trống');
      return;
    }

    if (!formData.type) {
      setError('Vui lòng chọn loại danh mục');
      return;
    }

    // Validate color format if provided
    if (formData.color && !/^#[0-9A-Fa-f]{6}$/.test(formData.color)) {
      setError('Màu sắc phải có định dạng #RRGGBB (ví dụ: #FF5733)');
      return;
    }

    // Create category
    createMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            ✨ Tạo danh mục mới
          </h1>
          <p className="text-gray-600 mt-1">
            Tạo danh mục để phân loại các giao dịch thu/chi
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tên danh mục <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ví dụ: Tiền lương, Tiền ăn, Tiền nhà..."
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Tên danh mục nên ngắn gọn, dễ hiểu
              </p>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Loại <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="INCOME">💰 Thu nhập</option>
                <option value="EXPENSE">💸 Chi tiêu</option>
                <option value="TRANSFER">🔄 Chuyển tiền</option>
              </select>
            </div>

            {/* Icon */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Icon (emoji)
              </label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-2xl"
                placeholder="💰 🍔 🚗 💡 🏠 ..."
                maxLength={2}
              />
              <p className="mt-1 text-xs text-gray-500">
                Gợi ý emoji: Thu nhập (💰 💵), Chi tiêu (🍔 🚗 🏠 💡), Chuyển tiền (🔄 💸)
              </p>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Màu sắc
              </label>
              <div className="flex gap-3">
                <input
                  type="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="h-12 w-24 rounded-lg cursor-pointer border-2 border-gray-300"
                />
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  placeholder="#6B7280"
                  pattern="^#[0-9A-Fa-f]{6}$"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Định dạng: #RRGGBB (ví dụ: #10B981 cho màu xanh lá)
              </p>
            </div>

            {/* Preview */}
            <div className="border-t border-gray-200 pt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Xem trước
              </label>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div
                  className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl shadow-sm"
                  style={{
                    backgroundColor: formData.color || '#6B7280',
                    color: 'white',
                  }}
                >
                  {formData.icon || '📁'}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {formData.name || 'Tên danh mục'}
                  </h3>
                  <span className="text-sm text-gray-600">
                    {formData.type === 'INCOME' && '💰 Thu nhập'}
                    {formData.type === 'EXPENSE' && '💸 Chi tiêu'}
                    {formData.type === 'TRANSFER' && '🔄 Chuyển tiền'}
                  </span>
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
                disabled={createMutation.isPending}
                className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
              >
                {createMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Đang tạo...
                  </span>
                ) : (
                  '✅ Tạo danh mục'
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
