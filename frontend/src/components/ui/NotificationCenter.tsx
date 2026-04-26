import { Bell, CheckCheck, ExternalLink } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { AppNotification } from '@/api/notifications'
import { useNotificationsStore } from '@/store/notificationsStore'
import { useSSE } from '@/hooks/useSSE'

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function NotifItem({ n, onRead }: { n: AppNotification; onRead: (id: string) => void }) {
  const navigate = useNavigate()

  function handleClick() {
    if (!n.read) onRead(n.id)
    if (n.meta?.formId) navigate('/responses')
  }

  return (
    <button
      onClick={handleClick}
      className={[
        'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-secondary',
        !n.read ? 'bg-brand-muted/30' : '',
      ].join(' ')}
    >
      <div className={[
        'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
        !n.read ? 'bg-brand/15 text-brand' : 'bg-surface-secondary text-text-muted',
      ].join(' ')}>
        <Bell size={13} />
      </div>
      <div className="min-w-0 flex-1">
        <p className={['truncate text-[13px]', !n.read ? 'font-semibold text-text-primary' : 'font-medium text-text-secondary'].join(' ')}>
          {n.title}
        </p>
        <p className="mt-0.5 truncate text-[12px] text-text-muted">{n.body}</p>
        <p className="mt-0.5 text-[11px] text-text-muted">{timeAgo(n.createdAt)}</p>
      </div>
      {n.meta?.formId && (
        <ExternalLink size={12} className="mt-1 shrink-0 text-text-muted" />
      )}
    </button>
  )
}

export function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { notifications, fetch, push, markRead, markAllRead, unreadCount } = useNotificationsStore()
  const count = unreadCount()

  useEffect(() => { fetch() }, [fetch])

  useSSE((data) => {
    const payload = data as { type: string; notification: AppNotification }
    if (payload.type === 'notification') push(payload.notification)
  })

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="relative flex h-8 w-8 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-secondary hover:text-text-primary"
      >
        <Bell size={16} />
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[9px] font-bold text-white">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-surface shadow-panel">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-[13px] font-semibold text-text-primary">Notifications</p>
            {count > 0 && (
              <button
                onClick={() => markAllRead()}
                className="flex items-center gap-1 text-[11px] font-medium text-text-muted transition-colors hover:text-text-primary"
              >
                <CheckCheck size={12} /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-border">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Bell size={20} className="mb-2 text-text-muted" />
                <p className="text-[13px] text-text-muted">No notifications yet</p>
              </div>
            ) : notifications.map(n => (
              <NotifItem key={n.id} n={n} onRead={markRead} />
            ))}
          </div>

          {notifications.length > 0 && (
            <div className="border-t border-border px-4 py-2.5 text-center">
              <p className="text-[11px] text-text-muted">
                {count > 0 ? `${count} unread` : 'All caught up'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
