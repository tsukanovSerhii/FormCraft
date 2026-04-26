import { Loader2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { workspacesApi, type WorkspaceMember } from '@/api/workspaces'
import { AppLayout } from '@/components/layouts'
import { MemberRow } from '@/components/workspace/MemberRow'
import { InviteForm } from '@/components/workspace/InviteForm'
import { RenameSection } from '@/components/workspace/RenameSection'
import { DangerZone } from '@/components/workspace/DangerZone'
import { useAuthStore } from '@/store/authStore'
import { useWorkspaceStore } from '@/store/workspaceStore'
import { useToast } from '@/components/ui/useToast'

export default function WorkspaceSettingsPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { workspaces } = useWorkspaceStore()
  const toast = useToast()

  const workspace = workspaces.find(w => w.id === workspaceId)
  const isOwner = workspace?.role === 'owner'

  const [members, setMembers] = useState<WorkspaceMember[]>([])
  const [loadingMembers, setLoadingMembers] = useState(true)

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
    if (userId === user?.id) {
      navigate('/forms')
    } else {
      toast.success('Member removed')
    }
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl px-8 py-8">
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1.5 text-[13px] text-text-muted hover:text-text-primary transition-colors">
            <X size={13} /> Close
          </button>
          <h1 className="text-[22px] font-bold text-text-primary">{workspace.name}</h1>
          <p className="mt-0.5 text-[13px] text-text-muted">Workspace settings</p>
        </div>

        {isOwner && <RenameSection workspaceId={workspace.id} currentName={workspace.name} />}

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

        {isOwner && workspaceId && (
          <InviteForm
            workspaceId={workspaceId}
            onInvited={member => setMembers(prev => [...prev, member])}
          />
        )}

        {isOwner && workspaceId && <DangerZone workspaceId={workspaceId} />}
      </div>
    </AppLayout>
  )
}
