import { create } from 'zustand'
import { notificationsApi, type AppNotification } from '@/api/notifications'

interface NotificationsState {
  notifications: AppNotification[]
  loading: boolean
  fetch: () => Promise<void>
  push: (n: AppNotification) => void
  markRead: (id: string) => Promise<void>
  markAllRead: () => Promise<void>
  unreadCount: () => number
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  loading: false,

  fetch: async () => {
    set({ loading: true })
    try {
      const notifications = await notificationsApi.list()
      set({ notifications })
    } finally {
      set({ loading: false })
    }
  },

  push: (n) => set(s => ({ notifications: [n, ...s.notifications].slice(0, 30) })),

  markRead: async (id) => {
    await notificationsApi.markRead(id)
    set(s => ({
      notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n),
    }))
  },

  markAllRead: async () => {
    await notificationsApi.markAllRead()
    set(s => ({ notifications: s.notifications.map(n => ({ ...n, read: true })) }))
  },

  unreadCount: () => get().notifications.filter(n => !n.read).length,
}))
