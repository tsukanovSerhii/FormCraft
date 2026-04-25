import { useNavigate } from 'react-router-dom'
import type { Template } from '@/data/templates'
import { uid } from '@/lib/uid'
import { useFormBuilderStore } from '@/store/formBuilderStore'

export function useTemplate() {
  const navigate = useNavigate()
  const { forms } = useFormBuilderStore()

  async function applyTemplate(template: Template) {
    const store = useFormBuilderStore.getState()
    const id = uid()
    const now = Date.now()

    const newFields = template.fields.map(f => ({ ...f, id: uid() }))

    store.forms = [
      {
        id,
        title: template.title,
        description: template.description,
        fields: newFields,
        status: 'draft',
        responses: 0,
        createdAt: now,
        updatedAt: now,
      },
      ...store.forms,
    ]

    try {
      const { formsApi } = await import('@/api/forms')
      const created = await formsApi.create({
        title: template.title,
        description: template.description,
        fields: newFields,
      })
      useFormBuilderStore.setState(s => ({
        forms: s.forms.map(f => f.id === id ? { ...created, responses: 0 } : f),
        activeFormId: created.id,
      }))
      navigate(`/builder/${created.id}`)
    } catch {
      useFormBuilderStore.setState(s => ({
        forms: s.forms.some(f => f.id === id) ? s.forms : [{ id, title: template.title, description: template.description, fields: newFields, status: 'draft', responses: 0, createdAt: now, updatedAt: now }, ...s.forms],
        activeFormId: id,
      }))
      navigate(`/builder/${id}`)
    }
  }

  return { applyTemplate, forms }
}
