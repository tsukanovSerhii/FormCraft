import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { formsApi } from '@/api/forms'
import { uid } from '@/lib/uid'
import type { FieldType, Form, FormField } from '@/types/form'

function defaultLabel(type: FieldType): string {
  const labels: Record<FieldType, string> = {
    text: 'Short Text',
    textarea: 'Long Text',
    number: 'Number',
    email: 'Email Address',
    phone: 'Phone Number',
    select: 'Dropdown',
    checkbox: 'Checkboxes',
    radio: 'Multiple Choice',
    date: 'Date',
    file: 'File Upload',
    rating: 'Rating',
  }
  return labels[type]
}

function defaultOptions(type: FieldType) {
  if (type === 'radio' || type === 'checkbox' || type === 'select') {
    return [
      { id: uid(), label: 'Option 1' },
      { id: uid(), label: 'Option 2' },
      { id: uid(), label: 'Option 3' },
    ]
  }
  return undefined
}

interface FormBuilderState {
  forms: Form[]
  activeFormId: string | null
  selectedFieldId: string | null

  // Remote sync
  fetchForms: () => Promise<void>

  // Form actions
  createForm: () => Promise<string>
  deleteForm: (id: string) => Promise<void>
  duplicateForm: (id: string) => Promise<string>
  updateFormTitle: (id: string, title: string) => void
  updateFormDescription: (id: string, description: string) => void
  updateFormSettings: (id: string, settings: { expiresAt?: string | null; maxResponses?: number | null }) => void
  publishForm: (id: string) => void
  syncForm: (id: string) => Promise<void>

  // Field actions
  addField: (type: FieldType) => void
  removeField: (id: string) => void
  duplicateField: (id: string) => void
  updateField: (id: string, patch: Partial<FormField>) => void
  reorderFields: (from: number, to: number) => void

  // Selection
  selectField: (id: string | null) => void
  setActiveForm: (id: string) => void
}

