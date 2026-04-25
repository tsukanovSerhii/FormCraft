import type { ApiResponse } from '@/types/api'
import { api } from './client'

export interface FormResponse {
  id: string
  formId: string
  data: Record<string, unknown>
  submittedAt: number
}

export interface PaginatedResponses {
  responses: ApiResponse[]
  total: number
  page: number
  limit: number
  pages: number
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

  getAll: (formId: string, page = 1, limit = 20) =>
    api.get<PaginatedResponses>(`/api/responses/${formId}?page=${page}&limit=${limit}`)
      .then(res => ({
        ...res,
        responses: res.responses.map(toResponse),
      })),

  exportCSV: async (formId: string, formTitle: string, token: string) => {
    const res = await fetch(`${BASE}/api/responses/${formId}/export/csv`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
    })
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${formTitle.replace(/[^a-z0-9]/gi, '_')}_responses.csv`
    a.click()
    URL.revokeObjectURL(url)
  },
}
