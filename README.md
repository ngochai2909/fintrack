# 💰 FinTrack - Personal Finance Tracker

A modern, full-stack personal finance management application built with **NestJS** and **Next.js**.

Track your income, expenses, wallets, and categories with beautiful charts and comprehensive statistics.

---

## ✨ Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication (Access + Refresh tokens)
- Password change
- Profile management

### 💰 Wallets Management
- Create, Read, Update, Delete wallets
- Support multiple wallet types (Cash, Bank, Credit Card, E-Wallet, Investment)
- Real-time balance tracking
- Multi-currency support (VND, USD)

### 📁 Categories Management
- Income, Expense, and Transfer categories
- System default categories + user custom categories
- Icon and color customization
- Category-based transaction grouping

### 💳 Transactions Management
- Create, Read, Update, Delete transactions
- Automatic wallet balance updates
- Transaction types: Income, Expense, Transfer*
- Date, amount, description, and notes
- Category and wallet selection
- Search and filter by type
- Grouped by date display

### 📊 Dashboard & Analytics
- Total balance across all wallets
- Monthly income and expense statistics
- Recent transactions (last 10)
- **Line Chart**: 30-day income/expense trend
- **Pie Charts**: Category-wise breakdown
- Auto-refresh every minute

### 👤 Profile & Settings
- View account information
- Update profile (name, avatar)
- Change password with validation
- Account security features

---

## 🛠️ Tech Stack

### Backend (API)
- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (Passport.js)
- **Validation**: class-validator
- **Password Hashing**: bcrypt
- **API Style**: REST

### Frontend (Web)
- **Framework**: Next.js 14+ (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Charts**: Recharts
- **TypeScript**: Full type safety

---

## 🏗️ Architecture

```
fintrack/
├── apps/
│   ├── api/                    # NestJS Backend
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/       # Authentication & Profile
│   │   │   │   ├── wallets/    # Wallets CRUD
│   │   │   │   ├── categories/ # Categories CRUD
│   │   │   │   ├── transactions/ # Transactions + Balance Logic
│   │   │   │   ├── dashboard/  # Statistics & Analytics
│   │   │   │   └── prisma/     # Database Service
│   │   │   ├── common/         # Decorators, Guards
│   │   │   └── main.ts
│   │   ├── prisma/
│   │   │   └── schema.prisma   # Database Schema
│   │   └── .env
│   │
│   └── web/                    # Next.js Frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── (auth)/     # Auth Pages (Login, Register)
│       │   │   └── (dashboard)/ # Protected Pages
│       │   │       ├── dashboard/
│       │   │       ├── wallets/
│       │   │       ├── categories/
│       │   │       ├── transactions/
│       │   │       └── profile/
│       │   ├── lib/            # Axios Config
│       │   ├── services/       # API Services
│       │   ├── types/          # TypeScript Types
│       │   └── providers/      # React Query Provider
│       └── .env.local
│
├── README.md                   # This file
├── API_DOCS.md                 # API Documentation
└── ARCHITECTURE.md             # Technical Architecture
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ (recommended)
- PostgreSQL 14+
- npm or yarn

### 1. Clone Repository
```bash
git clone <repository-url>
cd fintrack
```

### 2. Setup Backend (API)

```bash
cd apps/api

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Edit .env file with your database credentials
# DATABASE_URL="postgresql://user:password@localhost:5432/fintrack"
# JWT_SECRET="your-secret-key"
# JWT_REFRESH_SECRET="your-refresh-secret"

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed database with default categories
npx prisma db seed

# Start development server
npm run start:dev
```

Backend will run on: `http://localhost:3000`

### 3. Setup Frontend (Web)

```bash
cd apps/web

# Install dependencies
npm install

# Setup environment variables
cp .env.local.example .env.local

# Edit .env.local
# NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:3001`

### 4. Access Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000/api
- **API Docs**: See `API_DOCS.md`

---

## 📖 Usage

### 1. Register an Account
- Navigate to `/register`
- Enter your email, password, first name, and last name
- Click "Register"

### 2. Login
- Navigate to `/login`
- Enter your email and password
- Click "Login"

### 3. Create Wallets
- Go to "Wallets" page
- Click "Create New Wallet"
- Enter wallet name, initial balance, and currency
- Save

### 4. Create Categories
- Go to "Categories" page
- Click "Create New Category"
- Choose type (Income/Expense), name, icon, and color
- Save

### 5. Add Transactions
- Go to "Transactions" page
- Click "Create New Transaction"
- Select type, wallet, category, amount, date, and description
- Save (wallet balance updates automatically)

### 6. View Dashboard
- Go to "Dashboard" page
- View summary statistics, charts, and recent transactions

### 7. Manage Profile
- Go to "Profile" page
- Update your name and avatar
- Change password if needed

---

## 🔑 Key Features Explained

### Automatic Balance Management
When you create, update, or delete a transaction:
- **Income**: Adds to wallet balance
- **Expense**: Subtracts from wallet balance
- **Update**: Reverts old change + applies new change
- **Delete**: Reverts the balance change

### React Query Integration
- Automatic caching and refetching
- Optimistic UI updates
- Background data synchronization
- Minimal API calls

### JWT Authentication Flow
1. User logs in → Receives Access Token + Refresh Token
2. Access Token stored in localStorage (will migrate to HttpOnly cookies)
3. Axios interceptor attaches token to every request
4. On 401 error → Auto-refresh using Refresh Token
5. On refresh fail → Logout and redirect to login

---

## 🧪 Testing

### Backend Tests
```bash
cd apps/api
npm run test
npm run test:e2e
```

### Frontend Tests
```bash
cd apps/web
npm run test
```

---

## 🚢 Deployment

### Backend Deployment (Railway, Render, etc.)
1. Set environment variables
2. Run `npm run build`
3. Run `npm run start:prod`

### Frontend Deployment (Vercel, Netlify, etc.)
1. Set `NEXT_PUBLIC_API_URL` to your backend URL
2. Run `npm run build`
3. Deploy `/.next` folder

---

## 📚 Documentation

- **API Documentation**: See [API_DOCS.md](./API_DOCS.md)
- **Architecture Details**: See [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Database Schema**: See `apps/api/prisma/schema.prisma`

---

## 🎯 Roadmap

### Completed ✅
- [x] Authentication (Register, Login, JWT)
- [x] Wallets CRUD
- [x] Categories CRUD
- [x] Transactions CRUD with Balance Logic
- [x] Dashboard with Charts
- [x] Profile & Settings
- [x] Responsive UI

### Future Enhancements 🚀
- [ ] Dark Mode
- [ ] Budget Management
- [ ] Recurring Transactions
- [ ] Multi-currency Exchange Rates
- [ ] Import/Export CSV
- [ ] Advanced Filters & Search
- [ ] Email Notifications
- [ ] Mobile App (React Native)
- [ ] Multi-user Shared Wallets

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Nguyen Ngoc Hai**
- GitHub: [@ngochai2909](https://github.com/ngochai2909)

---

## 🙏 Acknowledgments

- NestJS Team for the amazing framework
- Next.js Team for the powerful React framework
- Prisma Team for the excellent ORM
- TanStack Team for React Query
- Recharts Team for the charting library

---

## 📞 Support

If you have any questions or issues, please:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

---

**Happy Tracking! 💰📊**
