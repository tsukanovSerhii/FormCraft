import type { ApiForm } from '@/types/api'

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export const publicApi = {
  getForm: async (id: string): Promise<ApiForm> => {
    const res = await fetch(`${BASE}/api/public/forms/${id}`)
    if (!res.ok) throw new Error('Form not found')
    return res.json()
  },
}
