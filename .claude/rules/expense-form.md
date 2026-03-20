---
paths:
  - "src/features/expense-form/**"
---

# expense-form Feature

This is the primary (and currently only) feature module in Receipt Snap.

## Directory Structure

```
expense-form/
├── ExpenseFormFeature.tsx    # Feature entry point
├── index.ts                  # Barrel export
├── model/                    # Business logic only — no JSX
│   ├── expenseFormStore.ts   # Global form state (createRoot signals)
│   ├── destinationStore.ts   # Destination list (createResource)
│   ├── useExpenseForm.ts     # Core form logic: validation, submit
│   ├── useExpenseFormController.ts  # Wires model to UI
│   ├── useParentMessage.ts   # iframe postMessage: receives name from parent
│   └── useReceiptImage.ts    # Image selection, validation, compression
└── ui/                       # SolidJS components only — minimal logic
    ├── ExpenseFormScreen.tsx  # Top-level layout, modals, form fields
    └── camera/               # Receipt capture components
```

## model/ Rules

- **No JSX, no CSS imports** — pure TypeScript business logic
- Stores (`*Store.ts`) export getter/setter functions; never export raw signals
- Hooks (`use*.ts`) return plain objects; never return JSX or style objects
- `useExpenseFormController.ts` is the single coordination layer — it connects multiple hooks and is the only model file that imports from other hooks
- `useParentMessage.ts` must register `onCleanup` for the `message` event listener

## ui/ Rules

- Components receive data and callbacks via props — do not import stores directly unless orchestrated by the controller
- `ExpenseFormScreen.tsx` is the exception: it uses `useExpenseFormController` directly
- Modals and overlays must use `<Portal>`
- Use `<Show>`, `<For>`, `<Switch>` — no ternaries or `.map()` in JSX

## Store Pattern

```typescript
// expenseFormStore.ts — canonical pattern
import { createRoot, createSignal } from "solid-js";

const [value, setValue] = createRoot(() => createSignal(""));

export { value, setValue };
```

Global stores use `createRoot()` so they survive component unmount/remount.

## Testing: Store Reset

All tests that involve stores MUST reset state in `beforeEach`:

```typescript
import { resetForm } from "@/features/expense-form/model/expenseFormStore";

beforeEach(() => {
  resetForm();
});
```

Failure to reset causes test bleed between cases. This is the most common source of flaky tests in this module.

## Data Flow

```
User input
  → expenseFormStore signals
  → useExpenseForm (validation via createEffect, only after field touched)
  → useExpenseFormController (wires model ↔ UI)
  → ExpenseFormScreen (renders form fields and feedback)
  → On submit: compressImage → fileToBase64 → reCAPTCHA token → apiRequest
```

## iframe Integration

`useParentMessage` handles name injection from parent apps:
- Only active when `window !== window.parent`
- Sets `isExternalName = true` in store → name field becomes read-only
- `isExternalName` is NOT reset by `resetForm` (intentional — persists for session)
