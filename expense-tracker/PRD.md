# PRD.md — Smart Expense Tracker

> Source of truth for **what to build**. Derived from the actual codebase audit (static read only; nothing was executed). Anything unconfirmed is marked `NEEDS REVIEW`.

## 1. Product Overview
A MERN web app where a signed-in user records **income** and **expenses**, sees a **monthly dashboard** (income, expense, savings, savings rate, category breakdown, recent activity), manages their **profile/password**, and **exports** their data to Excel.

## 2. Problem
People track money in notes or spreadsheets, so they can't quickly see how much they earned, spent and kept this month, or where the money went.

## 3. Target Users
Individuals (students, early-career professionals, freelancers) who want a fast, private, single-user ledger. No teams, no shared accounts.

## 4. Goals
1. Add / edit / delete income and expenses in under 10 seconds.
2. Show an accurate, real-data monthly summary at a glance.
3. Look and feel like a modern finance SaaS (portfolio-grade).
4. Stay simple, maintainable, and consistent with the existing backend.

## 5. Features (grounded in existing backend)

| Feature | Backend support | Frontend status |
|---|---|---|
| Register / Login (JWT) | ✅ `/api/users/register`, `/login` | ❌ not built |
| View/update profile, change password | ✅ `/me`, `/profile`, `/password` | ❌ not built |
| Income CRUD | ✅ add/get/update/delete | ❌ not built |
| Expense CRUD | ⚠️ add/get/update OK; **delete broken** | ❌ not built |
| Range overview (daily/weekly/monthly/yearly) | ✅ income, ⚠️ expense (response key typo) | ❌ not built |
| Dashboard (current month) | ⚠️ totals OK; **recent transactions & category distribution broken** | ❌ not built (empty page) |
| Excel export | ⚠️ income OK*, **expense broken** | ❌ not built |

\*Income export works in principle but has a shared-file race condition (see ARCHITECTURE.md).

## 6. MVP (must ship)
1. Auth: signup, login, logout, protected routes, session restore.
2. Dashboard with real data: income, expense, savings, savings rate, category distribution, recent transactions.
3. Expense page: list, add, edit, delete, filter by range/category, export.
4. Income page: list, add, edit, delete, filter by range/category, export.
5. Combined Transactions page (client-side merge of income + expense lists).
6. Profile page: update name/email, change password.
7. Responsive layout, loading/empty/error/success states on every data view.

## 7. Future (NOT in scope without approval)
Budgets/limits, recurring transactions, receipts upload, multi-currency, dark mode, pagination/search (needs backend), password reset by email, delete account, category management API.

## 8. Main User Flows
- **Onboard:** Sign up → token stored → Dashboard.
- **Return:** Open app → token restored → `/api/users/me` validates → Dashboard (else Login).
- **Add transaction:** Page → "Add" → modal form → submit → success toast → list & totals refresh.
- **Edit/Delete:** Row action → modal / confirm dialog → toast → refresh.
- **Review:** Dashboard → change range / open Transactions → filter.
- **Export:** Click Export → authenticated download of `.xlsx`.
- **Account:** Profile → edit details or change password → toast.
- **Logout:** Clear token → Login.

## 9. Functional Requirements
- FR1: All app routes except Login/Signup require a valid token; 401 → clear session → Login.
- FR2: Transaction fields are exactly `description`, `amount`, `category`, `date` (+ server-set `type`, `userId`, timestamps).
- FR3: Amounts shown are always from the API; **no mock/fake data** in production code.
- FR4: Totals/percentages displayed must be computed from API data (or API-provided fields) only.
- FR5: Forms validate required fields and positive numeric amount client-side (backend only checks presence).
- FR6: Destructive actions need confirmation.
- FR7: Currency formatting through one shared formatter. Currency itself is `NEEDS REVIEW` (not defined anywhere in the code).

## 10. Non-Functional Requirements
- Responsive 360px → 1440px+; WCAG AA contrast; keyboard accessible.
- No secrets in repo or client bundle; config via `.env`.
- Initial load < 3s on a normal connection; no layout shift on data load.
- Consistent error handling; no unhandled promise rejections or console errors.
- ESLint clean; `vite build` passes.

## 11. Definition of Done (per feature)
- Works end-to-end against the real backend with a real user.
- Loading, empty, error, success states implemented.
- Responsive at mobile / tablet / desktop.
- Matches DESIGN.md; follows RULES.md; no dummy data; no new unapproved dependencies.
- ESLint + build pass; manual test checklist for the phase completed.
- MEMORY.md updated.
