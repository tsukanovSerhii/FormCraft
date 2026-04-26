import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'

export function SecurityTab() {
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

  const isOAuth = !user?.email

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault()
    if (next !== confirm) { setError('Passwords do not match.'); return }
    if (next.length < 8) { setError('New password must be at least 8 characters.'); return }
    setSaving(true); setMsg(''); setError('')
    try {
      await authApi.changePassword(current, next)
      setMsg('Password changed successfully.')
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
    <div className="max-w-lg space-y-10">
      <div>
        <h2 className="mb-1 text-base font-semibold text-text-primary">Change password</h2>
        <p className="mb-6 text-sm text-text-muted">
          {isOAuth
            ? 'Your account uses OAuth login — set a password to also enable email login.'
            : 'Update your password. You will need your current password.'}
        </p>
        <form onSubmit={handlePassword} className="flex flex-col gap-4">
          {(['Current password', 'New password', 'Confirm new password'] as const).map((label, i) => {
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
