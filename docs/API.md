# API reference

Base path: `/api`. Requests and responses are JSON unless noted.

**Auth.** Protected endpoints need `Authorization: Bearer <accessToken>`. The access token lives
15 minutes. Refresh it with `POST /api/auth/refresh`, which reads the `refresh_token` httpOnly
cookie (7 days).

**CSRF.** Write requests to forms, templates, versions and workspaces must send an `Origin` (or
`Referer`) header that matches `FRONTEND_URL`. Otherwise they get `403`.

**Errors** look like `{ "error": "message" }`. Unexpected failures return `500` and are logged on
the server.

Legend: 🔒 requires a token, 🛡️ also checks CSRF.

## Health

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | `{ "status": "ok" }` |

## Auth — `/api/auth`

| Method | Path | | Description |
|---|---|---|---|
| POST | `/register` | | `{ name, email, password (≥ 8) }` → `201 { accessToken, user }`, sets refresh cookie |
| POST | `/login` | | `{ email, password }` → `{ accessToken, user }` |
| POST | `/refresh` | | New access token from the refresh cookie |
| POST | `/logout` | | Clears the refresh cookie |
| GET | `/me` | 🔒 | Current user |
| PATCH | `/me` | 🔒 | Update name / avatar |
| PATCH | `/me/password` | 🔒 | Change password |
| DELETE | `/me` | 🔒 | Delete the account with all its forms and responses |
| GET | `/google`, `/github` | | Start OAuth. Redirects to `/login?error=oauth_unavailable` when the provider isn't configured |
| GET | `/google/callback`, `/github/callback` | | OAuth callback. Redirects to `/auth/callback?token=…`. Signing in with an email that already has an account links the provider to that account |

## Forms — `/api/forms` 🔒

| Method | Path | | Access | Description |
|---|---|---|---|---|
| GET | `/` | | | Your forms. With `?workspaceId=` the workspace's forms (members only) |
| GET | `/:id` | | read | One form |
| POST | `/` | 🛡️ | | Create. `workspaceId` requires the `owner` or `editor` role in that workspace |
| PATCH | `/:id` | 🛡️ | write | Partial update. Publishing saves a version snapshot |
| DELETE | `/:id` | 🛡️ | delete | Delete the form with its responses and versions |
| GET | `/:formId/versions` | | read | Version list |
| POST | `/:formId/versions/:versionId/restore` | 🛡️ | write | Restore a version. The current state is saved as a new version first |
| GET | `/:formId/analytics?days=30` | | read | Totals, submissions by day, per-field distribution |

**Form body**

```jsonc
{
  "title": "Event registration",          // 1–200 chars
  "description": "Optional",              // ≤ 2000 chars
  "status": "draft",                      // "draft" | "published"
  "expiresAt": null,                      // ISO datetime: stop accepting responses after it
  "maxResponses": null,                   // positive int: stop after N responses
  "workspaceId": null,
  "fields": [                             // ≤ 200 fields
    { "id": "name", "type": "text", "label": "Full name", "required": true },
    { "id": "role", "type": "select", "label": "Role", "required": true,
      "options": [{ "id": "o1", "label": "Student" }, { "id": "o2", "label": "Employee" }] },
    { "id": "company", "type": "text", "label": "Company", "required": true,
      "condition": { "fieldId": "role", "operator": "equals", "value": "Employee" } },
    { "id": "score", "type": "rating", "label": "Rate us", "required": false, "ratingMax": 5 }
  ]
}
```

Field types: `text`, `textarea`, `number`, `email`, `phone`, `select`, `radio`, `checkbox`, `date`,
`file`, `rating`. Condition operators: `equals`, `not_equals`, `contains`, `not_empty`.

**Access levels** (see [Architecture → Access](ARCHITECTURE.md#access-to-forms)): the author has
full access. Workspace members can `read`, editors and owners can `write`, and only workspace
owners can `delete`. A missing or forbidden form returns `404` either way, so the API doesn't
reveal which form IDs exist.

## Public — `/api/public`

| Method | Path | Description |
|---|---|---|
| GET | `/forms/:id` | A published form: `id, title, description, status, fields, updatedAt`. Drafts return `404` |
| GET | `/sitemap.xml` | XML sitemap of published forms |

## Responses — `/api/responses`

| Method | Path | | Description |
|---|---|---|---|
| POST | `/:formId/submit` | | Submit answers `{ [fieldId]: value }`. Rate-limited per IP |
| GET | `/:formId?page=1&limit=20` | 🔒 | Paginated responses (`limit` ≤ 100), read access |
| GET | `/:formId/export/csv` | 🔒 | CSV download, read access |

Submission rules, applied on the server even if the client skipped them:

- Only answers to the form's fields are stored. Unknown keys are dropped.
- Fields hidden by their `condition` are skipped. Their answers aren't stored and they aren't required.
- Required visible fields must be non-empty → otherwise `400 { error: "\"Name\" is required" }`.
- Types are checked: email, phone, number, rating `1..ratingMax`, checkbox (list of strings), text ≤ 10 000 chars.
- Text is sanitized: HTML is stripped.
- A `file` answer keeps only its metadata `{ name, size, type }`. Uploads aren't stored.

| Status | Meaning |
|---|---|
| `201` | Saved |
| `400` | Validation failed |
| `404` | Form missing or not published |
| `410` | Form expired or reached `maxResponses` |
| `429` | Too many submissions from this IP |

## Templates — `/api/templates` 🔒

| Method | Path | | Description |
|---|---|---|---|
| GET | `/` | | Your saved templates |
| POST | `/` | 🛡️ | Save `{ title, description?, category?, fields }` |
| DELETE | `/:id` | 🛡️ | Delete |

## Workspaces — `/api/workspaces` 🔒

| Method | Path | | Role | Description |
|---|---|---|---|---|
| GET | `/` | | | Workspaces you belong to |
| POST | `/` | 🛡️ | | Create (you become `owner`) |
| PATCH | `/:id` | 🛡️ | owner | Rename |
| DELETE | `/:id` | 🛡️ | owner | Delete. Its forms stay with their authors |
| GET | `/:id/members` | | member | Members and pending invitations |
| POST | `/:id/invite` | 🛡️ | owner | Invite a registered user `{ email, role }` |
| PATCH | `/:id/members/:userId` | 🛡️ | owner | Change role |
| DELETE | `/:id/members/:userId` | 🛡️ | member | Remove a member, or leave |

## Notifications — `/api/notifications` 🔒

| Method | Path | Description |
|---|---|---|
| GET | `/stream` | Server-Sent Events. Authenticated by the refresh cookie, because `EventSource` can't send headers. Emits `{ "type": "notification", "notification": {…} }` |
| GET | `/` | Last 30 notifications |
| PATCH | `/:id/read` | Mark one as read |
| PATCH | `/read-all` | Mark all as read |
| GET / PATCH | `/preferences` | `{ notifyOnResponse: boolean }`: email the owner about new responses |

Every new response creates an in-app notification for the form's author and pushes it to their
open tabs.
