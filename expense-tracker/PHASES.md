# PHASES.md — Implementation Roadmap

**Protocol:** work **one phase at a time**. Do not start the next phase until the user confirms the current one. Re-read `RULES.md` at the start of each phase and update `MEMORY.md` at the end.

---

## Phase 0 — Project Audit  ✅ (done in this document set)
- **Goal:** Establish the facts. **Result:** see `ARCHITECTURE.md`.
- **Remaining:** user confirms findings; user rotates the leaked DB credential (manual, outside code).

---

## Phase 1 — Backend/API Verification & Critical Fixes
- **Goal:** A backend whose contracts match `ARCHITECTURE.md` and is safe to build on.
- **Tasks**
  1. *(Manual, user)* Rotate the MongoDB Atlas user password; confirm `.env` is git-ignored.
  2. Add `.gitignore` (root/backend: `node_modules`, `.env`, `*.xlsx`) and `backend/.env.example`; remove committed `income_details.xlsx` from tracking.
  3. `config/db.js` → `process.env.MONGO_URI`, awaited, with error handling. Require `JWT_SECRET` (fail fast if missing).
  4. Fix `expense` delete (`findOneAndDelete({_id,userId})`) and expense Excel export (`expenseModel`); export via in-memory buffer (`XLSX.write` → `res.send`) instead of shared files — for **both** income and expense.
  5. Fix dashboard: build `recentTransactions` from real documents (latest N of both, sorted by `date`/`createdAt`), build `expenseDistribution` via `$group` by category, fix end-of-month boundary (`< start of next month`).
  6. Fix `datafilter.js` weekly start (start-of-day, no mutation).
  7. Whitelist fields in `updateExpense`; validate `amount` is a positive number in add/update (both models); handle duplicate email on profile update (400).
  8. Perform only lightweight backend verification: server startup, database connection, and basic verification of the critical fixes. Do not exhaustively test every endpoint. Full endpoint/E2E testing will happen once at the end of the project.
- **Files likely affected:** `backend/config/db.js`, `controllers/{expense,income,dashboard,user}Controller.js`, `utils/datafilter.js`, `server.js`, new `.env.example`, `.gitignore`.
- **Dependencies:** user approval of each significant change (RULES §3); Phase 0.
- **Completion:** all 19 endpoints return documented shapes; no hardcoded secrets; export/delete/dashboard verified with real data; response keys unchanged (additive only); results logged in `MEMORY.md`.

---

## Phase 2 — Frontend Foundation
- **Goal:** Clean, buildable app skeleton wired to the API.
- **Tasks**
  1. Fix `Layout` import case; add `<Outlet/>`; remove unused state from `App.jsx`.
  2. Install approved deps (`lucide-react`, `recharts`); remove `uuid` usage and `assets/dummy.js`.
  3. Add Inter font, design tokens (`index.css` `@theme`), base styles per `DESIGN.md`.
  4. Create `services/api.js` (fetch wrapper: base URL from `VITE_API_URL`, Bearer header, JSON/blob helpers, 401 handling) and per-resource service files with **response adapters** (normalize `data`/`date`/`income` keys).
  5. Create `utils/format.js` (currency, date) and `frontend/.env.example`.
  6. Build shared UI primitives: Button, Input, Select, Card, Modal, ConfirmDialog, Toast, Spinner/Skeleton, EmptyState, ErrorState, Badge.
  7. App shell: sidebar (desktop) + bottom nav (mobile) + top bar; route table with placeholders.
  8. Retire `dummyStyles.js`/`color.jsx` as pages migrate (keep category→icon map in a small clean file).
- **Files:** `src/{App,main,index.css}`, `src/component/*`, `src/services/*`, `src/utils/*`, `package.json`.
- **Dependencies:** Phase 1 (for real endpoints).
- **Completion:** `npm run dev`, `lint`, `build` pass on a case-sensitive FS; shell renders at all breakpoints; no dummy data imports.

---

## Phase 3 — Authentication
- **Goal:** Working signup/login/logout with protected routes.
- **Tasks:** `AuthContext` (token + user, restore on load via `/api/users/me`); Login & Signup pages (validation, server errors, loading); `ProtectedRoute` / `PublicRoute`; logout; global 401 → logout; decide storage (default: `localStorage` token, `NEEDS REVIEW` for "remember me").
- **Files:** `src/context/AuthContext.jsx`, `src/pages/{Login,Signup}.jsx`, `src/component/ProtectedRoute.jsx`, `App.jsx`, `services/authService.js`.
- **Dependencies:** Phase 2.
- **Completion:** register → auto-login → dashboard; refresh keeps session; invalid/expired token redirects; logged-out users can't reach app routes; error messages from backend displayed.

---

