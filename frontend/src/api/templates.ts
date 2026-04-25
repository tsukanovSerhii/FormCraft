import { api } from './client'

export interface UserTemplate {
  id: string
  title: string
  description: string | null
  category: string
  fields: unknown[]
  createdAt: string
  userId: string
}

export const templatesApi = {
  getAll: () => api.get<UserTemplate[]>('/api/templates'),
  create: (data: { title: string; description?: string; category?: string; fields: unknown[] }) =>
    api.post<UserTemplate>('/api/templates', data),
  delete: (id: string) => api.delete<{ ok: boolean }>(`/api/templates/${id}`),
}
