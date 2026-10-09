# UserHelper

A React + MUI dashboard layout: login and register pages, a sidebar dashboard, and a working dark/light theme switch. The content is placeholder data; the layout is the part to build on.

## Setup

Install [Bun](https://bun.sh), then install the dependencies:

```sh
bun install
```

## Scripts

- `bun run dev` - start the dev server
- `bun run build` - production build
- `bun run lint` - run oxlint
- `bun run preview` - serve the production build locally

## Structure

- `src/layouts/` - `DashboardLayout` (sidebar and top bar) and `AuthLayout`
- `src/pages/` - one placeholder page per route
- `src/components/` - shared pieces such as `StatCard`, `SemesterToolbar` and `ThemeToggle`
- `src/theme/` - light and dark palettes and the color-mode provider
- `src/navigation.js` - sidebar items (label, route, icon)

## Docker

```sh
docker build -t aztusp-web .
docker run -p 8080:80 aztusp-web
```

CI (`.github/workflows/ci.yml`) lints and builds on every push/PR; pushes to `main` publish `ghcr.io/samad126/aztusp-web:latest` (plus a sha tag). Deploy with `docker compose pull && docker compose up -d`.
