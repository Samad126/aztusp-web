# AZTUSP Frontend

A React + MUI dashboard for students. They sign in with their university account and see their courses (plan, items, scores and attendance), schedule, grades, attendance, notices and settings. Settings set a profile photo (up to 10 MB), change the site password and change notifications (including Telegram), and switch the theme and the language (English or Azerbaijani). The avatar in the top right shows the student's name and signs them out.

The sign-in page also has a Demo option. It opens the app on built-in sample data without a login. Demo mode never sends a request to the API, and its changes (password, notifications, photo, Telegram) are refused, so it cannot touch a real account.

## Backend

The data comes from the AZTUSP API, version 2.3.0, which this app is built against. Its source code is at [github.com/Samad126/aztusp-backend](https://github.com/Samad126/aztusp-backend), and its interactive docs are at [aztuapi.alakbaroff.com/docs](https://aztuapi.alakbaroff.com/docs).

Signing out calls `POST /api/v1/auth/logout`, which also signs out of the university site, then clears the local session.

## Setup

Install [Bun](https://bun.sh), then install the dependencies:

```sh
bun install
```

## Configuration

- `VITE_API_URL` (optional, read at build time) sets the API base URL. It defaults to `https://aztuapi.alakbaroff.com`. In `bun run dev`, requests to `/api` go through the Vite proxy to that host instead.

## Scripts

- `bun run dev` - start the dev server on http://localhost:5173
- `bun run build` - production build
- `bun run lint` - run oxlint
- `bun run typecheck` - run tsc
- `bun run preview` - serve the production build locally

## Structure

- `src/api/` - API client (token, errors), endpoint paths, response types and the profile photo
- `src/auth/` - sign-in state (`AuthProvider`): login, demo mode, logout and the return to sign-in when the session expires
- `src/demo/` - sample data for demo mode, and `respond.ts`, which answers requests locally in place of the API
- `src/components/` - shared pieces such as `DataTable`, `RecordsTable`, `PasswordChange`, `ProfilePhoto`, `PhotoAvatar`, `AccountMenu`, `Subscriptions` and `ThemeToggle`
- `src/i18n/` - English and Azerbaijani messages
- `src/layouts/` - `DashboardLayout` (sidebar and top bar) and `AuthLayout`
- `src/pages/` - one page per route; `course/` holds the course detail tabs
- `src/theme/` - light and dark palettes and the color-mode provider
- `src/lib/` - formatting and attendance helpers
- `src/navigation.ts` - sidebar items (label, route, icon)

## Docker

```sh
docker build -t aztusp-web .
docker run -p 8080:80 aztusp-web
```

With Compose, the app is published on `127.0.0.1:${WEB_PORT:-8080}`:

```sh
docker compose up --build
```

## Deployment

CI lints, builds the app and builds the Docker image on every push and pull request. On a push to `main` it deploys over SSH: the server
checkout (`/pool/www/aztu.alakbaroff.com/frontend`, must already be a git clone of this repo)
is reset to `origin/main` and rebuilt with `docker compose up -d --build web`, listening on
`127.0.0.1:3004` behind nginx.

Required Actions secrets: `SSH_HOST`, `SSH_USER`, `SSH_PASSWORD`.

## Versioning

The version is in `package.json`, and the sidebar footer shows it. The current version is 0.8.0. Bump it with each release: minor for a new feature, patch for a fix or a copy change.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
