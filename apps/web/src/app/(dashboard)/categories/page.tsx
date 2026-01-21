'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesService } from '@/services/categories.service';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Category } from '@/types/category';

/**
 * CATEGORIES LIST PAGE
 * 
 * Display all categories grouped by type (INCOME, EXPENSE, TRANSFER)
 * Shows user's categories + system defaults
 * User can create, edit, delete their own categories
 * System default categories are read-only
 */
export default function CategoriesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch all categories using React Query
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getAll(),
  });

  // Mutation for deleting category
  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  // Handle delete with confirmation
  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Bạn có chắc muốn xóa danh mục "${name}"?`)) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err: any) {
        alert(err.response?.data?.message || 'Không thể xóa danh mục');
      }
    }
  };

  // Group categories by type
  const incomeCategories = categories?.filter(c => c.type === 'INCOME') || [];
  const expenseCategories = categories?.filter(c => c.type === 'EXPENSE') || [];
  const transferCategories = categories?.filter(c => c.type === 'TRANSFER') || [];

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

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-red-600 font-medium">Lỗi khi tải danh mục</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!categories || categories.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">📁 Danh mục</h1>
            <Link
              href="/categories/new"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-medium shadow-lg hover:shadow-xl transition-all"
            >
              + Tạo danh mục mới
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Chưa có danh mục nào
            </h3>
            <p className="text-gray-500 mb-6">
              Tạo danh mục để phân loại giao dịch thu/chi của bạn
            </p>
            <Link
              href="/categories/new"
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-medium"
            >
              Tạo danh mục đầu tiên
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              📁 Danh mục
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý danh mục thu nhập, chi tiêu và chuyển tiền
            </p>
          </div>
          <Link
            href="/categories/new"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            <span>Tạo danh mục mới</span>
          </Link>
        </div>

        {/* INCOME Categories */}
        {incomeCategories.length > 0 && (
          <CategorySection
            title="💰 Thu nhập"
            categories={incomeCategories}
            onDelete={handleDelete}
            color="green"
          />
        )}

        {/* EXPENSE Categories */}
        {expenseCategories.length > 0 && (
          <CategorySection
            title="💸 Chi tiêu"
            categories={expenseCategories}
            onDelete={handleDelete}
            color="red"
          />
        )}

        {/* TRANSFER Categories */}
        {transferCategories.length > 0 && (
          <CategorySection
            title="🔄 Chuyển tiền"
            categories={transferCategories}
            onDelete={handleDelete}
            color="purple"
          />
        )}
      </div>
    </div>
  );
}

/**
 * Category Section Component
 * Displays a group of categories with a title
 */
function CategorySection({
  title,
  categories,
  onDelete,
  color,
}: {
  title: string;
  categories: Category[];
  onDelete: (id: string, name: string) => void;
  color: 'green' | 'red' | 'purple';
}) {
  const colorClasses = {
    green: 'bg-green-100 text-green-800 border-green-200',
    red: 'bg-red-100 text-red-800 border-red-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
        {title}
        <span className="text-sm font-normal text-gray-500">
          ({categories.length})
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => {
          const isSystemDefault = !category.userId || category.isDefault;

          return (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-5 border border-gray-200"
            >
              {/* Icon and Name */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  {/* Icon with color background */}
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl shadow-sm"
                    style={{
                      backgroundColor: category.color || '#6B7280',
                      color: 'white',
                    }}
                  >
                    {category.icon || '📁'}
                  </div>

                  {/* Name and Type */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {category.name}
                    </h3>
                    {isSystemDefault && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                        🔒 Mặc định
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Color preview */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-gray-500">Màu:</span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded border-2 border-gray-300"
                    style={{ backgroundColor: category.color || '#6B7280' }}
                  />
                  <span className="text-xs font-mono text-gray-600">
                    {category.color || '#6B7280'}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              {!isSystemDefault && (
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <Link
                    href={`/categories/${category.id}`}
                    className="flex-1 text-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium text-sm transition-colors"
                  >
                    ✏️ Sửa
                  </Link>
                  <button
                    onClick={() => onDelete(category.id, category.name)}
                    className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium text-sm transition-colors"
                  >
                    🗑️ Xóa
                  </button>
                </div>
              )}

              {/* Read-only message for system defaults */}
              {isSystemDefault && (
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 text-center">
                    Danh mục hệ thống không thể chỉnh sửa
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
