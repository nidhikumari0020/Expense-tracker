# RULES.md — Coding Constitution

These rules are mandatory for Antigravity. If a rule conflicts with a request, **stop and ask**.

## 0. Before Any Work
1. Read `MEMORY.md`, then the relevant section of `PRD.md`, `ARCHITECTURE.md`, `DESIGN.md`, and the current phase in `PHASES.md`.
2. Inspect the existing files you will touch **before** editing them.
3. Work on **one phase at a time**. Never start a later phase on your own.
4. State your plan (files to touch, why) before coding. Keep changes small and reviewable.

## 1. Truthfulness & Scope
- **Never invent** APIs, endpoints, models, fields, auth flows, or features. If it isn't in `ARCHITECTURE.md`, it doesn't exist. Unsure → write `NEEDS REVIEW` and ask.
- Do not touch unrelated files. No drive-by refactors, renames, or reformatting.
- Do not rewrite working code. Prefer the smallest change that works.
- Do not duplicate functionality: search for an existing component/hook/util first, then reuse it.

## 2. Architecture
- Keep the MERN stack: Express + Mongoose (ESM) backend, React + Vite + Tailwind + react-router frontend. JavaScript only (no TypeScript migration).
- **Preserve API contracts** (paths, verbs, request/response shapes). Absorb inconsistencies in a frontend adapter (`src/services/`).
- Frontend structure: `src/{pages,component,services,hooks,context,utils}`. Keep the existing singular folder `component/` (do not rename).
- File names: components `PascalCase.jsx`; hooks `useThing.js`; utils `camelCase.js`. **Import paths must match file case exactly.**

## 3. Backend Changes (restricted)
- Backend edits are allowed only to fix issues listed in `ARCHITECTURE.md §8` or when a phase explicitly requires it.
- **Explain every significant backend change first** (what, why, impact on contract) and wait for approval.
- Fixes must be backward-compatible. Never change existing field names or response keys; add, don't rename.
- Always scope queries by `userId` from `req.user`. Never trust `userId`/`type` from the request body.
- Use env vars for all config: `MONGO_URI`, `JWT_SECRET` (no fallback), `TOKEN_EXPIRY`, `PORT`, `CLIENT_URL`. Provide `.env.example` (placeholders only).

## 4. Security
- **Never expose secrets**: no credentials, URIs, tokens, or keys in code, logs, docs, commits, or the client bundle. Never print or copy the existing hardcoded DB URI.
- Never log passwords, tokens, or full user objects.
- Never store the password client-side. Store only the token (and minimal user info).
- Validate and sanitize all user input on the client for UX; assume the server is the authority.
- Do not use `dangerouslySetInnerHTML`.

## 5. Data Integrity
- **No fake financial data** in the final app: no mock arrays, random generators, hardcoded totals/percentages, or placeholder amounts. Delete `assets/dummy.js` when no longer needed.
- Every number shown comes from the API. Derived values (e.g., net, percentages) are computed from API data in one shared util.
- Money formatting only through the shared formatter. Dates through the shared date util.
- Don't mutate API responses; map into view models.

## 6. Dependencies
- Avoid new dependencies. Pre-approved minimal set for the frontend: `lucide-react` (already referenced), `recharts` (charts). Everything else (HTTP client = native `fetch` wrapper, toasts, modals, forms) is built in-house.
- Any other package needs a one-line justification and approval. Remove unused/unreferenced packages only with approval.

## 7. UI/UX
- Follow `DESIGN.md` strictly; use design tokens, not ad-hoc colors/sizes.
- Every data view handles **loading, error (with retry), empty, and success** states.
- Every form handles: validation errors, disabled+spinner while submitting, server error message, success toast.
- Destructive actions require confirmation.
- Responsive at 360 / 768 / 1024 / 1440. Accessible: labels, focus rings, keyboard, aria, contrast.
- Components are reusable but **not over-engineered**: no generic abstractions until used ≥ 3 times.
- Do not keep using `assets/dummyStyles.js`; migrate to token-based Tailwind classes, then delete it.

## 8. Code Quality
- Prefer simple, readable code over clever code. Small functions, early returns, descriptive names.
- No dead code, commented-out blocks, or leftover `console.log`.
- Handle every promise; no unhandled rejections. Use `try/catch` in async handlers.
- ESLint must pass; `npm run build` must succeed before a phase is declared done.
- Comments explain *why*, not *what*.

## 9. Process
- Commit-sized changes with clear descriptions. Never delete files not created by you without approval.
- After finishing a task: run lint/build, list files changed, list what to manually test, update `MEMORY.md`.
- If you discover a new bug or inconsistency, **record it in `MEMORY.md → Known Issues`**; don't silently fix unrelated things.
- Never mark a phase complete unless every completion criterion in `PHASES.md` is met.
