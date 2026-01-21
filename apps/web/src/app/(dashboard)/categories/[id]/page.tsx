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

    // Prevent updating system defaults
    if (isSystemDefault) {
      setError('Không thể chỉnh sửa danh mục mặc định của hệ thống');
      return;
    }

    // Basic validation
    if (formData.name && !formData.name.trim()) {
      setError('Tên danh mục không được để trống');
      return;
    }

    // Validate color format if provided
    if (formData.color && !/^#[0-9A-Fa-f]{6}$/.test(formData.color)) {
      setError('Màu sắc phải có định dạng #RRGGBB (ví dụ: #FF5733)');
      return;
    }

    // Update category
    updateMutation.mutate(formData);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh mục...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy danh mục</h2>
          <p className="text-gray-600 mb-6">Danh mục không tồn tại hoặc đã bị xóa</p>
          <button
            onClick={() => router.push('/categories')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  // Check if system default
  const isSystemDefault = !category.userId || category.isDefault;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            ✏️ Chỉnh sửa danh mục
          </h1>
          <p className="text-gray-600 mt-1">
            Cập nhật thông tin danh mục "{category.name}"
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* System Default Warning */}
          {isSystemDefault && (
            <div className="bg-yellow-50 border-2 border-yellow-300 text-yellow-900 p-4 rounded-lg mb-6 flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="font-semibold mb-1">Danh mục mặc định của hệ thống</h3>
                <p className="text-sm">
                  Đây là danh mục mặc định, bạn không thể chỉnh sửa. 
                  Chỉ quản trị viên mới có quyền thay đổi.
                </p>
              </div>
            </div>
          )}

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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={isSystemDefault}
                required
              />
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={isSystemDefault}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-2xl disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={isSystemDefault}
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
                  className="h-12 w-24 rounded-lg cursor-pointer border-2 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSystemDefault}
                />
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={isSystemDefault}
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

            {/* Metadata */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Thông tin</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium">ID:</span>{' '}
                  <code className="bg-gray-200 px-2 py-0.5 rounded text-xs">
                    {category.id}
                  </code>
                </p>
                <p>
                  <span className="font-medium">Tạo lúc:</span>{' '}
                  {new Date(category.createdAt).toLocaleString('vi-VN')}
                </p>
                <p>
                  <span className="font-medium">Cập nhật:</span>{' '}
                  {new Date(category.updatedAt).toLocaleString('vi-VN')}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={updateMutation.isPending || isSystemDefault}
                className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
              >
                {updateMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Đang cập nhật...
                  </span>
                ) : (
                  '✅ Cập nhật danh mục'
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
