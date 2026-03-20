---
paths:
  - "src/components/ui/**"
---

# Shared UI Components

Components in this directory are **purely presentational**. They have no knowledge of the application's domain or business logic.

## Rules

### No Business Logic
- No imports from `src/features/`
- No imports from `src/services/`
- No imports from `src/stores/` or feature stores
- Behavior is controlled entirely through **props and callback functions**

### Props Design
- Accept data as props; emit events via callback props (`onSubmit`, `onChange`, `onClose`)
- Use TypeScript interfaces for all props — no `any`
- Prefer specific types over generic ones (`string` over `unknown`)

### SolidJS Conventions
- Use `<Show>` for conditional rendering (not `&&` or ternaries)
- Use `<For>` for lists (not `.map()`)
- Use `<Portal>` for overlays and modals
- Access props reactively — never destructure (`props.label` not `const { label } = props`)
- Use `splitProps` when forwarding remaining props to a native element

### Styles
- All styles in co-located `.module.css` files
- Use design tokens from `src/index.css` (CSS custom properties like `var(--color-primary)`)
- No hardcoded color values that exist as tokens
- Native CSS nesting with `&` for pseudo-classes and elements

### Accessibility
- Interactive elements must have accessible labels (`aria-label`, `aria-labelledby`, or visible text)
- Buttons must have descriptive text or `aria-label`
- Form inputs must be associated with labels (`<label for>` or `aria-labelledby`)
- Use semantic HTML elements where possible (`<button>` not `<div onClick>`)

### Exports
- Named exports only
- One component per file (plus its types)
- Export from barrel `index.ts` at this directory level if it exists

## Example Structure

```
src/components/ui/
├── Button/
│   ├── Button.tsx
│   ├── Button.module.css
│   └── Button.test.tsx   (optional, for non-trivial components)
└── index.ts              (barrel export)
```
