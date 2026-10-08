# DESIGN.md — UI/UX Source of Truth

**Direction:** Clean · Modern · Minimal · Professional · High contrast.
**Look:** neutral background + white surfaces + dark primary + meaningful green/red/blue. Should read as a real finance SaaS, not a college project.
**Hard rule:** UI shows **real backend data only**. Never fake numbers, charts, or APIs.

## 1. Principles
1. **Clarity over decoration** — numbers are the hero.
2. **Meaningful color** — green = income/positive, red = expense/negative, blue = info/links/focus. Color is never the only signal (add sign, icon, or label).
3. **Consistency** — same component, same look, everywhere.
4. **Calm density** — generous whitespace, tight hierarchy, no clutter.
5. **Every state designed** — loading, empty, error, success.

## 2. Design Tokens (Tailwind v4 — put in `src/index.css`)
```css
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

  /* Neutrals */
  --color-bg: #F6F7F9;
  --color-surface: #FFFFFF;
  --color-surface-muted: #F9FAFB;
  --color-border: #E4E7EC;
  --color-border-strong: #D0D5DD;
  --color-text: #101828;
  --color-text-muted: #475467;
  --color-text-subtle: #667085;   /* ≥4.5:1 on white; use for secondary only */

  /* Primary (dark) */
  --color-primary: #111827;
  --color-primary-hover: #1F2937;
  --color-primary-contrast: #FFFFFF;

  /* Semantic */
  --color-income: #027A48;     --color-income-bg: #ECFDF3;
  --color-expense: #B42318;    --color-expense-bg: #FEF3F2;
  --color-info: #175CD3;       --color-info-bg: #EFF8FF;
  --color-warning: #B54708;    --color-warning-bg: #FFFAEB;

  --radius-sm: 6px; --radius-md: 8px; --radius-lg: 12px;
  --shadow-sm: 0 1px 2px rgba(16,24,40,.06);
  --shadow-md: 0 4px 12px rgba(16,24,40,.08);
  --shadow-lg: 0 12px 32px rgba(16,24,40,.14);
}
body { background: var(--color-bg); color: var(--color-text); font-family: var(--font-sans); }
```
Load Inter (weights 400/500/600/700) via `<link>` in `index.html` with `display=swap`. Remove the unused `lobster-regular` reference.

## 3. Typography
| Role | Size / weight | Use |
|---|---|---|
| Display | 30/36 · 700 | Hero stat values |
| H1 | 24/32 · 600 | Page title |
| H2 | 18/28 · 600 | Section/card title |
| Body | 14/20 · 400 | Default |
| Label | 13/18 · 500 | Form labels, table headers |
| Caption | 12/16 · 400 | Meta, hints |
- Use `tabular-nums` for all money. Line length ≤ 70ch. No more than 2 weights per view.

## 4. Spacing & Layout
- 4px base scale (4, 8, 12, 16, 24, 32, 48). Card padding 20–24px (16 on mobile). Section gap 24px.
- Content max-width 1200px, centered; page padding 16 (mobile) / 24 (≥md) / 32 (≥lg).
- Radius: inputs/buttons 8px, cards 12px, chips/badges full. **Nothing larger than 12px** except pills/avatars.
- Shadows: cards use `shadow-sm` + 1px border; modals `shadow-lg`. No colored shadows.

## 5. Navigation
- **Desktop (≥1024):** fixed left sidebar 240px (collapsible optional): logo, Dashboard, Transactions, Expenses, Income, Profile; user chip + Logout at bottom. Active item: dark text, `surface-muted` bg, 2px left indicator.
- **Tablet (768–1023):** icon-only sidebar (72px) or top bar with menu.
- **Mobile (<768):** top bar (logo + page title) and **bottom tab bar** (Dashboard, Transactions, [+ Add], Expenses/Income, Profile) — 56px high, safe-area aware, 44px targets. The center "+" opens a type chooser sheet.
- Icons: `lucide-react`, 20px, stroke 1.75, paired with text labels.

## 6. Dashboard Layout
1. Header: "Dashboard" + current month label + primary "Add transaction" button.
2. **Stat cards row (4):** Income · Expense · Savings · Savings rate (grid 1 col mobile / 2 col sm / 4 col lg).
3. Two-column: **Expense by category** (chart + legend list with amount & %) · **Recent transactions** (≤8).
4. Footer link actions: "View all transactions".

## 7. Stat Cards
Surface card; small muted label with icon chip; Display-size value (`tabular-nums`); optional caption (e.g., "This month"). Income value in `--income`, expense in `--expense`, savings green if ≥0 else red; rate neutral/info. No gradients, no trend arrows unless computed from real data.

