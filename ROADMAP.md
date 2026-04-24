# FormCraft — Roadmap

## Поточний стан
Фази 1–3 завершені. Store підключений, всі поля інтерактивні, drag & drop працює. Наступний крок — роутинг і PreviewPage.

---

## ✅ Фаза 1 — Завершення верстки
> Мета: закрити всі UI-прогалини перед підключенням логіки

- [x] **`AddFieldModal` — розширені типи** (11 типів полів, expandable секція)
- [x] **`SettingsPanel` — динамічний** (адаптується під тип: Placeholder, Options, Rating, Date, File)
- [x] **`FormCanvas` — empty state** ("No fields yet" з кнопкою Add First Field)
- [x] **`DashboardPage` — empty state** ("No forms yet" з кнопкою Create your first form)
- [ ] **`PreviewPage` — адаптивний топбар** (перемикач Desktop / Mobile view) — _залишено на Фазу 4_
- [ ] **Workspace block у Sidebar** — клікабельний dropdown — _технічний борг_

---

## ✅ Фаза 2 — Стейт (Zustand store)
> Мета: зробити все інтерактивним без бекенду

### 2.1 Form store
- [x] `FormState`: `forms[]`, `activeFormId`, `selectedFieldId`
- [x] Екшени: `createForm`, `deleteForm`, `duplicateForm`, `updateFormTitle`
- [x] Екшени: `addField`, `removeField`, `duplicateField`, `updateField`
- [x] `reorderFields(from, to)` — для drag & drop
- [x] `selectField(id)` — відкриває SettingsPanel для поля

### 2.2 Підключення до UI
- [x] **"New Form"** → `createForm()` → redirect `/builder/:id`
- [x] **AddFieldModal** → `addField(type)` → поле в канвасі
- [x] **FormCanvas** рендерить `form.fields` зі store
- [x] **SettingsPanel** читає `selectedField`, всі зміни → `updateField()`
- [x] **DashboardPage** читає `forms[]` зі store, dropdown Edit/Duplicate/Delete
- [x] **Кнопки Duplicate / Delete** у SettingsPanel

### 2.3 Persistence
- [x] Zustand `persist` → `localStorage`

---

## ✅ Фаза 3 — Drag & Drop
> Мета: перетягування полів і опцій

- [x] `@dnd-kit/react` підключено
- [x] **FormCanvas** — drag & drop між полями через GripVertical
- [x] **Опції в канвасі** — drag & drop всередині radio/checkbox/select
- [x] **SettingsPanel → Options** — drag & drop між опціями

---

## 🔜 Фаза 4 — Роутинг і PreviewPage
> Мета: форми доступні по URL, назва редагується, preview працює

- [x] Роут `/builder/:formId` — зроблено в Фазі 2
- [x] `BuilderPage` читає `formId` з params
- [ ] **Inline редагування назви форми** у TopBar (клік → input)
- [ ] **Роут `/preview/:formId`** — публічна форма по ID
- [ ] **PreviewPage** рендерить поля форми зі store по ID
- [ ] **TopBar перемикач Desktop / Mobile** у PreviewPage

---

## 🔜 Фаза 5 — Валідація і публікація
> Мета: форми можна заповнювати і відправляти

- [ ] `PreviewPage` — справжні input'и для заповнення форми
- [ ] Валідація через `react-hook-form` + `zod` (обидва вже в `package.json`)
- [ ] `buildValidationSchema()` генерує схему з полів форми
- [ ] Submit зберігає відповідь в `responsesStore`
- [ ] **ResponsesPage** читає з `responsesStore` замість mock-даних
- [ ] Кнопка **Publish** змінює `status: 'draft' → 'published'`

---

## 🔜 Фаза 6 — Бекенд (опційно)
> Мета: дані живуть на сервері, а не в localStorage

- [ ] Вибір стеку (Supabase / Firebase / власний API)
- [ ] Авторизація (email + password або OAuth)
- [ ] CRUD форм через API замість Zustand persist
- [ ] Real-time відповіді (websocket або polling)

---

## Технічний борг
- [ ] Inline редагування назви форми у `FormHeader` на канвасі
- [ ] `StatusBadge` у `DashboardPage/FormCard` — виділити в `ui/`
- [ ] Workspace dropdown у Sidebar
- [ ] `ErrorBoundary` для сторінок
- [ ] Базові тести (Vitest) для store-екшенів
