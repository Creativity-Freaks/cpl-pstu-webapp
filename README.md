## CPL-PSTU Webapp

A React + TypeScript + Tailwind CSS single-page app for CSE Premier League (CPL) at PSTU. It includes a public site with dynamic sections and a simple role-based authentication demo with protected Admin and Player dashboards.

### Tech

- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui components (Radix UI)
- React Router v6
- TanStack Query (ready for data fetching)

### Features

- Public pages
  - Home: Hero, About, Stats (count), Tournament teaser, Gallery (video + image), Testimonials, Sponsors, FAQ, Contact, Footer
  - About, Team, Tournament, Gallery, Contact
- Auth and roles (mock/demo)
  - Login (no role selection; admin inferred by email)
  - Registration (always Player)
  - Role-based protected routes
  - Admin Dashboard and Player Dashboard
  - Hidden Auction page (admin-only, not in navbar)

### Routes

- `/` Home
- `/about`, `/team`, `/tournament`, `/gallery`, `/contact`
- `/auth` Auth (Login/Register tabs)
- `/login` -> redirects to `/auth?tab=login`
- `/register` -> redirects to `/auth?tab=register`
- `/dashboard` Player Dashboard (protected)
- `/admin` Admin Dashboard (admin-only)
- `/admin/auction` Auction (admin-only, hidden from navbar)

### Quick start

1. Install dependencies (npm, pnpm, yarn, or bun):

```sh
# using npm
npm install

# or using bun
bun install
```

2. Start the dev server:

```sh
npm run dev
```

3. Open the app at the printed local URL (typically http://localhost:5173).

### Auth demo

This project ships with a lightweight, client-side mock auth:

- Login: pick a role (Player/Admin) and any email/password.
- Registration creates a Player account directly.
- Session is stored in localStorage; click Logout to clear.

Role access:

- Player: can open `/dashboard`
- Admin: can open `/admin` and `/admin/auction`
  - Admin is determined by allowed admin emails (see `src/config/auth.ts`) or your backend logic.

### Notes and next steps

- Replace the mock auth with a real backend (JWT/OAuth) and persist sessions securely.
- Wire tournaments, teams, and gallery to real APIs or a CMS.
- Add forms and flows for team registration and tournament management.
- Add tests and CI.

### License

MIT
