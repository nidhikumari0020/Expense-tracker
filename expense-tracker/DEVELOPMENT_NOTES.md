# Development Notes — UI/UX Polish

Targeted polish of the existing app. No pages, auth, models or existing routes were rewritten.

## What changed
- Palette-based theme (dark default + derived light theme) in one file.
- Dark Mode ON/OFF toggle.
- SVG logo (wallet + upward growth line) used in sidebar, mobile header, Login, Signup, favicon.
- Monthly Income vs Expense line chart on the Dashboard.
- Removed hardcoded `text-white` / `hover:bg-red-700` / hex chart colors in favor of tokens.
- Documentation (`README.md`, this file).

## Key decisions
- A `ThemeProvider` (context, `data-theme` attribute, `localStorage`) already existed but had no UI. It was reused, not rebuilt.
- Raw palette values are defined once (`--pal-*`) and mapped to semantic tokens (`--color-*`, `--chart-*`). Components never use hex values.
- Light theme is derived from the same palette (deep teal as primary, indigo/purple for accents), not a simple inversion.
- Chart uses Recharts (already a dependency) with CSS variables for stroke/axis/grid so it follows the theme automatically.
- A small new endpoint was added instead of changing `/api/dashboard/data`, so existing behavior is untouched.

## Theme implementation
- `frontend/src/index.css`: `:root` = dark, `:root[data-theme="light"]` = light.
- `index.html`: inline script applies saved theme before first paint.
- `context/ThemeContext.jsx`: unchanged logic (default dark, persists `theme` key).

## Monthly chart
- `GET /api/dashboard/monthly-trend?months=6` (auth required). `months` clamped to 1–12.
- Returns `[{ month, year, income, expense }]`, oldest first; empty months are `0`.
- `Dashboard.jsx` fetches it alongside the existing data call; a trend failure only logs to console and does not break the rest of the dashboard.

## API changes
- Added: `GET /api/dashboard/monthly-trend`. Nothing else changed. No model changes.

## Files changed
- Backend: `controllers/dashboardController.js`, `routes/dashboardRoute.js`
- Frontend: `src/index.css`, `index.html`, `public/favicon.svg`, `src/services/dashboardService.js`, `src/pages/Dashboard.jsx`, `src/pages/Login.jsx`, `src/pages/Signup.jsx`, `src/pages/Transactions.jsx` (one class), `src/component/Layout.jsx`, `src/component/Navbar.jsx`, `src/component/ui/Button.jsx`, `src/component/dashboard/CategoryExpenseChart.jsx`
- New: `src/component/brand/Logo.jsx`, `src/component/ui/ThemeToggle.jsx`, `src/component/dashboard/MonthlyTrendChart.jsx`, `DEVELOPMENT_NOTES.md`

## How to test
1. Start backend and frontend (see README). Sign up, log in.
2. Add income/expenses dated in different months; the Dashboard trend chart should show them.
3. Click the Dark mode switch; refresh; theme should persist. Check every page in both themes.
4. Resize to ~375px wide; no horizontal scroll, bottom nav visible, toggle in the header.
5. `cd frontend && npm run lint && npm run build`.

## Known limitations
- `Navbar.jsx` is not used by the current routes (Layout has its own header); it was updated for consistency only.
- The project has no automated tests.
- `DESIGN.md` still describes the original light, high-contrast direction and was not rewritten; `README.md` is the current reference for the theme.
- Trend window is fixed at 6 months in the UI (API supports up to 12).