export const useFormBuilderStore = create<FormBuilderState>()(
  persist(
    (set, get) => ({
      forms: [],
      activeFormId: null,
      selectedFieldId: null,

      async fetchForms() {
        try {
          const forms = await formsApi.getAll()
          set({ forms })
        } catch {
          // offline fallback — keep local data
        }
      },

      async createForm() {
        const id = uid()
        const now = Date.now()
        const form: Form = {
          id,
          title: 'Untitled Form',
          fields: [],
          status: 'draft',
          responses: 0,
          createdAt: now,
          updatedAt: now,
        }
        set(s => ({ forms: [form, ...s.forms], activeFormId: id, selectedFieldId: null }))

        try {
          const created = await formsApi.create({ title: form.title })
          set(s => ({
            forms: s.forms.map(f => f.id === id ? { ...created, responses: 0 } : f),
            activeFormId: created.id,
          }))
          return created.id
        } catch {
          return id
        }
      },

      async deleteForm(id) {
        set(s => ({
          forms: s.forms.filter(f => f.id !== id),
          activeFormId: s.activeFormId === id ? null : s.activeFormId,
        }))
        try { await formsApi.delete(id) } catch { /* keep local delete */ }
      },

      async duplicateForm(id) {
        const original = get().forms.find(f => f.id === id)
        if (!original) return id
        const newId = uid()
        const now = Date.now()
        const copy: Form = {
          ...original,
          id: newId,
          title: `${original.title} (Copy)`,
          status: 'draft',
          responses: 0,
          createdAt: now,
          updatedAt: now,
          fields: original.fields.map(f => ({ ...f, id: uid() })),
        }
        set(s => ({ forms: [copy, ...s.forms] }))

        try {
          const created = await formsApi.create({
            title: copy.title,
            description: copy.description,
            fields: copy.fields,
          })
          set(s => ({
            forms: s.forms.map(f => f.id === newId ? { ...created, responses: 0 } : f),
          }))
          return created.id
        } catch {
          return newId
        }
      },

      updateFormTitle(id, title) {
        set(s => ({
          forms: s.forms.map(f =>
            f.id === id ? { ...f, title, updatedAt: Date.now() } : f
          ),
        }))
      },

      updateFormDescription(id, description) {
        set(s => ({
          forms: s.forms.map(f =>
            f.id === id ? { ...f, description, updatedAt: Date.now() } : f
          ),
        }))
      },

      updateFormSettings(id, settings) {
        set(s => ({
          forms: s.forms.map(f =>
            f.id === id ? { ...f, ...settings, updatedAt: Date.now() } : f
          ),
        }))
        const form = get().forms.find(f => f.id === id)
        if (form) formsApi.update(id, settings as never).catch(() => {})
      },

      publishForm(id) {
        set(s => ({
          forms: s.forms.map(f =>
            f.id === id ? { ...f, status: 'published', updatedAt: Date.now() } : f
          ),
        }))
        const form = get().forms.find(f => f.id === id)
        if (form) formsApi.update(id, { status: 'published' }).catch(() => {})
      },

      async syncForm(id) {
        const form = get().forms.find(f => f.id === id)
        if (!form) return
        try {
          await formsApi.update(id, {
            title: form.title,
            description: form.description,
            fields: form.fields,
            status: form.status,
          })
        } catch { /* offline — local state is source of truth */ }
      },

      addField(type) {
        const { activeFormId } = get()
        if (!activeFormId) return
        const field: FormField = {
          id: uid(),
          type,
          label: defaultLabel(type),
          required: false,
          options: defaultOptions(type),
          ...(type === 'rating' ? { ratingMax: 5 } : {}),
        }
        set(s => ({
          forms: s.forms.map(f =>
            f.id === activeFormId
              ? { ...f, fields: [...f.fields, field], updatedAt: Date.now() }
              : f
          ),
          selectedFieldId: field.id,
        }))
      },

      removeField(id) {
        const { activeFormId } = get()
        if (!activeFormId) return
        set(s => ({
          forms: s.forms.map(f =>
            f.id === activeFormId
              ? { ...f, fields: f.fields.filter(field => field.id !== id), updatedAt: Date.now() }
              : f
          ),
          selectedFieldId: s.selectedFieldId === id ? null : s.selectedFieldId,
        }))
      },

      duplicateField(id) {
        const { activeFormId } = get()
        if (!activeFormId) return
        set(s => ({
          forms: s.forms.map(f => {
            if (f.id !== activeFormId) return f
            const idx = f.fields.findIndex(field => field.id === id)
            if (idx === -1) return f
            const copy = { ...f.fields[idx], id: uid() }
            const fields = [...f.fields]
            fields.splice(idx + 1, 0, copy)
            return { ...f, fields, updatedAt: Date.now() }
          }),
        }))
      },

      updateField(id, patch) {
        const { activeFormId } = get()
        if (!activeFormId) return
        set(s => ({
          forms: s.forms.map(f =>
            f.id === activeFormId
              ? {
                  ...f,
                  fields: f.fields.map(field => field.id === id ? { ...field, ...patch } : field),
                  updatedAt: Date.now(),
                }
              : f
          ),
        }))
      },

      reorderFields(from, to) {
        const { activeFormId } = get()
        if (!activeFormId) return
        set(s => ({
          forms: s.forms.map(f => {
            if (f.id !== activeFormId) return f
            const fields = [...f.fields]
            const [moved] = fields.splice(from, 1)
            fields.splice(to, 0, moved)
            return { ...f, fields, updatedAt: Date.now() }
          }),
        }))
      },

      selectField(id) {
        set({ selectedFieldId: id })
      },

      setActiveForm(id) {
        set({ activeFormId: id, selectedFieldId: null })
      },
    }),
    { name: 'formcraft-store' }
  )
)

export const useActiveForm = () =>
  useFormBuilderStore(s => s.forms.find(f => f.id === s.activeFormId) ?? null)

export const useSelectedField = () =>
  useFormBuilderStore(s => {
    const form = s.forms.find(f => f.id === s.activeFormId)
    return form?.fields.find(f => f.id === s.selectedFieldId) ?? null
  })
