# 📁 CATEGORIES CRUD - IMPLEMENTATION GUIDE

**Date:** January 9, 2026 (Day 4)  
**Pattern:** Similar to Wallets CRUD  
**Estimated Time:** 8 hours

---

## 📋 OVERVIEW

Categories (Danh mục) quản lý các loại thu/chi của người dùng:
- **INCOME** (Thu nhập): Lương, thưởng, đầu tư...
- **EXPENSE** (Chi tiêu): Ăn uống, đi lại, mua sắm...
- **TRANSFER** (Chuyển tiền): Chuyển giữa các ví

**Key Features:**
- User's custom categories (userId !== null)
- System default categories (userId === null, isDefault === true)
- Cannot edit/delete system defaults
- Grouped by type

---

## 🗂️ FILE STRUCTURE

### ✅ Backend (NestJS)
```
apps/api/src/modules/categories/
├── dto/
│   ├── create-category.dto.ts  ✅ Created (needs implementation)
│   └── update-category.dto.ts  ✅ Created (needs implementation)
├── categories.service.ts       ✅ Created (needs implementation)
├── categories.controller.ts    ✅ Created (needs implementation)
└── categories.module.ts        ✅ Created (complete!)

apps/api/src/app.module.ts      ✅ Updated (CategoriesModule imported)
```

### ✅ Frontend (Next.js)
```
apps/web/src/
├── types/
│   └── category.ts             ✅ Created (complete!)
├── services/
│   └── categories.service.ts   ✅ Created (needs implementation)
└── app/(dashboard)/categories/
    ├── page.tsx                ✅ Created (needs implementation)
    ├── new/
    │   └── page.tsx            ✅ Created (needs implementation)
    └── [id]/
        └── page.tsx            ✅ Created (needs implementation)

apps/web/src/app/(dashboard)/layout.tsx  ✅ Updated (nav link added)
```

---

## 🎯 STEP-BY-STEP IMPLEMENTATION

---

## **PHASE 1: BACKEND (2 hours)**

### **Step 1.1: DTOs (15 min)**

#### **File: `create-category.dto.ts`**

**TODO:**
```typescript
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsIn } from 'class-validator';
import { TransactionType } from '@prisma/client';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(TransactionType)
  @IsIn(['INCOME', 'EXPENSE', 'TRANSFER'])
  type: TransactionType;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  color?: string;
}
```

#### **File: `update-category.dto.ts`**

**TODO:**
```typescript
import { IsString, IsEnum, IsOptional, IsIn } from 'class-validator';
import { TransactionType } from '@prisma/client';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(TransactionType)
  @IsIn(['INCOME', 'EXPENSE', 'TRANSFER'])
  type?: TransactionType;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  color?: string;
}
```

---

### **Step 1.2: Service (45 min)**

#### **File: `categories.service.ts`**

Implement 5 methods:

#### **1. createCategory**
```typescript
async createCategory(userId: string, dto: CreateCategoryDto) {
  // 1. Check duplicate (same user, same type, same name)
  const existing = await this.prisma.category.findFirst({
    where: {
      userId,
      type: dto.type,
      name: dto.name,
    },
  });

  if (existing) {
    throw new ConflictException(
      `Category "${dto.name}" already exists for type ${dto.type}`
    );
  }

  // 2. Create category
  return this.prisma.category.create({
    data: {
      userId,
      name: dto.name,
      type: dto.type,
      icon: dto.icon,
      color: dto.color || '#6B7280', // Default color
    },
  });
}
```

#### **2. getCategories**
```typescript
async getCategories(userId: string) {
  // Get user's categories + system defaults
  return this.prisma.category.findMany({
    where: {
      OR: [
        { userId }, // User's categories
        { userId: null, isDefault: true }, // System defaults
      ],
    },
    orderBy: [
      { isDefault: 'desc' }, // System defaults first
      { createdAt: 'desc' },
    ],
  });
}
```

#### **3. getCategoryById**
```typescript
async getCategoryById(categoryId: string, userId: string) {
  const category = await this.prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new NotFoundException('Category not found');
  }

  // Allow access if user owns it OR it's a system default
  if (category.userId !== userId && category.userId !== null) {
    throw new ForbiddenException('You do not have access to this category');
  }

  return category;
}
```

#### **4. updateCategory**
```typescript
async updateCategory(categoryId: string, userId: string, dto: UpdateCategoryDto) {
  // 1. Check existence and ownership
  const category = await this.getCategoryById(categoryId, userId);

  // 2. Cannot update system defaults
  if (!category.userId) {
    throw new ForbiddenException('Cannot update system default category');
  }

  // 3. Check duplicate name (if name is changing)
  if (dto.name) {
    const existing = await this.prisma.category.findFirst({
      where: {
        userId,
        type: dto.type || category.type,
        name: dto.name,
        id: { not: categoryId }, // Exclude current category
      },
    });

    if (existing) {
      throw new ConflictException(
        `Category "${dto.name}" already exists for this type`
      );
    }
  }

  // 4. Update
  return this.prisma.category.update({
    where: { id: categoryId },
    data: dto,
  });
}
```

