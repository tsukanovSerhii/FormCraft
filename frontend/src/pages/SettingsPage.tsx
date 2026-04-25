import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/api/auth'
import { AppLayout } from '@/components/layouts'
import { useAuthStore } from '@/store/authStore'

type Tab = 'profile' | 'security'

function Avatar({ name, avatarUrl, size = 'lg' }: { name: string; avatarUrl?: string | null; size?: 'sm' | 'lg' }) {
  const initials = name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
  const cls = size === 'lg'
    ? 'h-16 w-16 text-xl'
    : 'h-9 w-9 text-sm'
  if (avatarUrl) return <img src={avatarUrl} alt={name} className={`${cls} rounded-full object-cover`} />
  return (
    <div className={`${cls} flex shrink-0 items-center justify-center rounded-full bg-brand font-bold text-white`}>
      {initials}
    </div>
  )
}

function ProfileTab() {
  const { user, setAuth } = useAuthStore()
  const [name, setName] = useState(user?.name ?? '')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || name.trim() === user?.name) return
    setSaving(true)
    setMsg('')
    setError('')
    try {
      const updated = await authApi.updateProfile(name.trim())
      const token = useAuthStore.getState().accessToken!
      setAuth(updated, token)
      setMsg('Profile updated.')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-lg">
      <h2 className="mb-1 text-base font-semibold text-text-primary">Profile</h2>
      <p className="mb-6 text-sm text-text-muted">Manage your name and account identity.</p>

      <div className="mb-6 flex items-center gap-4">
        <Avatar name={user?.name ?? ''} avatarUrl={user?.avatarUrl} size="lg" />
        <div>
          <p className="text-sm font-medium text-text-primary">{user?.name}</p>
          <p className="text-xs text-text-muted">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-secondary">Display name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="h-9 rounded-lg border border-border bg-surface px-3 text-sm text-text-primary outline-none ring-offset-0 transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-secondary">Email</label>
          <input
            value={user?.email ?? ''}
            disabled
            className="h-9 rounded-lg border border-border bg-surface-secondary px-3 text-sm text-text-muted outline-none"
          />
          <p className="text-xs text-text-muted">Email cannot be changed.</p>
        </div>

        {msg && <p className="text-sm text-green-600">{msg}</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        <div>
          <button
            type="submit"
            disabled={saving || !name.trim() || name.trim() === user?.name}
            className="h-9 rounded-lg bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-40"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

function SecurityTab() {
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const isOAuth = !user?.email // won't happen, but guard
  // Detect if user likely has no password (OAuth only) — we show a note but still render form
  // The backend will return 400 if no password set

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault()
    if (next !== confirm) { setError('Passwords do not match.'); return }
    if (next.length < 8) { setError('New password must be at least 8 characters.'); return }
    setSaving(true); setMsg(''); setError('')
    try {
      await authApi.changePassword(current, next)
      setMsg('Password changed successfully.')
      setCurrent(''); setNext(''); setConfirm('')
    } catch (err: any) {
      setError(err.message)
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
    } catch (err: any) {
      setError(err.message)
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-lg space-y-10">
      {/* Change password */}
      <div>
        <h2 className="mb-1 text-base font-semibold text-text-primary">Change password</h2>
        <p className="mb-6 text-sm text-text-muted">
          {isOAuth
            ? 'Your account uses OAuth login — set a password to also enable email login.'
            : 'Update your password. You will need your current password.'}
        </p>
        <form onSubmit={handlePassword} className="flex flex-col gap-4">
          {['Current password', 'New password', 'Confirm new password'].map((label, i) => {
            const vals = [current, next, confirm]
            const setters = [setCurrent, setNext, setConfirm]
            return (
              <div key={label} className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-text-secondary">{label}</label>
                <input
                  type="password"
                  value={vals[i]}
                  onChange={e => setters[i](e.target.value)}
                  className="h-9 rounded-lg border border-border bg-surface px-3 text-sm text-text-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>
            )
          })}
          {msg && <p className="text-sm text-green-600">{msg}</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={saving || !current || !next || !confirm}
              className="h-9 rounded-lg bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-40"
            >
              {saving ? 'Updating…' : 'Update password'}
            </button>
          </div>
        </form>
      </div>

      {/* Danger zone */}
      <div className="rounded-xl border border-red-200 bg-red-50/50 p-5">
        <h3 className="mb-1 text-sm font-semibold text-red-700">Delete account</h3>
        <p className="mb-4 text-sm text-red-600">
          This permanently deletes your account, all forms, and responses. This action cannot be undone.
        </p>
        {!deleteConfirm ? (
          <button
            onClick={() => setDeleteConfirm(true)}
            className="h-9 rounded-lg border border-red-300 bg-white px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            Delete my account
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="h-9 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-40"
            >
              {deleting ? 'Deleting…' : 'Yes, delete permanently'}
            </button>
            <button
              onClick={() => setDeleteConfirm(false)}
              className="text-sm text-text-muted hover:text-text-primary"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('profile')

  const tabs: { id: Tab; label: string }[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'security', label: 'Security' },
  ]

  return (
    <AppLayout>
      <div className="flex flex-1 flex-col overflow-auto">
        <div className="border-b border-border px-8 pt-8">
          <h1 className="mb-4 text-xl font-bold text-text-primary">Settings</h1>
          <div className="flex gap-1">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={[
                  'relative px-4 py-2 text-sm font-medium transition-colors',
                  tab === t.id
                    ? 'text-brand after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full after:bg-brand'
                    : 'text-text-secondary hover:text-text-primary',
                ].join(' ')}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto px-8 py-8">
          {tab === 'profile' && <ProfileTab />}
          {tab === 'security' && <SecurityTab />}
        </div>
      </div>
    </AppLayout>
  )
}
