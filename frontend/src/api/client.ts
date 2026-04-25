import { useAuthStore } from '@/store/authStore'

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

async function refreshAccessToken(): Promise<string | null> {
  const res = await fetch(`${BASE}/api/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  })
  if (!res.ok) return null
  const { accessToken } = await res.json()
  return accessToken
}

export async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const { accessToken, setAuth, clearAuth, user } = useAuthStore.getState()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`

  let res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  })

  // Token expired — try refresh once
  if (res.status === 401 && accessToken) {
    const newToken = await refreshAccessToken()
    if (newToken && user) {
      setAuth(user, newToken)
      headers['Authorization'] = `Bearer ${newToken}`
      res = await fetch(`${BASE}${path}`, {
        ...options,
        headers,
        credentials: 'include',
      })
    } else {
      clearAuth()
      window.location.href = '/login'
      throw new Error('Session expired')
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Request failed: ${res.status}`)
  }

  return res.json() as Promise<T>
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
