# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Receipt Snap is a mobile-first SolidJS expense/receipt management app. Users photograph receipts, fill out expense forms, and submit to a Google Apps Script backend.

## Commands

```bash
pnpm dev              # Start Vite dev server
pnpm build            # Type-check (tsc -b) then Vite build
pnpm preview          # Preview production build
pnpm check            # Biome lint + format check
pnpm check:write      # Auto-fix lint + format issues
```

No test framework is configured (`pnpm test` exits with error).

## Tech Stack

- **SolidJS 1.9** — reactive framework (not React; no virtual DOM)
- **Vite 7** — build tool
- **TypeScript 5.9** — strict mode enabled
- **Tailwind CSS v4** — utility-first styling
- **Biome 2.3** — linter and formatter (no ESLint/Prettier)
- **pnpm** — package manager (Node 24 via Volta)

## Architecture

### Directory Layout

```
src/
├── components/
│   ├── ui/           # Presentational only — no business logic
│   └── features/     # Domain components (FormContainer, FormFields, camera/)
├── hooks/            # Business logic separated from UI (useExpenseForm, useImage, etc.)
├── stores/           # Global state via createRoot + createSignal (expenseFormStore, destinationStore)
├── services/         # API communication (fetch wrapper, reCAPTCHA)
├── types/            # Shared TypeScript type definitions
├── utils/            # Pure utilities (validation, image compression, date formatting)
└── constants/        # Validation limits, messages, compression settings
```

### Key Files

- **`src/components/features/FormContainer.tsx`** — Main orchestrator: wires form, modals, and layout together
- **`src/hooks/useExpenseForm.ts`** — Core form logic: validation state, touched tracking, submit handling
- **`src/stores/expenseFormStore.ts`** — Global form state (signals for each field)
- **`src/stores/destinationStore.ts`** — Destination list fetched via `createResource`
- **`src/utils/validation.ts`** — Field and form validation functions
- **`src/utils/imageCompression.ts`** — HEIC support, canvas-based compression (900x1600, 70% JPEG)
- **`src/services/api.ts`** — Generic `apiRequest<T>()` with mock mode for development
- **`src/constants/validation.ts`** — Magic numbers extracted to named constants

### Data Flow

1. User input → updates signals in `expenseFormStore`
2. `createEffect` in `useExpenseForm` runs real-time validation (only after field is touched)
3. On submit → converts image to base64, gets reCAPTCHA token, POSTs to API
4. API response uses discriminated union: `{ result: "done" | "error" }`

### State Management

- **Local**: `createSignal()` for component-scoped state
- **Global**: Stores use `createRoot()` to persist across component lifecycle
- **Server**: `createResource()` for API data fetching
- **Form**: Centralized in `expenseFormStore`, validated reactively in `useExpenseForm`

### Image Processing Pipeline

File input → `validateImageFile()` → `compressImage()` (HEIC→JPEG, canvas resize) → blob URL for preview → `fileToBase64()` on submit. Memory cleaned via `URL.revokeObjectURL()`.

## Conventions

- **Language**: Chat in Japanese, code/comments/commits/logs in English
- **Commit prefixes**: `feat:`, `fix:`, `chore:`, `refactor:`, `style:`
- **Branch prefixes**: `feature/`, `bugfix/`, `chore/`, `refactor/`
- **Path alias**: `@/*` maps to `src/*`
- **Indentation**: Tabs (per `.editorconfig`)
- **`any` is forbidden** — use proper types, discriminated unions, utility types
- **No self-evident comments** — only document complex logic
- **Conditional rendering**: Use `<Show>`, `<For>`, `<Switch>` (not ternaries)
- **Modals/overlays**: Use `<Portal>`
- **Cleanup**: Always use `onCleanup()` for resource disposal

## Environment Variables

Configured in `.env.local` (not committed):
- `VITE_RECAPTCHA_SITE_KEY` — Google reCAPTCHA v3 site key
- `VITE_API_BASE_URL` — Google Apps Script deployment URL
