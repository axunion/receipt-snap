---
name: new-component
description: Scaffold a new SolidJS component for this project.
disable-model-invocation: true
argument-hint: <ComponentName> [ui|feature]
---

Scaffold a new SolidJS component for this project.

Arguments: $ARGUMENTS
Parse as: "<ComponentName> [ui|feature]"
- ComponentName: PascalCase component name (required)
- placement: "ui" for `src/components/ui/` (default), "feature" for `src/features/expense-form/ui/`

Steps:
1. Determine the component name and placement from $ARGUMENTS
2. Create a directory at the appropriate path
3. Generate the component file and CSS Module file
4. Update or create the barrel `index.ts` if it exists in the parent directory

## Component Template (`<ComponentName>.tsx`)

```tsx
import type { JSX } from "solid-js";
import styles from "./<ComponentName>.module.css";

interface <ComponentName>Props {
  // define props here
}

export function <ComponentName>(props: <ComponentName>Props): JSX.Element {
  return (
    <div class={styles.container}>
      {/* component content */}
    </div>
  );
}
```

## CSS Module Template (`<ComponentName>.module.css`)

```css
.container {
  /* styles here */
}
```

## Rules to follow

- No business logic in `ui/` components — only props and callbacks
- Use CSS Modules for all styles; use design tokens from `src/index.css` custom properties
- Use `<Show>`, `<For>`, `<Switch>` for conditional rendering (not ternaries/`&&`)
- No `any` types
- Named export only (no default export)
- Tabs for indentation
- For `src/components/ui/` components: no imports from `src/features/`

After creating files, show the user the created file paths and their contents.
