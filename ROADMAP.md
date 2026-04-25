# FormCraft — Roadmap

## Поточний стан
Фази 1–9 завершені. Фронтенд підключено до бекенду (Express + Prisma + PostgreSQL). Авторизація через JWT + Google/GitHub OAuth. Монорепо з Docker.

---

## ✅ Фаза 1 — Завершення верстки
- [x] `AddFieldModal` — розширені типи (11 типів полів)
- [x] `SettingsPanel` — динамічний (адаптується під тип поля)
- [x] `FormCanvas` — empty state
- [x] `DashboardPage` — empty state
- [x] `PreviewPage` — адаптивний топбар (Desktop / Mobile)

---

## ✅ Фаза 2 — Стейт (Zustand store)
- [x] `FormState`: `forms[]`, `activeFormId`, `selectedFieldId`
- [x] Всі CRUD екшени для форм і полів
- [x] `reorderFields` для drag & drop
- [x] Zustand `persist` → `localStorage`

---

## ✅ Фаза 3 — Drag & Drop
- [x] `@dnd-kit/react` підключено
- [x] Drag & drop між полями у `FormCanvas`
- [x] Drag & drop між опціями у `SettingsPanel`

---

## ✅ Фаза 4 — Роутинг і PreviewPage
- [x] Роут `/builder/:formId`
- [x] Inline редагування назви форми у `TopBar`
- [x] `PreviewPage` рендерить поля форми зі store по ID
- [x] Перемикач Desktop / Mobile

---

## ✅ Фаза 5 — Валідація і публікація
- [x] `PreviewPage` — справжні input'и для заповнення форми
- [x] Валідація через `react-hook-form` + `zod`
- [x] `buildValidationSchema()` генерує схему з полів форми
- [x] Submit зберігає відповідь в `responsesStore`
- [x] `ResponsesPage` читає з `responsesStore`
- [x] Кнопка Publish змінює `status: 'draft' → 'published'`

---

## ✅ Фаза 6 — Бекенд і інфраструктура
- [x] Монорепо: `frontend/` + `backend/` з npm workspaces
- [x] Backend: Express + Prisma ORM + PostgreSQL
- [x] Auth: JWT (access + refresh token) + Google OAuth + GitHub OAuth
- [x] API: CRUD форм, відповідей, авторизація
- [x] `ProtectedRoute` — захист маршрутів від неавторизованих
- [x] API інтеграція у stores з offline-first підходом (optimistic updates)
- [x] `useAutoSave` — автозбереження форми у білдері (2s debounce)
- [x] `FormRenderer` винесено з `PreviewPage` у окремий компонент
- [x] `src/hooks/` — централізовані хуки
- [x] `src/types/` — розбито на `form.ts`, `auth.ts`, `api.ts`
- [x] `TemplatesPage` — реальні шаблони з полями + `useTemplate`
- [x] `AnalyticsPage` — реальні дані зі stores
- [x] Docker Compose: postgres + backend + frontend (nginx)
- [x] Загальний `README.md`

---

## ✅ Фаза 7 — Settings і профіль користувача
- [x] **SettingsPage** — вкладки Profile / Security
  - [x] Зміна імені (PATCH /api/auth/me)
  - [x] Зміна пароля (PATCH /api/auth/me/password)
  - [x] Видалення акаунта (DELETE /api/auth/me)
- [x] **Аватар у Sidebar** — фото або ініціали з authStore
- [x] **Logout** кнопка у Sidebar (нижній блок юзера)
- [x] **AppTopBar** — ім'я та аватар, клік → /settings

---

## ✅ Фаза 8 — Sharing і публічні форми
- [x] **Публічний URL** `/f/:formId` — окремий роут без авторизації
- [x] **Share modal** у TopBar — копіювання посилання + QR-код + embed snippet
- [x] **Embed код** — `<iframe>` snippet з preview
- [x] **Form branding** — логотип FormCraft у шапці публічної форми
- [x] **Backend** — `GET /api/public/forms/:id` без авторизації (тільки published)

---

## ✅ Фаза 9 — Responses і експорт
- [x] **ResponsesPage** — перегляд окремої відповіді у ResponseModal
- [x] **Фільтрація** по даті (7d / 30d / all) і формі
- [x] **Пошук** по назві форми і даних відповіді
- [x] **Експорт CSV** — GET /api/responses/:id/export/csv (з авторизацією)
- [x] **Pagination** — 20 на сторінку, навігація prev/next
- [x] **Backend pagination** — query params page + limit у getResponses

---

## ✅ Фаза 10 — SEO і публічна видимість
- [x] **`<meta>` теги** — title, description, og:image для кожної публічної форми (`/f/:formId`)
- [x] **`react-helmet-async`** — динамічний head на основі даних форми
- [x] **`sitemap.xml`** — backend генерує список опублікованих форм для crawlers (`GET /api/public/sitemap.xml`)
- [x] **`robots.txt`** — дозволити індексацію `/f/*`, закрити `/builder/*`, `/api/*`
- [x] **Structured data (JSON-LD)** — schema.org `WebPage` для публічних форм, `WebApplication` для landing
- [x] **Open Graph / Twitter Card** — превью при шеренні в соцмережах
- [x] **Canonical URL** — запобігти дублюванню контенту
- [x] **Landing page** `/` — публічна сторінка-вітрина FormCraft для нових відвідувачів

---

## ✅ Фаза 11 — Безпека і захист від XSS
- [x] **Sanitize form input на backend** — `sanitize-html` очищає всі текстові поля відповідей перед збереженням у БД (`src/utils/sanitize.ts`)
- [x] **Content Security Policy (CSP)** — `helmet` з директивами `defaultSrc`, `scriptSrc`, `frameSrc: none`
- [x] **Helmet.js** — встановлено і підключено (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` etc.)
- [x] **Rate limiting** — `express-rate-limit` 30 req/15min на `POST /:formId/submit`
- [x] **Escaping у FormRenderer** — підтверджено: жодного `dangerouslySetInnerHTML`, React екранує як text
- [x] **Валідація типів полів на backend** — email → regex, number → `isNaN(Number(v))` у `submitResponse`
- [x] **CSRF protection** — `csrfProtect` middleware перевіряє `Origin`/`Referer` для POST/PATCH/DELETE
- [ ] **Audit залежностей** — `npm audit` у CI, блокувати build при critical вразливостях

---

## 🔜 Фаза 12 — Notifications і real-time
> Мета: миттєві сповіщення при нових відповідях

- [ ] **Email notification** при новій відповіді (Nodemailer / Resend)
- [ ] **In-app notifications** — дзвіночок у TopBar
- [ ] **Real-time** — WebSocket або SSE для живого оновлення ResponsesPage
- [ ] **Notification preferences** у Settings

---

## 🔜 Фаза 13 — Тести і якість коду
> Мета: надійність і захист від регресій

- [ ] **Vitest** — unit-тести для store екшенів
- [ ] **React Testing Library** — компонентні тести (FormCanvas, SettingsPanel)
- [ ] **Supertest** — integration тести для API ендпоінтів
- [ ] **CI/CD** — GitHub Actions: lint + test + build при PR
- [ ] **Error Boundary** — обгортка для BuilderLayout і PreviewPage

---

## Технічний борг
- [ ] Inline редагування назви форми у `FormHeader` на канвасі
- [ ] Workspace dropdown у Sidebar
- [ ] `StatusBadge` у `DashboardPage/FormCard` — виділити в `ui/`
- [ ] Rate limiting на API ендпоінтах
- [ ] Валідація розміру файлів при upload
- [ ] `useTemplate` — мутує store напряму, треба перенести логіку в store action
