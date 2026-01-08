# 🎓 HƯỚNG DẪN IMPLEMENT WALLETS FRONTEND

## 📋 Tổng Quan

Bạn cần implement 4 files với các TODO đã được đánh dấu:

1. **services/wallets.service.ts** - API Layer (5 functions)
2. **app/(dashboard)/wallets/page.tsx** - List Page (4 TODOs)
3. **app/(dashboard)/wallets/new/page.tsx** - Create Page (4 TODOs)
4. **app/(dashboard)/wallets/[id]/page.tsx** - Edit Page (4 TODOs)

---

## 🎯 STEP 1: IMPLEMENT SERVICE LAYER

**File: `src/services/wallets.service.ts`**

### 📌 TODO 1: `getAll()` - Lấy danh sách wallets

```typescript
async getAll(): Promise<Wallet[]> {
  return axiosInstance.get<Wallet[]>('/wallets') as unknown as Promise<Wallet[]>
}
```

**Giải thích:**
- `axiosInstance.get()` - Gọi GET request
- `/wallets` - Endpoint (baseURL đã có trong axios config)
- `as unknown as Promise<Wallet[]>` - Type casting vì axios interceptor

---

### 📌 TODO 2: `getById()` - Lấy 1 wallet theo ID

```typescript
async getById(id: string): Promise<Wallet> {
  return axiosInstance.get<Wallet>(`/wallets/${id}`) as unknown as Promise<Wallet>
}
```

**Giải thích:**
- Template string để insert `id` vào URL
- `/wallets/${id}` → `/wallets/abc-123`

---

### 📌 TODO 3: `create()` - Tạo wallet mới

```typescript
async create(data: CreateWalletDto): Promise<Wallet> {
  return axiosInstance.post<Wallet>('/wallets', data) as unknown as Promise<Wallet>
}
```

**Giải thích:**
- `post(url, data)` - POST request với body
- `data` - Object chứa name, balance, currency

---

### 📌 TODO 4: `update()` - Cập nhật wallet

```typescript
async update(id: string, data: UpdateWalletDto): Promise<Wallet> {
  return axiosInstance.patch<Wallet>(`/wallets/${id}`, data) as unknown as Promise<Wallet>
}
```

**Giải thích:**
- `patch()` - PATCH request (partial update)
- Cần cả `id` và `data`

---

### 📌 TODO 5: `delete()` - Xóa wallet

```typescript
async delete(id: string): Promise<void> {
  return axiosInstance.delete<void>(`/wallets/${id}`) as unknown as Promise<void>
}
```

**Giải thích:**
- `delete()` - DELETE request
- Return void (không có response body)

---

## 🎯 STEP 2: IMPLEMENT LIST PAGE

**File: `src/app/(dashboard)/wallets/page.tsx`**

### 📌 TODO 1: `fetchWallets()` - Fetch data từ API

```typescript
const fetchWallets = async () => {
  try {
    setLoading(true)
    setError(null)
    const data = await walletsService.getAll()
    setWallets(data)
  } catch (err) {
    console.error('❌ Error:', err)
    const error = err as { response?: { data?: { message?: string } } }
    setError(error.response?.data?.message || 'Failed to fetch wallets')
  } finally {
    setLoading(false)
  }
}
```

**Giải thích:**
- `try-catch-finally` pattern
- `setLoading(true)` trước khi call API
- `setWallets(data)` sau khi có data
- `setError()` nếu có lỗi
- `setLoading(false)` trong finally (luôn chạy)

---

### 📌 TODO 2: `handleDelete()` - Xóa wallet

```typescript
const handleDelete = async (id: string, name: string) => {
  // Confirm trước khi xóa
  if (!confirm(`Bạn có chắc muốn xóa ví "${name}"?`)) {
    return
  }

  try {
    await walletsService.delete(id)
    
    // Remove khỏi state (không cần fetch lại)
    setWallets(wallets.filter((w) => w.id !== id))
    
    alert('✅ Xóa ví thành công!')
  } catch (err) {
    console.error('❌ Error:', err)
    const error = err as { response?: { data?: { message?: string } } }
    alert(error.response?.data?.message || 'Failed to delete wallet')
  }
}
```