## 8. Expense / Income / Transaction UI
- **Row (desktop table):** Date · Description (+ category badge) · Category · Amount (right-aligned) · Actions (edit/delete icon buttons).
- **Row (mobile card):** category icon chip, description, date + category, amount right-aligned.
- Amount: expense `−₹…` red, income `+₹…` green (symbol per shared formatter; currency `NEEDS REVIEW`).
- Filters bar: range segmented control (Day/Week/Month/Year/All), category select, search (Transactions). Sticky on scroll for lists.
- Summary strip above list: total, average, count (from overview endpoints).
- Type badge on Transactions: green "Income" / red "Expense".

## 9. Forms
- Single-column, label above input, 40px height inputs, 8px radius, 1px `border-strong`, focus ring 2px `--info` + offset.
- Required marked with `*`; errors below field in `--expense` with icon + text; helper text in `text-subtle`.
- Amount: numeric input, `inputmode="decimal"`, min > 0. Date: native date input, default today. Category: select with a **client-side suggestion list** (backend accepts free text — `NEEDS REVIEW` if category enum is desired).
- Submit button shows spinner and disables during request.

## 10. Buttons
| Variant | Style |
|---|---|
| Primary | bg `primary`, white text, hover `primary-hover` |
| Secondary | white, 1px border, dark text, hover `surface-muted` |
| Danger | bg `expense`, white text (confirm dialogs only) |
| Ghost / Icon | transparent, hover `surface-muted`; icon buttons 36–40px with `aria-label` |
Height 40px (36 compact); one primary per view; min touch target 44px on mobile.

## 11. Modals & Dialogs
Centered (max-w 480px) on desktop, **bottom sheet** on mobile; overlay `rgba(16,24,40,.5)`; focus trap, ESC/overlay close, return focus; title + close button. Delete uses a small confirm dialog with Danger button and item description.

## 12. Toasts
Top-right desktop / top-center mobile, 4s auto-dismiss (errors 6s), max 3 stacked, `role="status"` (`alert` for errors). Left color bar + icon: success green, error red, info blue. Short sentence copy.

## 13. Loading / Empty / Error States
- **Loading:** skeletons matching final layout (cards, rows); button spinners for actions. Avoid full-page spinners except initial auth restore.
- **Empty:** icon, one-line title, one-line help, primary CTA ("Add your first expense").
- **Error:** icon, "Couldn't load X", server message if available, **Retry** button. Inline form errors for validation.
- **Success:** toast + optimistic-free refresh (refetch after mutation).

## 14. Charts (recharts)
- Expense by category: donut (≤6 slices + "Other") **with a legend list showing amount and %**; or horizontal bars for >6.
- Income vs Expense: grouped bars by period.
- Palette (categorical): `#175CD3, #027A48, #B54708, #6941C6, #C11574, #475467`; income series green, expense series red.
- Light gridlines `--border`, axis labels 12px `text-muted`, tooltips white card + shadow-md, formatted money. Charts must have a text alternative (legend/table). Fixed responsive container height (240–320px). Empty data → empty state, never an empty chart.

## 15. Icons
`lucide-react` only. Category → icon map in one file (fallback: `Tag`). Icons sit in 32–36px rounded-lg `surface-muted` chips, neutral color (not rainbow).

## 16. Responsive Behavior
Mobile-first. Breakpoints: `sm 640 · md 768 · lg 1024 · xl 1280`. Tables → stacked cards <md. Stat cards 1/2/4 columns. Modals → bottom sheets <md. No horizontal page scroll at 360px. Use `min-h-dvh`, safe-area padding for bottom nav.

## 17. Accessibility
- WCAG AA contrast (tokens above are AA on white); visible focus on everything interactive.
- Semantic landmarks (`header/nav/main`), headings in order, labels bound to inputs, `aria-live` for toasts, `aria-label` on icon buttons, `scope` on table headers.
- Don't rely on color alone (±sign and text). Respect `prefers-reduced-motion`.
- Fully keyboard operable, including modals and menus.

## 18. Animation Rules
150–200ms ease-out for hover/focus/modal/toast only; fade+4px slide at most. No bouncing, parallax, or looping animations; skeleton pulse allowed. Disable under `prefers-reduced-motion`.

## 19. Component Consistency
Build once, reuse: `Button, Input, Select, Card, StatCard, Badge, Modal, ConfirmDialog, Toast, Skeleton, EmptyState, ErrorState, PageHeader, TransactionRow, FilterBar`. No page-specific one-off styling of these. Use tokens; **no arbitrary hex values in components**.

## 20. Avoid
Excess gradients (none by default) · neon/saturated colors · heavy glassmorphism/blur · large radii or pill cards · heavy shadows · random per-page colors · emoji as icons · cluttered dashboards · template-looking admin layouts · tiny low-contrast gray text · animated counters/confetti · the legacy `dummyStyles.js` look (`bg-gradient-to-br`, mixed teal/orange/cyan palettes).
