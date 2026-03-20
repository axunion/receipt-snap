---
name: new-hook
description: Scaffold a new SolidJS hook for this project.
disable-model-invocation: true
argument-hint: <hookName> [shared|feature]
---

Scaffold a new SolidJS hook for this project.

Arguments: $ARGUMENTS
Parse as: "<hookName> [shared|feature]"
- hookName: camelCase hook name starting with "use" (required)
- placement: "shared" for `src/hooks/` (default), "feature" for `src/features/expense-form/model/`

Steps:
1. Determine the hook name and placement from $ARGUMENTS
2. Create the hook file at the appropriate path
3. Create a co-located test file

## Hook Template (`<hookName>.ts`)

```typescript
import { createSignal, onCleanup } from "solid-js";

export function <hookName>() {
  const [value, setValue] = createSignal<string>("");

  // cleanup example — register for all event listeners / timers / subscriptions
  onCleanup(() => {
    // cleanup
  });

  return {
    value,
    setValue,
  };
}
```

## Test Template (`<hookName>.test.ts`)

```typescript
import { renderHook } from "@solidjs/testing-library";
import { <hookName> } from "./<hookName>";

describe("<hookName>", () => {
  it("should initialize with default values", () => {
    const { result } = renderHook(() => <hookName>());
    // add assertions
  });
});
```

## Rules to follow

- Always register `onCleanup` for event listeners, timers, and subscriptions
- Return an object (not array) so callers can pick what they need
- No `any` types; use proper TypeScript types
- No business logic that belongs in a specific feature in `src/hooks/`
- Shared hooks (`src/hooks/`) must not import from `src/features/`
- Tabs for indentation

After creating files, show the user the created file paths and their contents.
