---
name: frontend-design
description: Create distinctive, production-grade SolidJS UI for this project. Use this skill when asked to build components, pages, screens, or UI elements for receipt-snap. Generates polished, mobile-first code using SolidJS reactivity, CSS Modules, and project design tokens — not React.
---

This skill guides creation of production-grade UI for the receipt-snap project. The stack is **SolidJS + CSS Modules + Lightning CSS** — not React. All output must use SolidJS patterns exclusively.

## SolidJS — Required Patterns

SolidJS has fine-grained reactivity with no virtual DOM. The most common mistakes are writing React code by accident.

**Signals and reactivity:**
```tsx
// Access signals by calling them: count(), not count
const [count, setCount] = createSignal(0);
return <div>{count()}</div>;
```

**Props — never destructure:**
```tsx
// Wrong (breaks reactivity): function Foo({ label }) {}
// Correct:
function Foo(props: FooProps) {
  return <div>{props.label}</div>;
}
// Or use splitProps for local+rest:
const [local, rest] = splitProps(props, ["label"]);
```

**Conditional and list rendering — use control flow components:**
```tsx
// Not ternaries or &&
<Show when={props.visible} fallback={<Spinner />}>
  <Content />
</Show>

<For each={props.items}>
  {(item) => <Item data={item} />}
</For>

<Switch fallback={<Default />}>
  <Match when={state() === "loading"}><Loader /></Match>
  <Match when={state() === "error"}><Error /></Match>
</Switch>
```

**Side effects and cleanup:**
```tsx
createEffect(() => {
  const id = setInterval(() => tick(), 1000);
  onCleanup(() => clearInterval(id));
});
```

**Modals and overlays — always use Portal:**
```tsx
<Portal>
  <div class={styles.overlay}>...</div>
</Portal>
```

**Derived values — use createMemo:**
```tsx
const total = createMemo(() => items().reduce((s, i) => s + i.price, 0));
```

## Project Conventions

**File structure:**
- Shared presentational: `src/components/ui/<ComponentName>/`
- Feature-specific: `src/features/expense-form/ui/<ComponentName>/`
- Each component: `<ComponentName>.tsx` + `<ComponentName>.module.css`
- Named exports only (no default exports)

**CSS Modules:**
```tsx
import styles from "./MyComponent.module.css";
// Use class (not className — this is SolidJS, not React):
<div class={styles.container}>
```

**Design tokens** — always use CSS custom properties from `src/index.css`, never hardcode values:
```css
.container {
  color: var(--color-text-primary);
  background: var(--color-surface);
  border-radius: var(--radius-md);
}
```

**CSS nesting** with Lightning CSS:
```css
.button {
  background: var(--color-primary);

  &:hover {
    background: var(--color-primary-hover);
  }

  @media (max-width: 600px) {
    width: 100%;
  }
}
```

**TypeScript:**
- No `any` — use proper types, discriminated unions, utility types
- Annotate return types on exported functions: `function Foo(props: FooProps): JSX.Element`
- Props interfaces above the component

## Design Approach

This is a **mobile-first** expense/receipt app used in the field (on a phone, likely after taking a photo). Design for:
- Touch targets at least 44px tall
- Clear visual hierarchy — the user is often in a hurry
- Minimal cognitive load — forms should feel fast and obvious
- Comfortable thumb reach for primary actions

The palette uses a slate/neutral base. Match the existing visual language rather than introducing a new aesthetic direction unless explicitly asked for a redesign.

Before writing code, briefly confirm:
1. Where will this live? (`components/ui/` or `features/expense-form/ui/`)
2. What data/callbacks does it need?
3. Any existing components to reuse?

Then implement complete, working SolidJS code — not pseudocode, not React.
