import { api } from './client'

export interface AppNotification {
  id: string
  type: string
  title: string
  body: string
  read: boolean
  meta: { formId?: string; formTitle?: string; responseId?: string } | null
  createdAt: string
}

export interface NotificationPreferences {
  notifyOnResponse: boolean
}

export const notificationsApi = {
  list: () => api.get<AppNotification[]>('/api/notifications'),
  markRead: (id: string) => api.patch<AppNotification>(`/api/notifications/${id}/read`, {}),
  markAllRead: () => api.patch<{ ok: boolean }>('/api/notifications/read-all', {}),
  getPreferences: () => api.get<NotificationPreferences>('/api/notifications/preferences'),
  updatePreferences: (prefs: Partial<NotificationPreferences>) =>
    api.patch<NotificationPreferences>('/api/notifications/preferences', prefs),
}
