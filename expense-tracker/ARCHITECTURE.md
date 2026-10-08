# ARCHITECTURE.md — How the Existing System Works

> Based on a **static read** of the code. Nothing was run (no `.env`, DB not reachable). Runtime claims are marked `NEEDS REVIEW`. No application code was modified.

## 1. Folder Structure
```
expense-tracker/
├─ backend/                      ESM ("type": "module"), Express 5, Mongoose 9
│  ├─ server.js                  app setup, routes mount, listen (PORT || 4000)
│  ├─ config/db.js               mongoose connect  ⚠ hardcoded URI
│  ├─ middleware/auth.js         JWT Bearer guard → req.user
│  ├─ models/ userModel.js incomeModel.js expenseModel.js
│  ├─ controllers/ userController.js incomeController.js expenseController.js dashboardController.js
│  ├─ routes/ userRoutes.js incomeRoute.js expenseRoute.js dashboardRoute.js
│  ├─ utils/datafilter.js        getDateRange(range) → {start,end}
│  └─ income_details.xlsx        ⚠ generated artifact committed (export side-effect)
└─ frontend/                     Vite 8 + React 19 + Tailwind 4 (JS, not TS)
   └─ src/
      ├─ main.jsx                BrowserRouter + <App/>
      ├─ App.jsx                 Routes; unused auth state; unused logout fn
      ├─ index.css               only `@import "tailwindcss";`
      ├─ component/ Layout.jsx Navbar.jsx      (folder is singular "component")
      ├─ pages/ Dashboard.jsx                  (empty shell)
      └─ assets/ dummy.js dummyStyles.js color.jsx logo.png react.svg   (legacy/template leftovers)
```
No tests, no root README, no `.env.example`, no root/backend `.gitignore` found.

## 2. Backend Architecture
- Express app: `cors()` (open to all origins), `express.json()`, `express.urlencoded`.
- Pattern: **routes → (auth middleware) → controller → Mongoose model**. No service layer, no validation layer, no global error handler.
- DB connection: `connectDB()` is called un-awaited with no `.catch`.
- Mounts: `/api/users`, `/api/income`, `/api/expense`, `/api/dashboard`, `GET /` → "API working".
- Scripts: only `start` = `nodemon server.js` (no dev/prod split).
- Dependencies: express 5, mongoose 9, jsonwebtoken, bcryptjs, validator, cors, dotenv, xlsx, nodemon (in `dependencies`), body-parser (**unused**).

## 3. Database / Models (MongoDB via Mongoose)
**user** — `name` String req · `email` String req unique · `password` String req (bcrypt hash). No timestamps; email not lowercased/trimmed.

**income** — `description` String req · `amount` Number req · `category` String req (free text, no enum) · `date` Date req · `userId` ObjectId ref `"user"` req · `type` String default `"income"` · timestamps.

**expense** — identical fields; `type` default `"expense"`.

Notes: no `min` on `amount`; no indexes besides `email`; model guard `mongoose.model.x || …` is incorrect (should be `mongoose.models.x`) but harmless.

## 4. Authentication Flow
1. `POST /api/users/register|login` → returns `{ success, message, token, user:{id,name,email} }`.
2. Token = JWT `{ id }`, signed with `JWT_SECRET` (**fallback `"secret"`**), expiry `TOKEN_EXPIRY` (default `24h`).
3. Client sends `Authorization: Bearer <token>` on protected routes.
4. `middleware/auth.js` verifies, loads user (`-password`) into `req.user`; failures → `401 { success:false, message }`.
5. No refresh token, no logout endpoint (logout = client discards token).
6. Frontend intent (from `App.jsx`): keys `token` and `user` in `localStorage`/`sessionStorage` — `NEEDS REVIEW` (not implemented).

## 5. API Endpoints
Base URL: `http://localhost:4000` (default). All JSON unless noted. "OK" = reads correct; "BROKEN" = will fail/return wrong data per code reading.

