import type { ApiForm } from '@/types/api'
import type { Form, FormField } from '@/types/form'
import { api } from './client'

function toForm(f: ApiForm): Form {
  return {
    id: f.id,
    title: f.title,
    description: f.description ?? undefined,
    status: f.status as Form['status'],
    fields: f.fields ?? [],
    responses: 0,
    createdAt: new Date(f.createdAt).getTime(),
    updatedAt: new Date(f.updatedAt).getTime(),
  }
}

export const formsApi = {
  getAll: () =>
    api.get<ApiForm[]>('/api/forms').then(list => list.map(toForm)),

  getOne: (id: string) =>
    api.get<ApiForm>(`/api/forms/${id}`).then(toForm),

  create: (data: { title: string; description?: string; fields?: FormField[] }) =>
    api.post<ApiForm>('/api/forms', data).then(toForm),

  update: (id: string, data: Partial<{ title: string; description: string; fields: FormField[]; status: string }>) =>
    api.patch<ApiForm>(`/api/forms/${id}`, data).then(toForm),

  delete: (id: string) =>
    api.delete<{ ok: boolean }>(`/api/forms/${id}`),
}
