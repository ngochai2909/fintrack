# 🚀 REACT QUERY MIGRATION - SUMMARY

## 📊 TỔNG QUAN

Đã migrate toàn bộ Wallets CRUD từ **vanilla React** sang **React Query (TanStack Query v5)**.

---

## 📦 CÀI ĐẶT

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

**Packages đã cài:**
- `@tanstack/react-query` - Core library
- `@tanstack/react-query-devtools` - DevTools để debug

---

## 📁 FILES ĐÃ TẠO/SỬA

### **Files mới:**
1. `src/providers/query-provider.tsx` - QueryClient Provider

### **Files đã refactor:**
1. `src/app/layout.tsx` - Wrap app với QueryProvider
2. `src/app/(dashboard)/wallets/page.tsx` - List Page
3. `src/app/(dashboard)/wallets/new/page.tsx` - Create Page
4. `src/app/(dashboard)/wallets/[id]/page.tsx` - Edit Page

---

## 🔄 SO SÁNH BEFORE vs AFTER

### **1. LIST PAGE - Fetch Data**

#### ❌ BEFORE (Vanilla React):
```typescript
const [wallets, setWallets] = useState<Wallet[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

useEffect(() => {
  fetchWallets()
}, [])

const fetchWallets = async () => {
  setLoading(true)
  try {
    const data = await walletsService.getAll()
    setWallets(data)
    setError(null)
  } catch (err) {
    console.error('Error:', err)
    setError(error.message)
  } finally {
    setLoading(false)
  }
}

// ~35 dòng code
```

#### ✅ AFTER (React Query):
```typescript
const { data: wallets = [], isLoading, error } = useQuery({
  queryKey: ['wallets'],
  queryFn: walletsService.getAll,
})

// 4 dòng code! Giảm 90%!
```

**Lợi ích:**
- ✅ Giảm 35 dòng → 4 dòng (90% code)
- ✅ Tự động cache
- ✅ Không cần useState, useEffect
- ✅ Loading & error states tự động

---

### **2. LIST PAGE - Delete Mutation**

#### ❌ BEFORE:
```typescript
const handleDelete = async (id: string, name: string) => {
  if (!confirm(`Xóa "${name}"?`)) return

  try {
    await walletsService.delete(id)
    setWallets(wallets.filter((w) => w.id !== id))
    alert('Xóa thành công!')
  } catch (err) {
    alert('Lỗi: ' + err.message)
  }
}

// ~13 dòng, phải manual update state
```

#### ✅ AFTER:
```typescript
const deleteMutation = useMutation({
  mutationFn: (id: string) => walletsService.delete(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['wallets'] })
    alert('Xóa thành công!')
  },
  onError: (error) => alert('Lỗi: ' + error.message)
})

const handleDelete = (id: string, name: string) => {
  if (confirm(`Xóa "${name}"?`)) {
    deleteMutation.mutate(id)
  }
}

// ~13 dòng, nhưng tự động refetch data!
```

**Lợi ích:**
- ✅ Không cần manual filter state
- ✅ Tự động refetch data mới nhất
- ✅ Loading state: `deleteMutation.isPending`

---

### **3. CREATE PAGE**

#### ❌ BEFORE:
```typescript
const [loading, setLoading] = useState(false)
const [error, setError] = useState<string | null>(null)

const handleSubmit = async (e) => {
  e.preventDefault()
  
  try {
    setLoading(true)
    setError(null)
    await walletsService.create(formData)
    alert('Tạo thành công!')
    router.push('/wallets')
  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}

// ~20 dòng
```

#### ✅ AFTER:
```typescript
const createMutation = useMutation({
  mutationFn: (data: CreateWalletDto) => walletsService.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['wallets'] })
    alert('Tạo thành công!')
    router.push('/wallets')
  },
  onError: (error) => setError(error.message)
})

const handleSubmit = (e) => {
  e.preventDefault()
  createMutation.mutate(formData)
}

// ~15 dòng
```

