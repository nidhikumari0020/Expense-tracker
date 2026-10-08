# Smart Expense Tracker — MERN Stack

> A modern, responsive, full-stack personal finance ledger and expense analytics platform built with the MERN stack (MongoDB, Express 5, React 19, Node.js) and Tailwind CSS v4.

---

## 🌟 Overview

**Smart Expense Tracker** empowers individuals, freelancers, and professionals to seamlessly log and monitor daily expenditures, track multiple income streams, analyze spending distributions, and evaluate monthly cash flow in real-time.

### Key Features
- 🔐 **Secure Authentication**: JWT-based authorization, bcrypt password hashing, session restoration on refresh, protected routing, and global 401 handling.
- 📊 **Dynamic Monthly Dashboard**: Real-time aggregation of income, expenses, net savings, savings rate, interactive SVG category distribution charts, and recent activity ledgers.
- 💸 **Expense & Income Management**: Full CRUD operations with client-side validation, category suggestion tags, time-range filtering (daily, weekly, monthly, yearly), and live search.
- 📑 **Excel Export**: Instant authenticated `.xlsx` spreadsheet exports generated in-memory for both income and expense ledgers.
- 🔄 **Unified Transaction History**: Combined chronological ledger with cash flow ratio visualization, multi-criteria filtering, and sorting.
- 👤 **Profile & Security**: User detail management, duplicate email safeguards, and secure password updates.
- 🌗 **Dark / Light Mode**: Dark mode ON by default, switchable via a toggle (sidebar, mobile header, Login and Signup). Preference is saved in `localStorage`.
- 📈 **Monthly Income vs Expense Trend**: Line chart on the Dashboard showing the last 6 months, built from real MongoDB data.
- 📱 **Responsive Design**: Tailored experiences across mobile (bottom tab navigation & action sheets) and desktop (sidebar & detailed data tables).

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite 8, React Router v7, Tailwind CSS v4, Recharts, Lucide React Icons |
| **Backend** | Node.js (ES Modules), Express 5, Mongoose 9, JSONWebToken, BcryptJS, Validator, XLSX |
| **Database** | MongoDB (Atlas or Local) |
| **Styling & Design** | Palette-based CSS variable theme (dark + light), Inter typography, Recharts for the trend chart |

---

## 📁 Project Structure

```
expense-tracker/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/
│   │   ├── dashboardController.js# Monthly summaries & aggregation
│   │   ├── expenseController.js  # Expense CRUD & XLSX stream
│   │   ├── incomeController.js   # Income CRUD & XLSX stream
│   │   └── userController.js     # Auth, profile & password management
│   ├── middleware/
│   │   └── auth.js               # JWT Bearer token guard
│   ├── models/
│   │   ├── expenseModel.js       # Expense Mongoose schema
│   │   ├── incomeModel.js        # Income Mongoose schema
│   │   └── userModel.js          # User Mongoose schema
│   ├── routes/
│   │   ├── dashboardRoute.js
│   │   ├── expenseRoute.js
│   │   ├── incomeRoute.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   └── datafilter.js         # Time-range start/end calculators
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express server entry point
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── component/
│   │   │   ├── brand/            # Logo.jsx (SVG brand mark)
│   │   │   ├── dashboard/        # Category chart, monthly trend chart, recent list
│   │   │   ├── transactions/     # Modals, tables, filter bars
│   │   │   ├── ui/               # Reusable primitives (incl. ThemeToggle)
│   │   │   ├── Layout.jsx        # Sidebar & mobile navigation shell
│   │   │   ├── ProtectedRoute.jsx# Auth guard
│   │   │   └── PublicRoute.jsx   # Guest-only guard
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # User state & session restore
│   │   │   ├── ThemeContext.jsx  # Dark/light state + localStorage persistence
│   │   │   └── ToastContext.jsx  # Notification system
│   │   ├── hooks/                # useAuth, useToast, useTheme
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Expenses.jsx
│   │   │   ├── Income.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── Transactions.jsx
│   │   ├── services/             # Central API client & resource adapters
│   │   ├── utils/                # Currency/date formatters & constants
│   │   ├── App.jsx               # Route definitions
│   │   ├── index.css             # Theme tokens (palette, dark/light)
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── ARCHITECTURE.md
├── DESIGN.md
├── MEMORY.md
├── PHASES.md
├── PRD.md
├── RULES.md
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) URI (Atlas connection string or local instance)

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory based on `.env.example`:
```env
PORT=4000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/Expense
JWT_SECRET=your_super_secret_jwt_key
TOKEN_EXPIRY=24h
CLIENT_URL=http://localhost:5173
```

Start the backend development server:
```bash
npm start
```
*Backend runs on `http://localhost:4000`.*

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` directory based on `.env.example`:
```env
VITE_API_URL=http://localhost:4000
```

Start the frontend development server:
```bash
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 📡 API Reference