**Giải thích:**
- `confirm()` - Dialog xác nhận
- `filter()` - Remove item khỏi array
- Không cần `setLoading` vì action nhanh

---

### 📌 TODO 3: Empty State

```typescript
{!loading && wallets.length === 0 && (
  <div className='text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300'>
    <h3 className='text-lg font-medium text-gray-900'>
      Chưa có ví nào
    </h3>
    <p className='text-gray-600 mt-2'>
      Bắt đầu bằng cách tạo ví đầu tiên của bạn.
    </p>
    <Link
      href='/wallets/new'
      className='mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg'
    >
      Tạo Ví Đầu Tiên
    </Link>
  </div>
)}
```

---

### 📌 TODO 4: Render Wallets với Edit/Delete

```typescript
{wallets.map((wallet) => (
  <div
    key={wallet.id}
    className='bg-white rounded-lg shadow-md p-6'
  >
    {/* Header với Edit/Delete buttons */}
    <div className='flex justify-between items-start mb-4'>
      <h3 className='text-xl font-bold'>{wallet.name}</h3>
      <div className='flex gap-2'>
        {/* Edit Button */}
        <Link
          href={`/wallets/${wallet.id}`}
          className='text-blue-600 hover:text-blue-800 p-2'
        >
          ✏️
        </Link>
        
        {/* Delete Button */}
        <button
          onClick={() => handleDelete(wallet.id, wallet.name)}
          className='text-red-600 hover:text-red-800 p-2'
        >
          🗑️
        </button>
      </div>
    </div>

    {/* Balance */}
    <p className='text-2xl font-bold text-blue-600'>
      {wallet.balance} {wallet.currency}
    </p>

    {/* Metadata */}
    <p className='text-sm text-gray-500 mt-2'>
      Tạo: {new Date(wallet.createdAt).toLocaleDateString('vi-VN')}
    </p>
  </div>
))}
```

---

## 🎯 STEP 3: IMPLEMENT CREATE PAGE

**File: `src/app/(dashboard)/wallets/new/page.tsx`**

### 📌 TODO 2: `handleChange()` - Xử lý input change

```typescript
const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target

  setFormData((prev) => ({
    ...prev,
    [name]: name === 'balance' ? parseFloat(value) || 0 : value
  }))
}
```

**Giải thích:**
- Destructure `name` và `value` từ event
- Spread operator `...prev` để giữ các field khác
- `[name]` - Computed property name
- Check `name === 'balance'` để convert sang number

---

### 📌 TODO 3: `handleSubmit()` - Submit form

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  // Validation
  if (!formData.name.trim()) {
    setError('Vui lòng nhập tên ví')
    return
  }

  try {
    setLoading(true)
    setError(null)

    await walletsService.create(formData)

    alert('✅ Tạo ví thành công!')
    router.push('/wallets')
  } catch (err) {
    console.error('❌ Error:', err)
    const error = err as { response?: { data?: { message?: string } } }
    setError(error.response?.data?.message || 'Failed to create wallet')
  } finally {
    setLoading(false)
  }
}
```

**Giải thích:**
- `e.preventDefault()` - Ngăn form submit mặc định
- Validate trước khi call API
- `router.push()` - Navigate về list page sau khi tạo xong

---

## 🎯 STEP 4: IMPLEMENT EDIT PAGE

**File: `src/app/(dashboard)/wallets/[id]/page.tsx`**

### 📌 TODO 1: `fetchWallet()` - Fetch wallet data

```typescript
const fetchWallet = async () => {
  try {
    setLoading(true)
    setError(null)
    
    const data = await walletsService.getById(walletId)
    
    setWallet(data)
    setFormData({
      name: data.name,
      balance: data.balance,
      currency: data.currency
    })
  } catch (err) {
    console.error('❌ Error:', err)
    const error = err as { response?: { data?: { message?: string } } }
    setError(error.response?.data?.message || 'Failed to fetch wallet')
  } finally {
    setLoading(false)
  }
}
```

**Giải thích:**
- Fetch data bằng `walletId` từ URL params
- Set cả `wallet` state (để hiển thị info) và `formData` (để edit)

---

### 📌 TODO 2 & 3: `handleChange()` và `handleSubmit()`

```typescript
// handleChange() - GIỐNG CREATE PAGE
const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target
  setFormData((prev) => ({
    ...prev,
    [name]: name === 'balance' ? parseFloat(value) || 0 : value
  }))
}

