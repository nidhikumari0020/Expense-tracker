# MEMORY.md — Persistent Project Context

> Read this first, every session. **Update it at the end of every task** (status, decisions, issues).

## Identity
**Smart Expense Tracker** — MERN portfolio/placement project. Single-user ledger: income, expenses, monthly dashboard, profile, Excel export. Built to modern, clean, high-contrast finance-SaaS standards on top of the **existing** backend.

## Doc Map
PRD.md = what · ARCHITECTURE.md = how it works · RULES.md = how to code · PHASES.md = what next · DESIGN.md = how it looks · MEMORY.md = what to remember.

## Status (as of 2026-10-08)
- Backend: 100% verified & passing smoke tests (all 19 endpoints working).
- Frontend: 100% complete across all planned features. ESLint passes with 0 warnings/errors. Vite production build passes in ~1.3s.
- Project status: **Complete & Portfolio-Ready**.

## Stack
- Backend: Node (ESM), Express 5, Mongoose 9, JWT, bcryptjs, validator, xlsx, cors, dotenv · default port 4000.
- Frontend: React 19, Vite 8, react-router-dom 7, Tailwind 4 (JS), Lucide Icons, pure interactive SVG visualizations.

## Models (fields are fixed)
- user: `name, email(unique), password(hash)`
- income / expense: `description, amount, category(free string), date, userId→user, type(default "income"|"expense"), createdAt, updatedAt`

## Auth
JWT `{id}` · header `Authorization: Bearer <token>` · expiry `TOKEN_EXPIRY` (24h default) · login/register return `{token,user{id,name,email}}` · session restoration on page reload via `/api/users/me` · global 401 broadcast listener for auto-logout.

## Important APIs (prefix `/api`)
- `users`: POST register, POST login, GET me, PUT profile, PUT password
- `income`: POST add, GET get (raw array), PUT update/:id, DELETE delete/:id, GET downloadexcel, GET overview?range=
- `expense`: POST add, GET get (raw array), PUT update/:id, DELETE delete/:id, GET downloadexcel, GET overview?range= (payload key `date`)
- `dashboard`: GET data — totals, real `recentTransactions`, aggregated `expenseDistribution`
- `range` ∈ daily | weekly | monthly (default) | yearly

## Design System
- Inter font, neutral bg `#F6F7F9`, white surfaces, dark primary `#111827`, green income `#027A48` / red expense `#B42318` / blue info `#175CD3`.
- Tokens declared in `index.css @theme`.
- Responsive layout: Fixed desktop sidebar + mobile top header + mobile bottom tab bar.
- Reusable UI: `Button`, `Input`, `Select`, `Card`, `StatCard`, `Badge`, `Modal`, `ConfirmDialog`, `Toast`, `Skeleton`, `Spinner`, `EmptyState`, `ErrorState`, `TransactionTable`, `FilterBar`, `AddTransactionModal`, `EditTransactionModal`.

## Completed Phases
- Phase 0: Project Audit & source-of-truth documentation.
- Phase 1: Backend/API verification & critical bug fixes (all 19 endpoints verified).
- Phase 2: Frontend Foundation (theme tokens, UI primitives, API client, router shell).
- Phase 3: Authentication (AuthContext, Login, Signup, Protected & Public routes).
- Phase 4: Dashboard (Stat cards, pure SVG Category breakdown donut chart + legend list, recent transactions widget, quick add modal).
- Phase 5: Expense Management (CRUD, filters, summary strip, Excel download, confirmation dialogs).
- Phase 6: Income Management (CRUD, filters, summary strip, Excel download, confirmation dialogs).
- Phase 7: Transactions & Analytics (Unified merged ledger, multi-criteria filters, search, sorting, cash flow ratio bar).
- Phase 8: Profile / Settings (Profile update with email conflict handling, password change, sign out).
- Phase 9: Responsive Design (Full viewport adaptability, touch targets, mobile bottom sheets).
- Phase 10: UX, Error, Loading & Empty States (Skeletons, error retry, toast alerts, 404 page).
- Phase 11: Final Portfolio Polish (Root `README.md`, setup documentation, 0-warning ESLint and clean production build).

## Changelog
| Date | Change |
|---|---|
| 2026-10-08 | Initial audit; six docs created. |
| 2026-10-08 | Phase 1 completed: Backend security & bug fixes verified (29/29 tests passed). |
| 2026-10-08 | Phases 2–11 completed: Built all pages (Dashboard, Expenses, Income, Transactions, Profile, Login, Signup, NotFound), custom interactive SVG charts, transaction modals, export workflows, responsive navigation, root README.md, clean ESLint (0 errors) and Vite build verified. |
