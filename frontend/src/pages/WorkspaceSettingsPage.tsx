import { Crown, Edit2, Loader2, LogOut, Mail, Shield, Trash2, UserMinus, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { workspacesApi, type WorkspaceMember } from '@/api/workspaces'
import { AppLayout } from '@/components/layouts'
import { useAuthStore } from '@/store/authStore'
import { useWorkspaceStore } from '@/store/workspaceStore'
import { useToast } from '@/components/ui/useToast'

const ROLE_ICON: Record<string, React.ReactNode> = {
  owner:  <Crown size={12} className="text-brand" />,
  editor: <Edit2 size={12} className="text-text-muted" />,
  viewer: <Shield size={12} className="text-text-muted" />,
}

function MemberRow({
  member,
  isOwner,
  isSelf,
  onRoleChange,
  onRemove,
}: {
  member: WorkspaceMember
  isOwner: boolean
  isSelf: boolean
  onRoleChange: (userId: string, role: 'editor' | 'viewer') => Promise<void>
  onRemove: (userId: string) => Promise<void>
}) {
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

export default function WorkspaceSettingsPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { workspaces, renameWorkspace, removeWorkspace } = useWorkspaceStore()
  const toast = useToast()

  const workspace = workspaces.find(w => w.id === workspaceId)
  const isOwner = workspace?.role === 'owner'

  const [members, setMembers] = useState<WorkspaceMember[]>([])
  const [loadingMembers, setLoadingMembers] = useState(true)

  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor')
  const [inviting, setInviting] = useState(false)

  const [renaming, setRenaming] = useState(false)
  const [newName, setNewName] = useState(workspace?.name ?? '')
  const [renameBusy, setRenameBusy] = useState(false)

  const [deleteBusy, setDeleteBusy] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (!workspaceId) return
    setLoadingMembers(true)
    workspacesApi.getMembers(workspaceId)
      .then(setMembers)
      .catch(() => toast.error('Failed to load members'))
      .finally(() => setLoadingMembers(false))
  }, [workspaceId, toast])

  if (!workspace) {
    return (
      <AppLayout>
        <div className="flex h-full items-center justify-center text-text-muted text-[14px]">
          Workspace not found.
        </div>
      </AppLayout>
    )
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!inviteEmail.trim() || !workspaceId) return
    setInviting(true)
    try {
      const member = await workspacesApi.invite(workspaceId, inviteEmail.trim(), inviteRole)
      setMembers(prev => [...prev, member])
      setInviteEmail('')
      toast.success(`${member.user.name} added as ${inviteRole}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Invite failed')
    } finally {
      setInviting(false)
    }
  }

  async function handleRoleChange(userId: string, role: 'editor' | 'viewer') {
    if (!workspaceId) return
    const updated = await workspacesApi.updateRole(workspaceId, userId, role)
    setMembers(prev => prev.map(m => m.user.id === userId ? { ...m, role: updated.role } : m))
    toast.success('Role updated')
  }

  async function handleRemove(userId: string) {
    if (!workspaceId) return
    await workspacesApi.removeMember(workspaceId, userId)
    setMembers(prev => prev.filter(m => m.user.id !== userId))
    // If self removed — go home
    if (userId === user?.id) {
      navigate('/forms')
    } else {
      toast.success('Member removed')
    }
  }

  async function handleRename(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim() || !workspaceId) return
    setRenameBusy(true)
    try {
      await renameWorkspace(workspaceId, newName.trim())
      setRenaming(false)
      toast.success('Workspace renamed')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Rename failed')
    } finally {
      setRenameBusy(false)
    }
  }

  async function handleDelete() {
    if (!workspaceId) return
    setDeleteBusy(true)
    try {
      await removeWorkspace(workspaceId)
      navigate('/forms')
      toast.success('Workspace deleted')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
      setDeleteBusy(false)
    }
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1.5 text-[13px] text-text-muted hover:text-text-primary transition-colors">
            <X size={13} /> Close
          </button>
          <h1 className="text-[22px] font-bold text-text-primary">{workspace.name}</h1>
          <p className="mt-0.5 text-[13px] text-text-muted">Workspace settings</p>
        </div>

        {/* Rename */}
        {isOwner && (
          <div className="mb-6 rounded-lg border border-border bg-surface p-5 shadow-card">
            <p className="mb-3 text-[14px] font-semibold text-text-primary">Workspace name</p>
            {renaming ? (
              <form onSubmit={handleRename} className="flex gap-2">
                <input
                  autoFocus
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="flex-1 rounded-md border border-border bg-surface-secondary px-3 py-2 text-[13px] text-text-primary outline-none focus:border-brand"
                />
                <button
                  type="submit"
                  disabled={renameBusy}
                  className="flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-[13px] font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
                >
                  {renameBusy && <Loader2 size={13} className="animate-spin" />} Save
                </button>
                <button type="button" onClick={() => setRenaming(false)} className="rounded-md border border-border px-4 py-2 text-[13px] text-text-secondary hover:bg-surface-secondary">
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-text-secondary">{workspace.name}</span>
                <button
                  onClick={() => { setNewName(workspace.name); setRenaming(true) }}
                  className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-[13px] text-text-secondary hover:bg-surface-secondary transition-colors"
                >
                  <Edit2 size={13} /> Rename
                </button>
              </div>
            )}
          </div>
        )}

        {/* Members */}
        <div className="mb-6 rounded-lg border border-border bg-surface shadow-card">
          <div className="border-b border-border px-5 py-3.5">
            <p className="text-[14px] font-semibold text-text-primary">Members</p>
          </div>
          <div className="px-5">
            {loadingMembers ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={18} className="animate-spin text-text-muted" />
              </div>
            ) : (
              members.map(m => (
                <MemberRow
                  key={m.id}
                  member={m}
                  isOwner={isOwner}
                  isSelf={m.user.id === user?.id}
                  onRoleChange={handleRoleChange}
                  onRemove={handleRemove}
                />
              ))
            )}
          </div>
        </div>

        {/* Invite */}
        {isOwner && (
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
        )}

        {/* Danger zone */}
        {isOwner && (
          <div className="rounded-lg border border-danger/30 bg-danger-light p-5">
            <p className="mb-1 text-[14px] font-semibold text-danger">Danger zone</p>
            <p className="mb-4 text-[13px] text-text-muted">Deleting this workspace permanently removes all its forms and data.</p>
            {confirmDelete ? (
              <div className="flex gap-2">
                <button
                  disabled={deleteBusy}
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 rounded-md bg-danger px-4 py-2 text-[13px] font-semibold text-white hover:opacity-90 disabled:opacity-50"
                >
                  {deleteBusy ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                  Yes, delete workspace
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="rounded-md border border-border px-4 py-2 text-[13px] text-text-secondary hover:bg-surface-secondary"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1.5 rounded-md border border-danger/40 px-4 py-2 text-[13px] font-semibold text-danger hover:bg-danger/10 transition-colors"
              >
                <Trash2 size={13} /> Delete workspace
              </button>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
