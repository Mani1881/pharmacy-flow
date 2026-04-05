# PharmaFlow

<p align="center">
	<img src="<img width="1366" height="683" alt="image" src="https://github.com/user-attachments/assets/00826434-3d97-4d63-b1fb-cb30b44c597b" />
" alt="PharmaFlow 3D operations dashboard visual" width="100%" />
</p>

PharmaFlow is a pharmacy chain management platform for tracking inventory, sales, replenishment orders, outlets, audit logs, reports, and AI-assisted operational insights.

The repository contains two parts:
- A React + Vite frontend in the project root.
- A FastAPI microservices backend in the `backend/` folder.

## What You Get

- Dashboard for sales, traffic, alerts, and outlet performance
- Inventory management with search, filters, add product, and export
- POS screen for cart and checkout flow
- Replenishment orders with create/approve/dispatch actions
- BI reports with chart visualizations and CSV export
- AI insights for sales and inventory questions
- User management with add-user flow
- Outlets, alerts, audit log, and settings pages

## Tech Stack

- Frontend: React, TypeScript, Vite
- UI: Tailwind CSS, shadcn/ui, Radix UI
- Charts: Recharts
- State and data fetching: React context and React Query
- Backend: FastAPI, Uvicorn, JWT auth
- Local infra: Docker Compose, PostgreSQL, Redis

## Services We Use (Short Why)

- Frontend (React + Vite): Fast, interactive dashboard UI for pharmacy operations.
- Auth Service (FastAPI): Handles login and role-based access (RBAC).
- Inventory Service: Manages products, stock levels, and expiry tracking.
- POS Service: Supports billing and checkout transaction flows.
- Orders Service: Handles replenishment requests and order lifecycle.
- Analytics Service: Aggregates business metrics and reporting data.
- AI Service: Responds to operational and sales insight prompts.
- PostgreSQL: Reliable long-term relational data storage.
- Redis: Fast cache/session support for performance and scalability.
- Docker Compose: Starts all backend services consistently with one command.

## Project Structure

```text
pharmacy-flow/
├── src/                 # Frontend application code
├── public/              # Static assets
├── backend/             # FastAPI microservices
├── supabase/            # Supabase config files
└── vite.config.ts       # Vite dev server config
```

## Prerequisites

- Node.js 18 or newer
- npm
- Docker Desktop

## Project Setup (Step by Step)

1. Clone the repository and open it in VS Code.
2. Install frontend dependencies from project root:

```bash
npm install
```

3. Start backend microservices from project root:

```bash
docker compose -f backend/docker-compose.yml up --build
```

4. Start frontend in a new terminal from project root:

```bash
npm run dev
```

5. Open the frontend URL shown by Vite (commonly `http://localhost:8080`).
6. Log in with a demo account from the Login section below (password: `demo`).

If `8080` is busy, Vite will auto-pick another port. Use the exact URL printed in the terminal.

## Run The Frontend

From the project root:

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:8080
```

## Run The Backend

From the project root:

```bash
docker compose -f backend/docker-compose.yml up --build
```

This starts the backend services on these ports:

- Auth: `http://localhost:8000`
- Inventory: `http://localhost:8001`
- POS: `http://localhost:8002`
- Orders: `http://localhost:8003`
- Analytics: `http://localhost:8004`
- AI: `http://localhost:8005`

API docs:

- `http://localhost:8000/docs`
- `http://localhost:8001/docs`
- `http://localhost:8002/docs`
- `http://localhost:8003/docs`
- `http://localhost:8004/docs`
- `http://localhost:8005/docs`

## Login

Use one of the demo accounts below. The shared demo password is:

```text
demo
```

Demo emails:

- `admin@pharmacy.com`
- `admin@pharmaflow.com`
- `admin@pharmacy.local`
- `supervisor@pharmaflow.com`
- `pharmacist@pharmaflow.com`
- `assistant@pharmaflow.com`
- `finance@pharmaflow.com`

## Useful Scripts

```bash
npm run build
npm run lint
npm run test
npm run preview
```

## Notes

- The frontend proxies `/api` calls to the backend auth service in development.
- Some flows currently persist in browser localStorage for a lightweight demo experience.
- If you open backend URLs in a browser, use `localhost`, not `0.0.0.0`.

## Troubleshooting

- If the backend fails to start, restart Docker Desktop and run the compose command again.
- If login returns 401, confirm the email and password exactly match one of the demo accounts above.
- If a browser shows `ERR_ADDRESS_INVALID`, replace `0.0.0.0` with `localhost`.
