---
name: frontend-conventions
description: Conventions for building pages and components in the AZTUSP web app (i18n, API types, demo data, tables, grading rules). Use when adding or changing anything under src/.
---

# AZTUSP web conventions

- **Data flow:** `endpoints.ts` -> `useApi<T>(endpoint)` (cached 5 min) -> `<Async loading error onRetry>` -> `DataTable`. Don't call `fetch` directly.
- **Types** mirror the backend pydantic schemas; strings for numbers, `null` for not-yet-available values.
- **Demo mode:** the demo login never hits the API. Add the sample response in `src/demo/` and register it in `respond.ts`.
- **i18n:** keys are flat dotted strings (`'grades.final'`). Add to `en.ts` and `az.ts` together; a hook checks both files stay in sync.
- **Tables:** define `Column<T>[]` in a `useMemo` with `sortValue` for sortable columns; `render` for chips and units.
- **Info popovers:** follow `pages/attendance/StatusInfoButton.tsx` (IconButton + Popover, `stopPropagation` inside clickable rows).
- **Grading maths** belongs in `src/lib/` as pure, easily testable functions.
- **Verify:** `bun run typecheck && bun run lint`; try the page at 400px wide in light and dark themes.
