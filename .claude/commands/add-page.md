---
description: Add a page that shows data from a backend endpoint
argument-hint: <page name and the endpoint it shows>
---
Add $ARGUMENTS:

1. `src/api/endpoints.ts` entry and a response type in `src/api/types.ts` (match the backend schema).
2. A demo response in `src/demo/` and register it in `src/demo/respond.ts`.
3. The page in `src/pages/`, using `useApi`, `Async` and `DataTable`; route in `src/App.tsx`, nav item in `src/navigation.ts`.
4. Strings in both `en.ts` and `az.ts`.
5. Run `/check`.
