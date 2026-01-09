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

  // TODO: Implement handleChange
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    // Update formData
    throw new Error('Not implemented');
  };

  // TODO: Implement handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    // Call createMutation.mutate(formData)
    throw new Error('Not implemented');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Tạo danh mục mới</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Tên danh mục <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Ví dụ: Tiền lương, Tiền ăn..."
            required
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Loại <span className="text-red-500">*</span>
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          >
            <option value="INCOME">Thu nhập</option>
            <option value="EXPENSE">Chi tiêu</option>
            <option value="TRANSFER">Chuyển tiền</option>
          </select>
        </div>

        {/* Icon */}
        <div>
          <label className="block text-sm font-medium mb-1">Icon (emoji)</label>
          <input
            type="text"
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="💰 🍔 🚗 💡 ..."
            maxLength={2}
          />
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium mb-1">Màu sắc</label>
          <div className="flex gap-2">
            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="h-10 w-20 rounded cursor-pointer"
            />
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border rounded-lg"
              placeholder="#6B7280"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg">{error}</div>
        )}

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {createMutation.isPending ? 'Đang tạo...' : 'Tạo danh mục'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border rounded-lg hover:bg-gray-50"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
