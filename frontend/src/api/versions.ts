import { useAuthStore } from '@/store/authStore'

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export interface FormVersion {
  id: string
  version: number
  title: string
  createdAt: string
}

function authHeaders() {
  const token = useAuthStore.getState().accessToken
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

export const versionsApi = {
  async getAll(formId: string): Promise<FormVersion[]> {
    const res = await fetch(`${BASE}/api/forms/${formId}/versions`, { headers: authHeaders() })
    if (!res.ok) throw new Error('Failed to fetch versions')
    return res.json()
  },

  async restore(formId: string, versionId: string) {
    const res = await fetch(`${BASE}/api/forms/${formId}/versions/${versionId}/restore`, {
      method: 'POST',
      headers: { ...authHeaders(), Origin: window.location.origin },
    })
    if (!res.ok) throw new Error('Failed to restore version')
    return res.json()
  },
}
