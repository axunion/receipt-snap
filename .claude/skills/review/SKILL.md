---
name: review
description: Review changed files against project conventions and SolidJS best practices.
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Bash
---

Review changed files against project conventions and SolidJS best practices.

Steps:
1. Run `git diff --name-only HEAD` to identify changed files
2. Also check `git diff --name-only --cached` for staged changes
3. Read each changed `.ts` / `.tsx` / `.css` file
4. Review against the checklist below
5. Report findings grouped by file, with line references where possible

## Review Checklist

### SolidJS Reactivity
- [ ] Signals are called as functions: `count()` not `count`
- [ ] Props are not destructured (use `props.foo` or `splitProps`)
- [ ] `<Show>`, `<For>`, `<Switch>` used instead of ternaries/`&&`/`.map()`
- [ ] `createMemo` used for derived values that are reused
- [ ] `onCleanup` registered for all event listeners, timers, subscriptions
- [ ] `<Portal>` used for modals and overlays
- [ ] No side effects in component body (use `createEffect`)

### TypeScript
- [ ] No `any` types — proper types, discriminated unions, or utility types
- [ ] Props interfaces defined with clear types
- [ ] Return types annotated on exported functions

### Architecture
- [ ] `src/components/ui/` components have no business logic or feature imports
- [ ] Feature `model/` contains no JSX or rendering logic
- [ ] `src/services/api.ts` is the only file using `fetch`
- [ ] Stores use `createRoot()` for global state

### CSS Modules
- [ ] All styles in `.module.css` files (no inline `style` objects for static styles)
- [ ] Design tokens from `src/index.css` used (CSS custom properties like `var(--color-primary)`)
- [ ] Native CSS nesting with `&` for pseudo-classes
- [ ] No hardcoded hex colors that exist as design tokens

### Code Quality
- [ ] No self-evident comments — only non-obvious logic documented
- [ ] Named exports (no default exports, except for framework requirements)
- [ ] No `console.log` left in production code

Summarize findings as:
- **Issues** (must fix): violations of hard rules (`any`, wrong reactivity, missing cleanup)
- **Suggestions** (should fix): style and convention improvements
- **Looks good**: areas with no concerns
