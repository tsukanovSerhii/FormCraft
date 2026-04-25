import type { ApiResponse } from '@/types/api'
import { api } from './client'

export interface FormResponse {
  id: string
  formId: string
  data: Record<string, unknown>
  submittedAt: number
}

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

function toResponse(r: ApiResponse): FormResponse {
  return {
    id: r.id,
    formId: r.formId,
    data: r.data,
    submittedAt: new Date(r.submittedAt).getTime(),
  }
}

export const responsesApi = {
  submit: (formId: string, data: Record<string, unknown>) =>
    fetch(`${BASE}/api/responses/${formId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    }).then(r => r.json()),

  getAll: (formId: string) =>
    api.get<ApiResponse[]>(`/api/responses/${formId}`).then(list => list.map(toResponse)),
}
