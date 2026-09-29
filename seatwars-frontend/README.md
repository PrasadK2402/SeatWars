# SeatWars Frontend — redesigned

A clean, fully themeable (light / dark) React + TypeScript frontend for the
SeatWars bus booking platform. Talks to the existing Spring Boot backend —
**no backend changes required**.

## Tech

- React 19 + TypeScript + Vite
- React Router 7, Axios, Lucide icons
- Hand-crafted CSS design system (`src/styles/global.css`) — no Tailwind dependency
- Theme via `data-theme` on `<html>`, persisted in `localStorage`, defaults to the OS preference

## Run

### Dev (hot reload)

```bash
npm install
npm run dev        # http://localhost:5173 — /api is proxied to localhost:8080
```

### Production build

```bash
npm run build      # outputs dist/
npm run preview
```

### Docker (drop-in replacement for the old `frontend/`)

```bash
docker build -t seatwars-frontend .
docker run -p 3000:80 seatwars-frontend
```

Nginx serves the SPA and proxies `/api/*` to the `backend` service, same contract
as before, so the existing `docker-compose.yml` keeps working.

## Pages

| Route | Description |
|---|---|
| `/` | Hero + trip search, popular routes, features |
| `/search?from=&to=&date=` | Trip results with live seat counts, time-slot filters, sorting |
| `/trips/:tripId` | Live seat map + passenger details + booking summary (auth) |
| `/booking/success` | Ticket with booking reference + print |
| `/my-bookings` | Booking history, free cancellation (auth) |
| `/login`, `/register` | Split-screen auth |
| `/admin` | Dashboard with fleet stats |
| `/admin/buses` | Bus CRUD |
| `/admin/buses/:busId/seats` | Seat layout designer with live preview |
| `/admin/routes` | Route CRUD |
| `/admin/trips` | Trip scheduling (seat inventory auto-generated) |

## Backend API contract used

- `POST /api/auth/register`, `POST /api/auth/login`
- `POST /api/trips/search`, `GET /api/trips/{id}`, `GET /api/trips/{tripId}/seats` (public)
- `POST /api/bookings`, `GET /api/bookings/my-bookings`, `POST /api/bookings/{id}/cancel`
- Admin: `GET/POST /api/buses`, `GET/PUT/DELETE /api/buses/{id}`, `GET/POST /api/buses/{busId}/seats`, `GET/POST /api/routes`, `GET/PUT/DELETE /api/routes/{id}`, `GET/POST /api/trips`

JWT is attached automatically; a `401` clears the session and the route guards
redirect to login.
