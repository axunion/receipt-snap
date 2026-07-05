# CLAUDE.md

Guidance for Claude Code in this repository. Rules are ordered by importance; when in
doubt, the earlier section wins.

> **Keep in sync**: `AGENTS.md` is a mirror of this file. Apply any edit made here to
> `AGENTS.md` as well.

## Project Overview

Receipt Snap is a mobile-first SolidJS expense/receipt management app. Users photograph
receipts, fill out expense forms, and submit to a backend API. The frontend is
backend-agnostic — any server that accepts JSON and returns `{ result: "done" | "error" }`
responses works.

## Working Rules

- **Think before coding.** State assumptions; if uncertain, ask. When multiple
  interpretations exist, surface them rather than silently picking one. If a simpler path
  exists, say so and push back when warranted.
- **Simplest thing that works.** Write the minimum code that solves the stated problem —
  no speculative abstractions, flexibility, or error handling for impossible cases.
- **Surgical changes.** Every changed line traces to the request. Don't refactor,
  reformat, or "improve" adjacent code that isn't broken. Remove only the imports and
  symbols your change orphaned; mention unrelated dead code instead of touching it.
- **Goal-driven.** Turn each task into a verifiable outcome ("fix the bug" → "write a
  failing test that reproduces it, then make it pass"). For multi-step work, state a brief
  plan with a verification check per step.
- **Language.** Chat in Japanese. Code, comments, commits, logs, and AI-readable config
  files (CLAUDE.md, etc.) in English.

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

## Code Conventions

- **`any` is forbidden** — use proper types, discriminated unions, utility types.
- **SolidJS, not React** — no virtual DOM, no re-renders; respect fine-grained reactivity.
- **Conditional rendering**: `<Show>`, `<For>`, `<Switch>` (not ternaries or `&&`).
- **Modals/overlays**: `<Portal>`.
- **Cleanup**: `onCleanup()` for all subscriptions, timers, event listeners.
- **Naming**: variables, functions, and files communicate intent.
- **One concern per file**; split when a file exceeds ~300 lines.
- **Extract a helper only when used in 3+ places**; otherwise inline it.
- **Delete dead code you create**; never comment it out.
- **No self-evident comments** — only document non-obvious logic.
- **Path alias**: `@/*` → `src/*`.
- **Exports**: feature-level barrel `index.ts` files; prefer named exports.
- **CSS nesting**: `&` for pseudo-classes/elements; nest `@media` inside selectors.

## Testing

- Write tests before or alongside implementation — they are your success criteria.
- Test observable outcomes and edge cases, not implementation details.
- Each test is fully self-contained; no shared mutable state between tests.
- **Unit tests**: Vitest + `@solidjs/testing-library`, environment `happy-dom`, globals enabled.
- **Hooks**: `renderHook()` from `@solidjs/testing-library`.
- **Module mocks**: `vi.hoisted()` + `vi.mock()` pattern (see `useExpenseForm.test.ts`).
- **Store state**: reset manually in `beforeEach` via store setter functions.
- **Test files**: co-located with source, `*.test.ts` or `*.test.tsx`.

## Commits & Branches

Format:

```
<prefix>: <one-line summary>

<Why: one sentence — motivation or problem>

- <change 1>
- <change 2>
```

- **Prefixes**: `feat:`, `fix:`, `chore:`, `refactor:`, `style:`.
- **Summary**: imperative mood, ≤70 chars, no trailing period.
- **Why line**: only when motivation is not evident from the diff alone.
- **Bullets**: only for 2+ distinct changes.
- **Branch prefixes**: `feature/`, `bugfix/`, `chore/`, `refactor/`.
- Never commit secrets (`*.key`, `*.pem`, `credentials*`).
- Never use `--no-verify` or `--amend`; always create a new commit.

## Tech Stack

- **SolidJS 1.9** — fine-grained reactivity (NOT React)
- **Vite 8** — build tool (Rolldown-based bundler)
- **TypeScript 5.9** — strict mode enabled
- **CSS Modules + Lightning CSS** — scoped styles, native CSS nesting, auto vendor prefixes
- **Biome 2** — linter and formatter (no ESLint/Prettier)
- **Vitest 4** — unit tests; `@solidjs/testing-library` + `happy-dom`
- **pnpm** — package manager (exact pnpm version and Node `^24` pinned via `devEngines`
  with `onFail: "download"`; `.node-version` pins Node for Cloudflare Pages; bump pnpm
  with `pnpm self-update` — see README "Version management")

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

### State Management

- **Local**: `createSignal()` for component-scoped state
- **Global**: stores use `createRoot()` to persist across component lifecycle
- **Server**: `createResource()` for async/API data

## Environment Variables

In `.env.local` (not committed):

- `VITE_RECAPTCHA_SITE_KEY` — Google reCAPTCHA v3 site key
- `VITE_API_BASE_URL` — Backend API URL
  - `Content-Type` is intentionally omitted in `submitExpense` to avoid CORS preflight with GAS. Other backends may need it added.
- `VITE_ALLOWED_ORIGINS` — Comma-separated list of origins allowed to send postMessage events (e.g. `https://parent.example.com,http://localhost:3000`). `window.location.origin` is always allowed and does not need to be listed. Omit this variable to restrict to same-origin only.
