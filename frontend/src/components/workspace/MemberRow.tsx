import { Crown, Edit2, Loader2, LogOut, Shield, UserMinus } from 'lucide-react'
import { useState } from 'react'
import type { WorkspaceMember } from '@/api/workspaces'

const ROLE_ICON: Record<string, React.ReactNode> = {
  owner:  <Crown size={12} className="text-brand" />,
  editor: <Edit2 size={12} className="text-text-muted" />,
  viewer: <Shield size={12} className="text-text-muted" />,
}

interface Props {
  member: WorkspaceMember
  isOwner: boolean
  isSelf: boolean
  onRoleChange: (userId: string, role: 'editor' | 'viewer') => Promise<void>
  onRemove: (userId: string) => Promise<void>
}

export function MemberRow({ member, isOwner, isSelf, onRoleChange, onRemove }: Props) {
  const [busy, setBusy] = useState(false)
  const initials = member.user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  async function handleRole(role: 'editor' | 'viewer') {
    setBusy(true)
    try { await onRoleChange(member.user.id, role) } finally { setBusy(false) }
  }

  async function handleRemove() {
    setBusy(true)
    try { await onRemove(member.user.id) } finally { setBusy(false) }
  }

  return (
    <div className="flex items-center gap-3 py-3.5 border-b border-border last:border-0">
      {member.user.avatarUrl
        ? <img src={member.user.avatarUrl} alt={member.user.name} className="h-9 w-9 rounded-full object-cover shrink-0" />
        : <div className="h-9 w-9 rounded-full bg-brand flex items-center justify-center text-[12px] font-bold text-white shrink-0">{initials}</div>
      }
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-[13px] font-semibold text-text-primary truncate">{member.user.name}</p>
          {isSelf && <span className="text-[10px] text-text-muted">(you)</span>}
        </div>
        <p className="text-[12px] text-text-muted truncate">{member.user.email}</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1 text-[11px] font-medium text-text-secondary capitalize">
          {ROLE_ICON[member.role]} {member.role}
        </div>

        {isOwner && member.role !== 'owner' && (
          <>
            <select
              disabled={busy}
              value={member.role}
              onChange={e => handleRole(e.target.value as 'editor' | 'viewer')}
              className="rounded-md border border-border bg-surface text-[12px] px-2 py-1 text-text-primary outline-none focus:border-brand disabled:opacity-50"
            >
              <option value="editor">editor</option>
              <option value="viewer">viewer</option>
            </select>
            <button
              disabled={busy}
              onClick={handleRemove}
              title="Remove member"
              className="rounded-md p-1.5 text-text-muted hover:bg-danger-light hover:text-danger transition-colors disabled:opacity-50"
            >
              {busy ? <Loader2 size={13} className="animate-spin" /> : <UserMinus size={13} />}
            </button>
          </>
        )}

        {isSelf && member.role !== 'owner' && (
          <button
            disabled={busy}
            onClick={handleRemove}
            title="Leave workspace"
            className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[12px] text-text-muted hover:border-danger hover:text-danger transition-colors disabled:opacity-50"
          >
            {busy ? <Loader2 size={12} className="animate-spin" /> : <LogOut size={12} />}
            Leave
          </button>
        )}
      </div>
    </div>
  )
}
