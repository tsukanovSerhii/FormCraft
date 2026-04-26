import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/api/auth'
import { notificationsApi } from '@/api/notifications'
import { AppLayout } from '@/components/layouts'
import { useAuthStore } from '@/store/authStore'

type Tab = 'profile' | 'security' | 'notifications'

function Avatar({ name, avatarUrl }: { name: string; avatarUrl?: string | null }) {
  const initials = name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
  if (avatarUrl) return <img src={avatarUrl} alt={name} className="h-12 w-12 rounded-full object-cover" />
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-[15px] font-bold text-white">
      {initials}
    </div>
  )
}

const inputCls = 'h-9 w-full rounded-lg border border-border bg-surface px-3 text-[13px] text-text-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20'
const labelCls = 'block mb-1.5 text-[12px] font-medium text-text-secondary'

function ProfileTab() {
  const { user, setAuth } = useAuthStore()
  const [name, setName] = useState(user?.name ?? '')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || name.trim() === user?.name) return
    setSaving(true); setMsg(''); setError('')
    try {
      const updated = await authApi.updateProfile(name.trim())
      setAuth(updated, useAuthStore.getState().accessToken!)
      setMsg('Saved.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-md">
      <div className="mb-7 flex items-center gap-4">
        <Avatar name={user?.name ?? ''} avatarUrl={user?.avatarUrl} />
        <div>
          <p className="text-[14px] font-semibold text-text-primary">{user?.name}</p>
          <p className="text-[12px] text-text-muted">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className={labelCls}>Display name</label>
          <input value={name} onChange={e => setName(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Email</label>
          <input value={user?.email ?? ''} disabled className={`${inputCls} bg-surface-secondary text-text-muted`} />
          <p className="mt-1 text-[11px] text-text-muted">Email cannot be changed.</p>
        </div>

        {msg && <p className="text-[13px] text-success">{msg}</p>}
        {error && <p className="text-[13px] text-danger">{error}</p>}

        <button
          type="submit"
          disabled={saving || !name.trim() || name.trim() === user?.name}
          className="rounded-lg bg-brand px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-brand-dark disabled:opacity-40"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}

function SecurityTab() {
  const { clearAuth } = useAuthStore()
  const navigate = useNavigate()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault()
    if (next !== confirm) { setError('Passwords do not match.'); return }
    if (next.length < 8) { setError('Minimum 8 characters.'); return }
    setSaving(true); setMsg(''); setError('')
    try {
      await authApi.changePassword(current, next)
      setMsg('Password updated.')
      setCurrent(''); setNext(''); setConfirm('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await authApi.deleteAccount()
      clearAuth()
      navigate('/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-md space-y-10">
      <div>
        <p className="mb-5 text-[13px] font-semibold text-text-primary">Change password</p>
        <form onSubmit={handlePassword} className="space-y-4">
          {[
            { label: 'Current password', val: current, set: setCurrent },
            { label: 'New password', val: next, set: setNext },
            { label: 'Confirm new password', val: confirm, set: setConfirm },
          ].map(({ label, val, set }) => (
            <div key={label}>
              <label className={labelCls}>{label}</label>
              <input type="password" value={val} onChange={e => set(e.target.value)} className={inputCls} />
            </div>
          ))}
          {msg && <p className="text-[13px] text-success">{msg}</p>}
          {error && <p className="text-[13px] text-danger">{error}</p>}
          <button
            type="submit"
            disabled={saving || !current || !next || !confirm}
            className="rounded-lg bg-brand px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-brand-dark disabled:opacity-40"
          >
            {saving ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-danger/20 bg-danger-light p-5">
        <p className="mb-1 text-[13px] font-semibold text-danger">Delete account</p>
        <p className="mb-4 text-[12px] text-text-muted">
          Permanently deletes your account, all forms, and responses. Cannot be undone.
        </p>
        {!deleteConfirm ? (
          <button
            onClick={() => setDeleteConfirm(true)}
            className="rounded-lg border border-danger/30 px-4 py-2 text-[13px] font-semibold text-danger transition hover:bg-danger/10"
          >
            Delete my account
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-lg bg-danger px-4 py-2 text-[13px] font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
            >
              {deleting ? 'Deleting…' : 'Yes, delete permanently'}
            </button>
            <button onClick={() => setDeleteConfirm(false)} className="text-[13px] text-text-muted hover:text-text-primary">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function NotificationsTab() {
  const [notifyOnResponse, setNotifyOnResponse] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    notificationsApi.getPreferences().then(p => {
      setNotifyOnResponse(p.notifyOnResponse)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  async function handleToggle() {
    const next = !notifyOnResponse
    setNotifyOnResponse(next)
    setSaving(true)
    setMsg('')
    try {
      await notificationsApi.updatePreferences({ notifyOnResponse: next })
      setMsg('Saved.')
    } catch {
      setNotifyOnResponse(!next)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />

  return (
    <div className="max-w-md space-y-6">
      <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-4">
        <div>
          <p className="text-[13px] font-medium text-text-primary">Email on new response</p>
          <p className="mt-0.5 text-[12px] text-text-muted">Receive an email each time someone submits your form.</p>
        </div>
        <button
          onClick={handleToggle}
          disabled={saving}
          className={[
            'relative h-6 w-11 rounded-full transition-colors',
            notifyOnResponse ? 'bg-brand' : 'bg-surface-tertiary',
          ].join(' ')}
        >
          <span className={[
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
            notifyOnResponse ? 'translate-x-5' : 'translate-x-0.5',
          ].join(' ')} />
        </button>
      </div>
      {msg && <p className="text-[13px] text-success">{msg}</p>}
    </div>
  )
}

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('profile')

  return (
    <AppLayout>
      <div className="flex flex-1 flex-col overflow-auto">
        <div className="border-b border-border px-8 pt-7">
          <h1 className="mb-4 text-[17px] font-semibold text-text-primary">Settings</h1>
          <div className="flex gap-0.5">
            {(['profile', 'security', 'notifications'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={[
                  'relative px-4 py-2 text-[13px] font-medium capitalize transition-colors',
                  tab === t
                    ? 'text-brand after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full after:bg-brand'
                    : 'text-text-secondary hover:text-text-primary',
                ].join(' ')}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto px-8 py-7">
          {tab === 'profile' && <ProfileTab />}
          {tab === 'security' && <SecurityTab />}
          {tab === 'notifications' && <NotificationsTab />}
        </div>
      </div>
    </AppLayout>
  )
}