**Lợi ích:**
- ✅ Loading state: `createMutation.isPending`
- ✅ Tự động invalidate cache
- ✅ Danh sách tự động update

---

### **4. EDIT PAGE - Fetch & Update**

#### ❌ BEFORE:
```typescript
const [wallet, setWallet] = useState<Wallet | null>(null)
const [loading, setLoading] = useState(true)
const [submitting, setSubmitting] = useState(false)
const [error, setError] = useState<string | null>(null)

useEffect(() => {
  const fetchWallet = async () => {
    try {
      setLoading(true)
      const data = await walletsService.getById(walletId)
      setWallet(data)
      setFormData({
        name: data.name,
        balance: data.balance,
        currency: data.currency
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  fetchWallet()
}, [walletId])

const handleSubmit = async (e) => {
  e.preventDefault()
  
  try {
    setSubmitting(true)
    await walletsService.update(walletId, formData)
    alert('Cập nhật thành công!')
    router.push('/wallets')
  } catch (err) {
    setError(err.message)
  } finally {
    setSubmitting(false)
  }
}

// ~40 dòng
```

#### ✅ AFTER:
```typescript
const { data: wallet, isLoading, error } = useQuery({
  queryKey: ['wallet', walletId],
  queryFn: () => walletsService.getById(walletId),
  enabled: !!walletId,
})

const updateMutation = useMutation({
  mutationFn: (data: UpdateWalletDto) => 
    walletsService.update(walletId, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['wallets'] })
    queryClient.invalidateQueries({ queryKey: ['wallet', walletId] })
    alert('Cập nhật thành công!')
    router.push('/wallets')
  },
  onError: (error) => setError(error.message)
})

const handleSubmit = (e) => {
  e.preventDefault()
  updateMutation.mutate(formData)
}

// ~22 dòng
```

**Lợi ích:**
- ✅ Giảm 40 dòng → 22 dòng (45%)
- ✅ 2 loading states: `isLoading`, `updateMutation.isPending`
- ✅ Tự động cache wallet detail
- ✅ Invalidate cả list và detail

---

## 📊 THỐNG KÊ GIẢM CODE

| File | Before | After | Giảm |
|------|--------|-------|------|
| List Page | ~75 dòng | ~50 dòng | 33% |
| Create Page | ~90 dòng | ~75 dòng | 17% |
| Edit Page | ~110 dòng | ~85 dòng | 23% |
| **TỔNG** | **~275 dòng** | **~210 dòng** | **24%** |

**Giảm 65 dòng code tổng cộng!**

---

## 🎯 LỢI ÍCH CHÍNH

### **1. Ít Code Hơn**
- ❌ Không cần `useState` cho data, loading, error
- ❌ Không cần `useEffect` để fetch
- ❌ Không cần try-catch-finally
- ❌ Không cần manual setState

### **2. Tự Động Cache**
```typescript
// Lần 1: Fetch từ API
const { data } = useQuery({ queryKey: ['wallets'], ... })

// Lần 2: Lấy từ cache (instant!)
const { data } = useQuery({ queryKey: ['wallets'], ... })

// Cache valid trong 1 phút (staleTime: 60000)
```

### **3. Tự Động Refetch**
```typescript
// Sau khi create/update/delete
queryClient.invalidateQueries({ queryKey: ['wallets'] })
// → Tự động refetch danh sách mới!
```

### **4. Loading States Tốt Hơn**
```typescript
// Fetch data
isLoading     // Lần đầu fetch
isFetching    // Đang fetch (có thể có data cũ)
isRefetching  // Đang refetch

// Mutations
isPending     // Đang submit
isSuccess     // Submit thành công
isError       // Submit lỗi
```

### **5. DevTools**
```typescript
// Mở app → Press F12 → Tab "React Query"
// Xem được:
- Tất cả queries đang active
- Cache data
- Loading states
- Refetch manually
```

