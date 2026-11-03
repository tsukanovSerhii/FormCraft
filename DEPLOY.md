# Deploying a free demo

FormCraft deploys as **one web service**: Express serves both the API and the built
React app from the same origin. This keeps the `SameSite=lax` refresh-token cookie
working. Free hosts give the frontend and backend different public-suffix domains
(`*.onrender.com`, `*.vercel.app`), so a split deploy would log users out after
15 minutes.

| Part      | Service                         | Free tier                                               |
|-----------|---------------------------------|---------------------------------------------------------|
| App       | [Render](https://render.com)    | 512 MB RAM, sleeps after 15 min idle (~1 min cold start) |
| Database  | [Neon](https://neon.tech)       | 0.5 GB PostgreSQL, no expiry                             |

The root [`Dockerfile`](Dockerfile) builds everything; [`render.yaml`](render.yaml)
describes the service.

## 1. Database (Neon)

The repo is linked to a Neon project (`.neon`, `neon.ts`). To get the connection strings:

```bash
npm i -g neon@latest
neon login
neon env pull        # writes DATABASE_URL, DATABASE_URL_UNPOOLED to .env
```

| Variable                | Host                    | Used by                                  |
|-------------------------|-------------------------|------------------------------------------|
| `DATABASE_URL`          | `ep-…-pooler.…neon.tech` | the app (Prisma + `@prisma/adapter-pg`)  |
| `DATABASE_URL_UNPOOLED` | `ep-….neon.tech`         | `prisma migrate` (`backend/prisma.config.ts`) |

Migrations must use the direct URL. Through the PgBouncer pooler, Prisma Migrate fails with
`prepared statement "s0" already exists`.

The backend reads `backend/.env` first, then the repo-root `.env`, so `neon env pull` output works locally as-is.
In production the tables are created on start (`prisma migrate deploy` runs before the server).
Locally, run `npm run db:migrate` (dev) or `cd backend && npx prisma migrate deploy`.

## 2. Deploy the app (Render)

1. Push this repo to GitHub.
2. Render dashboard → **New → Blueprint** → select the repository. Render reads `render.yaml`.
3. Fill in the prompted variables:

   | Variable        | Value                                                        |
   |-----------------|--------------------------------------------------------------|
   | `DATABASE_URL`  | pooled Neon URL from step 1                                  |
   | `DATABASE_URL_UNPOOLED` | direct Neon URL from step 1                          |
   | `FRONTEND_URL`  | `https://formcraft.onrender.com` (your service URL, no `/` at the end) |
   | `BACKEND_URL`   | same as `FRONTEND_URL`                                       |
   | `SITE_URL`      | same as `FRONTEND_URL`                                       |
   | OAuth / Resend  | leave empty (optional, see below)                            |

   `JWT_SECRET` and `JWT_REFRESH_SECRET` are generated automatically.
4. **Apply**. The first build takes about 5 minutes. Then open `https://<name>.onrender.com/api/health`.
   You should see `{"status":"ok"}`.

> The service URL is `https://<service-name>.onrender.com`. If the name `formcraft`
> is taken, Render adds a suffix. In that case, set `FRONTEND_URL`, `BACKEND_URL` and `SITE_URL`
> to the real URL under **Environment** and redeploy.
> A wrong `FRONTEND_URL` makes every write request fail with `403 Forbidden` (CSRF check).

## 3. Optional features

**Google / GitHub sign-in.** Without credentials, the buttons send the user back to the
login page with a message. To enable them, create OAuth apps with these callback URLs:

- Google: `https://<your-url>/api/auth/google/callback`
- GitHub: `https://<your-url>/api/auth/github/callback`

Then set `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` and `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`.

**Email notifications.** Set `RESEND_API_KEY` (and optionally `EMAIL_FROM`).

## Avoiding cold starts during a demo

Free Render services sleep after 15 minutes without traffic. Open the site a minute
before you present. To keep it awake, add a free monitor at
[UptimeRobot](https://uptimerobot.com) that pings `/api/health` every 10 minutes.

## Other hosts

The same `Dockerfile` works on Koyeb, Railway, and Fly.io. Set the same environment
variables there. The container listens on `PORT` (default `3000`).

To check the image locally:

```bash
docker build -t formcraft .
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET=dev -e JWT_REFRESH_SECRET=dev2 \
  -e FRONTEND_URL=http://localhost:3000 -e BACKEND_URL=http://localhost:3000 \
  -e NODE_ENV=development \
  formcraft
```

(`NODE_ENV=development` here only so the `Secure` cookie works over plain `http://localhost`.)
