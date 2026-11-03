# Roadmap

## Done

| Area | What's in place |
|---|---|
| Builder | Drag-and-drop editor, 11 field types, conditional logic, autosave, desktop/mobile preview |
| Publishing | Public links, SEO meta and sitemap, response limit, expiry date, version history with restore |
| Responses | Table with search and filters, CSV export, validation in the browser and on the server |
| Analytics | Submissions over time, activity heatmap, per-field distribution, top forms, recent activity |
| Teams | Workspaces with owner / editor / viewer roles, access checks on every form endpoint |
| Notifications | In-app notification center with live updates (SSE), optional email via Resend |
| Accounts | Email/password, Google and GitHub sign-in with account linking, profile and security settings |
| Quality | Unit and API tests, CI (lint, test, build), WCAG AA colors in light and dark themes |
| Hosting | Single-container deploy on Render + Neon, migrations applied on start |

## Next

**Collecting data**
- [ ] File uploads with real storage (S3 / R2) and a size limit. Today a file field keeps only metadata
- [ ] Thank-you page redirect to a custom URL after submit
- [ ] Per-form theme: accent color, logo, option to hide FormCraft branding

**Analytics**
- [ ] Drop-off funnel: the field where people abandon the form
- [ ] Completion rate (started vs submitted)
- [ ] Export the analytics report as PDF / PNG

**Integrations**
- [ ] Webhooks on new responses, configured per form
- [ ] Google Sheets sync
- [ ] Slack notifications
- [ ] API keys for reading responses from other systems

**Teams**
- [ ] Email invitations, including people without an account yet (today only registered users can be invited)

## Tech debt

- [ ] Rate-limit the auth endpoints (login, register, refresh); only submissions are limited now
- [ ] `robots.txt` points to `formcraft.app/sitemap.xml`, but the sitemap is served at `/api/public/sitemap.xml`
- [ ] `useTemplate` writes to the store with `setState`; move it into a store action
- [ ] `npm audit` step in CI that fails on critical vulnerabilities
- [ ] `backend/Dockerfile` (docker-compose) still uses Node 20 and no lockfile; the root `Dockerfile` uses Node 22 and `npm ci`
- [ ] Move to Express 5 (native async error handling) and drop `express-async-errors`

## Later

- Mobile app (React Native + Expo): dashboard, response viewer, push notifications
- Custom domains for public forms
