'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesService } from '@/services/categories.service';
import { useRouter, useParams } from 'next/navigation';
import { UpdateCategoryDto } from '@/types/category';

/**
 * EDIT CATEGORY PAGE
 * 
 * PATTERN: Similar to wallets/[id]/page.tsx
 * 
 * FEATURES:
 * 1. Fetch category by ID
 * 2. Pre-fill form with existing data
 * 3. Update category
 * 4. Show "System Default" warning (cannot edit)
 * 
 * REACT QUERY:
 * - useQuery for fetching category
 * - useMutation for updating
 * 
 * TODO: Implement the page
 */
export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const categoryId = params.id as string;

  const [formData, setFormData] = useState<UpdateCategoryDto>({
    name: '',
    type: 'EXPENSE',
    icon: '',
    color: '#6B7280',
  });
  const [error, setError] = useState('');

  // TODO: Use useQuery to fetch category
  const { data: category, isLoading } = useQuery({
    queryKey: ['categories', categoryId],
    queryFn: () => categoriesService.getById(categoryId),
  });

  // TODO: Use useMutation for updating
  const updateMutation = useMutation({
    mutationFn: (data: UpdateCategoryDto) =>
      categoriesService.update(categoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories', categoryId] });
      router.push('/categories');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to update category');
    },
  });

  // TODO: Pre-fill form when category is loaded
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        type: category.type,
        icon: category.icon || '',
        color: category.color || '#6B7280',
      });
    }
  }, [category]);

  // TODO: Implement handleChange
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    // Update formData
    throw new Error('Not implemented');
  };

  // TODO: Implement handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check if it's a system default category
    // Call updateMutation.mutate(formData)
    throw new Error('Not implemented');
  };

  if (isLoading) {
    return <div className="p-6">Loading category...</div>;
  }

  if (!category) {
    return <div className="p-6">Category not found</div>;
  }

  // TODO: Show warning if system default category
  const isSystemDefault = !category.userId || category.isDefault;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Chỉnh sửa danh mục</h1>

      {/* System Default Warning */}
      {isSystemDefault && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg mb-6">
          ⚠️ Đây là danh mục mặc định của hệ thống. Bạn không thể chỉnh sửa.
        </div>
      )}

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
            disabled={isSystemDefault}
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
            disabled={isSystemDefault}
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
            disabled={isSystemDefault}
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
              disabled={isSystemDefault}
            />
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border rounded-lg"
              disabled={isSystemDefault}
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
            disabled={updateMutation.isPending || isSystemDefault}
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {updateMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật'}
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
