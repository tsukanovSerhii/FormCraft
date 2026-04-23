# FormCraft — Roadmap

## Поточний стан
Верстка основних сторінок завершена. Весь UI статичний — дані захардкоджені, кнопки не взаємодіють зі стором.

---

## Фаза 1 — Завершення верстки
> Мета: закрити всі UI-прогалини перед підключенням логіки

- [ ] **`AddFieldModal` — розширені типи** (`More field types` кнопка відкриває другий ряд: Email, Number, Rating, Dropdown)
- [ ] **`SettingsPanel` — динамічний** (зараз показує лише MultipleChoice — має адаптуватись під тип вибраного поля)
- [ ] **`FormCanvas` — empty state** (коли полів немає — показати заглушку "No fields yet, add your first question")
- [ ] **`DashboardPage` — empty state** (коли форм немає — ілюстрація + кнопка "Create your first form")
- [ ] **`PreviewPage` — адаптивний топбар** (перемикач Desktop / Mobile view)
- [ ] **Workspace block у Sidebar** — клікабельний аватар / dropdown з виходом

---

## Фаза 2 — Стейт (Zustand store)
> Мета: зробити все інтерактивним без бекенду

### 2.1 Form store (`src/store/formBuilderStore.ts`)
- [ ] Тип `FormState`: `forms[]`, `activeFormId`, `selectedFieldId`
- [ ] Екшени: `createForm`, `deleteForm`, `duplicateForm`
- [ ] Екшени: `addField(type)`, `removeField(id)`, `duplicateField(id)`, `updateField(id, patch)`
- [ ] Екшени: `reorderFields(from, to)` — для drag & drop
- [ ] `selectField(id)` — відкриває SettingsPanel для конкретного поля

### 2.2 Підключення до UI
- [ ] **"New Form" кнопка** → `createForm()` → redirect на `/builder?id=...`
- [ ] **"Add Question" / AddFieldModal** → `addField(type)` → поле з'являється в канвасі
- [ ] **FormCanvas** рендерить `form.fields` зі стору замість захардкоджених
- [ ] **SettingsPanel** читає `selectedField` зі стору, зміни → `updateField()`
- [ ] **DashboardPage** читає `forms[]` зі стору
- [ ] **Кнопки Duplicate / Delete** у SettingsPanel → відповідні екшени

### 2.3 Persistence
- [ ] Zustand `persist` middleware → `localStorage` (форми зберігаються між сесіями)

---

## Фаза 3 — Drag & Drop
> Мета: перетягування полів у FormCanvas і опцій у SettingsPanel

- [ ] Підключити `@dnd-kit/react` (вже є в `package.json`)
- [ ] **FormCanvas** — drag & drop між полями (`reorderFields`)
- [ ] **SettingsPanel → Options** — drag & drop між опціями (`GripVertical` вже є в UI)

---

## Фаза 4 — Роутинг і мульти-форми
> Мета: кожна форма має свою URL

- [ ] Роут `/builder/:formId` замість `/builder`
- [ ] Роут `/preview/:formId` — публічна форма по ID
- [ ] `BuilderPage` читає `formId` з params → завантажує форму зі стору
- [ ] **TopBar** показує назву активної форми (редагується inline click)

---

## Фаза 5 — Валідація і публікація
> Мета: форми можна заповнювати і відправляти

- [ ] `PreviewPage` використовує `react-hook-form` + `zod` (вже є в `package.json`)
- [ ] `buildValidationSchema()` з `src/schemas/fieldSchemas.ts` генерує схему з полів форми
- [ ] Submit зберігає відповідь в store (`responsesStore`)
- [ ] **ResponsesPage** читає з `responsesStore` замість mock-даних
- [ ] Валідація обов'язкових полів (поле `required` вже є в типах)

---

## Фаза 6 — Бекенд (опційно)
> Мета: дані живуть на сервері, а не в localStorage

- [ ] Вибір стеку (Supabase / Firebase / власний API)
- [ ] Авторизація (email + password або OAuth)
- [ ] CRUD форм через API замість Zustand persist
- [ ] Real-time відповіді (websocket або polling)

---

## Технічний борг
- [ ] `StatusBadge` у `DashboardPage` — виділити в `ui/`
- [ ] Замінити всі inline SVG іконки на `lucide-react` де можливо
- [ ] Додати `ErrorBoundary` для сторінок
- [ ] Базові тести (Vitest) для store-екшенів
