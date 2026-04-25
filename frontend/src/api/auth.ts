import type { AuthResponse, User } from '@/types/auth'
import { api } from './client'

export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/api/auth/login', { email, password }),

  register: (name: string, email: string, password: string) =>
    api.post<AuthResponse>('/api/auth/register', { name, email, password }),

  logout: () => api.post<{ ok: boolean }>('/api/auth/logout', {}),

  me: () => api.get<User>('/api/auth/me'),
}
