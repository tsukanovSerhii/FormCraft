# FormCraft

A full-stack form builder with drag & drop, real-time validation, and response tracking.

## Tech Stack

| Layer    | Technology                                        |
|----------|---------------------------------------------------|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS, Zustand |
| Backend  | Node.js, Express, Prisma ORM                      |
| Database | PostgreSQL                                        |
| Auth     | JWT (access + refresh), Google OAuth, GitHub OAuth |
| Deploy   | Docker, Render + Neon (free demo)                 |

## Project Structure

```
FormCraft/
├── frontend/          # Vite + React app
├── backend/           # Express API + Prisma
├── docker-compose.yml
└── package.json       # npm workspaces root
```

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+ (or use Docker)
- Google & GitHub OAuth credentials (optional — email/password works without them)

### 1. Clone and install

```bash
git clone https://github.com/your-username/formcraft.git
cd formcraft
npm install
```

Run `npm install` only from the repo root. npm workspaces use one root `package-lock.json`, so
don't create lockfiles inside `frontend/` or `backend/`.

### 2. Configure environment

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your database URL and OAuth credentials.

### 3. Run database migrations

```bash
npm run db:migrate
```

### 4. Start development servers

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Docker

Start everything (app + database) with a single command:

```bash
docker compose up --build
```

The app will be available at http://localhost:5173.

## Free demo deployment

The root `Dockerfile` builds a single service where Express also serves the frontend.
See [DEPLOY.md](DEPLOY.md) for step-by-step setup on Render + Neon.

## API Endpoints

### Auth
| Method | Path                      | Description                |
|--------|---------------------------|----------------------------|
| POST   | `/api/auth/register`      | Email + password register  |
| POST   | `/api/auth/login`         | Email + password login     |
| POST   | `/api/auth/refresh`       | Refresh access token       |
| POST   | `/api/auth/logout`        | Clear refresh cookie       |
| GET    | `/api/auth/me`            | Get current user           |
| GET    | `/api/auth/google`        | Google OAuth               |
| GET    | `/api/auth/github`        | GitHub OAuth               |

### Forms
| Method | Path             | Description      |
|--------|------------------|------------------|
| GET    | `/api/forms`     | List user forms  |
| POST   | `/api/forms`     | Create form      |
| GET    | `/api/forms/:id` | Get form         |
| PATCH  | `/api/forms/:id` | Update form      |
| DELETE | `/api/forms/:id` | Delete form      |

### Responses
| Method | Path                          | Description                     |
|--------|-------------------------------|---------------------------------|
| POST   | `/api/responses/:formId/submit` | Submit a response             |
| GET    | `/api/responses/:formId`      | Get responses (auth required)   |

## Scripts

```bash
npm run dev          # Run frontend + backend concurrently
npm run frontend     # Frontend only
npm run backend      # Backend only
npm run build        # Build both for production
npm run db:migrate   # Run Prisma migrations
npm run db:studio    # Open Prisma Studio
```