| Method | Endpoint | Purpose | Auth | Request | Response |
|---|---|---|---|---|---|
| GET | `/` | Health text | No | — | `"API working"` (text) |
| POST | `/api/users/register` | Create account | No | `{name,email,password(≥8)}` | `201 {success,message,token,user{id,name,email}}`; `400` validation/exists |
| POST | `/api/users/login` | Login | No | `{email,password}` | `200 {success,message,token,user{id,name,email}}`; `400` invalid creds |
| GET | `/api/users/me` | Current user | Yes | — | `{success,user{id,name,email}}` |
| PUT | `/api/users/profile` | Update name/email | Yes | `{name,email}` | `{success,message,user{_id,name,email}}` (note `_id`, not `id`) |
| PUT | `/api/users/password` | Change password | Yes | `{currentPassword,newPassword(≥8)}` | `{success,message}` |
| POST | `/api/income/add` | Add income | Yes | `{description,amount,category,date}` | `201 {success,message,income}` |
| GET | `/api/income/get` | List all (date desc) | Yes | — | **raw array** of income docs |
| PUT | `/api/income/update/:id` | Update | Yes | `{description,amount,category,date}` (send all) | `{success,message,income}`; `404` |
| DELETE | `/api/income/delete/:id` | Delete | Yes | — | `{success,message}`; `404` — OK |
| GET | `/api/income/downloadexcel` | Export `.xlsx` | Yes | — | file download (OK*, see §8) |
| GET | `/api/income/overview?range=` | Range totals | Yes | `range`: daily/weekly/monthly(default)/yearly | `{success,data{totalIncome,averageIncome,numberOfTransactions,recentTransactions(≤9),range}}` |
| POST | `/api/expense/add` | Add expense | Yes | `{description,amount,category,date}` | `200 {success,message,data}` (key `data`) |
| GET | `/api/expense/get` | List all (date desc) | Yes | — | **raw array** of expense docs |
| PUT | `/api/expense/update/:id` | Update | Yes | any body fields (mass-assigned) | `{success,message}` (no doc returned) |
| DELETE | `/api/expense/delete/:id` | Delete | Yes | — | **BROKEN**: calls `expense.remove()` (removed in Mongoose ≥7) → `500` |
| GET | `/api/expense/downloadexcel` | Export `.xlsx` | Yes | — | **BROKEN**: references undefined `Expense` → `500` |
| GET | `/api/expense/overview?range=` | Range totals | Yes | same `range` | `{success,date{totalExpense,averageExpense,numberOfTransactions,recentTransactions(≤5),range}}` — key is **`date`**, not `data` |
| GET | `/api/dashboard/data` | Current-month summary | Yes | — | `{success,data{monthlyIncome,monthlyExpense,savings,savingsRate,recentTransactions,expenseDistribution}}` — first four OK; last two **BROKEN** (§8) |

Standard error shape: `{ success:false, message }`. Success shapes are **inconsistent** (see §8).

## 6. Frontend Architecture (current)
- React 19 + react-router-dom 7 (`BrowserRouter` in `main.jsx`), Tailwind 4 via `@tailwindcss/vite`.
- Only route: `/` → `Layout` → `Dashboard` (empty). No `/login`, `/signup`, no auth guard, no API layer, no state/context.
- `Layout` renders only `Navbar`; **no `<Outlet/>`**, so child routes never display.
- `Navbar` shows the text "Expense Tracker" only.
- `assets/dummyStyles.js` (~33 KB of Tailwind class-string objects, gradients) and `color.jsx` (icon/color maps) are leftovers from a template; `dummy.js` contains **fake financial data**.
- Missing packages: `lucide-react` and `uuid` are imported by assets but **not in package.json**; no HTTP client, chart lib, or toast lib installed.
- No `VITE_API_URL` / env usage.

