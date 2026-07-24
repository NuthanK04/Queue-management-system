# Queue Management System

A full-stack queue management application for service managers. Managers can create queues, add people as tokens, change their position, serve the next person, cancel tokens, and monitor queue activity.

## Features

- Manager registration and JWT-based login
- Create, select, and delete queues
- Add people to a queue as numbered tokens
- Move waiting tokens up or down
- Serve only the token at the front of a queue
- Cancel waiting tokens
- Dashboard analytics for queue count, waiting tokens, served tokens, average wait time, and seven-day token activity
- Ownership checks so a manager can access only their own queues and tokens

## Tech stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, Recharts
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL with Prisma ORM
- Authentication: JWT and bcrypt

## Project structure

```
client/   # React application
server/   # Express API and Prisma schema/migrations
```

## Run locally

### Prerequisites

- Node.js 20+
- PostgreSQL 14+

### 1. Configure the server

Create `server/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/queue_management?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
PORT=5000
```

### 2. Install dependencies and set up the database

```powershell
cd server
npm install
npx prisma migrate deploy
npx prisma generate
```

### 3. Start the API

```powershell
cd server
npm run dev
```

The API runs at `http://localhost:5000`.

### 4. Start the frontend

```powershell
cd client
npm install
npm run dev
```

Open `http://localhost:5173`, create a manager account, and log in.

> On Windows systems where PowerShell blocks `npm.ps1`, use `npm.cmd` in place of `npm`.

## Production deployment

This repository includes production-ready deployment support with Docker, a sample environment file, and GitHub Actions CI.

1. Create a `.env` file in `server/` from `server/.env.example`.
2. Create a `.env` file in `client/` from `client/.env.example` if you want to override the API base URL.
3. Run the database migration:

```powershell
cd server
npm install
npx prisma migrate deploy
npx prisma generate
```

4. Start the full stack locally with Docker Compose. Make sure Docker Desktop or your Docker daemon is running before starting the stack.

```powershell
docker compose up --build
```

5. Visit `http://localhost:5000` to use the app. The API will also be available at `http://localhost:5000/api`.

## Cloud deployment

This repository supports a split deployment with the backend on Render and the frontend on Vercel.

### Deploy backend on Render

1. Connect this GitHub repository to Render.
2. Create a new PostgreSQL database on Render.
3. Create a web service using the `server/Dockerfile`.
4. Add these environment variables in Render:

```text
DATABASE_URL=<Render database URL>
JWT_SECRET=<strong-secret>
PORT=5000
CORS_ORIGIN=https://<your-vercel-url>
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100
```

5. Deploy the service. Note the Render service URL.

### Deploy frontend on Vercel

1. Connect this repository to Vercel.
2. Use the `client` directory as the project root.
3. Set the build command to `npm run build` and the output directory to `dist`.
4. Add this environment variable in Vercel:

```text
VITE_API_BASE_URL=https://<your-render-url>/api
```

5. Deploy the frontend.

When both are deployed, the frontend will call the Render backend with the Vercel URL as the user-facing app.

### Optional Render manifest

If you want Render to manage the backend directly from code, keep the `render.yaml` manifest in the repository and update the service name and `CORS_ORIGIN` values as needed.

## Continuous integration

For managed hosting, Render is a simple option for this repository because the server now serves the built frontend and can connect to a managed PostgreSQL database.

1. Connect this repository to Render.
2. Create a new PostgreSQL database on Render.
3. Create a web service using the `server/Dockerfile` and set the following environment variables:

```text
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/queue_management?schema=public"
JWT_SECRET=<strong-secret>
PORT=5000
CORS_ORIGIN=https://<your-render-url>
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100
```

4. Deploy the service. The frontend and API will both be served from the same Render URL.

5. Optionally, add a `render.yaml` manifest to the repository so Render can manage the web service and database from code.

## Continuous integration

A GitHub Actions workflow is included at `.github/workflows/ci.yml` to build the client and server and run server tests on every push and pull request.

## Main API routes

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Create a manager account |
| POST | `/api/auth/login` | Log in and receive a JWT |
| GET/POST | `/api/queues` | List or create queues |
| GET/DELETE | `/api/queues/:queueId` | Get or delete a queue |
| POST | `/api/tokens` | Add a person to a queue |
| GET | `/api/tokens/:queueId` | List waiting tokens |
| PATCH | `/api/tokens/:tokenId/move-up` | Move a token forward |
| PATCH | `/api/tokens/:tokenId/move-down` | Move a token backward |
| PATCH | `/api/tokens/:tokenId/serve` | Serve the token at the front |
| PATCH | `/api/tokens/:tokenId/cancel` | Cancel a waiting token |
| GET | `/api/dashboard` | Get dashboard analytics |

## Verification

```powershell
cd client; npm run build
cd ../server; npm run build
```

Both the client and server compile successfully.





