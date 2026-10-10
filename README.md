# AZTUSP Frontend

A React + MUI dashboard layout: login and register pages, a sidebar dashboard, and a working dark/light theme switch. The content is placeholder data; the layout is the part to build on.

## Backend

The data comes from the AZTUSP API. Its source code is at [github.com/Samad126/aztusp-backend](https://github.com/Samad126/aztusp-backend).

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

## Deployment

CI lints and builds on every push/PR. On a push to `main` it deploys over SSH: the server
checkout (`/pool/www/aztu.alakbaroff.com/frontend`, must already be a git clone of this repo)
is reset to `origin/main` and rebuilt with `docker compose up -d --build web`, listening on
`127.0.0.1:3004` behind nginx.

Required Actions secrets: `SSH_HOST`, `SSH_USER`, `SSH_PASSWORD`.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
