import { Loader2, Mail } from 'lucide-react'
import { useState } from 'react'
import { workspacesApi, type WorkspaceMember } from '@/api/workspaces'
import { useToast } from '@/components/ui/useToast'

interface Props {
  workspaceId: string
  onInvited: (member: WorkspaceMember) => void
}

export function InviteForm({ workspaceId, onInvited }: Props) {
  const toast = useToast()
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor')
  const [inviting, setInviting] = useState(false)

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!inviteEmail.trim()) return
    setInviting(true)
    try {
      const member = await workspacesApi.invite(workspaceId, inviteEmail.trim(), inviteRole)
      onInvited(member)
      setInviteEmail('')
      toast.success(`${member.user.name} added as ${inviteRole}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Invite failed')
    } finally {
      setInviting(false)
    }
  }

  return (
    <div className="mb-6 rounded-lg border border-border bg-surface p-5 shadow-card">
      <p className="mb-3 text-[14px] font-semibold text-text-primary">Invite member</p>
      <form onSubmit={handleInvite} className="flex gap-2">
        <div className="relative flex-1">
          <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="email"
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
            placeholder="colleague@company.com"
            className="w-full rounded-md border border-border bg-surface-secondary py-2 pl-9 pr-3 text-[13px] text-text-primary outline-none focus:border-brand"
          />
        </div>
        <select
          value={inviteRole}
          onChange={e => setInviteRole(e.target.value as 'editor' | 'viewer')}
          className="rounded-md border border-border bg-surface-secondary px-2 py-2 text-[13px] text-text-primary outline-none focus:border-brand"
        >
          <option value="editor">editor</option>
          <option value="viewer">viewer</option>
        </select>
        <button
          type="submit"
          disabled={inviting || !inviteEmail.trim()}
          className="flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-[13px] font-semibold text-white hover:bg-brand-dark disabled:opacity-50 transition-colors"
        >
          {inviting ? <Loader2 size={13} className="animate-spin" /> : null}
          Invite
        </button>
      </form>
    </div>
  )
}
