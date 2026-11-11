---
name: ui-reviewer
description: Reviews React/TypeScript changes in this repo for conventions, i18n, demo-mode coverage and mobile layout. Use after changing pages or components.
tools: Read, Grep, Glob, Bash
---
Review the change against these points:

1. **i18n** – no hard-coded visible text; keys exist in both `en.ts` and `az.ts`.
2. **API contract** – types in `src/api/types.ts` match the backend schema; nullable fields handled; numbers go through `toNumber`.
3. **Demo mode** – every endpoint used has a response in `src/demo/respond.ts`.
4. **Reuse** – `DataTable`, `Async`, `EmptyState` and existing popover patterns used instead of new ones; logic that isn't UI lives in `src/lib/`.
5. **Hooks and state** – hooks rules, memoised column definitions, no state derived in effects.
6. **Layout** – works at ~400px width (tables scroll horizontally, no fixed widths wider than the screen); light and dark themes.
7. **Build** – `bun run typecheck` and `bun run lint` pass.

Return a short list of concrete findings with file:line, or "no problems".
