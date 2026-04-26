import { Loader2, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkspaceStore } from '@/store/workspaceStore'
import { useToast } from '@/components/ui/useToast'

interface Props {
  workspaceId: string
}

export function DangerZone({ workspaceId }: Props) {
  const { removeWorkspace } = useWorkspaceStore()
  const navigate = useNavigate()
  const toast = useToast()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleteBusy, setDeleteBusy] = useState(false)

  async function handleDelete() {
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
  )
}
