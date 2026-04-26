import { useState } from 'react'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'

function Avatar({ name, avatarUrl, size = 'lg' }: { name: string; avatarUrl?: string | null; size?: 'sm' | 'lg' }) {
  const initials = name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
  const cls = size === 'lg' ? 'h-16 w-16 text-xl' : 'h-9 w-9 text-sm'
  if (avatarUrl) return <img src={avatarUrl} alt={name} className={`${cls} rounded-full object-cover`} />
  return (
    <div className={`${cls} flex shrink-0 items-center justify-center rounded-full bg-brand font-bold text-white`}>
      {initials}
    </div>
  )
}

export function ProfileTab() {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
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
