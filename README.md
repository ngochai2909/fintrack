# 🚀 FinTrack - Personal Finance Tracker

Dự án thực hành ôn tập Fullstack (NestJS + Next.js) trong 7 ngày.

## 📁 Cấu trúc dự án

```
fintrack/
├── apps/
│   ├── api/          # NestJS Backend
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/       # JWT Authentication & RBAC
│   │   │   │   ├── prisma/     # Database ORM
│   │   │   │   ├── users/      # User management (TODO)
│   │   │   │   ├── wallets/    # Wallet management (TODO)
│   │   │   │   ├── categories/ # Category management (TODO)
│   │   │   │   └── transactions/ # Transaction management (TODO)
│   │   │   └── common/
│   │   │       ├── decorators/ # Custom decorators
│   │   │       ├── filters/    # Exception filters
│   │   │       └── guards/     # Auth guards
│   │   └── prisma/
│   │       └── schema.prisma   # Database schema
│   │
│   └── web/          # Next.js Frontend
│       └── src/
│           ├── app/
│           │   ├── (auth)/     # Login, Register pages
│           │   └── (dashboard)/ # Dashboard, Transactions pages
│           ├── components/     # Reusable UI components
│           ├── hooks/          # Custom React hooks
│           ├── lib/            # Utilities, API client
│           ├── services/       # API services
│           └── types/          # TypeScript types
│
└── README.md
```

---

## 🛠️ Yêu cầu hệ thống

- **Node.js**: v20+ (sử dụng `nvm use 20`)
- **PostgreSQL**: v14+
- **npm**: v10+

---

## 🚀 Hướng dẫn cài đặt

### 1. Cài đặt PostgreSQL (nếu chưa có)

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql

# Tạo database
sudo -u postgres psql -c "CREATE DATABASE fintrack;"
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'password';"
```

### 2. Cấu hình Backend

```bash
cd apps/api

# Copy file môi trường
cp .env.example .env

# Sửa DATABASE_URL trong .env nếu cần

# Generate Prisma Client
npx prisma generate

# Chạy migration
npx prisma migrate dev --name init

# Khởi chạy server
npm run start:dev
```

**API sẽ chạy tại:** http://localhost:3000/api

### 3. Cấu hình Frontend

```bash
cd apps/web

# Tạo file .env.local
echo 'NEXT_PUBLIC_API_URL=http://localhost:3000/api' > .env.local

# Khởi chạy
npm run dev
```

**Frontend sẽ chạy tại:** http://localhost:3001

---

## 📅 LỘ TRÌNH ÔN TẬP 7 NGÀY

### Ngày 1: Authentication & Project Setup ✅

- [x] Setup NestJS với TypeScript
- [x] Cấu hình Prisma với PostgreSQL
- [x] Thiết kế Database Schema (User, Wallet, Category, Transaction)
- [x] Triển khai JWT Authentication (Access + Refresh Token)
- [x] Viết Guards và Decorators cho RBAC
- [x] Setup Next.js với App Router
- [x] Tạo trang Login/Register
- [x] Cấu hình Middleware bảo vệ routes

**🎯 BÀI TẬP CHO BẠN:**

1. Hoàn thiện kết nối Login/Register form với API
2. Lưu token vào Cookie (HttpOnly nếu có thể)
3. Tạo Auth Context để quản lý trạng thái đăng nhập

---

### Ngày 2: Wallet & Category Management

- [ ] API CRUD cho Wallet (Ví tiền)
- [ ] API CRUD cho Category (Danh mục)
- [ ] Validation với class-validator
- [ ] Frontend: Form tạo Wallet/Category
- [ ] Sử dụng React Hook Form + Zod

**🎯 Kiến thức cần ôn:**

- NestJS: DTOs, Pipes, Exception Filters
- React: Controlled Forms, Form Validation

---

### Ngày 3: Transaction Management

- [ ] API CRUD cho Transaction
- [ ] Tự động cập nhật số dư Wallet
- [ ] Database Transaction (ACID)
- [ ] Frontend: Form thêm giao dịch
- [ ] Hiển thị danh sách giao dịch

**🎯 Kiến thức cần ôn:**

- Prisma: Transactions, Relations
- TypeScript: Generics

---

### Ngày 4: Advanced Queries & Pagination

- [ ] API: Pagination, Search, Filter, Sort
- [ ] Thống kê theo tháng/năm (Aggregation)
- [ ] Frontend: Data Table với filter
- [ ] React Query cho data fetching & caching

**🎯 Kiến thức cần ôn:**

- SQL: GROUP BY, Aggregate Functions
- React Query: useQuery, useMutation, Cache

---

### Ngày 5: Dashboard & Charts

- [ ] API thống kê tổng quan
- [ ] Frontend: Dashboard với biểu đồ
- [ ] Sử dụng Recharts hoặc Chart.js
- [ ] Responsive design

**🎯 Kiến thức cần ôn:**

- Data Visualization
- React: useMemo, useCallback (optimization)

---

### Ngày 6: Real-time & Advanced Features

- [ ] Socket.io cho real-time updates
- [ ] Export data ra Excel/PDF
- [ ] File upload (Avatar)
- [ ] Rate Limiting, Security headers

**🎯 Kiến thức cần ôn:**

- WebSocket
- Node.js Streams
- Security best practices

---

### Ngày 7: Testing & Deployment

- [ ] Unit tests với Jest
- [ ] E2E tests
- [ ] Dockerize ứng dụng
- [ ] CI/CD với GitHub Actions

**🎯 Kiến thức cần ôn:**

- Testing: Unit, Integration, E2E
- Docker, Docker Compose
- DevOps basics

---

## 🔑 API Endpoints

### Auth

| Method | Endpoint             | Description   |
| ------ | -------------------- | ------------- |
| POST   | `/api/auth/register` | Đăng ký       |
| POST   | `/api/auth/login`    | Đăng nhập     |
| POST   | `/api/auth/logout`   | Đăng xuất     |
| POST   | `/api/auth/refresh`  | Làm mới token |

### Wallets (TODO)

| Method | Endpoint           | Description  |
| ------ | ------------------ | ------------ |
| GET    | `/api/wallets`     | Danh sách ví |
| POST   | `/api/wallets`     | Tạo ví mới   |
| PATCH  | `/api/wallets/:id` | Cập nhật ví  |
| DELETE | `/api/wallets/:id` | Xóa ví       |

### Transactions (TODO)

| Method | Endpoint                  | Description         |
| ------ | ------------------------- | ------------------- |
| GET    | `/api/transactions`       | Danh sách giao dịch |
| POST   | `/api/transactions`       | Tạo giao dịch       |
| GET    | `/api/transactions/stats` | Thống kê            |

---

## 📚 Tài liệu tham khảo

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Query (TanStack Query)](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 💡 Tips

1. **Đọc code trước khi code:** Hiểu cấu trúc hiện tại trước khi thêm tính năng mới.
2. **Commit thường xuyên:** Mỗi khi hoàn thành một tính năng nhỏ.
3. **Sử dụng Cursor AI:** Hỏi `@Codebase` để hiểu code hoặc nhờ review.
4. **Console.log là bạn:** Debug bằng log trước khi dùng debugger.

---

**Happy Coding! 🎉**
