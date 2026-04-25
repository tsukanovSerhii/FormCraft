import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useFormBuilderStore } from '@/store/formBuilderStore'

// Prevent Zustand persist from touching localStorage in tests
vi.mock('@/api/forms', () => ({
  formsApi: {
    getAll: vi.fn().mockResolvedValue([]),
    create: vi.fn().mockRejectedValue(new Error('offline')),
    update: vi.fn().mockRejectedValue(new Error('offline')),
    delete: vi.fn().mockRejectedValue(new Error('offline')),
  },
}))

function resetStore() {
  useFormBuilderStore.setState({
    forms: [],
    activeFormId: null,
    selectedFieldId: null,
  })
}

describe('formBuilderStore', () => {
  beforeEach(() => {
    resetStore()
  })

  // ── Form actions ──────────────────────────────────────────

  describe('createForm', () => {
    it('adds a new form to the list', async () => {
      await useFormBuilderStore.getState().createForm()
      expect(useFormBuilderStore.getState().forms).toHaveLength(1)
    })

    it('sets the new form as active', async () => {
      const id = await useFormBuilderStore.getState().createForm()
      expect(useFormBuilderStore.getState().activeFormId).toBe(id)
    })

    it('creates form with default title and draft status', async () => {
      await useFormBuilderStore.getState().createForm()
      const form = useFormBuilderStore.getState().forms[0]
      expect(form.title).toBe('Untitled Form')
      expect(form.status).toBe('draft')
    })
  })

  describe('deleteForm', () => {
    it('removes the form from the list', async () => {
      const id = await useFormBuilderStore.getState().createForm()
      await useFormBuilderStore.getState().deleteForm(id)
      expect(useFormBuilderStore.getState().forms).toHaveLength(0)
    })

    it('clears activeFormId when deleting the active form', async () => {
      const id = await useFormBuilderStore.getState().createForm()
      await useFormBuilderStore.getState().deleteForm(id)
      expect(useFormBuilderStore.getState().activeFormId).toBeNull()
    })

    it('preserves activeFormId when deleting a different form', async () => {
      const id1 = await useFormBuilderStore.getState().createForm()
      const id2 = await useFormBuilderStore.getState().createForm()
      useFormBuilderStore.getState().setActiveForm(id1)
      await useFormBuilderStore.getState().deleteForm(id2)
      expect(useFormBuilderStore.getState().activeFormId).toBe(id1)
    })
  })

  describe('updateFormTitle', () => {
    it('updates the title of the correct form', async () => {
      const id = await useFormBuilderStore.getState().createForm()
      useFormBuilderStore.getState().updateFormTitle(id, 'My Survey')
      const form = useFormBuilderStore.getState().forms.find(f => f.id === id)
      expect(form?.title).toBe('My Survey')
    })
  })

  describe('duplicateForm', () => {
    it('adds a copy of the form with "(Copy)" suffix', async () => {
      const id = await useFormBuilderStore.getState().createForm()
      useFormBuilderStore.getState().updateFormTitle(id, 'Original')
      await useFormBuilderStore.getState().duplicateForm(id)
      const titles = useFormBuilderStore.getState().forms.map(f => f.title)
      expect(titles).toContain('Original (Copy)')
    })

    it('duplicate starts as draft with 0 responses', async () => {
      const id = await useFormBuilderStore.getState().createForm()
      useFormBuilderStore.getState().publishForm(id)
      await useFormBuilderStore.getState().duplicateForm(id)
      const copy = useFormBuilderStore.getState().forms.find(f => f.title.includes('Copy'))
      expect(copy?.status).toBe('draft')
      expect(copy?.responses).toBe(0)
    })
  })

  describe('publishForm', () => {
    it('changes status to published', async () => {
      const id = await useFormBuilderStore.getState().createForm()
      useFormBuilderStore.getState().publishForm(id)
      const form = useFormBuilderStore.getState().forms.find(f => f.id === id)
      expect(form?.status).toBe('published')
    })
  })

  // ── Field actions ─────────────────────────────────────────

  describe('addField', () => {
    it('appends a field to the active form', async () => {
      const id = await useFormBuilderStore.getState().createForm()
      useFormBuilderStore.getState().setActiveForm(id)
      useFormBuilderStore.getState().addField('text')
      const form = useFormBuilderStore.getState().forms.find(f => f.id === id)
      expect(form?.fields).toHaveLength(1)
    })

    it('selects the newly added field', async () => {
      const id = await useFormBuilderStore.getState().createForm()
      useFormBuilderStore.getState().setActiveForm(id)
      useFormBuilderStore.getState().addField('email')
      const form = useFormBuilderStore.getState().forms.find(f => f.id === id)!
      expect(useFormBuilderStore.getState().selectedFieldId).toBe(form.fields[0].id)
    })

    it('does nothing when no active form', () => {
      useFormBuilderStore.setState({ activeFormId: null })
      useFormBuilderStore.getState().addField('text')
      expect(useFormBuilderStore.getState().forms).toHaveLength(0)
    })

    it('adds default options for radio fields', async () => {
      const id = await useFormBuilderStore.getState().createForm()
      useFormBuilderStore.getState().setActiveForm(id)
      useFormBuilderStore.getState().addField('radio')
      const form = useFormBuilderStore.getState().forms.find(f => f.id === id)!
      expect(form.fields[0].options?.length).toBeGreaterThan(0)
    })
  })

  describe('removeField', () => {
    it('removes the field from the active form', async () => {
      const id = await useFormBuilderStore.getState().createForm()
      useFormBuilderStore.getState().setActiveForm(id)
      useFormBuilderStore.getState().addField('text')
      const fieldId = useFormBuilderStore.getState().forms.find(f => f.id === id)!.fields[0].id
      useFormBuilderStore.getState().removeField(fieldId)
      expect(useFormBuilderStore.getState().forms.find(f => f.id === id)!.fields).toHaveLength(0)
    })

    it('clears selectedFieldId when removing the selected field', async () => {
      const id = await useFormBuilderStore.getState().createForm()
      useFormBuilderStore.getState().setActiveForm(id)
      useFormBuilderStore.getState().addField('text')
      const fieldId = useFormBuilderStore.getState().selectedFieldId!
      useFormBuilderStore.getState().removeField(fieldId)
      expect(useFormBuilderStore.getState().selectedFieldId).toBeNull()
    })
  })

  describe('updateField', () => {
    it('applies partial patch to the correct field', async () => {
      const id = await useFormBuilderStore.getState().createForm()
      useFormBuilderStore.getState().setActiveForm(id)
      useFormBuilderStore.getState().addField('text')
      const fieldId = useFormBuilderStore.getState().forms.find(f => f.id === id)!.fields[0].id
      useFormBuilderStore.getState().updateField(fieldId, { label: 'Full Name', required: true })
      const field = useFormBuilderStore.getState().forms.find(f => f.id === id)!.fields[0]
      expect(field.label).toBe('Full Name')
      expect(field.required).toBe(true)
    })
  })

  describe('reorderFields', () => {
    it('moves a field from one index to another', async () => {
      const id = await useFormBuilderStore.getState().createForm()
      useFormBuilderStore.getState().setActiveForm(id)
      useFormBuilderStore.getState().addField('text')
      useFormBuilderStore.getState().addField('email')
      useFormBuilderStore.getState().addField('number')
      useFormBuilderStore.getState().reorderFields(0, 2)
      const fields = useFormBuilderStore.getState().forms.find(f => f.id === id)!.fields
      expect(fields[0].type).toBe('email')
      expect(fields[1].type).toBe('number')
      expect(fields[2].type).toBe('text')
    })
  })

  describe('duplicateField', () => {
    it('inserts a copy of the field right after the original', async () => {
      const id = await useFormBuilderStore.getState().createForm()
      useFormBuilderStore.getState().setActiveForm(id)
      useFormBuilderStore.getState().addField('text')
      useFormBuilderStore.getState().addField('email')
      const textFieldId = useFormBuilderStore.getState().forms.find(f => f.id === id)!.fields[0].id
      useFormBuilderStore.getState().duplicateField(textFieldId)
      const fields = useFormBuilderStore.getState().forms.find(f => f.id === id)!.fields
      expect(fields).toHaveLength(3)
      expect(fields[1].type).toBe('text')
      expect(fields[1].id).not.toBe(textFieldId)
    })
  })
})