## Phase 4 — Dashboard
- **Goal:** Real-data monthly overview.
- **Tasks:** stat cards (income, expense, savings, savings rate); expense-by-category chart (donut or bar); recent transactions list; links to full pages; all four states.
- **Data:** `GET /api/dashboard/data` (post-Phase-1 fix). No other numbers invented.
- **Files:** `pages/Dashboard.jsx`, `component/dashboard/*`, `services/dashboardService.js`.
- **Dependencies:** Phases 1–3.
- **Completion:** values equal manual sums of the user's current-month data; empty account shows an empty state, not zeros-as-fake-charts.

---

## Phase 5 — Expense Management
- **Goal:** Full expense CRUD + export.
- **Tasks:** list (date desc), add/edit modal, delete confirm, category filter, range filter via `/expense/overview?range=`, summary strip, Excel download (blob with auth).
- **Files:** `pages/Expenses.jsx`, `component/transactions/*`, `services/expenseService.js`.
- **Dependencies:** Phase 4 primitives; Phase 1 fixes (delete, export).
- **Completion:** create/edit/delete reflected immediately and persisted; export opens in Excel; validation + error toasts work.

---

## Phase 6 — Income Management
- **Goal:** Mirror of Phase 5 for income.
- **Tasks:** reuse shared transaction components (parameterized by type, no duplication); `/income/*` endpoints; export.
- **Files:** `pages/Income.jsx`, `services/incomeService.js` (+ shared components).
- **Completion:** same as Phase 5; update sends all four fields.

---

## Phase 7 — Transactions & Analytics
- **Goal:** Unified history and simple insights from real data.
- **Tasks:** Transactions page merging `/income/get` + `/expense/get`; type/category/date-range filters, text search (client-side); sort; income-vs-expense and category charts computed from fetched data; range selector driven by overview endpoints.
- **Files:** `pages/Transactions.jsx`, `component/charts/*`, `utils/aggregate.js`.
- **Completion:** totals reconcile with Dashboard and pages; performance acceptable for several hundred rows; (pagination is **out of scope** — requires backend, `NEEDS REVIEW`).

---

## Phase 8 — Profile / Settings
- **Goal:** Account management using existing endpoints only.
- **Tasks:** profile view/edit (`/me`, `/profile`) with context sync (note response uses `_id`); change password (`/password`) with confirm field; logout button.
- **Files:** `pages/Profile.jsx`, `AuthContext`.
- **Completion:** updates persist and reflect in the shell; duplicate email error shown; no unsupported features (avatar, delete account) added.

---

## Phase 9 — Responsive Design
- **Tasks:** audit every page at 360/414/768/1024/1440; tables → cards on mobile; modals as bottom sheets on mobile; verify touch targets ≥ 44px; no horizontal scroll.
- **Completion:** checklist passes on real device or devtools; no overflow/clipping.

---

## Phase 10 — UX, Error, Loading & Empty States
- **Tasks:** consistent skeletons; retry on errors; empty states with CTA; success toasts; form focus management; offline/network error message; 404 page; page titles.
- **Completion:** every async view has all four states; no console errors; Lighthouse accessibility ≥ 90.

---
## Final Testing Strategy

IMPORTANT: There is NO separate testing phase.

This project is being developed using a limited/free AI coding plan, so AI usage and quota must be conserved.

During each development phase:
- Perform only lightweight sanity checks.
- Run build/lint when practical.
- Check for obvious compile/runtime errors.
- Verify only the feature implemented in the current phase.
- Fix errors directly related to the current phase.
- Do not perform exhaustive testing.
- Do not test unrelated features.
- Do not repeatedly test the entire application.

Do NOT spend quota on:
- Full E2E testing after every phase
- Testing every button after every phase
- Repeated regression testing
- Testing unfinished features
- Re-running tests that have already passed unless relevant code changed

After ALL implementation phases are complete, perform ONE comprehensive final test of the complete website.

The final test must cover:

### Backend
- Server startup
- MongoDB connection
- Registration/login
- JWT authentication
- Protected routes
- Income CRUD
- Expense CRUD
- Dashboard
- Excel exports
- Validation
- Error handling
- User ownership/isolation

### Frontend
- Signup
- Login/logout
- Session persistence
- Protected/public routes
- Dashboard
- Expenses
- Income
- Transactions
- Profile
- Filters/search
- Charts
- Forms
- Modals
- Loading states
- Empty states
- Error states
- Toasts
- Responsive layouts
- Navigation
- 404 page

### Integration
Verify that frontend data matches the real backend APIs and database data.

### Final Quality
- No console errors
- No broken routes
- No obvious UI bugs
- No fake/mock production data
- Production build succeeds
- Lint succeeds
- Environment variables work correctly
- No secrets committed
- Documentation matches the actual project

Fix all discovered issues during this single final testing pass.

After the final testing pass, do not create another testing phase.




## Phase 11 — Final Portfolio Polish
- **Tasks:** root `README.md` (overview, stack, setup, env vars, screenshots, API summary); `.env.example` files; remove dead code/assets (`dummy*.js`, unused svgs, large `logo.png` if unused); production build check; deployment notes; seed instructions that use the real app only (no fake data in repo).
- **Completion:** fresh clone → documented setup works; lint/build clean; no secrets in git history going forward; all docs match reality.
