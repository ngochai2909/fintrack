'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCopilotReadable, useCopilotAction } from '@copilotkit/react-core';
import { transactionsService } from '@/services/transactions.service';
import { walletsService } from '@/services/wallets.service';
import { categoriesService } from '@/services/categories.service';
import { CreateTransactionDto, UpdateTransactionDto } from '@/types/transaction';
import { CreateWalletDto, UpdateWalletDto } from '@/types/wallet';
import { CreateCategoryDto, UpdateCategoryDto } from '@/types/category';
import { TransactionType } from '@/types/category';

/**
 * Global CopilotKit Actions Hook
 * 
 * Provides ALL AI actions available across the entire app:
 * - Transaction actions: create, update, delete
 * - Wallet actions: create, update, delete
 * - Category actions: create, update, delete
 * 
 * This hook should be used at the root layout level via CopilotActionsProvider.
 */
export function useFinTrackActions() {
  const queryClient = useQueryClient();

  // ═══════════════════════════════════════════════════════════════
  // FETCH DATA GLOBALLY
  // ═══════════════════════════════════════════════════════════════

  const { data: wallets } = useQuery({
    queryKey: ['wallets'],
    queryFn: () => walletsService.getAll(),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getAll(),
  });

  const { data: transactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionsService.getAll(),
  });

  // ═══════════════════════════════════════════════════════════════
  // MUTATIONS
  // ═══════════════════════════════════════════════════════════════

  // Transaction mutations
  const createTransactionMutation = useMutation({
    mutationFn: (data: CreateTransactionDto) => transactionsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTransactionDto }) =>
      transactionsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: (id: string) => transactionsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  // Wallet mutations
  const createWalletMutation = useMutation({
    mutationFn: (data: CreateWalletDto) => walletsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const updateWalletMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWalletDto }) =>
      walletsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const deleteWalletMutation = useMutation({
    mutationFn: (id: string) => walletsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  // Category mutations
  const createCategoryMutation = useMutation({
    mutationFn: (data: CreateCategoryDto) => categoriesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) =>
      categoriesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => categoriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  // ═══════════════════════════════════════════════════════════════
  // EXPOSE DATA TO AI (READ-ONLY)
  // ═══════════════════════════════════════════════════════════════

  useCopilotReadable({
    description: 'Danh sách ví (READ-ONLY) - các ví: ' + 
      (wallets?.map(w => `${w.name} (id: ${w.id})`).join(', ') || 'chưa có ví'),
    value: wallets?.map(w => ({ id: w.id, name: w.name, balance: w.balance, currency: w.currency })) || [],
  });

  useCopilotReadable({
    description: 'Danh sách danh mục (READ-ONLY) - mỗi danh mục có: id, name, type (INCOME/EXPENSE/TRANSFER), icon, color',
    value: categories?.map(c => ({ id: c.id, name: c.name, type: c.type, icon: c.icon, color: c.color })) || [],
  });

  useCopilotReadable({
    description: 'Danh sách giao dịch (READ-ONLY) - để tìm giao dịch cần sửa/xóa',
    value: transactions?.map(t => ({
      id: t.id,
      amount: t.amount,
      type: t.type,
      description: t.description,
      date: t.date,
      walletName: t.wallet?.name,
      categoryName: t.category?.name,
    })) || [],
  });

  // ═══════════════════════════════════════════════════════════════
  // 🤖 COPILOT ACTIONS - TRANSACTIONS
  // ═══════════════════════════════════════════════════════════════

  useCopilotAction({
    name: 'createTransaction',
    description: `Tạo giao dịch thu/chi mới.

KHI NÀO GỌI: User muốn "ghi", "tạo", "thêm" giao dịch

INPUT:
- type: "INCOME" hoặc "EXPENSE"
- amount: số tiền VND
- walletName: tên ví
- categoryName: tên danh mục
- description: mô tả (optional)`,

    parameters: [
      { name: 'type', type: 'string', description: 'INCOME hoặc EXPENSE', required: true },
      { name: 'amount', type: 'number', description: 'Số tiền (VND)', required: true },
      { name: 'walletName', type: 'string', description: 'Tên ví', required: true },
      { name: 'categoryName', type: 'string', description: 'Tên danh mục', required: true },
      { name: 'description', type: 'string', description: 'Mô tả', required: false },
      { name: 'note', type: 'string', description: 'Ghi chú', required: false },
    ],
    handler: async ({ type, amount, walletName, categoryName, description, note }) => {
      try {
        const wallet = wallets?.find(w => 
          w.name.toLowerCase().includes(walletName.toLowerCase()) ||
          walletName.toLowerCase().includes(w.name.toLowerCase())
        );
        
        if (!wallet) {
          return { success: false, message: `❌ Không tìm thấy ví "${walletName}". Các ví: ${wallets?.map(w => w.name).join(', ')}` };
        }

        const category = categories?.find(c => 
          c.type === type &&
          (c.name.toLowerCase().includes(categoryName.toLowerCase()) ||
           categoryName.toLowerCase().includes(c.name.toLowerCase()))
        );
        
        if (!category) {
          return { success: false, message: `❌ Không tìm thấy danh mục "${categoryName}" cho ${type}. Các danh mục: ${categories?.filter(c => c.type === type).map(c => c.name).join(', ')}` };
        }

        await createTransactionMutation.mutateAsync({
          type: type as TransactionType,
          amount,
          walletId: wallet.id,
          categoryId: category.id,
          description,
          note,
          date: new Date().toISOString(),
        });
        
        return { success: true, message: `✅ Tạo giao dịch thành công: ${amount.toLocaleString('vi-VN')}₫ vào ${wallet.name}` };
      } catch (error: any) {
        return { success: false, message: `❌ Lỗi: ${error.message}` };
      }
    },
  });

  useCopilotAction({
    name: 'updateTransaction',
    description: `Sửa giao dịch đã có.

KHI NÀO GỌI: User muốn "sửa", "chỉnh", "cập nhật" giao dịch

INPUT:
- transactionId: ID giao dịch (tìm trong transactions readable)
- amount: số tiền mới (optional)
- description: mô tả mới (optional)
- Các field khác cũng optional`,

    parameters: [
      { name: 'transactionId', type: 'string', description: 'ID giao dịch cần sửa', required: true },
      { name: 'amount', type: 'number', description: 'Số tiền mới', required: false },
      { name: 'type', type: 'string', description: 'Loại mới (INCOME/EXPENSE)', required: false },
      { name: 'description', type: 'string', description: 'Mô tả mới', required: false },
      { name: 'note', type: 'string', description: 'Ghi chú mới', required: false },
      { name: 'walletName', type: 'string', description: 'Tên ví mới', required: false },
      { name: 'categoryName', type: 'string', description: 'Danh mục mới', required: false },
    ],
    handler: async ({ transactionId, amount, type, description, note, walletName, categoryName }) => {
      try {
        const updateData: UpdateTransactionDto = {};
        
        if (amount !== undefined) updateData.amount = amount;
        if (type) updateData.type = type as TransactionType;
        if (description !== undefined) updateData.description = description;
        if (note !== undefined) updateData.note = note;
        
        if (walletName) {
          const wallet = wallets?.find(w => w.name.toLowerCase().includes(walletName.toLowerCase()));
          if (wallet) updateData.walletId = wallet.id;
        }
        
        if (categoryName && type) {
          const category = categories?.find(c => 
            c.type === type && c.name.toLowerCase().includes(categoryName.toLowerCase())
          );
          if (category) updateData.categoryId = category.id;
        }

        await updateTransactionMutation.mutateAsync({ id: transactionId, data: updateData });
        
        return { success: true, message: `✅ Đã cập nhật giao dịch` };
      } catch (error: any) {
        return { success: false, message: `❌ Lỗi: ${error.message}` };
      }
    },
  });

  useCopilotAction({
    name: 'deleteTransaction',
    description: `Xóa giao dịch.

KHI NÀO GỌI: User muốn "xóa", "hủy" giao dịch

INPUT:
- transactionId: ID giao dịch (tìm trong transactions readable)`,

    parameters: [
      { name: 'transactionId', type: 'string', description: 'ID giao dịch cần xóa', required: true },
    ],
    handler: async ({ transactionId }) => {
      try {
        await deleteTransactionMutation.mutateAsync(transactionId);
        return { success: true, message: `✅ Đã xóa giao dịch` };
      } catch (error: any) {
        return { success: false, message: `❌ Lỗi: ${error.message}` };
      }
    },
  });

  // ═══════════════════════════════════════════════════════════════
  // 🤖 COPILOT ACTIONS - WALLETS
  // ═══════════════════════════════════════════════════════════════

  useCopilotAction({
    name: 'createWallet',
    description: `Tạo ví mới.

KHI NÀO GỌI: User muốn "tạo ví", "thêm ví"

INPUT:
- name: tên ví (vd: "Ngân hàng VCB", "Ví tiền mặt")
- balance: số dư ban đầu (optional, mặc định 0)
- currency: đơn vị tiền tệ (optional, mặc định "VND")`,

    parameters: [
      { name: 'name', type: 'string', description: 'Tên ví', required: true },
      { name: 'balance', type: 'number', description: 'Số dư ban đầu', required: false },
      { name: 'currency', type: 'string', description: 'Đơn vị (VND, USD...)', required: false },
    ],
    handler: async ({ name, balance, currency }) => {
      try {
        await createWalletMutation.mutateAsync({ name, balance, currency });
        return { success: true, message: `✅ Đã tạo ví "${name}"` };
      } catch (error: any) {
        return { success: false, message: `❌ Lỗi: ${error.message}` };
      }
    },
  });

  useCopilotAction({
    name: 'updateWallet',
    description: `Sửa thông tin ví.

KHI NÀO GỌI: User muốn "đổi tên ví", "sửa số dư"

INPUT:
- walletId: ID ví (tìm trong wallets readable)
- name: tên mới (optional)
- balance: số dư mới (optional)`,

    parameters: [
      { name: 'walletId', type: 'string', description: 'ID ví cần sửa', required: true },
      { name: 'name', type: 'string', description: 'Tên mới', required: false },
      { name: 'balance', type: 'number', description: 'Số dư mới', required: false },
      { name: 'currency', type: 'string', description: 'Đơn vị mới', required: false },
    ],
    handler: async ({ walletId, name, balance, currency }) => {
      try {
        const updateData: UpdateWalletDto = {};
        if (name) updateData.name = name;
        if (balance !== undefined) updateData.balance = balance;
        if (currency) updateData.currency = currency;

        await updateWalletMutation.mutateAsync({ id: walletId, data: updateData });
        return { success: true, message: `✅ Đã cập nhật ví` };
      } catch (error: any) {
        return { success: false, message: `❌ Lỗi: ${error.message}` };
      }
    },
  });

  useCopilotAction({
    name: 'deleteWallet',
    description: `Xóa ví.

CẢNH BÁO: Sẽ xóa tất cả giao dịch liên quan!

KHI NÀO GỌI: User muốn "xóa ví" và đã xác nhận`,

    parameters: [
      { name: 'walletId', type: 'string', description: 'ID ví cần xóa', required: true },
    ],
    handler: async ({ walletId }) => {
      try {
        await deleteWalletMutation.mutateAsync(walletId);
        return { success: true, message: `✅ Đã xóa ví` };
      } catch (error: any) {
        return { success: false, message: `❌ Lỗi: ${error.message}` };
      }
    },
  });

  // ═══════════════════════════════════════════════════════════════
  // 🤖 COPILOT ACTIONS - CATEGORIES
  // ═══════════════════════════════════════════════════════════════

  useCopilotAction({
    name: 'createCategory',
    description: `Tạo danh mục mới.

KHI NÀO GỌI: User muốn "tạo danh mục", "thêm danh mục"

INPUT:
- name: tên danh mục
- type: loại (INCOME/EXPENSE)
- icon: emoji icon (optional, vd: "🍔", "💰")
- color: mã màu hex (optional, vd: "#FF5733")`,

    parameters: [
      { name: 'name', type: 'string', description: 'Tên danh mục', required: true },
      { name: 'type', type: 'string', description: 'INCOME hoặc EXPENSE', required: true },
      { name: 'icon', type: 'string', description: 'Emoji icon', required: false },
      { name: 'color', type: 'string', description: 'Mã màu hex', required: false },
    ],
    handler: async ({ name, type, icon, color }) => {
      try {
        await createCategoryMutation.mutateAsync({ name, type: type as TransactionType, icon, color });
        return { success: true, message: `✅ Đã tạo danh mục "${name}"` };
      } catch (error: any) {
        return { success: false, message: `❌ Lỗi: ${error.message}` };
      }
    },
  });

  useCopilotAction({
    name: 'updateCategory',
    description: `Sửa danh mục.

KHI NÀO GỌI: User muốn "đổi tên danh mục", "sửa icon"

INPUT:
- categoryId: ID danh mục (tìm trong categories readable)
- Các field khác optional`,

    parameters: [
      { name: 'categoryId', type: 'string', description: 'ID danh mục', required: true },
      { name: 'name', type: 'string', description: 'Tên mới', required: false },
      { name: 'icon', type: 'string', description: 'Icon mới', required: false },
      { name: 'color', type: 'string', description: 'Màu mới', required: false },
    ],
    handler: async ({ categoryId, name, icon, color }) => {
      try {
        const updateData: UpdateCategoryDto = {};
        if (name) updateData.name = name;
        if (icon) updateData.icon = icon;
        if (color) updateData.color = color;

        await updateCategoryMutation.mutateAsync({ id: categoryId, data: updateData });
        return { success: true, message: `✅ Đã cập nhật danh mục` };
      } catch (error: any) {
        return { success: false, message: `❌ Lỗi: ${error.message}` };
      }
    },
  });

  useCopilotAction({
    name: 'deleteCategory',
    description: `Xóa danh mục.

CẢNH BÁO: Có thể ảnh hưởng đến giao dịch liên quan!

KHI NÀO GỌI: User muốn "xóa danh mục" và đã xác nhận`,

    parameters: [
      { name: 'categoryId', type: 'string', description: 'ID danh mục cần xóa', required: true },
    ],
    handler: async ({ categoryId }) => {
      try {
        await deleteCategoryMutation.mutateAsync(categoryId);
        return { success: true, message: `✅ Đã xóa danh mục` };
      } catch (error: any) {
        return { success: false, message: `❌ Lỗi: ${error.message}` };
      }
    },
  });
}
