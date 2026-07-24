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
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/queue_management?schema=public"
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
