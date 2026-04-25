# FormCraft

A full-stack form builder with drag & drop, real-time validation, and response tracking.

## Tech Stack

| Layer    | Technology                                        |
|----------|---------------------------------------------------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, Zustand |
| Backend  | Node.js, Express, Prisma ORM                      |
| Database | PostgreSQL                                        |
| Auth     | JWT (access + refresh), Google OAuth, GitHub OAuth |
| Deploy   | Docker + Docker Compose                           |

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
- Google & GitHub OAuth credentials

### 1. Clone and install

```bash
git clone https://github.com/your-username/formcraft.git
cd formcraft
npm install
```

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
