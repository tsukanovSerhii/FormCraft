import { Check, ChevronDown, Plus, Settings } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkspaceStore, useActiveWorkspace } from '@/store/workspaceStore'
import { useAuthStore } from '@/store/authStore'

function WorkspaceAvatar({ name, size = 'sm' }: { name: string; size?: 'sm' | 'md' }) {
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  const cls = size === 'sm'
    ? 'h-5 w-5 rounded text-[10px]'
    : 'h-6 w-6 rounded text-[11px]'
  return (
    <div className={`${cls} flex shrink-0 items-center justify-center bg-brand font-bold text-white`}>
      {initials}
    </div>
  )
}

export function WorkspaceSwitcher() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { workspaces, activeWorkspaceId, setActive, fetch, addWorkspace } = useWorkspaceStore()
  const active = useActiveWorkspace()
  const [open, setOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => { fetch() }, [fetch])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  async function handleCreate() {
    if (!newName.trim()) return
    await addWorkspace(newName.trim())
    setNewName('')
    setCreating(false)
    setOpen(false)
  }

  const displayName = active ? active.name : (user?.name ?? 'Personal')
  const displaySub  = active ? `${active.role}` : 'Personal workspace'

  return (
    <div ref={ref} className="relative mx-3 mb-2">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex w-full items-center gap-2 rounded-md border border-border bg-surface-secondary px-2.5 py-2 text-left transition-colors hover:bg-surface-tertiary"
      >
        {active
          ? <WorkspaceAvatar name={active.name} />
          : <div className="h-5 w-5 rounded flex items-center justify-center bg-brand-muted">
              <span className="text-[9px] font-bold text-brand">P</span>
            </div>
        }
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-semibold text-text-primary">{displayName}</p>
          <p className="truncate text-[10px] text-text-muted capitalize">{displaySub}</p>
        </div>
        <ChevronDown size={13} className={`shrink-0 text-text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-border bg-surface shadow-panel">
          <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Workspaces
          </div>

          {/* Personal */}
          <button
            onClick={() => { setActive(null); setOpen(false) }}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] hover:bg-surface-secondary transition-colors"
          >
            <div className="h-5 w-5 rounded flex items-center justify-center bg-brand-muted shrink-0">
              <span className="text-[9px] font-bold text-brand">P</span>
            </div>
            <span className="flex-1 truncate text-text-primary font-medium">{user?.name ?? 'Personal'}</span>
            {activeWorkspaceId === null && <Check size={13} className="text-brand shrink-0" />}
          </button>

          {/* Workspace list */}
          {workspaces.map(ws => (
            <button
              key={ws.id}
              onClick={() => { setActive(ws.id); setOpen(false) }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] hover:bg-surface-secondary transition-colors"
            >
              <WorkspaceAvatar name={ws.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-text-primary font-medium">{ws.name}</p>
                <p className="text-[10px] text-text-muted capitalize">{ws.role}</p>
              </div>
              {activeWorkspaceId === ws.id && <Check size={13} className="text-brand shrink-0" />}
              {ws.role === 'owner' && (
                <button
                  onClick={e => { e.stopPropagation(); navigate(`/settings/workspace/${ws.id}`); setOpen(false) }}
                  className="ml-1 rounded p-0.5 text-text-muted hover:text-text-primary hover:bg-surface-tertiary transition-colors"
                  title="Workspace settings"
                >
                  <Settings size={12} />
                </button>
              )}
            </button>
          ))}

          <div className="my-1 border-t border-border" />

          {/* Create new */}
          {creating ? (
            <div className="px-3 pb-2 pt-1">
              <input
                autoFocus
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setCreating(false) }}
                placeholder="Workspace name"
                className="w-full rounded-md border border-border bg-surface px-3 py-1.5 text-[12px] text-text-primary outline-none focus:border-brand"
              />
              <div className="mt-1.5 flex gap-1.5">
                <button
                  onClick={handleCreate}
                  className="flex-1 rounded-md bg-brand py-1 text-[11px] font-semibold text-white hover:bg-brand-dark transition-colors"
                >
                  Create
                </button>
                <button
                  onClick={() => setCreating(false)}
                  className="flex-1 rounded-md bg-surface-secondary py-1 text-[11px] font-semibold text-text-secondary hover:bg-surface-tertiary transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setCreating(true)}
              className="flex w-full items-center gap-2 px-3 py-2 text-[13px] text-text-secondary hover:bg-surface-secondary transition-colors"
            >
              <Plus size={13} />
              New workspace
            </button>
          )}
        </div>
      )}
    </div>
  )
}