#### **5. deleteCategory**
```typescript
async deleteCategory(categoryId: string, userId: string) {
  // 1. Check existence and ownership
  const category = await this.getCategoryById(categoryId, userId);

  // 2. Cannot delete system defaults
  if (!category.userId) {
    throw new ForbiddenException('Cannot delete system default category');
  }

  // 3. Delete (will fail if category has transactions)
  await this.prisma.category.delete({
    where: { id: categoryId },
  });

  return { message: 'Category deleted successfully' };
}
```

---

### **Step 1.3: Controller (30 min)**

#### **File: `categories.controller.ts`**

Implement 5 endpoints:

```typescript
@Post()
async createCategory(
  @CurrentUser('id') userId: string,
  @Body() dto: CreateCategoryDto,
) {
  return this.categoriesService.createCategory(userId, dto);
}

@Get()
async getCategories(@CurrentUser('id') userId: string) {
  return this.categoriesService.getCategories(userId);
}

@Get(':id')
async getCategoryById(
  @Param('id') id: string,
  @CurrentUser('id') userId: string,
) {
  return this.categoriesService.getCategoryById(id, userId);
}

@Patch(':id')
async updateCategory(
  @Param('id') id: string,
  @CurrentUser('id') userId: string,
  @Body() dto: UpdateCategoryDto,
) {
  return this.categoriesService.updateCategory(id, userId, dto);
}

@Delete(':id')
async deleteCategory(
  @Param('id') id: string,
  @CurrentUser('id') userId: string,
) {
  return this.categoriesService.deleteCategory(id, userId);
}
```

---

### **Step 1.4: Test Backend (30 min)**

Use **Postman** to test all endpoints:

#### **1. Create Category**
```
POST http://localhost:3000/categories
Authorization: Bearer <your_access_token>
Content-Type: application/json

{
  "name": "Tiền lương",
  "type": "INCOME",
  "icon": "💰",
  "color": "#10B981"
}
```

#### **2. Get All Categories**
```
GET http://localhost:3000/categories
Authorization: Bearer <your_access_token>
```

#### **3. Get Category by ID**
```
GET http://localhost:3000/categories/{id}
Authorization: Bearer <your_access_token>
```

#### **4. Update Category**
```
PATCH http://localhost:3000/categories/{id}
Authorization: Bearer <your_access_token>
Content-Type: application/json

{
  "name": "Lương tháng",
  "icon": "💵"
}
```

#### **5. Delete Category**
```
DELETE http://localhost:3000/categories/{id}
Authorization: Bearer <your_access_token>
```

**Expected Results:**
- ✅ Create returns new category
- ✅ Get all returns user's + system defaults
- ✅ Cannot edit/delete system defaults (403 error)
- ✅ Duplicate name throws 409 conflict

---

## **PHASE 2: FRONTEND (4 hours)**

---

### **Step 2.1: Service (30 min)**

#### **File: `categories.service.ts`**

Implement 5 methods:

```typescript
async getAll(): Promise<Category[]> {
  return axiosInstance.get<Category[]>(this.baseURL);
}

async getById(id: string): Promise<Category> {
  return axiosInstance.get<Category>(`${this.baseURL}/${id}`);
}

async create(data: CreateCategoryDto): Promise<Category> {
  return axiosInstance.post<Category>(this.baseURL, data);
}

async update(id: string, data: UpdateCategoryDto): Promise<Category> {
  return axiosInstance.patch<Category>(`${this.baseURL}/${id}`, data);
}

async delete(id: string): Promise<void> {
  return axiosInstance.delete(`${this.baseURL}/${id}`);
}
```

---

### **Step 2.2: List Page (1.5 hours)**

#### **File: `categories/page.tsx`**

**TODO: Implement grouping and display**

```typescript
// 1. Group categories by type
const incomeCategories = categories?.filter(c => c.type === 'INCOME') || [];
const expenseCategories = categories?.filter(c => c.type === 'EXPENSE') || [];

// 2. Implement handleDelete
const handleDelete = async (id: string, name: string) => {
  if (!confirm(`Bạn có chắc muốn xóa danh mục "${name}"?`)) return;
  
  try {
    await deleteMutation.mutateAsync(id);
    alert('Xóa danh mục thành công!');
  } catch (err: any) {
    alert(err.response?.data?.message || 'Không thể xóa danh mục');
  }
};

// 3. Render category groups
return (
  <div className="p-6">
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Danh mục</h1>
      <Link href="/categories/new" className="...">
        + Tạo danh mục mới
      </Link>
    </div>

    {/* INCOME Section */}
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4 text-green-600">
        💰 Thu nhập ({incomeCategories.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {incomeCategories.map(category => (
          <CategoryCard 
            key={category.id} 
            category={category}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>

    {/* EXPENSE Section */}
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4 text-red-600">
        💸 Chi tiêu ({expenseCategories.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {expenseCategories.map(category => (
          <CategoryCard 
            key={category.id} 
            category={category}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  </div>
);
```

