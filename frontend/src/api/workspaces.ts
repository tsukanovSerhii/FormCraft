import { api } from './client'

export interface Workspace {
  id: string
  name: string
  slug: string
  role: 'owner' | 'editor' | 'viewer'
  createdAt: number
  updatedAt: number
  _count?: { members: number; forms: number }
}

export interface WorkspaceMember {
  id: string
  role: 'owner' | 'editor' | 'viewer'
  invitedAt: string
  acceptedAt: string | null
  user: { id: string; name: string; email: string; avatarUrl: string | null }
}

export const workspacesApi = {
  list: () => api.get<Workspace[]>('/api/workspaces'),

  create: (name: string) => api.post<Workspace>('/api/workspaces', { name }),

  update: (id: string, name: string) => api.patch<Workspace>(`/api/workspaces/${id}`, { name }),

  delete: (id: string) => api.delete<{ ok: boolean }>(`/api/workspaces/${id}`),

  getMembers: (id: string) => api.get<WorkspaceMember[]>(`/api/workspaces/${id}/members`),

  invite: (id: string, email: string, role: 'editor' | 'viewer' = 'editor') =>
    api.post<WorkspaceMember>(`/api/workspaces/${id}/invite`, { email, role }),

  updateRole: (workspaceId: string, userId: string, role: 'editor' | 'viewer') =>
    api.patch<WorkspaceMember>(`/api/workspaces/${workspaceId}/members/${userId}`, { role }),

  removeMember: (workspaceId: string, userId: string) =>
    api.delete<{ ok: boolean }>(`/api/workspaces/${workspaceId}/members/${userId}`),
}
