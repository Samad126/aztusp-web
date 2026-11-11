# AZTUSP Web

React 19 + TypeScript + Vite + MUI student dashboard for the AZTUSP API (FastAPI backend in the sibling repo).
Bun is the package manager. UI languages: Azerbaijani (`az`) and English (`en`).

## Layout
- `src/pages/` – one file per route (`GradesPage`, `AttendancePage`, ...); page-specific pieces in a folder next to it.
- `src/components/` – shared UI (`table/DataTable`, `PageState` with `Async`/`EmptyState`, dialogs).
- `src/api/` – `endpoints.ts` (all URLs), `types.ts` (response types, mirror the backend schemas), `useApi.ts` (cached GET hook), `client.ts`.
- `src/demo/` – sample responses so the demo login works without the API; every new endpoint needs one (`respond.ts`).
- `src/i18n/locales/{en,az}.ts` – every user-visible string; both files must have the same keys.
- `src/lib/` – pure helpers (`format.ts`, `attendance.ts`).

## Commands
- `bun run dev` | `bun run typecheck` | `bun run lint` | `bun run build` (typecheck + vite build)
- Before finishing a change: `bun run typecheck && bun run lint`.

## Conventions
- Never hard-code user-facing text: add the key to **both** `en.ts` and `az.ts` and use `t('...')`.
- New endpoint = `endpoints.ts` entry + type in `types.ts` + demo response + page using `useApi`.
- Reuse `DataTable` (`Column<T>`), `Async`, `EmptyState`, `StatusInfoButton`-style popovers instead of new patterns.
- Numbers from the API are strings (`''`/`null` when missing); convert with `toNumber` from `lib/format.ts`.
- Pure logic (grading, attendance maths) lives in `src/lib/`, not inside components.
- Don't commit `dist/` or `tsconfig.tsbuildinfo`.

## Domain rules (AzTU)
- Grading order: Quiz 1 -> Midterm -> Quiz 2 -> Individual work -> Final. Up to 50 points before the exam, 50 for the exam.
- Letters: <51 F, 51-60 E, 61-70 D, 71-80 C, 81-90 B, 91-100 A.
- Scholarship: Əlaçı (all courses 91-100), Zərbəçi / həvəsləndirici (all 71-100, at least one 91+), Adi (all 51-100).
