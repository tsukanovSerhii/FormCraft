<div align="center">

# FormCraft

**Drag-and-drop form builder with conditional logic, analytics and team workspaces.**

[![CI](https://github.com/tsukanovSerhii/FormCraft/actions/workflows/ci.yml/badge.svg)](https://github.com/tsukanovSerhii/FormCraft/actions/workflows/ci.yml)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma_7-4169e1?logo=postgresql&logoColor=white)

[**Live demo**](https://formcraft-q6os.onrender.com) · [Architecture](docs/ARCHITECTURE.md) · [API](docs/API.md) · [Deployment](docs/DEPLOYMENT.md) · [Roadmap](docs/ROADMAP.md)

</div>

> The demo runs on a free Render instance. It sleeps after 15 minutes of inactivity, so the first request can take up to a minute.

## Features

**Build**
- Drag-and-drop editor with 11 field types: text, textarea, number, email, phone, select, radio, checkbox, date, file, rating
- Conditional logic: show a field only when another answer matches
- Autosave, desktop/mobile preview, version history with one-click restore
- Built-in templates plus your own saved templates

**Collect**
- Public link for every published form, with SEO meta tags and a sitemap
- Response limit and expiry date per form
- Validation on both sides: the browser and the API apply the same rules, including conditional fields

**Analyze**
- Responses table with search, filters and CSV export
- Submissions over time, per-field answer distribution, recent activity
- In-app notifications in real time (Server-Sent Events) and optional email alerts

**Collaborate**
- Workspaces with `owner` / `editor` / `viewer` roles; invite registered users by their email
- Sign in with email and password, Google or GitHub
- Light and dark themes, WCAG AA contrast in both

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, Zustand, React Router, React Hook Form + Zod, dnd-kit, Recharts |
| Backend | Node.js, Express, Prisma 7 (`@prisma/adapter-pg`), Passport, JWT, Helmet, Zod |
| Database | PostgreSQL (Neon in production, Docker locally) |
| Tests | Vitest, Testing Library, Supertest |
| Infra | npm workspaces, Docker, GitHub Actions, Render |

## Quick start

**Requirements:** Node.js 20+ and PostgreSQL 15+ (or Docker).

```bash
git clone https://github.com/tsukanovSerhii/FormCraft.git
cd FormCraft
npm install                              # installs both workspaces

cp backend/.env.example backend/.env     # set DATABASE_URL and the JWT secrets
npm run db:migrate                       # create the tables
npm run dev                              # frontend :5173 + backend :3000
```

Google and GitHub sign-in are optional. Without their keys the app works with email and password.

**Everything in Docker:**

```bash
cp .env.example .env
docker compose up --build                # http://localhost:5173
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Frontend and backend with hot reload |
| `npm test` | All tests (frontend + backend) |
| `npm run build` | Production build of both packages |
| `npm run db:migrate` | Create and apply Prisma migrations |
| `npm run db:studio` | Browse the database in Prisma Studio |
| `npm run lint -w frontend` | ESLint |

## Project structure

```
FormCraft/
├── frontend/            React app (Vite)
│   └── src/
│       ├── pages/       Route screens: dashboard, builder, responses, analytics…
│       ├── components/  UI building blocks and feature sections
│       ├── store/       Zustand stores
│       ├── schemas/     Response validation (mirrors the backend)
│       └── api/         API client
├── backend/             Express API
│   ├── prisma/          Schema and migrations
│   └── src/
│       ├── routes/      Route definitions
│       ├── controllers/ Request handlers
│       ├── middleware/  Auth, CSRF, workspace roles
│       └── utils/       Form access, submission validation, sanitizing
├── docs/                Architecture, API, deployment, roadmap
├── Dockerfile           Single-service image for hosting
└── docker-compose.yml   Local stack: Postgres + API + frontend
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md): form lifecycle, validation, access rules, authentication
- [API reference](docs/API.md): every endpoint, its auth and the responses
- [Deployment](docs/DEPLOYMENT.md): free hosting on Render + Neon
- [Roadmap](docs/ROADMAP.md): what's done and what's next