### Authentication & User
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/users/register` | Register new user account | No |
| `POST` | `/api/users/login` | Login user & issue JWT | No |
| `GET` | `/api/users/me` | Fetch authenticated user data | Yes |
| `PUT` | `/api/users/profile` | Update user name & email | Yes |
| `PUT` | `/api/users/password` | Change user password | Yes |

### Expenses
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/expense/add` | Create an expense record | Yes |
| `GET` | `/api/expense/get` | List all user expenses (descending) | Yes |
| `PUT` | `/api/expense/update/:id` | Update an existing expense | Yes |
| `DELETE` | `/api/expense/delete/:id` | Delete an expense | Yes |
| `GET` | `/api/expense/overview?range=` | Aggregated expense totals by range | Yes |
| `GET` | `/api/expense/downloadexcel` | Stream `.xlsx` expense download | Yes |

### Income
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/income/add` | Create an income record | Yes |
| `GET` | `/api/income/get` | List all user income (descending) | Yes |
| `PUT` | `/api/income/update/:id` | Update an existing income | Yes |
| `DELETE` | `/api/income/delete/:id` | Delete an income | Yes |
| `GET` | `/api/income/overview?range=` | Aggregated income totals by range | Yes |
| `GET` | `/api/income/downloadexcel` | Stream `.xlsx` income download | Yes |

### Dashboard
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/dashboard/data` | Fetch monthly metrics, category breakdown & recent records | Yes |
| `GET` | `/api/dashboard/monthly-trend?months=6` | Income & expense totals per month for the last N months (1–12, default 6). Months without data return `0`. | Yes |

---

## 🎨 Theme & Color System

All colors live in one place: `frontend/src/index.css`. Components only use semantic tokens (`var(--color-*)`, `var(--chart-*)`), never raw hex values.

| Palette color | Role |
|---|---|
| `#040D12` | App background (dark) |
| `#151515` | Cards, panels, sidebar (dark surface) |
| `#183D3D` | Selected states, logo background, primary in light mode |
| `#5C8374` | Primary accent, buttons, income line |
| `#93B1A6` | Subtle highlights, income values, secondary UI (dark) |
| `#301B3F` | Purple accent (chart series, light-mode purple tone, selection tint) |
| `#3C415C` | Indigo accent (chart series, info/rate highlights in light mode) |
| `#B4A5A5` | Muted/secondary text (dark), chart series |

Expense/warning tones (a soft rose and amber) are additional semantic colors not in the base palette, used so expenses are distinguishable from income.

### Dark / Light Mode
- `ThemeContext` stores `'dark' | 'light'`, defaults to **dark**, persists to `localStorage` key `theme`, and sets `data-theme` on `<html>`.
- `index.html` has a tiny inline script that applies the saved theme before React loads (prevents a flash on refresh).
- `src/index.css` defines the dark tokens in `:root` and light overrides in `:root[data-theme="light"]`.
- `ThemeToggle` (`component/ui/ThemeToggle.jsx`) is a `role="switch"` control with sun/moon icon, shown in the desktop sidebar, mobile header, Login and Signup.

## 📈 Monthly Financial Chart

- Frontend: `component/dashboard/MonthlyTrendChart.jsx` (Recharts `LineChart`, responsive, themed via CSS variables, custom tooltip).
- Backend: `GET /api/dashboard/monthly-trend` in `dashboardController.js` runs two `$group` aggregations (income, expense) by year+month for the authenticated user and fills missing months with `0`.
- Shows an empty state if there is no data in the selected window.

## 🔐 Authentication
JWT Bearer tokens issued on login/register, verified by `middleware/auth.js`. The frontend API client (`services/api.js`) attaches the token from `localStorage` and clears the session on any `401`.

## 🗄️ Database
MongoDB via Mongoose. Collections: users, incomes, expenses (all records scoped by `userId`). No schema changes were made in the UI polish.

## 📊 Dashboard Analytics & Excel Export
The Dashboard shows current-month income, expenses, net savings, savings rate, a category breakdown donut, the monthly trend line chart, and recent activity. Income and expense ledgers can be exported to `.xlsx` (`/api/expense/downloadexcel`, `/api/income/downloadexcel`).

## 🔭 Future Improvements
- Selectable trend range (3 / 6 / 12 months) in the UI (the API already supports `months`).
- Dedicated Analytics page (currently analytics live on the Dashboard and Transactions pages).
- Automated tests (none exist in the repo yet).
- Upgrade Recharts to v3.

---

## 📦 Production Build

To test or generate the production bundle for the frontend:

```bash
cd frontend
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## 🔒 Security & Code Standards

- **Environment Isolation**: No production database credentials, API secrets, or sensitive tokens are stored in the codebase.
- **User Ownership Guard**: All CRUD endpoints strictly enforce `userId` scoping extracted directly from the verified JWT payload.
- **Strict Data Validation**: Positive numeric limits on financial fields with client and server validations.
- **In-Memory Buffer Streaming**: Excel exports generated safely using memory buffers without filesystem conflicts.

---

## 📄 License
ISC