### **6. Optimistic Updates** (Nâng cao)
```typescript
// Cập nhật UI trước, gọi API sau
useMutation({
  mutationFn: updateWallet,
  onMutate: async (newData) => {
    // Cancel refetch đang chạy
    await queryClient.cancelQueries({ queryKey: ['wallets'] })
    
    // Lưu data cũ
    const previousData = queryClient.getQueryData(['wallets'])
    
    // Cập nhật cache ngay lập tức
    queryClient.setQueryData(['wallets'], (old) => 
      old.map(w => w.id === newData.id ? newData : w)
    )
    
    return { previousData }
  },
  onError: (err, newData, context) => {
    // Rollback nếu lỗi
    queryClient.setQueryData(['wallets'], context.previousData)
  }
})
```

---

## 🎨 REACT QUERY DEVTOOLS

**Đã cài sẵn! Cách dùng:**

1. Chạy app: `npm run dev`
2. Mở browser DevTools (F12)
3. Tìm tab "React Query" (góc dưới bên phải)
4. Xem được:
   - ✅ Tất cả queries đang cache
   - ✅ Loading states
   - ✅ Data trong cache
   - ✅ Refetch manually

---

## 📚 TÀI LIỆU THAM KHẢO

**Official Docs:**
- 📖 https://tanstack.com/query/latest
- 📖 https://tanstack.com/query/latest/docs/react/guides/queries
- 📖 https://tanstack.com/query/latest/docs/react/guides/mutations

**Video Tutorials:**
- 🎥 "React Query in 100 Seconds" - Fireship
- 🎥 "React Query Tutorial" - Codevolution

**Key Concepts:**
- `useQuery` - Fetch & cache data
- `useMutation` - Create/Update/Delete
- `queryClient.invalidateQueries()` - Refetch data
- `queryKey` - Unique identifier cho cache

---

## 🧪 TEST CHECKLIST

### **✅ Test Cache:**
1. Mở List page → Data load
2. Navigate to Create page
3. Back to List page → **Data instant (from cache)**
4. Wait 1 minute → Data refetch tự động

### **✅ Test Mutations:**
1. Create wallet → List tự động update
2. Edit wallet → List tự động update  
3. Delete wallet → List tự động update

### **✅ Test DevTools:**
1. F12 → React Query tab
2. Xem queries cache
3. Click "Refetch" → Data update
4. Xem loading states

---

## 🎯 NEXT STEPS

### **Áp dụng cho features khác:**
```
✅ Wallets - DONE!
🔨 Categories - Next
🔨 Transactions - Next
🔨 Dashboard - Next
```

### **Advanced Features:**
- Optimistic Updates
- Infinite Queries (Pagination)
- Prefetching
- Dependent Queries

---

## 💡 TIPS & TRICKS

### **1. QueryKey Naming:**
```typescript
// ✅ Good
['wallets']
['wallet', walletId]
['categories']
['transactions', { month: 1, year: 2024 }]

// ❌ Bad
['getWallets']
['walletDetail']
```

### **2. Invalidate Patterns:**
```typescript
// Invalidate tất cả wallets queries
queryClient.invalidateQueries({ queryKey: ['wallets'] })

// Invalidate specific wallet
queryClient.invalidateQueries({ queryKey: ['wallet', id] })

// Invalidate tất cả
queryClient.invalidateQueries()
```

### **3. Error Handling:**
```typescript
const { data, error, isError } = useQuery({
  queryKey: ['wallets'],
  queryFn: walletsService.getAll,
  retry: 1, // Retry 1 lần nếu lỗi
  onError: (error) => {
    console.error('Error:', error)
    toast.error('Failed to fetch wallets')
  }
})
```

---

## 🎉 HOÀN THÀNH!

**Đã migrate thành công toàn bộ Wallets CRUD sang React Query!**

**Benefits:**
- ✅ Code giảm 24%
- ✅ Tự động cache
- ✅ Tự động refetch
- ✅ Better loading states
- ✅ DevTools support

**Giờ app chạy nhanh hơn, code ít hơn, dễ maintain hơn!** 🚀