## 7. Frontend ↔ Backend Data Flow (target)
```
Component → hook/service (api client adds Bearer token) → /api/... → controller → Mongoose → MongoDB
                         ↑ 401 → clear session → /login
```
- Single API client module; normalizes the inconsistent response shapes (§8) **in the frontend adapter**, without changing backend contracts.
- Transactions page = merge of `/income/get` + `/expense/get` (each doc has `type`).
- Excel export must be fetched with the Authorization header and saved as a blob (a plain `<a href>` cannot send the header).

## 8. Known Inconsistencies & Problems
**Security (fix first)**
1. `config/db.js` has a **hardcoded MongoDB Atlas URI with credentials**. Treat as leaked: rotate the DB user password, move to `MONGO_URI` env var.
2. `JWT_SECRET` falls back to `"secret"`; must be required via env.
3. CORS fully open; no helmet/rate limiting; `getUserDetails` logs `req.user`.
4. No `.gitignore` for backend/root → risk of committing `.env`/`node_modules`; `income_details.xlsx` (real-looking test data) is committed.

**Backend bugs**
5. `DELETE /expense/delete/:id` → `expense.remove is not a function`.
6. `GET /expense/downloadexcel` → `Expense` is not defined.
7. Dashboard `recentTransactions` is built from **aggregate results** (`[{_id:null,total}]`), not documents → meaningless objects, sort by undefined `createdAt`.
8. Dashboard `expenseDistribution` loops the same aggregate result, so `category`/`amount` are undefined → always `Other: 0`.
9. Dashboard `endOfMonth = new Date(y, m+1, 0)` is midnight of the last day → last-day transactions are excluded.
10. `datafilter.js` weekly range mutates `now` and keeps current time-of-day (start isn't start-of-day).
11. Excel export writes a **shared fixed filename** into server cwd (`expense_details.xlsx`/`income_details.xlsx`) → concurrent users can receive each other's data; file never cleaned.
12. `PUT /expense/update/:id` uses `Object.assign(expense, req.body)` → client can overwrite `userId`/`type`. `PUT /income/update` sends `undefined` for omitted fields and builds `new Date(undefined)`.
13. Email uniqueness not handled on profile update (Mongo duplicate-key → 500). Login failure returns 400 (not 401).
14. No numeric/positive validation on `amount`; `0` rejected by falsy check.
15. `connectDB()` unhandled rejection; `body-parser` unused; nodemon in `dependencies`.

**Contract inconsistencies**
| Concern | Income | Expense |
|---|---|---|
| Add response key | `income` (201) | `data` (200) |
| Update response | `{income}` | no doc |
| Overview payload key | `data` | `date` |
| Recent list size | 9 | 5 |
| List endpoint | raw array | raw array (both unlike other `{success,...}` responses) |

**Frontend**
16. `App.jsx` imports `./component/layout` but file is `Layout.jsx` → fails on case-sensitive filesystems (Linux/CI); works on Windows/macOS by accident.
17. Layout has no `<Outlet/>`; `App` never passes `user`/`onLogout`; auth state is unused.
18. Missing deps (`lucide-react`, `uuid`); `lobster-regular` font class referenced but font never loaded; template gradients conflict with DESIGN.md.
19. Currency not defined anywhere — `NEEDS REVIEW`.

## 9. Do NOT Change Without a Valid Reason (and approval)
- Route paths and HTTP verbs listed in §5.
- Model field names/types (`description, amount, category, date, userId, type`; user `name,email,password`).
- Auth scheme (JWT Bearer, payload `{id}`), bcrypt hashing, password min length 8.
- `{success,message}` error shape.
- Stack: Express + Mongoose (ESM) backend; React + Vite + Tailwind + react-router frontend.
- Backend response-shape inconsistencies: **handle in a frontend adapter**; only fix on backend with explicit approval and a backward-compatible change.

Allowed (with a short explanation first): fixing the bugs in §8 items 1–15.
