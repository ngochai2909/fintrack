'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesService } from '@/services/categories.service';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/**
 * CATEGORIES LIST PAGE
 * 
 * PATTERN: Similar to wallets/page.tsx
 * 
 * FEATURES:
 * 1. Display all categories (user's + system defaults)
 * 2. Grouped by type (INCOME, EXPENSE, TRANSFER)
 * 3. Show system defaults differently (read-only badge)
 * 4. Edit/Delete buttons (only for user's categories)
 * 5. "Create New Category" button
 * 
 * REACT QUERY:
 * - useQuery for fetching categories
 * - useMutation for deleting
 * 
 * TODO: Implement the page
 */
export default function CategoriesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // TODO: Use useQuery to fetch categories
  // queryKey: ['categories']
  // queryFn: categoriesService.getAll
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getAll(),
  });

  // TODO: Use useMutation for delete
  // mutationFn: categoriesService.delete
  // onSuccess: invalidate 'categories' query
  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  // TODO: Implement handleDelete function
  const handleDelete = async (id: string, name: string) => {
    // Show confirmation
    // Call deleteMutation.mutate(id)
    throw new Error('Not implemented');
  };

  // TODO: Implement grouping logic
  // Group categories by type: INCOME, EXPENSE, TRANSFER
  // const incomeCategories = categories?.filter(c => c.type === 'INCOME') || [];
  // const expenseCategories = categories?.filter(c => c.type === 'EXPENSE') || [];
  // const transferCategories = categories?.filter(c => c.type === 'TRANSFER') || [];

  if (isLoading) {
    return <div className="p-6">Loading categories...</div>;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Danh mục</h1>
        <Link
          href="/categories/new"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          + Tạo danh mục mới
        </Link>
      </div>

      {/* TODO: Implement category groups */}
      {/* 
        STRUCTURE:
        - Section for INCOME categories
        - Section for EXPENSE categories
        - Section for TRANSFER categories (if any)
        
        Each category card should show:
        - Icon + Color
        - Name
        - Type badge
        - "System Default" badge (if isDefault or userId === null)
        - Edit button (only if userId !== null)
        - Delete button (only if userId !== null)
      */}

      <div className="text-center text-gray-500 mt-8">
        TODO: Implement category groups display
      </div>
    </div>
  );
}
