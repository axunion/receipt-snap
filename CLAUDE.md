# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

Receipt Snap is a mobile-first SolidJS expense/receipt management app. Users photograph receipts, fill out expense forms, and submit to a backend API. The frontend is backend-agnostic — any server that accepts JSON and returns `{ result: "done" | "error" }` responses works.

## Commands

```bash
pnpm dev              # Start Vite dev server
pnpm build            # Type-check (tsc -b) then Vite build
pnpm preview          # Preview production build
pnpm check            # Biome lint + format check + type-check
pnpm fix              # Auto-fix lint + format issues
pnpm test             # Run Vitest (unit tests)
pnpm test:watch       # Vitest in watch mode
```

## Tech Stack

- **SolidJS 1.9** — fine-grained reactivity (NOT React; no virtual DOM, no re-renders)
- **Vite 7** — build tool
- **TypeScript 5.9** — strict mode enabled
- **CSS Modules + Lightning CSS** — scoped styles, native CSS nesting, auto vendor prefixes
- **Biome 2** — linter and formatter (no ESLint/Prettier)
- **Vitest 4** — unit tests; `@solidjs/testing-library` + `happy-dom`
- **pnpm** — package manager (Node 24, versions pinned via `devEngines`)

## Architecture

### Directory Layout

```
src/
├── features/
│   └── expense-form/         # Feature module (the only feature)
│       ├── model/            # Business logic: stores, hooks, state
│       └── ui/               # UI components for this feature
│           └── camera/       # Receipt camera/upload components
├── components/
│   ├── ui/                   # Shared presentational components (no business logic)
│   └── dev/                  # Dev-only tools (DevPanel)
├── hooks/                    # Shared cross-feature hooks (useBodyScrollLock)
├── services/                 # API communication (fetch wrapper, reCAPTCHA)
├── types/                    # Shared TypeScript type definitions
├── utils/                    # Pure utilities (validation, image, date, format)
├── constants/                # Named constants (validation limits, messages, config)
└── layouts/                  # Page layout components (MainLayout)
```

### Key Files

- **`src/features/expense-form/ExpenseFormFeature.tsx`** — Feature entry point: wires `useParentMessage`, renders `ExpenseFormScreen`
- **`src/features/expense-form/model/expenseFormStore.ts`** — Global form state (signals via `createRoot`)
- **`src/features/expense-form/model/destinationStore.ts`** — Destination list via `createResource`
- **`src/features/expense-form/model/useExpenseForm.ts`** — Core form logic: validation, touched tracking, submit
- **`src/features/expense-form/model/useExpenseFormController.ts`** — Connects model to UI (coordinates hooks)
- **`src/features/expense-form/model/useParentMessage.ts`** — iframe postMessage: receives name from parent app
- **`src/features/expense-form/model/useReceiptImage.ts`** — Image selection, validation, compression
- **`src/features/expense-form/ui/ExpenseFormScreen.tsx`** — Top-level UI: layout, modals, form fields
- **`src/services/api.ts`** — `apiRequest<T>()`, `fetchDestinations()`, `submitExpense()` (mock mode in DEV)
- **`src/utils/validation.ts`** — Field and form validation functions
- **`src/utils/imageCompression.ts`** — HEIC→JPEG, canvas-based compression (900×1600, 70% JPEG)
- **`src/constants/validation.ts`** — Validation limits as named constants

### State Management

- **Local**: `createSignal()` for component-scoped state
- **Global**: Stores use `createRoot()` to persist across component lifecycle
- **Server**: `createResource()` for async/API data

### Testing Patterns

- **Unit tests**: Vitest + `@solidjs/testing-library`, environment `happy-dom`, globals enabled
- **Hooks**: `renderHook()` from `@solidjs/testing-library`
- **Module mocks**: `vi.hoisted()` + `vi.mock()` pattern (see `useExpenseForm.test.ts`)
- **Store state**: Reset manually in `beforeEach` via store setter functions
- **Test files**: Co-located with source, `*.test.ts` or `*.test.tsx`

## Conventions

- **Language**: Chat in Japanese, code/comments/commits/logs in English
- **Commit prefixes**: `feat:`, `fix:`, `chore:`, `refactor:`, `style:`
- **Branch prefixes**: `feature/`, `bugfix/`, `chore/`, `refactor/`
- **Path alias**: `@/*` → `src/*`
- **Indentation**: Tabs (per `.editorconfig`)
- **`any` is forbidden** — use proper types, discriminated unions, utility types
- **No self-evident comments** — only document non-obvious logic
- **Conditional rendering**: `<Show>`, `<For>`, `<Switch>` (not ternaries or `&&`)
- **Modals/overlays**: `<Portal>`
- **Cleanup**: `onCleanup()` for all subscriptions, timers, event listeners
- **CSS nesting**: `&` for pseudo-classes/elements; nest `@media` inside selectors
- **Exports**: Feature-level barrel `index.ts` files; prefer named exports

## Environment Variables

In `.env.local` (not committed):
- `VITE_RECAPTCHA_SITE_KEY` — Google reCAPTCHA v3 site key
- `VITE_API_BASE_URL` — Backend API URL
  - `Content-Type` is intentionally omitted in `submitExpense` to avoid CORS preflight with GAS. Other backends may need it added.
- `VITE_ALLOWED_ORIGINS` — Comma-separated list of origins allowed to send postMessage events (e.g. `https://parent.example.com,http://localhost:3000`). `window.location.origin` is always allowed and does not need to be listed. Omit this variable to restrict to same-origin only.
