# ✅ DAY 4 CHECKLIST - CATEGORIES CRUD

**Date:** January 9, 2026  
**Target:** 8 hours  
**Pattern:** Similar to Wallets

---

## 🎯 YOUR TASKS TODAY

### **BACKEND (2 hours)** ⏸️

#### **1. DTOs (15 min)**
- [ ] Open `create-category.dto.ts`
- [ ] Add validation decorators (@IsNotEmpty, @IsString, @IsEnum, @IsIn, @IsOptional)
- [ ] Open `update-category.dto.ts`
- [ ] Add validation decorators (all @IsOptional)

#### **2. Service (45 min)**
- [ ] Open `categories.service.ts`
- [ ] Implement `createCategory` (check duplicate, create with default color)
- [ ] Implement `getCategories` (user's + system defaults)
- [ ] Implement `getCategoryById` (check ownership or system default)
- [ ] Implement `updateCategory` (prevent system defaults, check duplicate)
- [ ] Implement `deleteCategory` (prevent system defaults)

#### **3. Controller (30 min)**
- [ ] Open `categories.controller.ts`
- [ ] Implement 5 endpoints (POST, GET, GET/:id, PATCH/:id, DELETE/:id)
- [ ] Each endpoint calls corresponding service method

#### **4. Test with Postman (30 min)**
- [ ] POST /categories - Create category
- [ ] GET /categories - Get all categories
- [ ] GET /categories/:id - Get one category
- [ ] PATCH /categories/:id - Update category
- [ ] DELETE /categories/:id - Delete category
- [ ] Test error cases (duplicate, system default edit)

---

### **FRONTEND (4 hours)** ⏸️

#### **5. Service (30 min)**
- [ ] Open `categories.service.ts`
- [ ] Implement `getAll()` - axiosInstance.get
- [ ] Implement `getById(id)` - axiosInstance.get
- [ ] Implement `create(data)` - axiosInstance.post
- [ ] Implement `update(id, data)` - axiosInstance.patch
- [ ] Implement `delete(id)` - axiosInstance.delete

#### **6. List Page (1.5 hours)**
- [ ] Open `categories/page.tsx`
- [ ] Implement grouping logic (filter by INCOME, EXPENSE, TRANSFER)
- [ ] Implement `handleDelete` function
- [ ] Create category card component
- [ ] Display categories grouped by type
- [ ] Show "System Default" badge
- [ ] Add edit/delete buttons (only for user's categories)

#### **7. Create Page (1 hour)**
- [ ] Open `categories/new/page.tsx`
- [ ] Implement `handleChange` function
- [ ] Implement `handleSubmit` function
- [ ] Add validation
- [ ] Test form submission

#### **8. Edit Page (1 hour)**
- [ ] Open `categories/[id]/page.tsx`
- [ ] Implement `handleChange` function
- [ ] Implement `handleSubmit` function
- [ ] Add system default check
- [ ] Add validation
- [ ] Test form submission

---

### **TESTING (1 hour)** ⏸️

#### **9. Full Flow Test**
- [ ] Create INCOME category: "Tiền lương" 💰 #10B981
- [ ] Create EXPENSE category: "Ăn uống" 🍔 #EF4444
- [ ] Create EXPENSE category: "Di chuyển" 🚗 #F59E0B
- [ ] View categories list (grouped by type)
- [ ] Edit a user category (change name, icon, color)
- [ ] Try to edit system default (should show warning)
- [ ] Delete a user category (with confirmation)
- [ ] Try duplicate name (should show error)

---

## 📊 PROGRESS TRACKING

| Phase | Task | Est. Time | Status | Actual Time |
|-------|------|-----------|--------|-------------|
| Backend | DTOs | 15 min | ⏸️ | ___ |
| Backend | Service | 45 min | ⏸️ | ___ |
| Backend | Controller | 30 min | ⏸️ | ___ |
| Backend | Postman Test | 30 min | ⏸️ | ___ |
| Frontend | Service | 30 min | ⏸️ | ___ |
| Frontend | List Page | 1.5 hrs | ⏸️ | ___ |
| Frontend | Create Page | 1 hr | ⏸️ | ___ |
| Frontend | Edit Page | 1 hr | ⏸️ | ___ |
| Testing | Full Flow | 1 hr | ⏸️ | ___ |
| **TOTAL** | | **7.5 hrs** | **0%** | **___ hrs** |

---

## 🚀 QUICK COMMANDS

### **Start Backend:**
```bash
cd "/media/hai-nguyen/Working and Studying/CODE/Course/Reactjs/practical_project/fintrack/apps/api"
npm run start:dev
```

### **Start Frontend:**
```bash
cd "/media/hai-nguyen/Working and Studying/CODE/Course/Reactjs/practical_project/fintrack/apps/web"
npm run dev
```

### **Backend URL:**
```
http://localhost:3000/categories
```

### **Frontend URL:**
```
http://localhost:3001/categories
```

---

## 📁 FILES TO EDIT

### **Backend:**
1. `apps/api/src/modules/categories/dto/create-category.dto.ts`
2. `apps/api/src/modules/categories/dto/update-category.dto.ts`
3. `apps/api/src/modules/categories/categories.service.ts`
4. `apps/api/src/modules/categories/categories.controller.ts`

### **Frontend:**
1. `apps/web/src/services/categories.service.ts`
2. `apps/web/src/app/(dashboard)/categories/page.tsx`
3. `apps/web/src/app/(dashboard)/categories/new/page.tsx`
4. `apps/web/src/app/(dashboard)/categories/[id]/page.tsx`

---

## 💡 HELPFUL REFERENCES

### **Similar Patterns:**
- **DTOs:** Check `wallets/dto/*.dto.ts`
- **Service:** Check `wallets/wallets.service.ts`
- **Controller:** Check `wallets/wallets.controller.ts`
- **Frontend Service:** Check `wallets.service.ts`
- **Pages:** Check `wallets/page.tsx`, `wallets/new/page.tsx`, `wallets/[id]/page.tsx`

### **Key Differences:**
- Categories có system defaults (userId = null)
- Không thể edit/delete system defaults
- Display grouped by type

---

## ⚠️ COMMON ERRORS

### **Backend:**
- `ConflictException`: Duplicate name (same type, same user)
- `ForbiddenException`: Trying to edit/delete system default
- `NotFoundException`: Category not found

### **Frontend:**
- Empty name validation
- Type selection required
- System default edit warning

---

## 🎯 SUCCESS CRITERIA

✅ All 5 backend APIs work correctly  
✅ Postman tests pass  
✅ Categories list shows grouped by type  
✅ Can create new category  
✅ Can edit user's category  
✅ Cannot edit system default  
✅ Can delete user's category  
✅ Cannot delete system default  
✅ Duplicate name shows error  
✅ Navigation link works  
✅ No linter errors

---

## 📝 END OF DAY REPORT

**Hours worked:** ___ / 8h  
**Tasks completed:** ___ / 9  
**Backend:** ✅ / ⏸️ / ❌  
**Frontend:** ✅ / ⏸️ / ❌  
**Testing:** ✅ / ⏸️ / ❌  

**Issues encountered:**
- 

**Lessons learned:**
- 

**Tomorrow plan:**
- Start Day 5: Transactions Backend

---

**LET'S GO!** 🚀💪🔥