**Category Card Component:**
```typescript
function CategoryCard({ category, onDelete }: { 
  category: Category; 
  onDelete: (id: string, name: string) => void;
}) {
  const isSystemDefault = !category.userId || category.isDefault;

  return (
    <div 
      className="bg-white rounded-lg p-4 border-l-4"
      style={{ borderLeftColor: category.color || '#6B7280' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {category.icon && (
            <span className="text-2xl">{category.icon}</span>
          )}
          <div>
            <h3 className="font-medium">{category.name}</h3>
            {isSystemDefault && (
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                Hệ thống
              </span>
            )}
          </div>
        </div>

        {!isSystemDefault && (
          <div className="flex gap-2">
            <Link
              href={`/categories/${category.id}`}
              className="text-blue-500 hover:text-blue-700"
            >
              ✏️
            </Link>
            <button
              onClick={() => onDelete(category.id, category.name)}
              className="text-red-500 hover:text-red-700"
            >
              🗑️
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

### **Step 2.3: Create Page (1 hour)**

#### **File: `categories/new/page.tsx`**

**TODO: Implement handlers**

```typescript
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  // Validate
  if (!formData.name.trim()) {
    setError('Tên danh mục không được để trống');
    return;
  }

  if (!formData.type) {
    setError('Vui lòng chọn loại danh mục');
    return;
  }

  // Submit
  createMutation.mutate(formData);
};
```

---

### **Step 2.4: Edit Page (1 hour)**

#### **File: `categories/[id]/page.tsx`**

**TODO: Implement handlers**

```typescript
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  // Check if system default
  if (!category?.userId || category?.isDefault) {
    setError('Không thể chỉnh sửa danh mục hệ thống');
    return;
  }

  // Validate
  if (!formData.name?.trim()) {
    setError('Tên danh mục không được để trống');
    return;
  }

  // Submit
  updateMutation.mutate(formData);
};
```

---

## **PHASE 3: TESTING (1 hour)**

### **Test Full Flow:**

1. **Create Categories:**
   - ✅ Create income category: "Tiền lương" 💰
   - ✅ Create expense category: "Ăn uống" 🍔
   - ✅ Create transfer category: "Chuyển khoản" 💸

2. **View Categories:**
   - ✅ Categories grouped by type
   - ✅ System defaults have badge
   - ✅ User categories have edit/delete buttons

3. **Edit Category:**
   - ✅ Can edit user's category
   - ✅ Cannot edit system default (warning shown)
   - ✅ Duplicate name shows error

4. **Delete Category:**
   - ✅ Can delete user's category
   - ✅ Cannot delete system default
   - ✅ Confirmation dialog works

5. **Edge Cases:**
   - ✅ Empty name validation
   - ✅ Duplicate name error (409)
   - ✅ Invalid type error (400)
   - ✅ Non-existent ID error (404)

---

## ⏱️ TIME BREAKDOWN

| Task | Time | Status |
|------|------|--------|
| Backend DTOs | 15 min | ⏸️ Pending |
| Backend Service | 45 min | ⏸️ Pending |
| Backend Controller | 30 min | ⏸️ Pending |
| Backend Testing | 30 min | ⏸️ Pending |
| Frontend Service | 30 min | ⏸️ Pending |
| List Page | 1.5 hrs | ⏸️ Pending |
| Create Page | 1 hr | ⏸️ Pending |
| Edit Page | 1 hr | ⏸️ Pending |
| Frontend Testing | 1 hr | ⏸️ Pending |
| **TOTAL** | **7.5 hrs** | **0% Complete** |

---

## 🚀 QUICK START

### **Start Backend Server:**
```bash
cd fintrack/apps/api
npm run start:dev
```

### **Start Frontend Server:**
```bash
cd fintrack/apps/web
npm run dev
```

### **Open in Browser:**
```
http://localhost:3001/categories
```

---

## 📝 NOTES

### **Key Differences from Wallets:**
1. **System Defaults**: Categories có system defaults (userId = null)
2. **Grouping**: Display grouped by type (INCOME/EXPENSE/TRANSFER)
3. **Read-only**: System defaults cannot be edited/deleted
4. **Colors**: Each category has its own color for visual distinction

### **Common Errors:**
- **409 Conflict**: Duplicate category name (same type)
- **403 Forbidden**: Trying to edit/delete system default
- **404 Not Found**: Category doesn't exist

### **Tips:**
- Reuse Wallets patterns (very similar)
- Focus on ownership checks (user vs system)
- Test with Postman first before FE
- Use React Query for caching

---

## ✅ COMPLETION CHECKLIST

### **Backend:**
- [ ] DTOs implemented
- [ ] Service implemented (5 methods)
- [ ] Controller implemented (5 endpoints)
- [ ] All Postman tests pass
- [ ] No linter errors

### **Frontend:**
- [ ] Service implemented (5 methods)
- [ ] List page complete with grouping
- [ ] Create page complete
- [ ] Edit page complete with warning
- [ ] All features tested
- [ ] No linter errors

### **Integration:**
- [ ] Full CRUD works end-to-end
- [ ] System defaults show correctly
- [ ] Cannot edit/delete system defaults
- [ ] Duplicate names handled
- [ ] Navigation link works

---

**GOAL:** Complete Categories CRUD trong 8 hours!

**START NOW!** 🚀💪🔥
