# SeatWars — Bus Booking Frontend

Production-ready React frontend for the Spring Boot bus booking backend.

## Stack
- React 19 + TypeScript
- Vite 8 + Tailwind CSS 4 (`@tailwindcss/vite`)
- React Router 7
- Axios (centralized instance)
- Lucide React

## Requirements
- Node.js 18+
- Running Spring Boot backend (default `http://localhost:8080`, Postgres `seatwars`)

## Backend API (verified from source)
- `GET/POST /api/buses`, `GET/PUT/DELETE /api/buses/{id}`
- `GET/POST /api/buses/{busId}/seats`
- `GET/POST /api/routes`, `GET /api/routes/{id}`
- `GET/POST /api/trips`, `GET /api/trips/{id}`, `POST /api/trips/search`, `GET /api/trips/{tripId}/seats`
- `POST /api/bookings`
- Port: 8080 (Spring Boot default, `application.properties` has no `server.port`)
- CORS: enabled via `WebConfig` for `http://localhost:5173`

## Installation
```bash
cd frontend
npm install
cp .env.example .env
# edit VITE_API_BASE_URL if backend runs elsewhere
```

## Environment
```env
VITE_API_BASE_URL=http://localhost:8080
```
Vite proxy also configured: `/api` → `http://localhost:8080` for dev.

## Start frontend
```bash
npm run dev  # http://localhost:5173
```

## Start backend
```bash
cd ../backend
./mvnw spring-boot:run
# requires Postgres at localhost:5432/seatwars user postgres/2402
```

## Build
```bash
npm run build   # tsc -b && vite build
npm run preview
```

## Project Structure
```
src/
  api/       axios.ts, buses.ts, seats.ts, routes.ts, trips.ts, bookings.ts
  types/     index.ts (mirrors Java DTOs)
  components/ui/  Button, Input, Card, Spinner, EmptyState
  components/layout/ Navbar, AdminLayout
  components/booking/ SearchForm, TripCard, SeatMap, PassengerForm
  pages/ Home, Search, Trip, Booking, Admin/*
  utils/ format.ts
  App.tsx (React Router)
```

## Customer Flow
`/` → Search (From/To/Date → POST /api/trips/search) → `/trips/:tripId` (GET seats, select seat, passenger form → POST /api/bookings) → `/booking/confirmation`

Race condition: if 409 SeatNotAvailable, error shown, seats refreshed, selection cleared.

## Admin
`/admin` → Dashboard (counts from /api/buses/routes/trips) → `/admin/buses` → `/admin/buses/:busId/seats` → `/admin/routes` → `/admin/trips`
