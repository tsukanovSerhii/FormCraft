# Architecture

FormCraft is an npm-workspaces monorepo: a React single-page app in `frontend/` and an Express
API in `backend/`, backed by PostgreSQL through Prisma.

```
Browser ──► Express (one origin in production)
             ├── /api/*   JSON API ──► Prisma ──► PostgreSQL
             └── /*       built SPA (frontend/dist)
```

In production one container serves both the API and the SPA (`FRONTEND_DIST`), so the refresh
cookie stays first-party. Locally Vite serves the SPA on `:5173` and the API runs on `:3000`.
See [DEPLOYMENT.md](DEPLOYMENT.md).

## Form lifecycle

```
create (draft) ──► edit + autosave ──► publish ──► public link /f/:id ──► responses
                        ▲                 │                                  │
                        └── restore ◄── version snapshot          analytics · CSV · notifications
```

1. **Create.** `POST /api/forms` makes a draft owned by the user, optionally inside a workspace.
2. **Edit.** The builder keeps the form in a Zustand store and autosaves with `PATCH` after 2 s
   of inactivity. Fields live in a `fields` JSON column on `forms` (see the field shape in
   [API.md](API.md#forms--apiforms-)).
3. **Publish.** Setting `status: "published"` stores a snapshot in `form_versions`. Any version
   can be restored later. The current state is saved first, so a restore can itself be undone.
4. **Share.** `/f/:id` loads the form from `GET /api/public/forms/:id`. That endpoint returns
   only what a respondent needs (no owner or workspace IDs). Drafts return 404.
5. **Respond.** `POST /api/responses/:formId/submit`. The form can stop accepting answers
   after `expiresAt` or after `maxResponses` (`410`).
6. **After a response**, the author gets an in-app notification (stored, then pushed over SSE),
   plus an email if `notifyOnResponse` is on and `RESEND_API_KEY` is set.
7. **Analyze.** The responses table, CSV export and analytics read the same `responses` rows.

**Preview** (`/preview/:id`) renders the real form but never records a response, so owner
test runs never mix with real data.

## Validation

The same rules run twice: in the browser for instant feedback and on the server because the
client can be bypassed.

| | Frontend | Backend |
|---|---|---|
| File | `frontend/src/schemas/fieldSchemas.ts` | `backend/src/utils/submission.ts` |
| Hidden by condition | skipped | skipped, answer dropped |
| Empty + required | error on that field | `400` |
| Empty + optional | allowed | allowed, not stored |
| Type checks | email, phone, number, rating range | same, plus size limits |
| Unknown keys | not sent (`prepareSubmission`) | dropped |

A field is visible when its `condition` matches the current answers (`equals`, `not_equals`,
`contains`, `not_empty`; see `frontend/src/lib/conditions.ts`). The whole response is validated
in one pass (`superRefine`), because one field's visibility depends on another's value.

Answers are also sanitized on the server: HTML is stripped. A `file` field stores only
`{ name, size, type }`. There is no upload storage yet.

## Access to forms

All form-scoped endpoints go through `findAccessibleForm()` (`backend/src/utils/formAccess.ts`):

| Who | read (form, responses, analytics, versions) | write (edit, restore) | delete |
|---|:-:|:-:|:-:|
| Author | ✓ | ✓ | ✓ |
| Workspace `owner` | ✓ | ✓ | ✓ |
| Workspace `editor` | ✓ | ✓ | — |
| Workspace `viewer` | ✓ | — | — |
| Invited, not yet accepted | — | — | — |

Forbidden and missing forms both return `404`. Only workspace owners and editors may create a
form in a workspace or move a form into one.

## Authentication

- **Access token:** JWT, 15 min, sent as `Authorization: Bearer`. The SPA keeps it in memory
  (Zustand) and refreshes it on `401`.
- **Refresh token:** JWT, 7 days, in an `httpOnly`, `SameSite=lax`, `Secure` (production) cookie.
  The SSE stream is authenticated by this cookie, because `EventSource` can't send headers.
- **OAuth:** Google and GitHub through Passport. A provider is enabled only when its client ID
  and secret are set. Signing in with an email that already has an account links the provider
  to that account.
- **CSRF:** write endpoints require an `Origin`/`Referer` that matches `FRONTEND_URL`.

## Reliability and security

- `express-async-errors` plus a global error handler: a failing handler returns `500` and logs
  the error instead of crashing the process. OAuth failures redirect to `/login?error=oauth_failed`.
- Helmet headers, a per-IP rate limit on submissions, `trust proxy` behind the hosting proxy.
- Configuration is read from `backend/.env`, then the repo-root `.env` (written by
  `neon env pull`). Real environment variables win.

## Data model

```
User ─┬─< Form ─┬─< Response
      │         └─< FormVersion
      ├─< UserTemplate
      ├─< Notification
      └─< WorkspaceMember >── Workspace ──< Form (optional)
```

Deleting a user deletes their forms, responses, versions, templates and notifications.
Deleting a workspace keeps its forms; they stay with their authors. The schema is in
`backend/prisma/schema.prisma`, and every change ships as a migration (see
[DEPLOYMENT.md](DEPLOYMENT.md#database-changes-must-ship-as-migrations)).

## Frontend layout

| Folder | Contents |
|---|---|
| `pages/` | Route screens; all but the landing page are lazy-loaded |
| `components/sections/` | Builder canvas, field settings, form renderer |
| `components/ui/` | Shared UI: buttons, modals, toasts, notification center |
| `store/` | Zustand stores (forms, auth, responses, notifications) |
| `api/` | Typed API client with automatic token refresh |
| `index.css` | Theme tokens for light and dark themes, checked for WCAG AA contrast |

## Tests

| Suite | Tool | Covers |
|---|---|---|
| `frontend/src/test/` | Vitest + Testing Library | Builder store, validation schema incl. conditions |
| `backend/src/test/` | Vitest + Supertest, Prisma mocked | Auth, forms, submissions, workspace access, notifications |

`npm test` at the repo root runs both. CI runs lint, tests and builds on every push and PR.
