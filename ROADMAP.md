# FormCraft — Roadmap

## Поточний стан
Фази 1–6 завершені. Фронтенд підключено до бекенду (Express + Prisma + PostgreSQL). Авторизація через JWT + Google/GitHub OAuth. Монорепо з Docker.

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

## 🔜 Фаза 7 — Settings і профіль користувача
> Мета: керування акаунтом і налаштуваннями воркспейсу

- [ ] **SettingsPage** — вкладки Profile / Security / Integrations
  - [ ] Зміна імені і аватара (upload до S3 або локально)
  - [ ] Зміна пароля (поточний → новий)
  - [ ] Видалення акаунта
- [ ] **Аватар у Sidebar** — показувати фото/ініціали залогованого юзера
- [ ] **Logout** кнопка у Sidebar або AppTopBar
- [ ] **AppTopBar** — показувати ім'я та аватар поточного юзера

---

## 🔜 Фаза 8 — Sharing і публічні форми
> Мета: форму можна розповсюджувати за посиланням

- [ ] **Публічний URL** `/f/:formId` — окремий роут без авторизації
- [ ] **Share modal** у TopBar — копіювання посилання, QR-код
- [ ] **Embed код** — `<iframe>` snippet для вставки на сайт
- [ ] **Form branding** — назва і логотип у шапці публічної форми
- [ ] **Custom slug** — `/f/my-form-name` замість UUID

---

## 🔜 Фаза 9 — Responses і експорт
> Мета: перегляд і вивантаження відповідей

- [ ] **ResponsesPage** — перегляд окремої відповіді (modal або сторінка)
- [ ] **Фільтрація** відповідей по даті, формі, статусу
- [ ] **Пошук** по відповідях
- [ ] **Експорт CSV** — вивантаження всіх відповідей форми
- [ ] **Pagination** у таблиці відповідей
- [ ] **Webhook** — надсилати відповідь на зовнішній URL при submit

---

## 🔜 Фаза 10 — Notifications і real-time
> Мета: миттєві сповіщення при нових відповідях

- [ ] **Email notification** при новій відповіді (Nodemailer / Resend)
- [ ] **In-app notifications** — дзвіночок у TopBar
- [ ] **Real-time** — WebSocket або SSE для живого оновлення ResponsesPage
- [ ] **Notification preferences** у Settings

---

## 🔜 Фаза 11 — Тести і якість коду
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