// handleSubmit() - Gần giống, nhưng dùng UPDATE thay vì CREATE
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!formData.name?.trim()) {
    setError('Vui lòng nhập tên ví')
    return
  }

  try {
    setSubmitting(true)
    setError(null)

    await walletsService.update(walletId, formData)

    alert('✅ Cập nhật ví thành công!')
    router.push('/wallets')
  } catch (err) {
    console.error('❌ Error:', err)
    const error = err as { response?: { data?: { message?: string } } }
    setError(error.response?.data?.message || 'Failed to update wallet')
  } finally {
    setSubmitting(false)
  }
}
```

---

## 🧪 TESTING CHECKLIST

Sau khi implement xong, test theo thứ tự:

### ✅ 1. Service Layer
```bash
# Mở browser DevTools → Console
# Gọi service trực tiếp (nếu cần debug)
```

### ✅ 2. List Page
- [ ] Navigate to `/wallets`
- [ ] Thấy loading spinner
- [ ] Thấy empty state (nếu chưa có data)
- [ ] Thấy danh sách wallets (nếu có data)

### ✅ 3. Create Page
- [ ] Click "Tạo Ví Mới"
- [ ] Điền form
- [ ] Submit → Redirect về `/wallets`
- [ ] Thấy ví mới trong list

### ✅ 4. Edit Page
- [ ] Click Edit (✏️) trên 1 wallet
- [ ] Thấy form pre-filled
- [ ] Thay đổi thông tin
- [ ] Submit → Redirect về `/wallets`
- [ ] Thấy thay đổi trong list

### ✅ 5. Delete
- [ ] Click Delete (🗑️) trên 1 wallet
- [ ] Confirm dialog
- [ ] Wallet biến mất khỏi list

---

## 💡 TIPS & TRICKS

### 🔍 Debugging
```typescript
// Thêm console.log để debug
console.log('📤 Request:', data)
console.log('✅ Response:', result)
console.log('❌ Error:', err)
```

### 🎨 Format Currency
```typescript
const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

// Sử dụng:
{formatCurrency(wallet.balance, wallet.currency)}
// → ₫1,000,000
```

### ⚡ Performance
```typescript
// Dùng useCallback nếu cần
const handleDelete = useCallback(async (id: string) => {
  // ...
}, [wallets])
```

---

## 🚨 COMMON ERRORS

### ❌ "Cannot read property of undefined"
```typescript
// ❌ Sai
wallet.name

// ✅ Đúng
wallet?.name
```

### ❌ "Type 'any' is not assignable"
```typescript
// ❌ Sai
catch (err: any)

// ✅ Đúng
catch (err)
const error = err as { response?: { data?: { message?: string } } }
```

### ❌ "Missing dependency in useEffect"
```typescript
// ❌ Sai - Function bên ngoài useEffect
const fetchData = async () => {}
useEffect(() => {
  fetchData()
}, []) // ⚠️ Warning

// ✅ Đúng - Function bên trong useEffect
useEffect(() => {
  const fetchData = async () => {}
  fetchData()
}, []) // ✅ OK
```

---

## 📚 THAM KHẢO

### Axios Instance
- File: `src/lib/axios.ts`
- Đã có: interceptors, auto-refresh token

### Auth Service Pattern
- File: `src/services/auth.service.ts`
- Pattern tương tự để implement wallets service

### React Hooks
- `useState` - Manage state
- `useEffect` - Side effects (fetch data)
- `useRouter` - Navigate
- `useParams` - Get URL params

---

## 🎯 NEXT STEPS

Sau khi hoàn thành Wallets:
1. Test toàn bộ flow
2. Add search/filter (optional)
3. Add pagination (optional)
4. Move to next feature (Transactions, Categories...)

---

**CHÚC BẠN CODE VUI VẺ! 🚀**

Hỏi tôi nếu gặp khó khăn ở bất kỳ bước nào!

